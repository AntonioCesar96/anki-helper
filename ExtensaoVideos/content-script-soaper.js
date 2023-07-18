if (location.host.includes('soaper')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMSoaper);
    } else {
        afterDOMSoaper();
    }
}

var legendas = [];
var styleElementSoaper;
var posicaoLegendaSliderRodapeSoaper = localStorage.getItem('posicaoLegendaSliderRodape') ? Number(localStorage.getItem('posicaoLegendaSliderRodape')) : 450;
var fonteLegendaRodapeSoaper = localStorage.getItem('fonteLegendaRodape') ? Number(localStorage.getItem('fonteLegendaRodape')) : 34;
var posicaoLegendaRodapeSoaper = localStorage.getItem('posicaoLegendaRodape') ? Number(localStorage.getItem('posicaoLegendaRodape')) : 500;
var backgroundColorRodapeSoaper = localStorage.getItem('backgroundColorRodape') ? localStorage.getItem('backgroundColorRodape') : '0.25';

function addStyleElementSoaper() {
    if (styleElementSoaper) {
        styleElementSoaper.parentElement.removeChild(styleElementSoaper);
    }

    styleElementSoaper = document.createElement('style');

    styleElementSoaper.innerHTML = `.legenda {position: absolute !important;} `;
    styleElementSoaper.innerHTML += `.jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: ${posicaoLegendaSliderRodapeSoaper}% !important; line-height: 1.27 !important;}  `;
    styleElementSoaper.innerHTML += `.jw-flag-user-inactive .jw-text-track-display { bottom: ${posicaoLegendaRodapeSoaper}% !important;} `;
    
    styleElementSoaper.innerHTML += `.jw-text-track-display .jw-text-track-cue {font-family: NovaFonte, sans-serif !important; font-size: ${fonteLegendaRodapeSoaper}px !important; padding: 0px 5px !important;} `;
    styleElementSoaper.innerHTML += `.jw-text-track-display .jw-text-track-cue {background-color: rgba(0, 0, 0, ${backgroundColorRodapeSoaper}) !important; line-height: inherit !important;} `;
    styleElementSoaper.innerHTML += `.jw-captions {overflow: auto !important;} `;

    styleElementSoaper.innerHTML += `.full-video #player {height: 100% !important; position: fixed !important; z-index: 99999 !important; top: 0 !important; left: 0 !important; right: 0 !important;} `;
    styleElementSoaper.innerHTML += `.full-video {overflow: hidden !important;} `;

    document.head.appendChild(styleElementSoaper);
}

function afterDOMSoaper() {
    console.log('Fone Helper Rodando! - Soaper ou Soaper');


    let intervalCriarModal = setInterval(() => {
        if (document.querySelector('#posicaoSliderRodape')) {
            addStyleElementSoaper();

            let posicaoRodapeSliderInput = document.querySelector('#posicaoSliderRodape');
            posicaoRodapeSliderInput.addEventListener('input', function () {
                posicaoLegendaSliderRodapeSoaper = Number(this.value);
                addStyleElementSoaper();
            });

            let fonteLegendaRodapeInput = document.querySelector('#fonteRodape');
            fonteLegendaRodapeInput.addEventListener('input', function () {
                fonteLegendaRodapeSoaper = Number(this.value);
                addStyleElementSoaper();
            });

            let posicaoRodapeInput = document.querySelector('#posicaoRodape');
            posicaoRodapeInput.addEventListener('input', function () {
                posicaoLegendaRodapeSoaper = Number(this.value);
                addStyleElementSoaper();
            });

            let backgroundColorRodapeInput = document.querySelector('#backgroundColorRodape');
            backgroundColorRodapeInput.addEventListener('input', function () {
                backgroundColorRodapeSoaper = this.value;
                addStyleElementSoaper();
            });

            clearInterval(intervalCriarModal);
        }
    }, 500);



    setInterval(() => {
        var legenda = pegarLegendaSoaper();
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
            var video = document.querySelector('video');

            console.log(e.keyCode);

            
            if (e.code == 'KeyR') { 
                addStyleElementSoaper();

                if(!document.body.classList.contains('full-video')) {
                    document.body.classList.add('full-video');
                } else {
                    document.body.classList.remove('full-video');
                }
            }

            if (e.keyCode == '96' || e.code == 'KeyZ') { // 0
                video.currentTime = video.currentTime - 4;
            }

            if (e.keyCode == '110' || e.code == 'KeyX') { // ,
                video.currentTime = video.currentTime - 6;
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
                var legenda = pegarLegendaSoaper();
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
        if (labels[i].textContent.SoapertsWith(texto) && labels[i].getAttribute('for').SoapertsWith(sessao)) {
            return labels[i];
        }
    }
}

function pegarLegendaSoaper() {
    var legenda = document.querySelector('.dss-subtitle-renderer-cue-window')?.innerText;
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