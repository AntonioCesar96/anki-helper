afterDOMGambiDaGambiCelular();

var legendas = [];
var styleElementGambiDaGambi;
var esconderBarra = false;

function addStyleElementGambiDaGambiCelular() {
    if (styleElementGambiDaGambi) {
        styleElementGambiDaGambi.parentElement.removeChild(styleElementGambiDaGambi);
    }

    styleElementGambiDaGambi = document.createElement('style');

    styleElementGambiDaGambi.innerHTML = `.legenda {position: absolute !important;} `;
    styleElementGambiDaGambi.innerHTML += `.jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 10px !important; }  `; // line-height: 1.27 !important;
    styleElementGambiDaGambi.innerHTML += `.jw-flag-user-inactive .jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 10px !important; }  `; // line-height: 1.27 !important;

    styleElementGambiDaGambi.innerHTML += `[aria-label="Rewind 10 Seconds"], [aria-label="Seek forward 10s"], [aria-label="Seek backward 10s"], [aria-label="Picture in Picture (PiP)"] { display: none !important; } `;

    // styleElementGambiDaGambi.innerHTML += `.jw-captions { pointer-events: auto !important; }`;

    // styleElementGambiDaGambi.innerHTML += `.jw-svg-icon-buffer, .jw-svg-icon-replay { display: none !important; }`;
    // styleElementGambiDaGambi.innerHTML += `.jw-svg-icon-play, .jw-svg-icon-pause { display: none !important; }`;

    if (esconderBarra) {
        styleElementGambiDaGambi.innerHTML += `.jw-controlbar, .jw-controls-backdrop { display: none !important; }`;

        styleElementGambiDaGambi.innerHTML += `.jw-text-track-display { position: fixed !important; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 20px !important; }  `; // line-height: 1.27 !important;
        styleElementGambiDaGambi.innerHTML += `.jw-flag-user-inactive .jw-text-track-display { position: fixed !important; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 20px !important; }  `; // line-height: 1.27 !important;
    }

    document.head.appendChild(styleElementGambiDaGambi);
}

function afterDOMGambiDaGambiCelular() {

    addStyleElementGambiDaGambiCelular();

    setInterval(() => {
        let legenda = pegarLegendaGambiCelular();
        if (!legenda) {
            return;
        }

        let achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);


    let copiarButton = document.createElement("button");
    copiarButton.innerText = "C";
    copiarButton.style.color = "#434343";
    copiarButton.style.backgroundColor = "#ccc";
    copiarButton.style.border = "none";
    copiarButton.style.padding = "10px 10px";
    copiarButton.style.marginTop = "15px";
    copiarButton.style.borderRadius = "5px";
    copiarButton.style.cursor = "pointer";
    copiarButton.style.position = 'fixed';
    copiarButton.style.top = '10px';
    copiarButton.style.right = '5px';
    copiarButton.style.opacity = ".2";

    document.querySelector('video').parentElement.appendChild(copiarButton);

    copiarButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        let legenda = pegarLegendaGambiCelular();
        if (!legenda) {
            if (legendas && legendas.length > 0) {
                legenda = legendas[legendas.length - 1]
            } else {
                return;
            }
        }

        let achou = legendas.filter(x => x == legenda);
        if (achou.length > 0) {
            legenda = '';
            let index = legendas.indexOf(achou[0]);

            for (let i = 5; i >= 0; i--) {
                if ((index - i) >= 0) {
                    legenda += legendas[index - i] + ' ';
                }
            }

            for (let i = 1; i <= 3; i++) {
                if (legendas.length > (index + i)) {
                    legenda += legendas[index + i] + ' ';
                }
            }
        }

        copyToClipboard(legenda)
    });



    let containerLeft = document.createElement('div');
    containerLeft.style.position = 'fixed';
    containerLeft.style.top = '50%';
    containerLeft.style.marginTop = '-60px';
    containerLeft.style.left = '5px';

    containerLeft.appendChild(criarBotao(3))
    containerLeft.appendChild(criarBotao(4))
    containerLeft.appendChild(criarBotao(6))

    document.querySelector('video').parentElement.appendChild(containerLeft);


    let containerRight = document.createElement('div');
    containerRight.style.position = 'fixed';
    containerRight.style.top = '50%';
    containerRight.style.marginTop = '-60px';
    containerRight.style.right = '5px';

    containerRight.appendChild(criarBotao(3))
    containerRight.appendChild(criarBotao(4))
    containerRight.appendChild(criarBotao(6))

    document.querySelector('video').parentElement.appendChild(containerRight);


    let botaoTravar = criarBotaoTravar()
    botaoTravar.style.position = 'fixed';
    botaoTravar.style.top = '10px';
    botaoTravar.style.left = '5px';

    document.querySelector('video').parentElement.appendChild(botaoTravar);
}

function criarBotao(tempo) {
    let retrocessoButton = document.createElement("button");
    retrocessoButton.innerText = tempo + "s";
    retrocessoButton.style.color = "#434343";
    retrocessoButton.style.backgroundColor = "#ccc";
    retrocessoButton.style.border = "none";
    retrocessoButton.style.padding = "10px 10px";
    retrocessoButton.style.marginTop = "15px";
    retrocessoButton.style.borderRadius = "5px";
    retrocessoButton.style.cursor = "pointer";
    retrocessoButton.style.display = "block";
    retrocessoButton.style.opacity = ".2";

    retrocessoButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        var player = jwplayer("player");
        var currentTime = player.getPosition();
        player.seek(currentTime - tempo);
    });

    return retrocessoButton;
}


function criarBotaoTravar() {
    let retrocessoButton = document.createElement("button");
    retrocessoButton.innerText = "T";
    retrocessoButton.style.color = "#434343";
    retrocessoButton.style.backgroundColor = "#ccc";
    retrocessoButton.style.border = "none";
    retrocessoButton.style.padding = "10px 10px";
    retrocessoButton.style.marginTop = "15px";
    retrocessoButton.style.borderRadius = "5px";
    retrocessoButton.style.cursor = "pointer";
    retrocessoButton.style.display = "block";
    retrocessoButton.style.opacity = ".2";

    retrocessoButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        esconderBarra = !esconderBarra;
        addStyleElementGambiDaGambiCelular();
    });

    return retrocessoButton;
}

function pegarLegendaGambiCelular() {
    let legenda = document.querySelector('.jw-text-track-display')?.innerText;
    if (!legenda) {
        return '';
    }

    if (!legenda) {
        return '';
    }

    legenda = legenda.replaceAll('\n', ' ');
    legenda = legenda.replaceAll('>> ', '');
    legenda = legenda.replaceAll('[', '(');
    legenda = legenda.replaceAll(']', ')');
    legenda = legenda.trim();

    return legenda
}

function copyToClipboard(text) {
    let video = document.querySelector('video');
    const elem = document.createElement('textarea');
    elem.value = text;
    video.parentElement.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    video.parentElement.removeChild(elem);
}