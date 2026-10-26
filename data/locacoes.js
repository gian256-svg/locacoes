/* =====================================================================
   LOCAÇÕES
   ---------------------------------------------------------------------
   Cada bloco { ... } é uma locação. Para adicionar uma nova, copie um
   bloco inteiro, cole abaixo (separado por vírgula) e altere os dados.

   CAMPOS:
   id        -> identificador único, sem espaços/acentos (vira o link: local.html?id=casa-jardim)
   nome      -> nome que aparece em cima da foto
   cidade    -> usado para agrupar/filtrar
   bairro    -> texto pequeno ao lado do nome (opcional)
   selo      -> etiqueta dourada sobre a foto, ex: "Novo" (opcional)
   capa      -> foto principal (página inicial)
   resumo    -> frase curta
   descricao -> texto completo (use \n\n para separar parágrafos)
   infos     -> lista de informações importantes { icone, rotulo, valor }
                ícones disponíveis: area, pessoas, preco, relogio, luz,
                local, carro, camera, energia, check
   fotos     -> lista de fotos. Pode ser só o caminho "assets/..." ou
                { src: "assets/...", legenda: "Sala principal" }
   video     -> um link (YouTube, Vimeo, Google Drive ou arquivo .mp4)
                ou uma lista. Para vídeo em pé (celular) use:
                { src: "...", vertical: true }
   visivel   -> false esconde a locação sem precisar apagar

   FOTOS LOCAIS: coloque em assets/locacoes/<id>/ e use o caminho, ex:
   capa: "assets/locacoes/casa-jardim/capa.jpg"

   As fotos abaixo (picsum.photos) são apenas exemplos — troque pelas suas.
   ===================================================================== */

