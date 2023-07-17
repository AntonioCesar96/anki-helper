if (location.host === "www.netflix.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMNetflix);
    } else {
        afterDOMNetflix();
    }
}

function inject() {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('netflix-rewind-1-sec.js');
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

var legendas = [];
var styleElementNetflix;
var posicaoLegendaSliderRodapeNetflix = localStorage.getItem('posicaoLegendaSliderRodape') ? Number(localStorage.getItem('posicaoLegendaSliderRodape')) : 450;
var fonteLegendaRodapeNetflix = localStorage.getItem('fonteLegendaRodape') ? Number(localStorage.getItem('fonteLegendaRodape')) : 34;
var posicaoLegendaRodapeNetflix = localStorage.getItem('posicaoLegendaRodape') ? Number(localStorage.getItem('posicaoLegendaRodape')) : 500;
var backgroundColorRodapeNetflix = localStorage.getItem('backgroundColorRodape') ? localStorage.getItem('backgroundColorRodape') : '0.25';

function addStyleElementNetflix() {
    if (styleElementNetflix) {
        styleElementNetflix.parentElement.removeChild(styleElementNetflix);
    }

    styleElementNetflix = document.createElement('style');

    // talvez text-shadow: #000000 0px 0px 7px;
    styleElementNetflix.innerHTML += `.player-timedtext-text-container span {font-family: NovaFonte, sans-serif !important; font-size: ${fonteLegendaRodapeNetflix}px !important; text-shadow: none !important; } `;
    styleElementNetflix.innerHTML += `.player-timedtext-text-container span {background-color: rgba(0, 0, 0, ${backgroundColorRodapeNetflix}) !important; font-weight: normal !important;} `;

    //styleElementNetflix.innerHTML += `.player-timedtext-text-container {text-align: center !important; left: 0 !important; right: 0 !important; bottom: ${posicaoLegendaRodapeNetflix}% !important;} `;
    //styleElementNetflix.innerHTML += `.active .player-timedtext-text-container {bottom: ${posicaoLegendaSliderRodapeNetflix}% !important;} `;
    // styleElementNetflix.innerHTML += `.player-timedtext-text-container {text-align: center !important; left: 0 !important; right: 0 !important;} `;
    // styleElementNetflix.innerHTML += `.active .player-timedtext-text-container {bottom: ${posicaoLegendaSliderRodapeNetflix}% !important;} `;

    styleElementNetflix.innerHTML += `.player-timedtext {position: fixed !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: ${posicaoLegendaRodapeNetflix}%!important;} `;
    styleElementNetflix.innerHTML += `.active .player-timedtext { bottom: ${posicaoLegendaSliderRodapeNetflix}%!important;} `;
    styleElementNetflix.innerHTML += `.player-timedtext-text-container { position: static !important; text-align: center !important; } `;

    document.head.appendChild(styleElementNetflix);
}

function afterDOMNetflix() {
    console.log('Fone Helper Rodando! - Netflix');

    inject();

    let intervalCriarModal = setInterval(() => {
        if (document.querySelector('#posicaoSliderRodape')) {
            addStyleElementNetflix();

            let posicaoRodapeSliderInput = document.querySelector('#posicaoSliderRodape');
            posicaoRodapeSliderInput.addEventListener('input', function () {
                posicaoLegendaSliderRodapeNetflix = Number(this.value);
                addStyleElementNetflix();
            });

            let fonteLegendaRodapeInput = document.querySelector('#fonteRodape');
            fonteLegendaRodapeInput.addEventListener('input', function () {
                fonteLegendaRodapeNetflix = Number(this.value);
                addStyleElementNetflix();
            });

            let posicaoRodapeInput = document.querySelector('#posicaoRodape');
            posicaoRodapeInput.addEventListener('input', function () {
                posicaoLegendaRodapeNetflix = Number(this.value);
                addStyleElementNetflix();
            });

            let backgroundColorRodapeInput = document.querySelector('#backgroundColorRodape');
            backgroundColorRodapeInput.addEventListener('input', function () {
                backgroundColorRodapeNetflix = this.value;
                addStyleElementNetflix();
            });

            clearInterval(intervalCriarModal);
        }
    }, 500);

    setInterval(() => {
        var legenda = pegarLegendaNetflix();
        if (!legenda) {
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    setTimeout(() => {

        document.addEventListener('keydown', checkKey);

        async function checkKey(e) {
            e = e || window.event;

            // console.log(e.keyCode);

            if (e.keyCode == '78') { // N

                // console.log("Trocar audio e legenda");

                document.querySelector('button[aria-label="Idioma e legendas"]').click();

                var audioInglesSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês"]');
                var audioInglesOriginalSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original] (5.1)"]');
                var audioInglesOriginal5Selected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original]"]');

                if (audioInglesSelected || audioInglesOriginalSelected || audioInglesOriginal5Selected) {

                    let audioPortugues = document.querySelector('li[data-uia="audio-item-Português"]');
                    let audioPortugues5 = document.querySelector('li[data-uia="audio-item-Português (5.1)"]');

                    if (audioPortugues5) {
                        audioPortugues5.click();
                    }
                    else if (audioPortugues) {
                        audioPortugues.click();
                    }

                    // legenda
                    let legendaPortuguesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Português"]');
                    if (!legendaPortuguesSelected) {
                        let legendaPortugues = document.querySelector('li[data-uia="subtitle-item-Português"]');

                        if (legendaPortugues) {
                            legendaPortugues.click();
                        }

                    }

                } else {
                    let audioIngles = document.querySelector('li[data-uia="audio-item-Inglês"]');
                    let audioInglesOriginal = document.querySelector('li[data-uia="audio-item-Inglês [original]"]');
                    let audioInglesOriginal5 = document.querySelector('li[data-uia="audio-item-Inglês [original] (5.1)"]');

                    if (audioInglesOriginal5) {
                        audioInglesOriginal5.click();
                    }
                    else if (audioInglesOriginal) {
                        audioInglesOriginal.click();
                    }
                    else if (audioIngles) {
                        audioIngles.click();
                    }

                    // legenda
                    let legendaInglesCCSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês (CC)"]');
                    let legendaInglesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês"]');

                    if (!legendaInglesCCSelected && !legendaInglesSelected) {

                        let legendaInglesCC = document.querySelector('li[data-uia="subtitle-item-Inglês (CC)"]');
                        let legendaIngles = document.querySelector('li[data-uia="subtitle-item-Inglês"]');

                        if (legendaInglesCC) {
                            legendaInglesCC.click();
                        }
                        else if (legendaIngles) {
                            legendaIngles.click();
                        }
                    }
                }

                document.querySelector('.ltr-4dcwks')?.classList.remove('show');
            }

            if (e.keyCode == '86') { // V

                document.querySelector('button[aria-label="Idioma e legendas"]').click();

                let legendaInglesCCSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês (CC)"]');
                let legendaInglesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês"]');

                if (legendaInglesCCSelected || legendaInglesSelected) {

                    let legendaDesligada = document.querySelector('li[data-uia="subtitle-item-desligadas"]');

                    if (legendaDesligada) {
                        legendaDesligada.click();
                    }

                } else {

                    let legendaInglesCC = document.querySelector('li[data-uia="subtitle-item-Inglês (CC)"]');
                    let legendaIngles = document.querySelector('li[data-uia="subtitle-item-Inglês"]');

                    if (legendaInglesCC) {
                        legendaInglesCC.click();
                    }
                    else if (legendaIngles) {
                        legendaIngles.click();
                    }
                }

                document.querySelector('.ltr-4dcwks')?.classList.remove('show');
            }

            if (e.keyCode == '80') { // P
                document.querySelector('button[aria-label="Idioma e legendas"]').click();

                let legendaPortuguesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Português"]');
                if (legendaPortuguesSelected) {
                    let legendaDesligada = document.querySelector('li[data-uia="subtitle-item-desligadas"]');

                    if (legendaDesligada) {
                        legendaDesligada.click();
                    }

                } else {
                    let legendaPortugues = document.querySelector('li[data-uia="subtitle-item-Português"]');

                    if (legendaPortugues) {
                        legendaPortugues.click();
                    }
                }

                document.querySelector('.ltr-4dcwks')?.classList.remove('show');
            }

            if (e.keyCode == '66') { // B

                document.querySelector('button[aria-label="Idioma e legendas"]').click();

                var audioInglesSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês"]');
                var audioInglesOriginalSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original] (5.1)"]');
                var audioInglesOriginal5Selected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original]"]');

                if (audioInglesSelected || audioInglesOriginalSelected || audioInglesOriginal5Selected) {

                    let audioPortugues = document.querySelector('li[data-uia="audio-item-Português"]');
                    let audioPortugues5 = document.querySelector('li[data-uia="audio-item-Português (5.1)"]');

                    if (audioPortugues5) {
                        audioPortugues5.click();
                    }
                    else if (audioPortugues) {
                        audioPortugues.click();
                    }

                } else {
                    let audioIngles = document.querySelector('li[data-uia="audio-item-Inglês"]');
                    let audioInglesOriginal = document.querySelector('li[data-uia="audio-item-Inglês [original]"]');
                    let audioInglesOriginal5 = document.querySelector('li[data-uia="audio-item-Inglês [original] (5.1)"]');

                    if (audioInglesOriginal5) {
                        audioInglesOriginal5.click();
                    }
                    else if (audioInglesOriginal) {
                        audioInglesOriginal.click();
                    }
                    else if (audioIngles) {
                        audioIngles.click();
                    }
                }

                document.querySelector('.ltr-4dcwks')?.classList.remove('show');
            }

            if (e.keyCode == '192') { // . /
                var legenda = pegarLegendaNetflix();
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

                // console.log(legenda);

                copyToClipboard(legenda)

                function copyToClipboard(text) {
                    const elem = document.createElement('textarea');
                    elem.value = text;
                    document.body.appendChild(elem);
                    elem.select();
                    document.execCommand('copy');
                    document.body.removeChild(elem);
                }
            }
        }
    }, 5000);
}

function pegarLegendaNetflix() {
    var legenda = document.querySelector('.player-timedtext')?.innerText;
    if (!legenda) {
        //alterar para 'legendaTopoHtml' se o ingles estiver em cima
        legenda = document.getElementById('legendaRodapeHtml')?.innerText;
        if (!legenda) {
            return '';
        }
    }

    if (!legenda) {
        return '';
    }

    legenda = legenda.replaceAll('\n', ' ');
    legenda = legenda.replaceAll('>> ', '');
    legenda = legenda.replaceAll('[', '(');
    legenda = legenda.replaceAll(']', ')');
    legenda = legenda.trim();

    // legenda = legenda.charAt(0) + legenda.substring(1).toLowerCase();

    return legenda
}