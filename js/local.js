/* Página de detalhes da locação */
(function () {
  "use strict";
  var el = App.el, CFG = App.config, T = CFG.textos || {}, L = CFG.layout || {};
  var main = document.getElementById("conteudo");
  var id = new URLSearchParams(window.location.search).get("id");
  var loc = App.locacoes.filter(function (l) { return String(l.id) === id; })[0];

  if (!loc) {
    document.title = (T.naoEncontrado || "Locação não encontrada") + " · " + ((CFG.marca || {}).nome || "");
    main.append(el("section", { class: "nao-encontrado container" }, [
      el("p", { class: "eyebrow", text: "404" }),
      el("h1", { class: "titulo-ouro", text: T.naoEncontrado || "Locação não encontrada" }),
      el("div", { class: "ornamento", "aria-hidden": "true" }, el("span")),
      el("a", { class: "botao botao--contorno", href: "index.html", text: T.voltar || "Todas as locações" })
    ]));
    return;
  }

  document.title = loc.nome + " · " + ((CFG.marca || {}).nome || "");
  var fotos = App.normalizarFotos(loc);
  var lightbox = criarLightbox(fotos);

  /* ---------- Cabeçalho ---------- */
  function hero() {
    return el("section", { class: "local-hero container" }, [
      el("a", { class: "voltar", href: "index.html" }, [el("span", { html: App.icone("voltar") }), T.voltar || "Todas as locações"]),
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
    }, [el("span", { html: App.icone("grade") }), (T.verTodasFotos || "Ver todas as fotos") + " (" + fotos.length + ")"]) : null;
    return el("section", { class: "container revelar" }, el("div", { class: "mosaico mosaico--" + n }, itens.concat(botao || [])));
  }

  /* ---------- Sobre + Informações + Contato ---------- */
  function informacoes() {
    var infos = Array.isArray(loc.infos) ? loc.infos : [];
    var desc = String(loc.descricao || "").split(/\n+/).filter(function (p) { return p.trim(); });
    if (!desc.length && !infos.length) return null;

    var esquerda = el("div", { class: "local-corpo__principal" }, [
      desc.length ? el("div", { class: "bloco revelar" }, [
        el("h2", { class: "titulo-secao", text: T.tituloSobre || "Sobre o espaço" }),
        el("div", { class: "texto-corrido" }, desc.map(function (p) { return el("p", { text: p }); }))
      ]) : null,
      infos.length ? el("div", { class: "bloco revelar" }, [
        el("h2", { class: "titulo-secao", text: T.tituloInfos || "Informações" }),
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

    var wa = App.linkWhatsApp(loc.nome);
    var lateral = el("aside", { class: "cta revelar" }, [
      el("p", { class: "eyebrow", text: loc.nome }),
      el("h3", { class: "cta__titulo", text: T.ctaTitulo || "Gostou deste local?" }),
      T.ctaTexto ? el("p", { class: "cta__texto", text: T.ctaTexto }) : null,
      wa ? el("a", { class: "botao botao--ouro", href: wa, target: "_blank", rel: "noopener noreferrer" }, [el("span", { html: App.icone("whatsapp") }), T.ctaBotao || "Consultar disponibilidade"]) : null,
      el("div", { class: "cta__links" }, App.linksContato(loc.nome))
    ]);

    return el("section", { class: "local-corpo container" }, [esquerda, lateral]);
  }

  /* ---------- Vídeo ---------- */
  var RX_YT = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;
  var RX_VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/i;
  var RX_DRIVE = /drive\.google\.com\/file\/d\/([\w-]+)/i;

  function normalizarVideos() {
    var v = loc.video || loc.videos;
    if (!v) return [];
    return [].concat(v).map(function (x) {
      if (typeof x === "string") return { src: App.safeUrl(x) };
      if (x && typeof x === "object") return { src: App.safeUrl(x.src), titulo: x.titulo, vertical: !!x.vertical, capa: App.safeUrl(x.capa) };
      return null;
    }).filter(function (x) { return x && x.src; });
  }

  function player(v) {
    var m, frame = null;
    var iframeAttrs = { loading: "lazy", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin", title: v.titulo || ("Vídeo — " + loc.nome), allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" };
    if ((m = v.src.match(RX_YT))) frame = "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0&modestbranding=1&playsinline=1";
    else if ((m = v.src.match(RX_VIMEO))) frame = "https://player.vimeo.com/video/" + m[1] + "?dnt=1&title=0&byline=0&portrait=0";
    else if ((m = v.src.match(RX_DRIVE))) frame = "https://drive.google.com/file/d/" + m[1] + "/preview";

    var midia;
    if (frame) { iframeAttrs.src = frame; midia = el("iframe", iframeAttrs); }
    else midia = el("video", { src: v.src, controls: true, playsinline: true, preload: "metadata", controlslist: "nodownload", poster: v.capa || App.safeUrl(loc.capa) || null });

    return el("figure", { class: "video revelar" }, [
      el("div", { class: "player" + (v.vertical ? " player--vertical" : "") }, midia),
      v.titulo ? el("figcaption", { class: "video__legenda", text: v.titulo }) : null
    ]);
  }

  function video() {
    var vids = normalizarVideos();
    if (!vids.length) return null;
    return el("section", { class: "faixa" }, el("div", { class: "container" }, [
      el("h2", { class: "titulo-secao titulo-secao--centro revelar", text: T.tituloVideo || "Vídeo do local" }),
      el("div", { class: "videos" + (vids.length > 1 ? " videos--varios" : "") }, vids.map(player))
    ]));
  }

  /* ---------- Galeria completa ---------- */
  function galeria() {
    if (fotos.length < 2) return null;
    return el("section", { class: "container galeria-completa", id: "galeria-completa" }, [
      el("h2", { class: "titulo-secao titulo-secao--centro revelar", text: T.tituloFotos || "Galeria de fotos" }),
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
        el("h2", { class: "secao-cidade__titulo", text: T.outrasLocacoes || "Outras locações" }),
        el("span", { class: "secao-cidade__linha", "aria-hidden": "true" })
      ]),
      el("div", { class: "grade" }, lista.map(App.criarCard))
    ]);
  }

  /* ---------- Montagem ---------- */
  var secoes = { mosaico: mosaico, informacoes: informacoes, video: video, galeria: galeria, outras: outras };
  var ordem = Array.isArray(L.ordemPaginaLocal) ? L.ordemPaginaLocal : ["mosaico", "informacoes", "video", "galeria", "outras"];
  main.append(hero());
  ordem.forEach(function (nome) {
    if (secoes[nome]) { var s = secoes[nome](); if (s) main.append(s); }
  });
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