window.LOCACOES = [
  {
    id: "casa-jardim",
    nome: "Casa Jardim",
    cidade: "São Paulo",
    bairro: "Alto de Pinheiros",
    selo: "Destaque",
    capa: "https://picsum.photos/seed/casajardim/1000/1250",
    resumo: "Casa modernista com jardim tropical, luz natural o dia todo e varanda ampla.",
    descricao: "Uma casa modernista cercada por um jardim tropical exuberante. Grandes painéis de vidro garantem luz natural durante todo o dia, ideal para ensaios de moda, editoriais e produções publicitárias.\n\nO espaço conta com sala integrada, cozinha gourmet, varanda coberta e área externa com piscina.",
    infos: [
      { icone: "area",    rotulo: "Área",           valor: "450 m²" },
      { icone: "pessoas", rotulo: "Capacidade",     valor: "Até 25 pessoas" },
      { icone: "luz",     rotulo: "Luz natural",    valor: "Manhã e tarde" },
      { icone: "carro",   rotulo: "Estacionamento", valor: "4 vagas" },
      { icone: "relogio", rotulo: "Diária",         valor: "8h às 20h" },
      { icone: "energia", rotulo: "Energia",        valor: "110v / 220v" }
    ],
    fotos: [
      { src: "https://picsum.photos/seed/cj1/1600/1067", legenda: "Sala integrada" },
      { src: "https://picsum.photos/seed/cj2/1067/1600", legenda: "Corredor" },
      { src: "https://picsum.photos/seed/cj3/1600/1067", legenda: "Varanda" },
      { src: "https://picsum.photos/seed/cj4/1600/1067", legenda: "Cozinha" },
      { src: "https://picsum.photos/seed/cj5/1067/1600", legenda: "Jardim" },
      { src: "https://picsum.photos/seed/cj6/1600/1067", legenda: "Piscina" },
      { src: "https://picsum.photos/seed/cj7/1600/1067" }
    ],
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    visivel: true
  },
  {
    id: "loft-industrial",
    nome: "Loft Industrial",
    cidade: "São Paulo",
    bairro: "Barra Funda",
    capa: "https://picsum.photos/seed/loftind/1000/1250",
    resumo: "Pé-direito duplo, tijolos aparentes e janelas de ferro.",
    descricao: "Loft com estética industrial, pé-direito de 7 metros, tijolos aparentes e grandes janelas de ferro. Perfeito para editoriais urbanos, vídeos e lançamentos.",
    infos: [
      { icone: "area",    rotulo: "Área",       valor: "300 m²" },
      { icone: "pessoas", rotulo: "Capacidade", valor: "Até 40 pessoas" },
      { icone: "luz",     rotulo: "Luz natural", valor: "Tarde" },
      { icone: "camera",  rotulo: "Ideal para", valor: "Moda e vídeo" }
    ],
    fotos: [
      "https://picsum.photos/seed/li1/1600/1067",
      "https://picsum.photos/seed/li2/1600/1067",
      "https://picsum.photos/seed/li3/1067/1600",
      "https://picsum.photos/seed/li4/1600/1067",
      "https://picsum.photos/seed/li5/1600/1067"
    ],
    video: "",
    visivel: true
  },
  {
    id: "estudio-luz",
    nome: "Estúdio Luz Natural",
    cidade: "São Paulo",
    bairro: "Vila Madalena",
    selo: "Novo",
    capa: "https://picsum.photos/seed/estudioluz/1000/1250",
    resumo: "Estúdio claro com ciclorama e claraboias.",
    descricao: "Estúdio com paredes brancas, ciclorama infinito e claraboias que garantem uma luz suave e difusa.",
    infos: [
      { icone: "area",    rotulo: "Área",       valor: "120 m²" },
      { icone: "pessoas", rotulo: "Capacidade", valor: "Até 12 pessoas" },
      { icone: "preco",   rotulo: "A partir de", valor: "Sob consulta" }
    ],
    fotos: [
      "https://picsum.photos/seed/el1/1600/1067",
      "https://picsum.photos/seed/el2/1067/1600",
      "https://picsum.photos/seed/el3/1600/1067"
    ],
    video: "",
    visivel: true
  },
  {
    id: "mansao-classica",
    nome: "Mansão Clássica",
    cidade: "São Paulo",
    bairro: "Jardim Europa",
    capa: "https://picsum.photos/seed/mansaoclass/1000/1250",
    resumo: "Arquitetura neoclássica, escadaria em mármore e salões amplos.",
    descricao: "Mansão em estilo neoclássico com escadaria em mármore, lustres de cristal e salões amplos. Ideal para produções sofisticadas.",
    infos: [
      { icone: "area",    rotulo: "Área",       valor: "1.200 m²" },
      { icone: "pessoas", rotulo: "Capacidade", valor: "Até 60 pessoas" },
      { icone: "carro",   rotulo: "Estacionamento", valor: "10 vagas" }
    ],
    fotos: [
      "https://picsum.photos/seed/mc1/1600/1067",
      "https://picsum.photos/seed/mc2/1600/1067",
      "https://picsum.photos/seed/mc3/1067/1600",
      "https://picsum.photos/seed/mc4/1600/1067",
      "https://picsum.photos/seed/mc5/1600/1067",
      "https://picsum.photos/seed/mc6/1067/1600"
    ],
    video: { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", titulo: "Tour pelo local" },
    visivel: true
  },
  {
    id: "fazenda-santa-clara",
    nome: "Fazenda Santa Clara",
    cidade: "Campinas",
    bairro: "Joaquim Egídio",
    capa: "https://picsum.photos/seed/fazendasc/1000/1250",
    resumo: "Casarão de fazenda centenário com campos e lago.",
    descricao: "Fazenda histórica com casarão centenário, campos abertos, lago e capela. Cenário perfeito para ensaios externos e produções de época.",
    infos: [
      { icone: "area",    rotulo: "Área",       valor: "15 hectares" },
      { icone: "pessoas", rotulo: "Capacidade", valor: "Até 100 pessoas" },
      { icone: "local",   rotulo: "Distância",  valor: "1h de SP" }
    ],
    fotos: [
      "https://picsum.photos/seed/fs1/1600/1067",
      "https://picsum.photos/seed/fs2/1600/1067",
      "https://picsum.photos/seed/fs3/1600/1067",
      "https://picsum.photos/seed/fs4/1067/1600",
      "https://picsum.photos/seed/fs5/1600/1067"
    ],
    video: "",
    visivel: true
  },
  {
    id: "casarao-colonial",
    nome: "Casarão Colonial",
    cidade: "Campinas",
    bairro: "Cambuí",
    capa: "https://picsum.photos/seed/casaraocol/1000/1250",
    resumo: "Pátio interno, azulejos portugueses e portas altas de madeira.",
    descricao: "Casarão colonial restaurado com pátio interno, azulejos portugueses e portas altas de madeira maciça.",
    infos: [
      { icone: "area",    rotulo: "Área",       valor: "600 m²" },
      { icone: "pessoas", rotulo: "Capacidade", valor: "Até 30 pessoas" }
    ],
    fotos: [
      "https://picsum.photos/seed/cc1/1600/1067",
      "https://picsum.photos/seed/cc2/1067/1600",
      "https://picsum.photos/seed/cc3/1600/1067",
      "https://picsum.photos/seed/cc4/1600/1067"
    ],
    video: "",
    visivel: true
  }
];
