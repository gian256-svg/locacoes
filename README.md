# 📸 Locações — Galeria de espaços para fotografar

Site elegante (preto e dourado) para apresentar locações a clientes.
**100% gratuito**: HTML, CSS e JavaScript puros, hospedado no **GitHub Pages**.

O cliente só **visualiza**: não tem login, formulário nem banco de dados, então não tem como alterar nada.

---

## 📁 Estrutura

```
Locações/
├── index.html              ← Página inicial (lista de locações)
├── local.html              ← Página de cada locação (fotos + vídeo + infos)
│
├── config/
│   └── site.js             ← ⚙️  CORES, FONTES, TEXTOS, LAYOUT, CONTATO
├── data/
│   └── locacoes.js         ← 📝 CADASTRO DAS LOCAÇÕES (fotos, vídeos, infos)
├── assets/
│   ├── img/                ← logo, favicon
│   └── locacoes/<id>/      ← 🖼️  fotos e vídeos de cada locação
│
├── css/style.css           ← visual (não precisa mexer)
└── js/                     ← funcionamento (não precisa mexer)
    ├── core.js
    ├── home.js
    └── local.js
```

> No dia a dia você só mexe em **3 lugares**: `config/site.js`, `data/locacoes.js` e `assets/locacoes/`.

---

## 👀 Ver no seu computador

Dê dois cliques no `index.html`. Ele abre no navegador, sem instalar nada.
Depois de editar algum arquivo, aperte **F5** no navegador para ver a mudança.

> Vídeos do YouTube podem não tocar quando a página é aberta direto do computador (`file://`). Depois de publicada, eles funcionam normalmente.

---

## ➕ Adicionar / editar uma locação

1. Crie a pasta `assets/locacoes/nome-da-locacao/` e coloque as fotos (veja `assets/locacoes/LEIA-ME.md`).
2. Abra `data/locacoes.js`, copie um bloco `{ ... },` e altere:

```js
{
  id: "nome-da-locacao",                 // sem espaços/acentos
  nome: "Nome da Locação",
  cidade: "São Paulo",
  bairro: "Pinheiros",
  selo: "Novo",                          // opcional
  capa: "assets/locacoes/nome-da-locacao/capa.jpg",
  resumo: "Frase curta.",
  descricao: "Texto completo.\n\nSegundo parágrafo.",
  infos: [
    { icone: "area",    rotulo: "Área",       valor: "200 m²" },
    { icone: "pessoas", rotulo: "Capacidade", valor: "Até 20 pessoas" }
  ],
  fotos: [
    "assets/locacoes/nome-da-locacao/01.jpg",
    { src: "assets/locacoes/nome-da-locacao/02.jpg", legenda: "Cozinha" }
  ],
  video: "https://youtu.be/XXXXXXXXXXX",
  visivel: true
},
```

**Ícones disponíveis:** `area`, `pessoas`, `preco`, `relogio`, `luz`, `local`, `carro`, `camera`, `energia`, `check`

**Esconder uma locação sem apagar:** `visivel: false`

**Ordem na página:** é a mesma ordem dos blocos no arquivo.

---

## 🎬 Vídeos (opções gratuitas)

| Opção | Como usar | Observação |
|---|---|---|
| **YouTube** (recomendado) | Suba como **"Não listado"** e cole o link | Sem limite de tamanho, carrega rápido |
| **Google Drive** | Compartilhe como "Qualquer pessoa com o link" e cole o link | Bom para vídeos grandes |
| **Vimeo** | Cole o link | Plano grátis tem limite de upload |
| **Arquivo .mp4** | Coloque em `assets/locacoes/<id>/video.mp4` | Máx. 25 MB pelo site do GitHub (100 MB via Git) |

Vídeo gravado **em pé** (celular): `video: { src: "...", vertical: true }`
Vários vídeos: `video: ["link1", "link2"]`

---

## 🎨 Personalização (`config/site.js`)

| Seção | O que muda |
|---|---|
| `marca` | Nome, slogan e logo |
| `cores` | Todas as cores do site (fundo, dourado, textos) |
| `fontes` | Fonte dos títulos e do texto, tamanho, caixa alta |
| `textos` | Todos os textos (títulos, botões, rodapé) |
| `layout` | Colunas, formato da foto, bordas, posição do nome, infos no cartão, ordem das seções |
| `contato` | WhatsApp (com mensagem automática), Instagram, e-mail |
| `protecao` | Bloqueio de clique direito/arrastar nas fotos |

