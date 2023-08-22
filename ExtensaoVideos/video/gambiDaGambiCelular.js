afterDOMGambiDaGambiCelular();

var legendas = [];
var styleElementGambiDaGambi;

function addStyleElementGambiDaGambi() {
    if (styleElementGambiDaGambi) {
        styleElementGambiDaGambi.parentElement.removeChild(styleElementGambiDaGambi);
    }

    styleElementGambiDaGambi = document.createElement('style');

    styleElementGambiDaGambi.innerHTML = `.legenda {position: absolute !important;} `;
    styleElementGambiDaGambi.innerHTML += `.jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 5px !important; }  `; // line-height: 1.27 !important;
    styleElementGambiDaGambi.innerHTML += `.jw-flag-user-inactive .jw-text-track-display { bottom: 5px !important;} `;

    styleElementGambiDaGambi.innerHTML += `[aria-label="Rewind 10 Seconds"], [aria-label="Seek forward 10s"], [aria-label="Seek backward 10s"], [aria-label="Picture in Picture (PiP)"] { display: none !important; } `;

    document.head.appendChild(styleElementGambiDaGambi);
}

function afterDOMGambiDaGambiCelular() {

    addStyleElementGambiDaGambi();

    setInterval(() => {
        var legenda = pegarLegendaGambiCelular();
        if (!legenda) {
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    var copiarButton = document.createElement("button");
    copiarButton.innerText = "C";
    copiarButton.style.color = "#434343";
    copiarButton.style.backgroundColor = "#ccc";
    copiarButton.style.border = "none";
    copiarButton.style.padding = "10px 10px";
    copiarButton.style.marginLeft = "7px";
    copiarButton.style.borderRadius = "5px";
    copiarButton.style.cursor = "pointer";

    var durationElement = document.querySelector(".jw-text-duration");
    durationElement.appendChild(copiarButton);

    copiarButton.addEventListener("click", () => {
        var legenda = pegarLegendaGambiCelular();
        if (!legenda) {
            if (legendas && legendas.length > 0) {
                legenda = legendas[legendas.length - 1]
            } else {
                return;
            }
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length > 0) {
            legenda = '';
            var index = legendas.indexOf(achou[0]);

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

        function copyToClipboard(text) {
            var video = document.querySelector('video');
            const elem = document.createElement('textarea');
            elem.value = text;
            video.parentElement.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            video.parentElement.removeChild(elem);
        }
    });

    function pegarLegendaGambiCelular() {
        var legenda = document.querySelector('.jw-text-track-display')?.innerText;
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



    function criarBotao(tempo) {
        var retrocessoButton = document.createElement("button");
        retrocessoButton.innerText = tempo + "s";
        retrocessoButton.style.color = "#434343";
        retrocessoButton.style.backgroundColor = "#ccc";
        retrocessoButton.style.border = "none";
        retrocessoButton.style.padding = "10px 10px";
        retrocessoButton.style.marginLeft = "7px";
        retrocessoButton.style.borderRadius = "5px";
        retrocessoButton.style.cursor = "pointer";

        retrocessoButton.addEventListener("click", () => {
            var player = jwplayer("player");
            var currentTime = player.getPosition();
            player.seek(currentTime - tempo);
        });

        return retrocessoButton;
    }

    var buttonContainer = document.querySelector(".jw-button-container");

    let b1_3s = criarBotao(3)
    buttonContainer.insertBefore(b1_3s, buttonContainer.firstChild);
    let b1_4s = criarBotao(4)
    buttonContainer.insertBefore(b1_4s, buttonContainer.firstChild);
    let b1_6s = criarBotao(6)
    buttonContainer.insertBefore(b1_6s, buttonContainer.firstChild);

    let b2_3s = criarBotao(3)
    buttonContainer.appendChild(b2_3s);
    let b2_4s = criarBotao(4)
    buttonContainer.appendChild(b2_4s);
    let b2_6s = criarBotao(6)
    buttonContainer.appendChild(b2_6s);
}
