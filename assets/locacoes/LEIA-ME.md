# Fotos e vídeos das locações

Crie uma pasta para cada locação usando o mesmo `id` do arquivo `data/locacoes.js`:

```
assets/locacoes/
├── casa-jardim/
│   ├── capa.jpg        ← foto principal (página inicial)
│   ├── 01.jpg
│   ├── 02.jpg
│   └── video.mp4       ← opcional (máx. 25 MB pelo site do GitHub)
└── loft-industrial/
    ├── capa.jpg
    └── ...
```

Depois, no `data/locacoes.js`:

```js
capa: "assets/locacoes/casa-jardim/capa.jpg",
fotos: [
  "assets/locacoes/casa-jardim/01.jpg",
  { src: "assets/locacoes/casa-jardim/02.jpg", legenda: "Sala principal" }
],
video: "assets/locacoes/casa-jardim/video.mp4"
```

**Dicas**
- Nomes de arquivo sem espaços nem acentos (`sala-principal.jpg`, não `Sala Principal.JPG`).
- Letras maiúsculas/minúsculas importam: `capa.JPG` ≠ `capa.jpg`.
- Reduza as fotos antes de subir (1600–2000 px no lado maior, ~300–500 KB) com o site grátis https://squoosh.app
