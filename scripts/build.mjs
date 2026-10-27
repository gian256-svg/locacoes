/* =====================================================================
   BUILD — monta o site a partir do conteúdo editado no painel.
   Executado automaticamente pela Cloudflare a cada alteração.
   Para testar no computador:  node scripts/build.mjs
   (sem dependências — só precisa do Node.js)
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const r = (...p) => path.join(ROOT, ...p);

/* Pesos disponíveis de cada fonte oferecida no painel */
const FONTES = {
  "Cormorant Garamond": "400;500;600;700",
  "Playfair Display": "400;500;600;700",
  "Cinzel": "400;500;600;700",
  "Bodoni Moda": "400;500;600;700",
  "Marcellus": "400",
  "Italiana": "400",
  "Libre Baskerville": "400;700",
  "DM Serif Display": "400",
  "Montserrat": "300;400;500;600",
  "Jost": "300;400;500;600",
  "Raleway": "300;400;500;600",
  "Lato": "300;400;700",
  "Poppins": "300;400;500;600",
  "Inter": "300;400;500;600",
  "Nunito Sans": "300;400;600;700",
  "Josefin Sans": "300;400;600;700"
};

const lerJSON = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
/* JSON seguro para colocar dentro de um arquivo .js */
const paraJS = (nome, obj) =>
  "/* Arquivo gerado automaticamente por scripts/build.mjs — edite pelo painel (/admin) */\n" +
  `window.${nome} = ` +
  JSON.stringify(obj, null, 2).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") +
  ";\n";

/* "/assets/uploads/x.webp" -> "assets/uploads/x.webp" (funciona também abrindo o arquivo no PC) */
const caminho = (s) => {
  if (typeof s !== "string") return "";
  s = s.trim();
  if (/^https?:\/\//i.test(s)) return s;
  return s.replace(/^\/+/, "");
};

/* ---------------- Configurações ---------------- */
const site = lerJSON(r("content/site.json"));
const fonte = (nome, padrao) => {
  const n = typeof nome === "string" && nome.trim() ? nome.trim() : padrao;
  return { nome: n, pesos: FONTES[n] || "400;700" };
};
site.fontes = site.fontes || {};
site.fontes.titulos = fonte(site.fontes.titulos, "Cormorant Garamond");
site.fontes.texto = fonte(site.fontes.texto, "Montserrat");
if (site.marca) site.marca.logo = caminho(site.marca.logo);
const ocultarDoGoogle = !site.seo || site.seo.ocultarDoGoogle !== false;

/* ---------------- Cidades ---------------- */
const arqCidades = r("content/cidades.json");
site.cidades = fs.existsSync(arqCidades)
  ? (lerJSON(arqCidades).cidades || [])
      .filter((c) => c && typeof c.nome === "string" && c.nome.trim())
      .map((c) => ({ nome: c.nome.trim(), subtitulo: c.subtitulo || "", visivel: c.visivel !== false }))
  : [];
const cidadesOcultas = new Set(site.cidades.filter((c) => !c.visivel).map((c) => c.nome.toLowerCase()));

/* ---------------- Locações ---------------- */
const pasta = r("content/locacoes");
const locacoes = fs.readdirSync(pasta)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const d = lerJSON(path.join(pasta, f));
    const videos = (Array.isArray(d.videos) ? d.videos : [])
      .map((v) => ({
        src: caminho(v.link) || caminho(v.arquivo),
        titulo: v.titulo || "",
        // "auto" = o site detecta; o antigo campo "vertical" continua valendo
        formato: ["horizontal", "vertical"].includes(v.formato) ? v.formato : (v.vertical ? "vertical" : "auto")
      }))
      .filter((v) => v.src);
    const listaFotos = (lista) => (Array.isArray(lista) ? lista : [])
      .map((x) => caminho(typeof x === "string" ? x : x && x.src)).filter(Boolean);
    return {
      id: f.replace(/\.json$/, ""),
      ordem: Number(d.ordem) || 0,
      visivel: d.visivel !== false,
      nome: d.nome || "",
      cidade: d.cidade || "",
      bairro: d.bairro || "",
      selo: d.selo || "",
      capa: caminho(d.capa),
      resumo: d.resumo || "",
      descricao: d.descricao || "",
      infos: (d.infos || []).filter((i) => i && (i.rotulo || i.valor)),
      fotos: listaFotos(d.fotos),
      ensaios: listaFotos(d.ensaios),
      video: videos
    };
  })
  .filter((l) => l.visivel && l.nome && !cidadesOcultas.has(l.cidade.trim().toLowerCase()))
  .sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome, "pt-BR"));

