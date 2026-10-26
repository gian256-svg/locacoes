/* =====================================================================
   CONFIGURAÇÕES DO SITE
   ---------------------------------------------------------------------
   Este é o arquivo de personalização. Altere os valores entre aspas
   e salve. Não apague vírgulas, chaves { } ou colchetes [ ].
   Dica: para testar, abra o index.html no navegador e aperte F5.
   ===================================================================== */

window.SITE_CONFIG = {

  /* ---------------- MARCA ---------------- */
  marca: {
    nome: "Locações",                 // Nome que aparece no topo e na aba do navegador
    slogan: "Espaços para fotografar", // Texto pequeno abaixo do nome (deixe "" para esconder)
    logo: ""                           // Caminho de uma imagem de logo, ex: "assets/img/logo.png" (substitui o nome)
  },

  /* ---------------- CORES ----------------
     Use códigos hexadecimais (#000000). Ferramenta grátis para escolher:
     https://htmlcolorcodes.com/pt/                                     */
  cores: {
    fundo:           "#0b0b0b",  // Fundo principal
    fundoSecundario: "#121212",  // Fundo de faixas/seções alternadas
    superficie:      "#181818",  // Fundo de caixas e cartões
    destaque:        "#c9a45c",  // Dourado principal
    destaqueClaro:   "#ead7a4",  // Dourado claro (brilho do degradê)
    destaqueEscuro:  "#8c6a2f",  // Dourado escuro (sombra do degradê)
    texto:           "#f2ede3",  // Texto principal
    textoSuave:      "#9d978b"   // Textos secundários
  },

  /* ---------------- FONTES (Google Fonts, grátis) ----------------
     Veja e escolha em https://fonts.google.com
     "nome"  -> exatamente como aparece no Google Fonts
     "pesos" -> espessuras disponíveis na fonte, separadas por ;
     Sugestões testadas estão no README.md                              */
  fontes: {
    titulos: { nome: "Cormorant Garamond", pesos: "400;500;600;700" },
    texto:   { nome: "Montserrat",         pesos: "300;400;500;600" },
    tamanhoBase: 16,              // Tamanho do texto em px (14 a 18 recomendado)
    titulosEmMaiusculas: false    // true = títulos em CAIXA ALTA
  },

  /* ---------------- TEXTOS DO SITE ---------------- */
  textos: {
    eyebrow:          "Portfólio de espaços",   // Linha pequena acima do título
    titulo:           "Locações Disponíveis",
    subtitulo:        "São Paulo",
    filtroTodas:      "Todas",
    botaoVerLocacao:  "Ver locação",
    maisInfos:        "+ informações",
    semLocacoes:      "Nenhuma locação disponível no momento.",

    voltar:           "Todas as locações",
    tituloSobre:      "Sobre o espaço",
    tituloInfos:      "Informações",
    tituloVideo:      "Vídeo do local",
    tituloFotos:      "Galeria de fotos",
    verTodasFotos:    "Ver todas as fotos",
    outrasLocacoes:   "Outras locações",
    naoEncontrado:    "Locação não encontrada",

    ctaTitulo:        "Gostou deste local?",
    ctaTexto:         "Fale com a gente para consultar datas, valores e condições.",
    ctaBotao:         "Consultar disponibilidade",

    rodape:           "Locações para ensaios, produções e eventos."
  },

  /* ---------------- LAYOUT ---------------- */
  layout: {
    colunasDesktop: 3,            // Quantidade de fotos por linha no computador (2, 3 ou 4)
    formatoCapa: "4/5",           // Proporção da foto principal: "1/1" quadrada, "4/5" retrato, "3/2" paisagem
    cantosArredondados: 6,        // Arredondamento das bordas em px (0 = quadrado)
    posicaoNome: "acima",         // Nome da locação: "acima", "abaixo" ou "sobre" (em cima da foto)

    mostrarInfosNoCard: true,     // true = mostra infos importantes abaixo da foto na página inicial
    quantidadeInfosNoCard: 3,     // Quantas infos mostrar no cartão
    mostrarResumoNoCard: false,   // true = mostra o resumo em texto no cartão

    agruparPorCidade: true,       // Separa as locações por cidade (como no Airbnb)
    mostrarFiltroCidades: true,   // Botões para filtrar por cidade (aparece se houver 2+ cidades)
    carrosselNoCelular: true,     // No celular, as fotos deslizam para o lado

    // Ordem das seções na página de cada locação (remova um item para esconder)
    ordemPaginaLocal: ["mosaico", "informacoes", "video", "galeria", "outras"],
    incluirCapaNaGaleria: true,   // A foto de capa também aparece na galeria
    quantidadeOutras: 3,          // Quantas "outras locações" sugerir no fim da página

    animacoes: true               // Efeitos suaves de entrada
  },

  /* ---------------- CONTATO ----------------
     Deixe "" para esconder. WhatsApp: apenas números com DDI + DDD.  */
  contato: {
    whatsapp:  "5511999999999",
    mensagemWhatsapp: "Olá! Vi a locação {local} e gostaria de mais informações.",
    instagram: "@seuperfil",
    email:     ""
  },

  /* ---------------- PROTEÇÃO DAS IMAGENS ----------------
     Dificulta (não impede 100%) que o cliente baixe as fotos.        */
  protecao: {
    bloquearCliqueDireito: true,
    bloquearArrastarImagens: true
  }
};
