/* Página inicial — lista de locações */
(function () {
  "use strict";
  var el = App.el, CFG = App.config, texto = App.texto;
  var L = CFG.layout || {};

  /* ---------- Cabeçalho (textos vazios são removidos) ---------- */
  function preencher(id, valor) {
    var n = document.getElementById(id);
    if (!n) return;
    if (valor) n.textContent = valor; else n.remove();
  }
  var titulo = texto("titulo", "Locações Disponíveis");
  preencher("hero-eyebrow", texto("eyebrow", ""));
  preencher("hero-titulo", titulo);
  preencher("hero-subtitulo", texto("subtitulo", ""));
  var hero = document.querySelector(".hero");
  if (hero && !hero.querySelector("p, h1")) hero.remove();
  document.title = [titulo, (CFG.marca || {}).nome].filter(Boolean).join(" · ") || "Locações";

  /* ---------- Cidades ----------
     Ordem e visibilidade vêm do painel (Configurações › Cidades).
     Cidades não cadastradas lá aparecem no fim. */
  var SEM_CIDADE = "Outras";
  var cadastro = (Array.isArray(CFG.cidades) ? CFG.cidades : []).filter(function (c) { return c && c.nome; });
  var info = {};
  cadastro.forEach(function (c) { info[c.nome.trim().toLowerCase()] = c; });
  var chave = function (nome) { return String(nome || SEM_CIDADE).trim().toLowerCase(); };
  var visivel = function (nome) { var c = info[chave(nome)]; return !c || c.visivel !== false; };

  var locacoes = App.locacoes.filter(function (l) { return visivel(l.cidade); });
  var cidades = [];
  cadastro.forEach(function (c) {
    if (c.visivel !== false && locacoes.some(function (l) { return chave(l.cidade) === chave(c.nome); })) cidades.push(c.nome.trim());
  });
  locacoes.forEach(function (l) {
    var n = (l.cidade || SEM_CIDADE).trim();
    if (!cidades.some(function (c) { return chave(c) === chave(n); })) cidades.push(n);
  });

  var filtro = "__todas";
  var nav = document.getElementById("filtros");
  var galeria = document.getElementById("galeria");

  function renderFiltros() {
    if (!nav) return;
    if (L.mostrarFiltroCidades === false || cidades.length < 2) { nav.remove(); nav = null; return; }
    var opcoes = cidades.map(function (c) { return [c, c]; });
    var todas = texto("filtroTodas", "Todas");
    if (todas) opcoes.unshift(["__todas", todas]);
    else filtro = cidades[0];
    opcoes.forEach(function (o) {
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
    var lista = filtro === "__todas" ? locacoes : locacoes.filter(function (l) { return chave(l.cidade) === chave(filtro); });
    if (!lista.length) {
      galeria.append(el("p", { class: "vazio", text: texto("semLocacoes", "Nenhuma locação disponível no momento.") }));
      return;
    }
    if (L.agruparPorCidade !== false) {
      cidades.forEach(function (c) {
        var itens = lista.filter(function (l) { return chave(l.cidade) === chave(c); });
        if (!itens.length) return;
        var dados = info[chave(c)] || {};
        galeria.append(el("section", { class: "secao-cidade container" }, [
          el("header", { class: "secao-cidade__cab revelar" }, [
            el("div", { class: "secao-cidade__textos" }, [
              el("h2", { class: "secao-cidade__titulo", text: c }),
              dados.subtitulo ? el("p", { class: "secao-cidade__sub", text: dados.subtitulo }) : null
            ]),
            el("span", { class: "secao-cidade__linha", "aria-hidden": "true" }),
            L.mostrarQuantidadePorCidade === false ? null :
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
