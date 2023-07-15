if (location.host === "www.disneyplus.com" || location.host === "www.starplus.com" 
    || location.host === "www.southparkstudios.com.br") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMDisney);
    } else {
        afterDOMDisney();
    }
}

function foneStar() {

    function pularIntro() {

        var skipButton = document.querySelector('div[aria-label="Pular abertura"]');
        if (skipButton) {
            skipButton.click()
            return true;
        }

        return false;
    }

    if (!navigator.mediaSession) {
        return;
    }

    navigator.mediaSession.setActionHandler('previoustrack', function () {
        if (pularIntro()) {
            return;
        }

        document.querySelector('[aria-label="Skip back 10 seconds"]').click();
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        if (pularIntro()) {
            return;
        }

        let audioPortugues = getBotao('Português (Brasil)', 'audio');
        let audioIngles = getBotao('English', 'audio');
        let subPortugues = getBotao('Português (Brasil)', 'sub');
        let subIngles = getBotao('English', 'sub');

        if (audioIngles) {
            if (audioIngles.parentElement.querySelector('input').checked) {
                audioPortugues.click();
                subPortugues.click();
            } else {
                audioIngles.click();
                subIngles.click();
            }
        }

    });
}

var legendas = [];

function afterDOMDisney() {
    console.log('Fone Helper Rodando! - Star ou Disney');

    setTimeout(() => {
        console.log('Fone Helper Rodando! - Star ou Disney');

        foneStar();

    }, 15000);

    setInterval(() => {
        var legenda = pegarLegendaStar();
        if (!legenda) {
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    setTimeout(() => {

        document.onkeydown = checkKey;

        async function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            // console.log(e.keyCode);

            if (e.keyCode == '96') { // 0
                // voltarNoTempo(skipTime)
                video.currentTime = video.currentTime - 4;
            }

            if (e.keyCode == '110') { // ` '
                // voltarNoTempo(7)
                video.currentTime = video.currentTime - 7;
            }


            if (e.keyCode == '78') { // N

                // console.log("Trocar audio e legenda");

                var audioPortugues = getBotao('Português (Brasil)', 'audio');
                var audioIngles = getBotao('English', 'audio');
                var subPortugues = getBotao('Português (Brasil)', 'sub');
                var subIngles = getBotao('English', 'sub');

                if (audioIngles) {
                    if (audioIngles.parentElement.querySelector('input').checked) {
                        audioPortugues.click();
                        subPortugues.click();
                    } else {
                        audioIngles.click();
                        subIngles.click();
                    }
                }
            }

            if (e.keyCode == '86') { // V
                var subOff = getBotao('Off', 'sub');
                var subIngles = getBotao('English', 'sub');

                if (subIngles.parentElement.querySelector('input').checked) {
                    subOff.click();
                } else {
                    subIngles.click();
                }
            }

            if (e.keyCode == '80') { // P
                var subOff = getBotao('Off', 'sub');
                var subPortugues = getBotao('Português (Brasil)', 'sub');

                if (subPortugues.parentElement.querySelector('input').checked) {
                    subOff.click();
                } else {
                    subPortugues.click();
                }
            }

            if (e.keyCode == '66') { // B
                var audioPortugues = getBotao('Português (Brasil)', 'audio');
                var audioIngles = getBotao('English', 'audio');

                if (audioIngles.parentElement.querySelector('input').checked) {
                    audioPortugues.click();
                } else {
                    audioIngles.click();
                }
            }

            if (e.keyCode == '192') { // . /
                var legenda = pegarLegendaStar();
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


function getBotao(texto, sessao) {
    var labels = document.querySelectorAll('label');

    for (let i = 0; i < labels.length; i++) {
        if (labels[i].textContent.startsWith(texto) && labels[i].getAttribute('for').startsWith(sessao)) {
            return labels[i];
        }
    }
}

function pegarLegendaStar() {
    var elemento = document.querySelector('.dss-subtitle-renderer-cue-window');
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