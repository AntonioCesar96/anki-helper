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
var styleElementStar;
var posicaoLegendaSliderRodapeStar = localStorage.getItem('posicaoLegendaSliderRodape') ? Number(localStorage.getItem('posicaoLegendaSliderRodape')) : 450;
var fonteLegendaRodapeStar = localStorage.getItem('fonteLegendaRodape') ? Number(localStorage.getItem('fonteLegendaRodape')) : 34;
var posicaoLegendaRodapeStar = localStorage.getItem('posicaoLegendaRodape') ? Number(localStorage.getItem('posicaoLegendaRodape')) : 500;
var backgroundColorRodapeStar = localStorage.getItem('backgroundColorRodape') ? localStorage.getItem('backgroundColorRodape') : '0.25';
var esconderBarra = false;

function addStyleElementStar() {
    if (styleElementStar) {
        styleElementStar.parentElement.removeChild(styleElementStar);
    }

    styleElementStar = document.createElement('style');

    styleElementStar.innerHTML = `.dss-subtitle-renderer-cue {font-family: NovaFonte, sans-serif !important; font-size: ${fonteLegendaRodapeStar}px !important;} `;

    styleElementStar.innerHTML += `.btm-media-player:not(.btm-media-player-idle) .dss-subtitle-renderer-cue-positioning-box {position: fixed !important; bottom: ${posicaoLegendaSliderRodapeStar}% !important; top: auto !important; left: 0 !important; right: 0 !important;} `;
    styleElementStar.innerHTML += `.btm-media-player.btm-media-player-idle .dss-subtitle-renderer-cue-positioning-box { position: fixed !important; bottom: ${posicaoLegendaRodapeStar}% !important; top: auto !important; left: 0 !important; right: 0 !important;} `;

    styleElementStar.innerHTML += `.dss-subtitle-renderer-line {background-color: rgba(0, 0, 0, ${backgroundColorRodapeStar}) !important;} `;
    styleElementStar.innerHTML += `.controls__footer { padding-bottom: 5px !important;} `;
    styleElementStar.innerHTML += `.controls__header:before { display: none !important;} `;
    styleElementStar.innerHTML += `.controls__footer:before { height: 11% !important;} `;

    if (esconderBarra) {
        styleElementStar.innerHTML += `.controls.controls__content  { display: none !important; }`;
        styleElementStar.innerHTML += `.btm-media-player:not(.btm-media-player-idle) .dss-subtitle-renderer-cue-positioning-box {position: fixed !important; bottom: ${posicaoLegendaRodapeStar}% !important; top: auto !important; left: 0 !important; right: 0 !important;} `;
    }

    document.head.appendChild(styleElementStar);
}

function afterDOMDisney() {
    console.log('Fone Helper Rodando! - Star ou Disney');

    setTimeout(() => {
        console.log('Fone Helper Rodando! - Star ou Disney');

        foneStar();

    }, 15000);

    let intervalCriarModal = setInterval(() => {
        if (document.querySelector('#posicaoSliderRodape')) {
            addStyleElementStar();

            let posicaoRodapeSliderInput = document.querySelector('#posicaoSliderRodape');
            posicaoRodapeSliderInput.addEventListener('input', function () {
                posicaoLegendaSliderRodapeStar = Number(this.value);
                addStyleElementStar();
            });

            let fonteLegendaRodapeInput = document.querySelector('#fonteRodape');
            fonteLegendaRodapeInput.addEventListener('input', function () {
                fonteLegendaRodapeStar = Number(this.value);
                addStyleElementStar();
            });

            let posicaoRodapeInput = document.querySelector('#posicaoRodape');
            posicaoRodapeInput.addEventListener('input', function () {
                posicaoLegendaRodapeStar = Number(this.value);
                addStyleElementStar();
            });

            let backgroundColorRodapeInput = document.querySelector('#backgroundColorRodape');
            backgroundColorRodapeInput.addEventListener('input', function () {
                backgroundColorRodapeStar = this.value;
                addStyleElementStar();
            });

            clearInterval(intervalCriarModal);
        }
    }, 500);

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

            if (e.key === '.') {
                esconderBarra = !esconderBarra;
                addStyleElementStar();
            }

            // TODO
            // quando aparecer document.querySelector('.overlay__loading')
            // apertar voltar 10s e ir pra frente 10s
            if (e.key.toUpperCase() === localStorage.getItem('teclaTempo1').toUpperCase()) { 
                video.currentTime = video.currentTime - Number(localStorage.getItem('valorTempo1'));
            }

            if (e.key.toUpperCase() === localStorage.getItem('teclaTempo2').toUpperCase()) { 
                video.currentTime = video.currentTime - Number(localStorage.getItem('valorTempo2'));
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
                if (!subOff) {
                    subOff = getBotao('Não', 'sub');
                }
                var subIngles = getBotao('English', 'sub');

                if (subIngles.parentElement.querySelector('input').checked) {
                    subOff.click();
                } else {
                    subIngles.click();
                }
            }

            if (e.keyCode == '80') { // P
                var subOff = getBotao('Off', 'sub');
                if (!subOff) {
                    subOff = getBotao('Não', 'sub');
                }
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
                    var video = document.querySelector('video');
                    const elem = document.createElement('textarea');
                    elem.value = text;
                    video.parentElement.appendChild(elem);
                    elem.select();
                    document.execCommand('copy');
                    video.parentElement.removeChild(elem);
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
    var legenda = document.querySelector('.dss-subtitle-renderer-cue-window')?.innerText;
    if (!legenda) {
        let qualLegendaCopiar = localStorage.getItem('qualLegendaCopiar');
        legenda = document.getElementById(`${qualLegendaCopiar}`)?.innerText;
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