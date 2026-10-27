/* =====================================================================
   LOGIN DO PAINEL COM GITHUB — passo 2 (Cloudflare Pages Function)
   /api/callback  ->  o GitHub volta aqui; trocamos o código pelo acesso
   e entregamos ao painel (/admin) que abriu esta janela.
   ===================================================================== */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie") || "";
  const salvo = (cookie.match(/(?:^|;\s*)oauth_state=([a-f0-9]+)/) || [])[1];

  if (url.searchParams.get("error")) {
    return pagina("error", { error: url.searchParams.get("error_description") || "Login cancelado." });
  }
  if (!code || !state || !salvo || state !== salvo) {
    return pagina("error", { error: "Falha de verificação. Feche esta janela e tente entrar novamente." });
  }

  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "locacoes-painel" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`
      })
    });
    const dados = await resp.json();
    if (!dados.access_token) {
      return pagina("error", { error: dados.error_description || "Não foi possível concluir o login." });
    }
    return pagina("success", { token: dados.access_token });
  } catch (e) {
    return pagina("error", { error: "Erro de conexão com o GitHub. Tente novamente." });
  }
}

/* Página que envia o resultado para o painel (protocolo Decap/Sveltia CMS) */
function pagina(status, conteudo) {
  const mensagem = `authorization:github:${status}:${JSON.stringify({ provider: "github", ...conteudo })}`;
  const seguro = JSON.stringify(mensagem).replace(/</g, "\\u003c");
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Entrando…</title></head>
<body style="background:#0b0b0b;color:#c9a45c;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0">
<p>${status === "success" ? "Login concluído. Esta janela vai fechar…" : "Não foi possível entrar. Pode fechar esta janela."}</p>
<script>
(function () {
  var msg = ${seguro};
  if (!window.opener) return;
  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin) return;
    if (e.data === "authorizing:github") {
      window.opener.postMessage(msg, e.origin);
      setTimeout(function () { window.close(); }, 400);
    }
  }, false);
  window.opener.postMessage("authorizing:github", location.origin);
})();
</script></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    }
  });
}
