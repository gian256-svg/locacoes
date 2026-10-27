/* =====================================================================
   NÚCLEO DO SITE — aplica as configurações e fornece funções comuns.
   Normalmente você NÃO precisa editar este arquivo.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var App = (window.App = {});

  App.config = CFG;
  App.locacoes = (Array.isArray(window.LOCACOES) ? window.LOCACOES : []).filter(function (l) {
    return l && l.id && l.visivel !== false;
  });

  /* ---------- Criação segura de elementos (sem innerHTML com dados) ---------- */
  App.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v; // usado apenas para ícones SVG internos
        else if (k.indexOf("on") === 0 && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    [].concat(children === undefined ? [] : children).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return node;
  };
  var el = App.el;

  /* Aceita somente links http(s) ou caminhos relativos (bloqueia javascript:, data: etc.) */
  App.safeUrl = function (url) {
    if (typeof url !== "string") return "";
    var u = url.trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(u) || u.indexOf("//") === 0) return "";
    return u;
  };

  /* ---------- Ícones (SVG internos) ---------- */
  var ICONES = {
    area: '<path d="M3 9V3h6M21 15v6h-6M3 3l7 7M21 21l-7-7"/>',
    pessoas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.3 0 4 1.5 4.5 4"/>',
    preco: '<path d="M12 3v18M16.5 7.5C15.7 6 14 5 12 5c-2.6 0-4.5 1.4-4.5 3.4 0 4.8 9 2.4 9 7.2 0 2.1-2 3.4-4.5 3.4-2.2 0-4-1-4.8-2.6"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    luz: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    local: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    carro: '<path d="M5 17v-5l2-5h10l2 5v5M3 17h18M6.5 17v2.5M17.5 17v2.5"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>',
    energia: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    check: '<path d="M5 12.5 9.5 17 19 7"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    voltar: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    anterior: '<path d="M15 5l-7 7 7 7"/>',
    proximo: '<path d="M9 5l7 7-7 7"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    grade: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    whatsapp: '<path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1.2-.5-2.2-1.5-2.7-2.7l.8-1-1-2z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6l8.5 7 8.5-7"/>'
  };
  App.icone = function (nome) {
    var p = ICONES[nome] || ICONES.check;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  };

  /* ---------- Aplicar cores ---------- */
  var root = document.documentElement;
  var corValida = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i;
  var mapaCores = {
    fundo: "--cor-fundo",
    fundoSecundario: "--cor-fundo-2",
    superficie: "--cor-superficie",
    destaque: "--cor-dourado",
    destaqueClaro: "--cor-dourado-claro",
    destaqueEscuro: "--cor-dourado-escuro",
    texto: "--cor-texto",
    textoSuave: "--cor-texto-suave"
  };
  var cores = CFG.cores || {};
  Object.keys(mapaCores).forEach(function (k) {
    if (typeof cores[k] === "string" && corValida.test(cores[k].trim())) {
      root.style.setProperty(mapaCores[k], cores[k].trim());
    }
  });

  /* ---------- Aplicar fontes (Google Fonts) ---------- */
  var F = CFG.fontes || {};
  function carregarFonte(f, variavel, reserva) {
    if (!f || typeof f.nome !== "string" || !/^[\w\s\-]+$/.test(f.nome)) return;
    var pesos = typeof f.pesos === "string" && /^[\d;]+$/.test(f.pesos) ? f.pesos : "400";
    var href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(f.nome.trim()).replace(/%20/g, "+") +
      ":wght@" + pesos + "&display=swap";
    document.head.append(el("link", { rel: "stylesheet", href: href }));
    root.style.setProperty(variavel, '"' + f.nome.trim() + '", ' + reserva);
  }
  carregarFonte(F.titulos, "--fonte-titulo", "Georgia, 'Times New Roman', serif");
  carregarFonte(F.texto, "--fonte-texto", "system-ui, -apple-system, 'Segoe UI', sans-serif");
  if (Number(F.tamanhoBase) >= 12 && Number(F.tamanhoBase) <= 22) root.style.setProperty("--tamanho-base", Number(F.tamanhoBase) + "px");
  if (F.titulosEmMaiusculas) document.body.classList.add("titulos-maiusculos");

  /* ---------- Aplicar layout ---------- */
  var L = CFG.layout || {};
  var col = parseInt(L.colunasDesktop, 10);
  if (col >= 1 && col <= 5) root.style.setProperty("--colunas", col);
  if (typeof L.formatoCapa === "string" && /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(L.formatoCapa)) root.style.setProperty("--proporcao-capa", L.formatoCapa);
  if (Number(L.cantosArredondados) >= 0) root.style.setProperty("--raio", Number(L.cantosArredondados) + "px");
  if (L.animacoes === false) document.body.classList.add("sem-animacoes");
  if (L.carrosselNoCelular !== false) document.body.classList.add("carrossel-mobile");

  /* ---------- Proteção das imagens ---------- */
  var P = CFG.protecao || {};
  if (P.bloquearCliqueDireito) {
    document.addEventListener("contextmenu", function (e) {
      if (e.target.closest && e.target.closest("img, video, .card__foto, .lb")) e.preventDefault();
    });
  }
  if (P.bloquearArrastarImagens) {
    document.addEventListener("dragstart", function (e) {
      if (e.target.tagName === "IMG") e.preventDefault();
    });
  }

  /* ---------- Contato ---------- */
  App.linkWhatsApp = function (nomeLocal) {
    var c = CFG.contato || {};
    var num = String(c.whatsapp || "").replace(/\D/g, "");
    if (!num) return "";
    var msg = String(c.mensagemWhatsapp || "").replace(/\{local\}/g, nomeLocal || "");
    return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : "");
  };

  App.linksContato = function (nomeLocal) {
    var c = CFG.contato || {};
    var out = [];
    var wa = App.linkWhatsApp(nomeLocal);
    if (wa) out.push(el("a", { class: "icone-link", href: wa, target: "_blank", rel: "noopener noreferrer", "aria-label": "WhatsApp", title: "WhatsApp", html: App.icone("whatsapp") }));
    var ig = String(c.instagram || "").replace(/^@/, "").replace(/[^\w.]/g, "");
    if (ig) out.push(el("a", { class: "icone-link", href: "https://instagram.com/" + ig, target: "_blank", rel: "noopener noreferrer", "aria-label": "Instagram", title: "Instagram", html: App.icone("instagram") }));
    var em = String(c.email || "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) out.push(el("a", { class: "icone-link", href: "mailto:" + em, "aria-label": "E-mail", title: "E-mail", html: App.icone("email") }));
    return out;
  };

  /* ---------- Fotos ---------- */
  App.normalizarFotos = function (loc) {
    var lista = (Array.isArray(loc.fotos) ? loc.fotos : []).map(function (f) {
      if (typeof f === "string") return { src: App.safeUrl(f), legenda: "" };
      if (f && typeof f === "object") return { src: App.safeUrl(f.src), legenda: f.legenda ? String(f.legenda) : "" };
      return null;
    }).filter(function (f) { return f && f.src; });
    var capa = App.safeUrl(loc.capa);
    if (capa && L.incluirCapaNaGaleria !== false && !lista.some(function (f) { return f.src === capa; })) {
      lista.unshift({ src: capa, legenda: "" });
    }
    return lista;
  };

  /* ---------- Textos ----------
     Texto apagado no painel ("") = elemento escondido.
     O padrão só é usado se o campo nem existir. */
  App.texto = function (chave, padrao) {
    var T = CFG.textos || {};
    if (typeof T[chave] === "string") return T[chave].trim();
    return padrao || "";
  };
  var texto = App.texto;

  /* ---------- Cartão de locação ---------- */
  App.criarCard = function (loc) {
    var pos = L.posicaoNome || "acima";
    var capa = App.safeUrl(loc.capa) || (App.normalizarFotos(loc)[0] || {}).src;
    var verTxt = texto("botaoVerLocacao", "Ver locação");

    var cab = el("div", { class: "card__cabecalho" }, [
      el("h3", { class: "card__nome", text: loc.nome || "" }),
      loc.bairro && L.mostrarBairroNoCard !== false ? el("span", { class: "card__local", text: loc.bairro }) : null
    ]);

    var foto = el("div", { class: "card__foto" }, [
      capa ? el("img", { src: capa, alt: loc.nome || "", loading: "lazy", decoding: "async" }) : null,
      loc.selo ? el("span", { class: "card__selo", text: loc.selo }) : null,
      verTxt ? el("span", { class: "card__ver" }, [verTxt, el("span", { class: "card__seta", html: App.icone("seta") })]) : null
    ]);

    var partes = [];
    if (pos === "sobre") { cab.classList.add("card__cabecalho--sobre"); foto.append(cab); partes.push(foto); }
    else if (pos === "abaixo") partes.push(foto, cab);
    else partes.push(cab, foto);

    if (L.mostrarResumoNoCard && loc.resumo) partes.push(el("p", { class: "card__resumo", text: loc.resumo }));

    var infos = Array.isArray(loc.infos) ? loc.infos : [];
    var qtd = Number(L.quantidadeInfosNoCard) >= 0 ? Number(L.quantidadeInfosNoCard) : 3;
    if (L.mostrarInfosNoCard !== false && infos.length && qtd > 0) {
      partes.push(el("ul", { class: "card__infos" }, infos.slice(0, qtd).map(function (i) {
        return el("li", { title: i.rotulo || "" }, [el("span", { class: "icone", html: App.icone(i.icone) }), String(i.valor || i.rotulo || "")]);
      })));
    } else if (L.mostrarInfosNoCard === false && texto("maisInfos", "+ informações")) {
      partes.push(el("span", { class: "card__mais", text: texto("maisInfos", "+ informações") }));
    }

    return el("a", { class: "card revelar", href: "local.html?id=" + encodeURIComponent(loc.id), "aria-label": loc.nome }, partes);
  };

  /* ---------- Animação de entrada ---------- */
  App.observarRevelar = function (escopo) {
    var itens = (escopo || document).querySelectorAll(".revelar:not(.visivel)");
    if (!("IntersectionObserver" in window) || L.animacoes === false) {
      itens.forEach(function (i) { i.classList.add("visivel"); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    itens.forEach(function (i, idx) {
      i.style.transitionDelay = Math.min(idx % 4, 3) * 80 + "ms";
      obs.observe(i);
    });
  };

  /* ---------- Topo e rodapé ---------- */
  if (L.mostrarOrnamentos === false) document.body.classList.add("sem-ornamentos");

  function renderTopo() {
    var topo = document.getElementById("topo");
    if (!topo) return;
    var m = CFG.marca || {};
    var logo = App.safeUrl(m.logo);
    var marca = el("a", { class: "marca", href: "index.html", "aria-label": m.nome || "Início" },
      logo ? el("img", { class: "marca__logo", src: logo, alt: m.nome || "" })
        : [m.nome ? el("span", { class: "marca__nome", text: m.nome }) : null, m.slogan ? el("span", { class: "marca__slogan", text: m.slogan }) : null]);
    var acoes = L.mostrarContatoNoTopo === false ? null : el("nav", { class: "topo__acoes", "aria-label": "Contato" }, App.linksContato());
    topo.append(el("div", { class: "topo__inner container" }, [marca, acoes]));
    window.addEventListener("scroll", function () {
      topo.classList.toggle("rolado", window.scrollY > 10);
    }, { passive: true });
  }

  function renderRodape() {
    var r = document.getElementById("rodape");
    if (!r) return;
    if (L.mostrarRodape === false) { r.remove(); return; }
    var m = CFG.marca || {};
    var rod = texto("rodape", "");
    r.append(el("div", { class: "container rodape__inner" }, [
      el("div", { class: "ornamento", "aria-hidden": "true" }, el("span")),
      m.nome ? el("p", { class: "rodape__marca", text: m.nome }) : null,
      rod ? el("p", { class: "rodape__texto", text: rod }) : null,
      el("div", { class: "rodape__contato" }, App.linksContato()),
      el("p", { class: "rodape__copy", text: "© " + new Date().getFullYear() + " " + (m.nome || "") })
    ]));
  }

  renderTopo();
  renderRodape();
})();
