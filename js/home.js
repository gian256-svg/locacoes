/* Página inicial — lista de locações */
(function () {
  "use strict";
  var el = App.el, CFG = App.config, locacoes = App.locacoes;
  var T = CFG.textos || {}, L = CFG.layout || {};

  function texto(id, valor) {
    var n = document.getElementById(id);
    if (!n) return;
    if (valor) n.textContent = valor; else n.remove();
  }
  texto("hero-eyebrow", T.eyebrow);
  texto("hero-titulo", T.titulo);
  texto("hero-subtitulo", T.subtitulo);
  document.title = [T.titulo, (CFG.marca || {}).nome].filter(Boolean).join(" · ");

  var SEM_CIDADE = "Outras";
  var cidades = [];
  locacoes.forEach(function (l) {
    var c = l.cidade || SEM_CIDADE;
    if (cidades.indexOf(c) === -1) cidades.push(c);
  });

  var filtro = "__todas";
  var nav = document.getElementById("filtros");
  var galeria = document.getElementById("galeria");

  function renderFiltros() {
    if (!nav) return;
    if (L.mostrarFiltroCidades === false || cidades.length < 2) { nav.remove(); nav = null; return; }
    [["__todas", T.filtroTodas || "Todas"]].concat(cidades.map(function (c) { return [c, c]; })).forEach(function (o) {
      nav.append(el("button", {
        type: "button", class: "filtro" + (o[0] === filtro ? " ativo" : ""), "data-valor": o[0], "aria-pressed": String(o[0] === filtro),
        onclick: function () {
          filtro = o[0];
          nav.querySelectorAll(".filtro").forEach(function (b) {
            var a = b.getAttribute("data-valor") === filtro;
            b.classList.toggle("ativo", a);
            b.setAttribute("aria-pressed", String(a));
          });
          renderGaleria();
        }
      }, o[1]));
    });
  }

  function grade(lista) {
    return el("div", { class: "grade" }, lista.map(App.criarCard));
  }

  function renderGaleria() {
    galeria.textContent = "";
    var lista = filtro === "__todas" ? locacoes : locacoes.filter(function (l) { return (l.cidade || SEM_CIDADE) === filtro; });
    if (!lista.length) {
      galeria.append(el("p", { class: "vazio", text: T.semLocacoes || "Nenhuma locação disponível no momento." }));
      return;
    }
    if (L.agruparPorCidade !== false) {
      cidades.forEach(function (c) {
        var itens = lista.filter(function (l) { return (l.cidade || SEM_CIDADE) === c; });
        if (!itens.length) return;
        galeria.append(el("section", { class: "secao-cidade container" }, [
          el("header", { class: "secao-cidade__cab revelar" }, [
            el("h2", { class: "secao-cidade__titulo", text: c }),
            el("span", { class: "secao-cidade__linha", "aria-hidden": "true" }),
            el("span", { class: "secao-cidade__qtd", text: itens.length + (itens.length === 1 ? " locação" : " locações") })
          ]),
          grade(itens)
        ]));
      });
    } else {
      galeria.append(el("section", { class: "secao-cidade container" }, grade(lista)));
    }
    App.observarRevelar(galeria);
  }

  renderFiltros();
  renderGaleria();
  App.observarRevelar(document);
})();
