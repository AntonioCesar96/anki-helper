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

function afterDOMNetflix() {
    console.log('Fone Helper Rodando! - Netflix');

    inject();

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

            console.log(e.keyCode);

            if (e.keyCode == '78') { // N

                console.log("Trocar audio e legenda");

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

                console.log(legenda);

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
    var elemento = document.querySelector('.player-timedtext');
    if (!elemento) {
        return '';
    }

    var legenda = elemento.innerText;
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