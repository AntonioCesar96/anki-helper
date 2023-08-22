
var sitesHome = [
    { host: "netflix", },
    { host: "primevideo" },
    { host: "Hbomax" },
    { host: "disneyplus" },
    { host: "starplus" },
    { host: "southparkstudios" },
    { host: "youtube" },
    { host: "soaper" },
    { host: "soap2day" },
    { host: "123serieshd" },
    { host: "fmovies" },
    { host: "myflixertv" },
    { host: "movieuniverse" },
]

var siteHome = sitesHome.filter(x => location.host.includes(x.host))[0];
if (siteHome) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMSoap2day);
    } else {
        afterDOMSoap2day();
    }
}

function afterDOMSoap2day() {

    let copiarButton = document.createElement("button");
    copiarButton.innerText = "COPIAR";
    copiarButton.style.color = "#434343";
    copiarButton.style.backgroundColor = "#ccc";
    copiarButton.style.border = "none";
    copiarButton.style.padding = "10px 10px";
    copiarButton.style.marginBottom = "30px";
    copiarButton.style.borderRadius = "5px";
    copiarButton.style.cursor = "pointer";
    copiarButton.style.position = "fixed";
    copiarButton.style.top = "10px";
    copiarButton.style.left = "5px";
    copiarButton.style.zIndex = "999999999999";

    document.body.appendChild(copiarButton);

    copiarButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        const elem = document.createElement("textarea");
        elem.value = codigo;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);

        document.body.removeChild(copiarButton);
    });

}