/* ---------------- Gera arquivos ---------------- */
fs.mkdirSync(r("config"), { recursive: true });
fs.mkdirSync(r("data"), { recursive: true });
fs.writeFileSync(r("config/site.js"), paraJS("SITE_CONFIG", site));
fs.writeFileSync(r("data/locacoes.js"), paraJS("LOCACOES", locacoes));

/* Copia o site público para dist/
   (cópia manual: fs.cpSync falha no Windows com pastas acentuadas como "Locações") */
function copiar(origem, destino) {
  const st = fs.statSync(origem);
  if (st.isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const nome of fs.readdirSync(origem)) copiar(path.join(origem, nome), path.join(destino, nome));
  } else {
    fs.copyFileSync(origem, destino);
  }
}
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const item of ["css", "js", "config", "data", "assets", "admin"]) {
  if (fs.existsSync(r(item))) copiar(r(item), path.join(DIST, item));
}
for (const html of ["index.html", "local.html"]) {
  let txt = fs.readFileSync(r(html), "utf8");
  if (!ocultarDoGoogle) txt = txt.replace(/\s*<!--[^>]*Google[^>]*-->/, "").replace(/\s*<meta name="robots"[^>]*>/, "");
  fs.writeFileSync(path.join(DIST, html), txt);
}
fs.rmSync(path.join(DIST, "assets/locacoes/LEIA-ME.md"), { force: true });

/* ---------------- Otimização das fotos ----------------
   Fotos enviadas pelo painel (assets/uploads) viram WebP de até 2000px
   no site publicado. O original fica guardado no repositório.
   Se o "sharp" não estiver instalado ou a foto falhar, usa a original. */
let sharp = null;
try { sharp = (await import("sharp")).default; } catch { console.log("ℹ sharp não instalado — fotos publicadas sem otimização"); }

const cacheOtim = new Map();
let otimizadas = 0;
async function otimizar(rel) {
  if (!sharp || typeof rel !== "string" || !/^assets\/uploads\/.+\.(jpe?g|png|webp|tiff?|avif)$/i.test(rel)) return rel;
  if (cacheOtim.has(rel)) return cacheOtim.get(rel);
  let final = rel;
  const origem = r(rel);
  if (fs.existsSync(origem)) {
    const destRel = "assets/otimizadas/" + rel.slice("assets/uploads/".length).replace(/\.[^./]+$/, "") + ".webp";
    const dest = path.join(DIST, destRel);
    try {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      await sharp(origem, { failOn: "none" })
        .rotate()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(dest);
      final = destRel;
      otimizadas++;
    } catch (e) {
      console.warn(`⚠ Não foi possível otimizar ${rel}: ${e.message}`);
    }
  }
  cacheOtim.set(rel, final);
  return final;
}

const locacoesPublicadas = [];
for (const l of locacoes) {
  const fotos = [], ensaios = [];
  for (const f of l.fotos) fotos.push(await otimizar(f));
  for (const f of l.ensaios) ensaios.push(await otimizar(f));
  locacoesPublicadas.push({ ...l, capa: await otimizar(l.capa), fotos, ensaios });
}
fs.writeFileSync(path.join(DIST, "data/locacoes.js"), paraJS("LOCACOES", locacoesPublicadas));
if (sharp) console.log(`✔ ${otimizadas} foto(s) otimizada(s)`);

/* Cabeçalhos de segurança (Cloudflare Pages) */
fs.writeFileSync(path.join(DIST, "_headers"), [
  "/*",
  "  X-Content-Type-Options: nosniff",
  "  X-Frame-Options: DENY",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "  Strict-Transport-Security: max-age=31536000",
  ocultarDoGoogle ? "  X-Robots-Tag: noindex, nofollow" : null,
  "",
  "/admin/*",
  "  X-Robots-Tag: noindex, nofollow",
  "  Cache-Control: no-store",
  "",
  "/assets/*",
  "  Cache-Control: public, max-age=604800",
  ""
].filter((l) => l !== null).join("\n"));

console.log(`✔ Site gerado em dist/  (${locacoes.length} locações visíveis)`);