### Infos na página inicial: mostrar ou não?
Você estava em dúvida, então deixei como opção:
- `mostrarInfosNoCard: true`: mostra 3 infos principais embaixo da foto (estilo Airbnb).
- `mostrarInfosNoCard: false`: página inicial mais limpa, só com "+ informações", e as infos aparecem ao abrir o local.

### Posição do nome
`posicaoNome: "acima"` (padrão, como no seu esboço) · `"abaixo"` · `"sobre"` (escrito em cima da foto)

### Sugestões de fontes (copie e cole)

**Títulos (elegantes, serifadas):**
```js
{ nome: "Cormorant Garamond", pesos: "400;500;600;700" }
{ nome: "Playfair Display",   pesos: "400;500;600;700" }
{ nome: "Cinzel",             pesos: "400;500;600;700" }
{ nome: "Bodoni Moda",        pesos: "400;500;600;700" }
{ nome: "Marcellus",          pesos: "400" }
{ nome: "Italiana",           pesos: "400" }
```
**Texto (limpas):**
```js
{ nome: "Montserrat", pesos: "300;400;500;600" }
{ nome: "Jost",       pesos: "300;400;500;600" }
{ nome: "Raleway",    pesos: "300;400;500;600" }
{ nome: "Lato",       pesos: "300;400;700" }
{ nome: "Poppins",    pesos: "300;400;500;600" }
```
> Se a fonte não carregar, provavelmente algum peso não existe nela. Confira os pesos disponíveis no Google Fonts.

### Paletas prontas
```js
// Dourado clássico (padrão)
destaque: "#c9a45c", destaqueClaro: "#ead7a4", destaqueEscuro: "#8c6a2f"
// Champagne suave
destaque: "#d4b98c", destaqueClaro: "#f1e4c8", destaqueEscuro: "#9a7f55"
// Ouro intenso
destaque: "#d4af37", destaqueClaro: "#f5e08a", destaqueEscuro: "#8f7320"
// Ouro rosé
destaque: "#c8977a", destaqueClaro: "#ecc9b4", destaqueEscuro: "#8a5f48"
```

---

## 🚀 Publicar grátis no GitHub Pages

### Primeira vez
1. Crie uma conta grátis em https://github.com
2. Clique em **New repository**, dê o nome `locacoes`, deixe **Public** e **não** marque "Add README". Depois clique em **Create**.
3. No terminal, dentro desta pasta:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/locacoes.git
   git push -u origin main
   ```
4. No GitHub, vá em **Settings → Pages**. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e clique em **Save**.
5. Em 1–2 minutos o site estará em: `https://SEU-USUARIO.github.io/locacoes/`

### Atualizar depois
**Pelo site do GitHub (sem programar):** abra o arquivo, clique no ✏️ e depois em **Commit changes**. Para fotos, entre na pasta e use **Add file → Upload files**.

**Pelo computador:**
```bash
git add .
git commit -m "Nova locação"
git push
```

### Link de cada locação
`https://SEU-USUARIO.github.io/locacoes/local.html?id=casa-jardim`

Dá para mandar o link direto de um local para o cliente.

---

## 🔒 Segurança

- Site **estático**: sem servidor, sem banco de dados e sem login, então não existe nada que um visitante consiga alterar.
- **Content-Security-Policy**: o navegador só carrega scripts do próprio site, o que bloqueia scripts injetados.
- Todo texto é inserido de forma segura (sem `innerHTML` com dados), e links `javascript:` são bloqueados.
- Vídeos do YouTube usam o modo **privacidade aprimorada** (`youtube-nocookie`).
- `noindex`: por padrão o site **não aparece no Google**. Só vê quem tiver o link. Para aparecer, remova a linha `<meta name="robots"...>` do `index.html` e do `local.html`.
- Proteção das fotos: o clique direito e o arrastar ficam bloqueados. Isso dificulta, mas **nenhum site consegue impedir 100%** (um print de tela sempre funciona). Se precisar, use fotos com marca d'água.

> ⚠️ No GitHub grátis, o repositório do Pages precisa ser **público**, ou seja, os arquivos ficam visíveis no GitHub. Para repositório **privado** e ainda grátis, use o **Cloudflare Pages** (https://pages.cloudflare.com): conecte o repositório privado e ele publica automaticamente. Não precisa mudar nada no código.