var codigo = `
afterDOMGambiDaGambiCelular();

var legendas = [];
var styleElementGambiDaGambi;
var esconderBarra = false;
var legendaTopoHtml;

function addStyleElementGambiDaGambiCelular() {
    if (styleElementGambiDaGambi) {
        styleElementGambiDaGambi.parentElement.removeChild(styleElementGambiDaGambi);
    }

    styleElementGambiDaGambi = document.createElement("style");

    styleElementGambiDaGambi.innerHTML = ".legenda {position: absolute !important;} ";
    styleElementGambiDaGambi.innerHTML += ".jw-text-track-display {opacity: 0; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 10px !important; }  ";
    styleElementGambiDaGambi.innerHTML += ".jw-flag-user-inactive .jw-text-track-display {opacity: 0; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 10px !important; }  ";

    styleElementGambiDaGambi.innerHTML += "[aria-label='Rewind 10 Seconds'], [aria-label='Seek forward 10s'], [aria-label='Seek backward 10s'], [aria-label='Picture in Picture (PiP)'] { display: none !important; } ";
    styleElementGambiDaGambi.innerHTML += ".jwplayer {user-select: auto !important; } ";

    if (esconderBarra) {
        styleElementGambiDaGambi.innerHTML += ".jw-controlbar, .jw-controls-backdrop { display: none !important; }";

        styleElementGambiDaGambi.innerHTML += ".jw-text-track-display { position: fixed !important; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 20px !important; }  ";
        styleElementGambiDaGambi.innerHTML += ".jw-flag-user-inactive .jw-text-track-display { position: fixed !important; height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 20px !important; }  ";
    }

    document.head.appendChild(styleElementGambiDaGambi);
}

function criarLegendaTopo() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaTopoHtml');
    legenda.classList.add('legenda');
    legenda.style.position = 'fixed !important';
    legenda.style.zIndex = '99999999999';
    legenda.style.top = '10px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = '22px';
    legenda.style.fontFamily = 'NovaFonte, sans-serif';
    legenda.style.textAlign = 'center';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}


function afterDOMGambiDaGambiCelular() {

    addStyleElementGambiDaGambiCelular();

    if (!document.getElementById('legendaTopoHtml')) {
        legendaTopoHtml = criarLegendaTopo();
        document.querySelector('video').parentElement.appendChild(legendaTopoHtml);
    }

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


    let lastLegenda;
    setInterval(() => {
        let legenda = document.querySelector(".jw-text-track-display")?.innerText;
        if (lastLegenda === legenda) {
            return;
        }

        lastLegenda = legenda;

        if (!legenda) {
            legendaTopoHtml.innerHTML = '';
            legendaTopoHtml.style.display = 'none';
            return;
        }

        legenda = legenda.replaceAll("\\n", " <br> ");


        let palavras = legenda.split(" ");
        let divContainer = document.createElement("div");
        divContainer.style.lineHeight = "normal";
        divContainer.style.padding = "0px 0px 0";

        palavras.forEach(palavra => {
            let span = document.createElement("span");
            span.innerHTML = palavra + " ";
            span.style.cursor = "pointer";
            span.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            span.style.padding = "0px 0px 0";
            span.style.margin = "0";

            span.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(palavra);
            });

            divContainer.appendChild(span);
        });

        legendaTopoHtml.innerHTML = '';
        legendaTopoHtml.appendChild(divContainer);
        legendaTopoHtml.style.display = 'block';
    }, 1);


    let copiarButton = document.createElement("button");
    copiarButton.innerText = "C";
    copiarButton.style.color = "#434343";
    copiarButton.style.backgroundColor = "#ccc";
    copiarButton.style.border = "none";
    copiarButton.style.padding = "10px 10px";
    copiarButton.style.marginBottom = "30px";
    copiarButton.style.borderRadius = "5px";
    copiarButton.style.cursor = "pointer";
    copiarButton.style.opacity = ".2";

    document.querySelector("video").parentElement.appendChild(copiarButton);

    copiarButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        let legenda = pegarLegendaGambiCelular();
        if (!legenda) {
            if (legendas && legendas.length > 0) {
                legenda = legendas[legendas.length - 1];
            } else {
                return;
            }
        }

        let achou = legendas.filter(x => x == legenda);
        if (achou.length > 0) {
            legenda = "";
            let index = legendas.indexOf(achou[0]);

            for (let i = 5; i >= 0; i--) {
                if ((index - i) >= 0) {
                    legenda += legendas[index - i] + " ";
                }
            }

            for (let i = 1; i <= 3; i++) {
                if (legendas.length > (index + i)) {
                    legenda += legendas[index + i] + " ";
                }
            }
        }

        copyToClipboard(legenda);
    });



    let containerLeft = document.createElement("div");
    containerLeft.style.position = "fixed";
    containerLeft.style.top = "10px";
    containerLeft.style.left = "5px";
    containerLeft.style.zIndex = "999999999999";

    containerLeft.appendChild(criarBotaoTravar());
    containerLeft.appendChild(criarBotao(3));
    containerLeft.appendChild(criarBotao(4));
    containerLeft.appendChild(criarBotao(6));

    document.querySelector("video").parentElement.appendChild(containerLeft);


    let containerRight = document.createElement("div");
    containerRight.style.position = "fixed";
    containerRight.style.top = "10px";
    containerRight.style.right = "5px";
    containerRight.style.zIndex = "999999999999";

    containerRight.appendChild(copiarButton);
    containerRight.appendChild(criarBotao(3));
    containerRight.appendChild(criarBotao(4));
    containerRight.appendChild(criarBotao(6));

    document.querySelector("video").parentElement.appendChild(containerRight);
}

function criarBotao(tempo) {
    let retrocessoButton = document.createElement("button");
    retrocessoButton.innerText = tempo + "s";
    retrocessoButton.style.color = "#434343";
    retrocessoButton.style.backgroundColor = "#ccc";
    retrocessoButton.style.border = "none";
    retrocessoButton.style.padding = "10px 10px";
    retrocessoButton.style.marginBottom = "15px";
    retrocessoButton.style.borderRadius = "5px";
    retrocessoButton.style.cursor = "pointer";
    retrocessoButton.style.display = "block";
    retrocessoButton.style.opacity = ".2";

    retrocessoButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        let video = document.querySelector("video");
        video.currentTime = video.currentTime - tempo;
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
    retrocessoButton.style.marginBottom = "30px";
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
    let legenda = document.querySelector(".jw-text-track-display")?.innerText;
    if (!legenda) {
        return "";
    }

    if (!legenda) {
        return "";
    }

    legenda = legenda.replaceAll("\\n", " ");
    legenda = legenda.replaceAll(">> ", "");
    legenda = legenda.replaceAll("[", "(");
    legenda = legenda.replaceAll("]", ")");
    legenda = legenda.trim();

    return legenda
}

function copyToClipboard(text) {
    let video = document.querySelector("video");
    const elem = document.createElement("textarea");
    elem.value = text;
    video.parentElement.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    video.parentElement.removeChild(elem);
}
 `
