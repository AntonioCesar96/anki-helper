(() => {
  if (window.legendaAtiva) {
    return;
  }

  window.legendaAtiva = true;

  let conteudoLegenda = "";
  let legendas = [];
  let legendaAtual = "";
  let atrasoLegendaMilissegundos = Number(localStorage.getItem("atrasoLegendaMilissegundos")) || 0;
  let video = null;
  let trilhaNativa = null;

  const linkFonte = document.createElement("link");
  linkFonte.href = "https://db.onlinewebfonts.com/c/da8df087b9aea1bd74a2e899278d9457?family=CinecavDSans-Regular";
  linkFonte.rel = "stylesheet";
  document.head.appendChild(linkFonte);

  const inputArquivo = document.createElement("input");
  inputArquivo.type = "file";
  inputArquivo.accept = ".srt";
  inputArquivo.style.display = "none";
  document.body.appendChild(inputArquivo);

  const caixaLegenda = document.createElement("div");
  caixaLegenda.id = "caixa-legenda-srt";
  caixaLegenda.style.position = "fixed";
  caixaLegenda.style.left = "50%";
  caixaLegenda.style.bottom = "8%";
  caixaLegenda.style.transform = "translateX(-50%)";
  caixaLegenda.style.zIndex = "999999";
  caixaLegenda.style.display = "none";
  caixaLegenda.style.maxWidth = "90vw";
  caixaLegenda.style.padding = "10px 5px";
  caixaLegenda.style.background = "rgba(0, 0, 0, 0.8)";
  caixaLegenda.style.color = "#fff";
  caixaLegenda.style.fontSize = "28px";
  caixaLegenda.style.fontFamily = 'CinecavDSans-Regular, cinecav-sans-regular, Arial, Helvetica, sans-serif';
  caixaLegenda.style.textAlign = "center";
  caixaLegenda.style.whiteSpace = "pre-line";
  caixaLegenda.style.cursor = "move";
  caixaLegenda.style.userSelect = "none";
  document.body.appendChild(caixaLegenda);

  const dialogAtraso = document.createElement("div");
  dialogAtraso.id = "dialog-atraso-legenda";
  dialogAtraso.style.position = "fixed";
  dialogAtraso.style.top = "20px";
  dialogAtraso.style.right = "20px";
  dialogAtraso.style.zIndex = "1000000";
  dialogAtraso.style.display = "none";
  dialogAtraso.style.alignItems = "center";
  dialogAtraso.style.gap = "8px";
  dialogAtraso.style.padding = "8px";
  dialogAtraso.style.background = "rgba(0, 0, 0, 0.8)";
  dialogAtraso.style.borderRadius = "6px";

  const inputAtraso = document.createElement("input");
  inputAtraso.type = "text";
  inputAtraso.placeholder = "ms";
  inputAtraso.style.width = "70px";
  inputAtraso.style.height = "24px";
  inputAtraso.style.fontSize = "16px";

  const botaoFecharDialog = document.createElement("button");
  botaoFecharDialog.textContent = "X";
  botaoFecharDialog.style.width = "28px";
  botaoFecharDialog.style.height = "28px";
  botaoFecharDialog.style.cursor = "pointer";

  dialogAtraso.appendChild(inputAtraso);
  dialogAtraso.appendChild(botaoFecharDialog);
  document.body.appendChild(dialogAtraso);

  function estaEmFullscreenVideo() {
    return document.fullscreenElement && document.fullscreenElement.tagName === "VIDEO";
  }

  function obterContainerFullscreen() {
    const elementoFullscreen = document.fullscreenElement;

    if (!elementoFullscreen || elementoFullscreen.tagName === "VIDEO") {
      return document.body;
    }

    return elementoFullscreen;
  }

  function atualizarContainerInterface() {
    const container = obterContainerFullscreen();

    if (caixaLegenda.parentElement !== container) {
      container.appendChild(caixaLegenda);
    }

    if (dialogAtraso.parentElement !== container) {
      container.appendChild(dialogAtraso);
    }
  }

  function limparTrilhaNativa() {
    if (!trilhaNativa || !trilhaNativa.cues) {
      return;
    }

    Array.from(trilhaNativa.cues).forEach((cue) => {
      trilhaNativa.removeCue(cue);
    });
  }

  function sincronizarTrilhaNativa() {
    if (!video || !("VTTCue" in window)) {
      return;
    }

    if (!trilhaNativa) {
      trilhaNativa = video.addTextTrack("subtitles", "Legenda SRT", "pt-BR");
      trilhaNativa.mode = "disabled";
    }

    limparTrilhaNativa();

    const atrasoEmSegundos = atrasoLegendaMilissegundos / 1000;

    legendas.forEach((legenda) => {
      const inicio = Math.max(0, legenda.inicio + atrasoEmSegundos);
      const fim = Math.max(inicio + 0.001, legenda.fim + atrasoEmSegundos);
      trilhaNativa.addCue(new VTTCue(inicio, fim, legenda.texto));
    });
  }

  function atualizarModoFullscreen() {
    atualizarContainerInterface();

    if (trilhaNativa) {
      trilhaNativa.mode = estaEmFullscreenVideo() ? "showing" : "disabled";
    }

    atualizarLegenda();
  }

  function tempoSrtParaSegundos(tempo) {
    const partes = tempo.trim().split(/[:,]/);
    const horas = Number(partes[0]);
    const minutos = Number(partes[1]);
    const segundos = Number(partes[2]);
    const milissegundos = Number(partes[3]);

    return horas * 3600 + minutos * 60 + segundos + milissegundos / 1000;
  }

  function lerSrt(texto) {
    return texto
      .replace(/\r/g, "")
      .trim()
      .split(/\n\s*\n/)
      .map((bloco) => {
        const linhas = bloco.split("\n");
        const linhaTempo = linhas.find((linha) => linha.includes("-->"));

        if (!linhaTempo) {
          return null;
        }

        const [inicio, fim] = linhaTempo.split("-->");
        const indiceLinhaTempo = linhas.indexOf(linhaTempo);
        const textoLegenda = linhas.slice(indiceLinhaTempo + 1).join("\n").trim();

        return {
          inicio: tempoSrtParaSegundos(inicio),
          fim: tempoSrtParaSegundos(fim),
          texto: textoLegenda,
        };
      })
      .filter(Boolean);
  }

  function atualizarLegenda() {
    if (!video) {
      return;
    }

    console.log(`Current Time: ${video.currentTime}`);

    const tempoComAtraso = video.currentTime - atrasoLegendaMilissegundos / 1000;
    const legendaEncontrada = legendas.find((legenda) => (
      tempoComAtraso >= legenda.inicio && tempoComAtraso <= legenda.fim
    ));

    const novoTexto = legendaEncontrada ? legendaEncontrada.texto : "";

    if (novoTexto === legendaAtual) {
      return;
    }

    legendaAtual = novoTexto;
    caixaLegenda.textContent = legendaAtual;
    caixaLegenda.style.display = legendaAtual ? "block" : "none";
  }

  inputArquivo.addEventListener("change", () => {
    const arquivo = inputArquivo.files[0];

    if (!arquivo) {
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      conteudoLegenda = String(leitor.result);
      legendas = lerSrt(conteudoLegenda);
      legendaAtual = "";
      sincronizarTrilhaNativa();
      atualizarLegenda();
    };

    leitor.readAsText(arquivo, "UTF-8");
  });

  document.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();

    if (tecla === "q") {
      inputArquivo.click();
    }

    if (tecla === "w") {
      event.preventDefault();
      dialogAtraso.style.display = "flex";
      inputAtraso.value = String(atrasoLegendaMilissegundos);
      inputAtraso.focus();
      inputAtraso.select();
    }

    if (event.key === ".") {
      const controles = document.querySelector('[data-testid="playback_controls"]');

      if (controles) {
        const opacityTela = Number(controles.style.opacity);
        controles.style.opacity = opacityTela === 0 ? 1 : 0.1;
      }
    }
  });

  inputAtraso.addEventListener("input", () => {
    const valorDigitado = Number(inputAtraso.value.replace(",", "."));

    if (!Number.isNaN(valorDigitado)) {
      atrasoLegendaMilissegundos = valorDigitado;
      localStorage.setItem("atrasoLegendaMilissegundos", String(atrasoLegendaMilissegundos));
      sincronizarTrilhaNativa();
      atualizarLegenda();
    }
  });

  botaoFecharDialog.addEventListener("click", () => {
    dialogAtraso.style.display = "none";
  });

  function areaVisivel(elemento) {
    const retangulo = elemento.getBoundingClientRect();
    const largura = Math.max(0, Math.min(retangulo.right, window.innerWidth) - Math.max(retangulo.left, 0));
    const altura = Math.max(0, Math.min(retangulo.bottom, window.innerHeight) - Math.max(retangulo.top, 0));

    return largura * altura;
  }

  function escolherVideoPrincipal() {
    const videos = Array.from(document.querySelectorAll("video"));

    if (!videos.length) {
      return null;
    }

    const videosOrdenados = videos
      .map((elemento) => ({
        elemento,
        area: areaVisivel(elemento),
        tocando: !elemento.paused && !elemento.ended,
        usado: elemento.played.length > 0,
      }))
      .filter((item) => item.area > 0 || item.usado || item.tocando)
      .sort((a, b) => {
        if (a.tocando !== b.tocando) {
          return a.tocando ? -1 : 1;
        }

        if (a.usado !== b.usado) {
          return a.usado ? -1 : 1;
        }

        return b.area - a.area;
      });

    return videosOrdenados[0]?.elemento || videos[0];
  }

  function conectarNoVideo() {
    const videoEncontrado = escolherVideoPrincipal();

    if (!videoEncontrado || videoEncontrado === video) {
      return;
    }

    if (video) {
      video.removeEventListener("timeupdate", atualizarLegenda);
      video.removeEventListener("seeked", atualizarLegenda);
      video.removeEventListener("play", atualizarLegenda);
    }

    video = videoEncontrado;
    trilhaNativa = null;
    sincronizarTrilhaNativa();
    video.addEventListener("timeupdate", atualizarLegenda);
    video.addEventListener("seeked", atualizarLegenda);
    video.addEventListener("play", atualizarLegenda);
    atualizarModoFullscreen();
    atualizarLegenda();
  }

  conectarNoVideo();

  const observador = new MutationObserver(conectarNoVideo);
  observador.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  setInterval(conectarNoVideo, 1000);
  document.addEventListener("fullscreenchange", atualizarModoFullscreen);
  document.addEventListener("webkitfullscreenchange", atualizarModoFullscreen);

  let arrastando = false;
  let diferencaY = 0;

  caixaLegenda.addEventListener("mousedown", (event) => {
    arrastando = true;
    caixaLegenda.style.transform = "translateX(-50%)";

    const posicao = caixaLegenda.getBoundingClientRect();
    diferencaY = event.clientY - posicao.top;
  });

  document.addEventListener("mousemove", (event) => {
    if (!arrastando) {
      return;
    }

    caixaLegenda.style.left = "50%";
    caixaLegenda.style.top = `${event.clientY - diferencaY}px`;
    caixaLegenda.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    arrastando = false;
  });
})();
