/* =====================================================================
   VÍDEOS ENVIADOS PELO PAINEL — /assets/uploads/*.mp4
   Os navegadores pedem o vídeo em pedaços (cabeçalho "Range"). A
   hospedagem estática devolve sempre o arquivo inteiro, e isso faz o
   player mostrar "erro de rede" ao avançar/repetir. Aqui respondemos
   corretamente com o pedaço pedido (206 Partial Content).
   ===================================================================== */
const VIDEO = /\.(mp4|m4v|webm|mov)$/i;

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (!VIDEO.test(url.pathname) || (request.method !== "GET" && request.method !== "HEAD")) return next();

  const original = await env.ASSETS.fetch(new Request(url.toString(), { method: "GET" }));
  if (!original.ok) return original;

  const headers = new Headers(original.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=604800");
  headers.delete("Content-Encoding");

  const range = request.headers.get("Range");
  if (!range) {
    return new Response(request.method === "HEAD" ? null : original.body, { status: 200, headers });
  }

  const dados = await original.arrayBuffer();
  const total = dados.byteLength;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  let inicio, fim;
  if (m && m[1] !== "") {
    inicio = Number(m[1]);
    fim = m[2] !== "" ? Math.min(Number(m[2]), total - 1) : total - 1;
  } else if (m && m[2] !== "") {           // "bytes=-500" = últimos 500 bytes
    inicio = Math.max(total - Number(m[2]), 0);
    fim = total - 1;
  }
  if (inicio === undefined || inicio > fim || inicio >= total) {
    headers.set("Content-Range", `bytes */${total}`);
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${inicio}-${fim}/${total}`);
  headers.set("Content-Length", String(fim - inicio + 1));
  const corpo = request.method === "HEAD" ? null : new Uint8Array(dados, inicio, fim - inicio + 1);
  return new Response(corpo, { status: 206, headers });
}
