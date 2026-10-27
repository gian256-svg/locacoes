/* =====================================================================
   LOGIN DO PAINEL COM GITHUB — passo 1 (Cloudflare Pages Function)
   /api/auth  ->  redireciona para a tela de login do GitHub.
   Requer as variáveis GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET
   configuradas no projeto da Cloudflare (veja o README).
   ===================================================================== */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response(
      "O login com GitHub ainda não foi configurado.\n" +
      "Adicione GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET em Cloudflare › seu projeto › Configurações › Variáveis e segredos.",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } }
    );
  }

  // Valor aleatório para impedir login forjado (proteção CSRF)
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const state = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  const github = new URL("https://github.com/login/oauth/authorize");
  github.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  github.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  github.searchParams.set("scope", "repo,user");
  github.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      "Set-Cookie": `oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      "Cache-Control": "no-store"
    }
  });
}
