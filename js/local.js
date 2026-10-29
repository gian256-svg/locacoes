/* Página de detalhes da locação */
(function () {
  "use strict";
  var el = App.el, CFG = App.config, texto = App.texto, L = CFG.layout || {};
  var main = document.getElementById("conteudo");
  /* Título só aparece se o texto não estiver vazio no painel */
  function cab(tag, cls, txt) { return txt ? el(tag, { class: cls, text: txt }) : null; }
  var id = new URLSearchParams(window.location.search).get("id");
  var loc = App.locacoes.filter(function (l) { return String(l.id) === id; })[0];

  if (!loc) {
    document.title = (texto("naoEncontrado", "Locação não encontrada")) + " · " + ((CFG.marca || {}).nome || "");
    main.append(el("section", { class: "nao-encontrado container" }, [
      el("p", { class: "eyebrow", text: "404" }),
      cab("h1", "titulo-ouro", texto("naoEncontrado", "Locação não encontrada")),
      el("div", { class: "ornamento", "aria-hidden": "true" }, el("span")),
      el("a", { class: "botao botao--contorno", href: "index.html", text: texto("voltar", "Todas as locações") || "Voltar" })
    ]));
    return;
  }

  document.title = loc.nome + " · " + ((CFG.marca || {}).nome || "");
  var fotos = App.normalizarFotos(loc);
  var lightbox = criarLightbox(fotos);

  /* ---------- Cabeçalho ---------- */
  function hero() {
    return el("section", { class: "local-hero container" }, [
      texto("voltar", "Todas as locações") ? el("a", { class: "voltar", href: "index.html" }, [el("span", { html: App.icone("voltar") }), texto("voltar", "Todas as locações")]) : null,
      el("p", { class: "eyebrow", text: [loc.cidade, loc.bairro].filter(Boolean).join(" · ") }),
      el("h1", { class: "titulo-ouro", text: loc.nome }),
      el("div", { class: "ornamento", "aria-hidden": "true" }, el("span")),
      loc.resumo ? el("p", { class: "local-hero__resumo", text: loc.resumo }) : null
    ]);
  }

  /* ---------- Mosaico de fotos ---------- */
  function mosaico() {
    if (!fotos.length) return null;
    var n = fotos.length >= 5 ? 5 : fotos.length >= 3 ? 3 : fotos.length;
    var itens = fotos.slice(0, n).map(function (f, i) {
      return el("button", { type: "button", class: "mosaico__item", "aria-label": "Abrir foto " + (i + 1), onclick: function () { lightbox.abrir(i); } },
        el("img", { src: f.src, alt: f.legenda || loc.nome, loading: i === 0 ? "eager" : "lazy", decoding: "async" }));
    });
    var botao = fotos.length > 1 ? el("button", {
      type: "button", class: "mosaico__todas",
      onclick: function () {
        var g = document.getElementById("galeria-completa");
        if (g) g.scrollIntoView({ behavior: "smooth", block: "start" }); else lightbox.abrir(0);
      }
    }, [el("span", { html: App.icone("grade") }), [texto("verTodasFotos", "Ver todas as fotos"), "(" + fotos.length + ")"].filter(Boolean).join(" ")]) : null;
    return el("section", { class: "container revelar" }, el("div", { class: "mosaico mosaico--" + n }, itens.concat(botao || [])));
  }

  /* ---------- Sobre + Informações + Contato ---------- */
  function informacoes() {
    var infos = Array.isArray(loc.infos) ? loc.infos : [];
    var desc = String(loc.descricao || "").split(/\n+/).filter(function (p) { return p.trim(); });
    if (!desc.length && !infos.length) return null;

    var esquerda = el("div", { class: "local-corpo__principal" }, [
      desc.length ? el("div", { class: "bloco revelar" }, [
        cab("h2", "titulo-secao", texto("tituloSobre", "Sobre o espaço")),
        el("div", { class: "texto-corrido" }, desc.map(function (p) { return el("p", { text: p }); }))
      ]) : null,
      infos.length ? el("div", { class: "bloco revelar" }, [
        cab("h2", "titulo-secao", texto("tituloInfos", "Informações")),
        el("ul", { class: "infos-grade" }, infos.map(function (i) {
          return el("li", { class: "info" }, [
            el("span", { class: "info__icone", html: App.icone(i.icone) }),
            el("span", { class: "info__textos" }, [
              el("span", { class: "info__rotulo", text: i.rotulo || "" }),
              el("span", { class: "info__valor", text: String(i.valor || "") })
            ])
          ]);
        }))
      ]) : null
    ]);

    var lateral = criarCta("cta--desktop");

    return el("section", { class: "local-corpo container" + (lateral ? "" : " local-corpo--sem-cta") }, [esquerda, lateral]);
  }

  /* Caixa "Gostou deste local?". No celular ela aparece mais abaixo
     (depois dos ensaios); no computador, ao lado das informações. */
  function criarCta(variante) {
    if (L.mostrarCaixaContato === false) return null;
    var wa = App.linkWhatsApp(loc.nome);
    return el("aside", { class: "cta revelar " + variante }, [
      el("p", { class: "eyebrow", text: loc.nome }),
      cab("h3", "cta__titulo", texto("ctaTitulo", "Gostou deste local?")),
      texto("ctaTexto", "") ? el("p", { class: "cta__texto", text: texto("ctaTexto", "") }) : null,
      wa ? el("a", { class: "botao botao--ouro", href: wa, target: "_blank", rel: "noopener noreferrer" }, [el("span", { html: App.icone("whatsapp") }), texto("ctaBotao", "Consultar disponibilidade") || "WhatsApp"]) : null,
      // Ícones de WhatsApp/Instagram já ficam fixos no topo; só repete aqui se o topo estiver sem eles
      L.mostrarContatoNoTopo === false ? el("div", { class: "cta__links" }, App.linksContato(loc.nome)) : null
    ]);
  }

  /* ---------- Vídeo ---------- */
  var RX_YT = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;
  var RX_VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/i;
  var RX_DRIVE = /drive\.google\.com\/file\/d\/([\w-]+)/i;

  function normalizarVideos() {
    var v = loc.video || loc.videos;
    if (!v) return [];
    return [].concat(v).map(function (x) {
      if (typeof x === "string") return { src: App.safeUrl(x), formato: "auto" };
      if (x && typeof x === "object") return { src: App.safeUrl(x.src), titulo: x.titulo, formato: x.formato || (x.vertical ? "vertical" : "auto"), capa: App.safeUrl(x.capa) };
      return null;
    }).filter(function (x) { return x && x.src; });
  }

  /* Ajusta a proporção do player (largura / altura do vídeo) */
  function aplicarProporcao(caixa, w, h) {
    if (!(w > 0 && h > 0)) return;
    caixa.style.setProperty("--ar", w + " / " + h);
    caixa.style.setProperty("--arn", String(w / h));
    caixa.classList.toggle("player--vertical", h > w);
  }

  function player(v) {
    var m, frame = null;
    var iframeAttrs = { loading: "lazy", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin", title: v.titulo || ("Vídeo — " + loc.nome), allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" };
    var vertical = v.formato === "vertical";
    if ((m = v.src.match(RX_YT))) {
      frame = "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0&modestbranding=1&playsinline=1";
      if (v.formato === "auto" && /\/shorts\//i.test(v.src)) vertical = true; // YouTube Shorts é sempre em pé
    }
    else if ((m = v.src.match(RX_VIMEO))) frame = "https://player.vimeo.com/video/" + m[1] + "?dnt=1&title=0&byline=0&portrait=0";
    else if ((m = v.src.match(RX_DRIVE))) frame = "https://drive.google.com/file/d/" + m[1] + "/preview";

    var caixa = el("div", { class: "player" + (vertical ? " player--vertical" : "") });
    var midia;
    if (frame) { iframeAttrs.src = frame; midia = el("iframe", iframeAttrs); }
    else {
      midia = el("video", { src: v.src, controls: true, playsinline: true, preload: "metadata", controlslist: "nodownload", poster: v.capa || App.safeUrl(loc.capa) || null });
      // Arquivo enviado: no modo automático, usa o formato real do vídeo
      if (v.formato === "auto") midia.addEventListener("loadedmetadata", function () { aplicarProporcao(caixa, midia.videoWidth, midia.videoHeight); });
    }
    caixa.append(midia);

    return el("figure", { class: "video revelar" }, [
      caixa,
      v.titulo ? el("figcaption", { class: "video__legenda", text: v.titulo }) : null
    ]);
  }

  function video() {
    var vids = normalizarVideos();
    if (!vids.length) return null;
    return el("section", { class: "faixa" }, el("div", { class: "container" }, [
      cab("h2", "titulo-secao titulo-secao--centro revelar", texto("tituloVideo", "Vídeo do local")),
      el("div", { class: "videos" + (vids.length > 1 ? " videos--varios" : "") }, vids.map(player))
    ]));
  }

  /* ---------- Galeria completa ---------- */
  function galeria() {
    if (fotos.length < 2) return null;
    return el("section", { class: "container galeria-completa", id: "galeria-completa" }, [
      cab("h2", "titulo-secao titulo-secao--centro revelar", texto("tituloFotos", "Galeria de fotos")),
      el("div", { class: "masonry" }, fotos.map(function (f, i) {
        return el("button", { type: "button", class: "masonry__item revelar", "aria-label": "Abrir foto " + (i + 1), onclick: function () { lightbox.abrir(i); } }, [
          el("img", { src: f.src, alt: f.legenda || loc.nome, loading: "lazy", decoding: "async" }),
          f.legenda ? el("span", { class: "masonry__legenda", text: f.legenda }) : null
        ]);
      }))
    ]);
  }

  /* ---------- Outras locações ---------- */
  function outras() {
    var qtd = Number(L.quantidadeOutras) >= 0 ? Number(L.quantidadeOutras) : 3;
    var lista = App.locacoes.filter(function (l) { return l.id !== loc.id; });
    // prioriza mesma cidade
    lista.sort(function (a, b) { return (b.cidade === loc.cidade) - (a.cidade === loc.cidade); });
    lista = lista.slice(0, qtd);
    if (!lista.length) return null;
    return el("section", { class: "container outras" }, [
      el("div", { class: "secao-cidade__cab revelar" }, [
        cab("h2", "secao-cidade__titulo", texto("outrasLocacoes", "Outras locações")),
        el("span", { class: "secao-cidade__linha", "aria-hidden": "true" })
      ]),
      el("div", { class: "grade" }, lista.map(App.criarCard))
    ]);
  }

  /* ---------- Ensaios feitos aqui ---------- */
  function ensaios() {
    var lista = (Array.isArray(loc.ensaios) ? loc.ensaios : [])
      .map(function (s) { return { src: App.safeUrl(s) }; })
      .filter(function (f) { return f.src; });
    if (!lista.length) return null;
    var lb = criarLightbox(lista);
    var trilho = el("div", { class: "masonry ensaios__trilho revelar" }, lista.map(function (f, i) {
      return el("button", { type: "button", class: "masonry__item", "aria-label": "Abrir foto de ensaio " + (i + 1), onclick: function () { lb.abrir(i); } },
        el("img", { src: f.src, alt: "Ensaio em " + loc.nome, loading: "lazy", decoding: "async" }));
    }));

    /* Indicador do carrossel (só aparece no celular): bolinhas ou "3 / 20" */
    var usarBolinhas = lista.length <= 12;
    var bolinhas = usarBolinhas ? lista.map(function (_, i) {
      return el("button", { type: "button", class: "ensaios__ponto", "aria-label": "Ir para foto " + (i + 1), onclick: function () { irPara(i); } });
    }) : [];
    var contador = usarBolinhas ? null : el("span", { class: "ensaios__contador" });
    var indicador = lista.length > 1 ? el("div", { class: "ensaios__indicador", "aria-hidden": usarBolinhas ? null : "true" }, usarBolinhas ? bolinhas : contador) : null;

    function itemAtual() {
      var itens = trilho.children, centro = trilho.scrollLeft + trilho.clientWidth / 2, melhor = 0, dist = Infinity;
      for (var i = 0; i < itens.length; i++) {
        var d = Math.abs(itens[i].offsetLeft + itens[i].offsetWidth / 2 - centro);
        if (d < dist) { dist = d; melhor = i; }
      }
      return melhor;
    }
    function irPara(i) {
      var item = trilho.children[i];
      if (item) trilho.scrollTo({ left: item.offsetLeft - (trilho.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
    }
    function atualizar() {
      var atual = itemAtual();
      bolinhas.forEach(function (b, i) { b.classList.toggle("ativo", i === atual); });
      if (contador) contador.textContent = (atual + 1) + " / " + lista.length;
    }
    var pendente = false;
    trilho.addEventListener("scroll", function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () { pendente = false; atualizar(); });
    }, { passive: true });
    atualizar();

    return el("section", { class: "container ensaios", id: "ensaios" }, [
      cab("h2", "titulo-secao titulo-secao--centro revelar", texto("tituloEnsaios", "Ensaios feitos aqui")),
      texto("subtituloEnsaios", "") ? el("p", { class: "ensaios__sub revelar", text: texto("subtituloEnsaios", "") }) : null,
      trilho,
      indicador
    ]);
  }

  /* ---------- Montagem ---------- */
  var secoes = { mosaico: mosaico, informacoes: informacoes, video: video, galeria: galeria, ensaios: ensaios, outras: outras };
  var ordem = Array.isArray(L.ordemPaginaLocal) ? L.ordemPaginaLocal : ["mosaico", "informacoes", "video", "galeria", "ensaios", "outras"];
  main.append(hero());
  var temCta = false, ctaCelularColocada = false;
  function ctaCelular() {
    if (!temCta || ctaCelularColocada) return;
    ctaCelularColocada = true;
    main.append(el("section", { class: "container cta-celular" }, criarCta("cta--celular")));
  }
  ordem.forEach(function (nome) {
    if (!secoes[nome]) return;
    if (nome === "outras") ctaCelular(); // no celular: depois dos ensaios, antes de "Outras locações"
    var s = secoes[nome]();
    if (s) {
      if (nome === "informacoes" && s.querySelector(".cta")) temCta = true;
      main.append(s);
    }
  });
  ctaCelular(); // se "Outras locações" estiver desligada, fica no final
  App.observarRevelar(main);

  /* ---------- Visualizador de fotos (lightbox) ---------- */
  function criarLightbox(lista) {
    var atual = 0, ultimoFoco = null, xInicio = null;
    var img = el("img", { class: "lb__img", alt: "" });
    var legenda = el("p", { class: "lb__legenda" });
    var contador = el("span", { class: "lb__contador" });
    var btnFechar = el("button", { type: "button", class: "lb__btn lb__fechar", "aria-label": "Fechar", html: App.icone("fechar"), onclick: fechar });
    var unica = lista.length < 2;

    var box = el("div", { class: "lb", role: "dialog", "aria-modal": "true", "aria-label": "Visualizador de fotos", hidden: true }, [
      el("div", { class: "lb__topo" }, [contador, btnFechar]),
      unica ? null : el("button", { type: "button", class: "lb__btn lb__nav lb__ant", "aria-label": "Foto anterior", html: App.icone("anterior"), onclick: function () { ir(-1); } }),
      el("figure", { class: "lb__palco" }, [img, legenda]),
      unica ? null : el("button", { type: "button", class: "lb__btn lb__nav lb__prox", "aria-label": "Próxima foto", html: App.icone("proximo"), onclick: function () { ir(1); } })
    ]);
    document.body.append(box);

    img.addEventListener("load", function () { img.classList.add("carregado"); });

    function mostrar(i) {
      atual = (i + lista.length) % lista.length;
      var f = lista[atual];
      img.classList.remove("carregado");
      img.src = f.src;
      img.alt = f.legenda || loc.nome;
      legenda.textContent = f.legenda || "";
      contador.textContent = (atual + 1) + " / " + lista.length;
      [1, -1].forEach(function (d) { var p = lista[(atual + d + lista.length) % lista.length]; if (p) new Image().src = p.src; });
    }
    function ir(d) { mostrar(atual + d); }
    function abrir(i) {
      if (!lista.length) return;
      ultimoFoco = document.activeElement;
      box.hidden = false;
      document.body.classList.add("travado");
      mostrar(i);
      requestAnimationFrame(function () { box.classList.add("aberto"); });
      btnFechar.focus();
    }
    function fechar() {
      box.classList.remove("aberto");
      document.body.classList.remove("travado");
      setTimeout(function () { box.hidden = true; }, 300);
      if (ultimoFoco) ultimoFoco.focus();
    }

    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowRight" && !unica) ir(1);
      else if (e.key === "ArrowLeft" && !unica) ir(-1);
      else if (e.key === "Tab") { e.preventDefault(); btnFechar.focus(); }
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lb__palco")) fechar();
    });
    box.addEventListener("touchstart", function (e) { xInicio = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (xInicio === null || unica) return;
      var dx = e.changedTouches[0].clientX - xInicio;
      if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
      xInicio = null;
    });

    return { abrir: abrir };
  }
})();
