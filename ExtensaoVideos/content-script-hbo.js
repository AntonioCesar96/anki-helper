if (location.host === "play.hbomax.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedHbo);
    } else {
        afterDOMLoadedHbo();
    }
}

var legendas = [];
var skipTime = 4;
var mediaSession;

function getVideo() {
    var videos = document.querySelectorAll('video');
    var video;
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].className != 'tst-video-overlay-player-html5') {
            return videos[i];
        }
    }

    return null;
}

function foneHbo() {

    function pularIntro() {

        var skipButton = document.querySelector('div[aria-label="Pular abertura"]');
        if (skipButton) {
            skipButton.click()
            return true;
        }

        return false;
    }

    if (!mediaSession) {
        return;
    }

    // navigator.mediaSession
    mediaSession.setActionHandler('previoustrack', function () {
        if (pularIntro()) {
            return;
        }

        var video = getVideo();
        video.currentTime = video.currentTime - 7;
        // voltarNoTempo(7);
    });

    // navigator.mediaSession
    mediaSession.setActionHandler('nexttrack', function () {
        if (pularIntro()) {
            return;
        }

        setTimeout(() => {
            document.querySelector('div[aria-label="Exibir áudio e legendas CC"]').click();

            var portugues = document.querySelector('div[aria-label="Áudio"] div[aria-label="Português (Brasil)"]');

            var ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Original"]');
            if (!ingles) {
                ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Descrição áudio"]');
            }

            if (ingles) {

                if (ingles.querySelector('img')) {
                    portugues.click()
                } else {
                    ingles.click()
                }

                document.querySelector('div[aria-label="Fechar diálogo Áudio e legendas CC"]').click();

                // video.currentTime = video.currentTime - 1;
            }
        }, 150);
    });
}

var tempoInicial = 0;
var tempoFinal = 0;
var tempo = 0;
var timer = 0;
var tituloPagina = "";

function acelerarVideoHbo() {
    if (!localStorage.getItem("playbackRate")) {
        localStorage.setItem("playbackRate", 1.3);
    }

    var playbackRate = 1;
    var acelerar = localStorage.getItem("acelerar") === "false" ? false : true;
    if (acelerar) {
        playbackRate = Number(localStorage.getItem("playbackRate"))

    }

    var video = getVideo();
    if (video && playbackRate) {
        video.playbackRate = playbackRate;
        document.title = video.playbackRate + ' - ' + tituloPagina;
    }

}

function pularIntro2(tentativas) {
    var pular = document.querySelector('div[aria-label="Pular abertura"]');
    if (!pular) {
        setTimeout(() => {
            //console.log(new Date() + "Tentando pular intro... Tentativa: " + tentativas);
            pularIntro2(++tentativas)
        }, 3000);

        return;
    }

    pular.click();

    // console.log("Abertura pulada, próxima tentativa será: " + new Date((Date.now() + (1000 * 60 * 10))));
    setTimeout(() => {
        //console.log(new Date() + "Iniciando processo de tentativas");
        pularIntro2(1);
    }, (1000 * 60 * 1));
}


var styleElementHboMax;
var posicaoLegendaSliderRodapeHboMax = localStorage.getItem('posicaoLegendaSliderRodape') ? Number(localStorage.getItem('posicaoLegendaSliderRodape')) : 450;
var fonteLegendaRodapeHboMax = localStorage.getItem('fonteLegendaRodape') ? Number(localStorage.getItem('fonteLegendaRodape')) : 34;
var posicaoLegendaRodapeHboMax = localStorage.getItem('posicaoLegendaRodape') ? Number(localStorage.getItem('posicaoLegendaRodape')) : 500;
var backgroundColorRodapeHboMax = localStorage.getItem('backgroundColorRodape') ? localStorage.getItem('backgroundColorRodape') : '0.25';

function addStyleElementHboMax() {
    if (styleElementHboMax) {
        styleElementHboMax.parentElement.removeChild(styleElementHboMax);
    }

    styleElementHboMax = document.createElement('style');

    // talvez text-shadow: #000000 0px 0px 7px;
    styleElementHboMax.innerHTML += `div[data-testid="CueBoxContainer"] .css-1rynq56 {font-family: NovaFonte, sans-serif !important; font-size: ${fonteLegendaRodapeHboMax}px !important; text-shadow: none !important; } `;
    styleElementHboMax.innerHTML += `div[data-testid="CueBoxContainer"] .css-1rynq56 {background-color: rgba(0, 0, 0, ${backgroundColorRodapeHboMax}) !important; font-weight: normal !important;} `;
    
    // Comentar se começar a ficar zuado
    styleElementHboMax.innerHTML += `div[data-testid="CueBoxContainer"] > .css-175oi2r { top: ${posicaoLegendaRodapeHboMax}% !important; } `;
    styleElementHboMax.innerHTML += `div[data-slider="true"] div[data-testid="CueBoxContainer"] > .css-175oi2r { top: ${posicaoLegendaSliderRodapeHboMax}% !important; } `;

    styleElementHboMax.innerHTML += `div[data-testid="CueBoxContainer"] .css-175oi2r .css-175oi2r {position: fixed !important; left: 0 !important; right: 0 !important; } `;
    styleElementHboMax.innerHTML += `div[data-testid="CueBoxContainer"] .css-175oi2r .css-1rynq56 {align-self: center !important;} `;
    styleElementHboMax.innerHTML += `.css-175oi2r.r-1d09ksm.r-1niwhzg.r-1h0z5md.r-rabhyy.r-12vffkv { position: fixed !important; right: 5px !important; bottom: -20px; opacity: 0.2; }`;
    styleElementHboMax.innerHTML += `.css-175oi2r.r-1d09ksm.r-1niwhzg.r-1h0z5md.r-rabhyy.r-12vffkv .css-1rynq56 { font-size: 14px !important; }`;

    document.head.appendChild(styleElementHboMax);
}

var rnVideo;
function afterDOMLoadedHbo() {

    setInterval(() => {
        if(!rnVideo) {
            rnVideo = document.querySelector('#rn-video');
        }

        let timelineSlider = document.querySelector('div[data-testid="TimelineSlider"]');
        if(rnVideo) {
            rnVideo.parentElement.setAttribute('data-slider', !!timelineSlider);
        }
    }, 100);

    setTimeout(() => {
        addStyleElementHboMax();

        let posicaoRodapeSliderInput = document.querySelector('#posicaoSliderRodape');
        posicaoRodapeSliderInput.addEventListener('input', function () {
            posicaoLegendaSliderRodapeHboMax = Number(this.value);
            addStyleElementHboMax();
        });

        let fonteLegendaRodapeInput = document.querySelector('#fonteRodape');
        fonteLegendaRodapeInput.addEventListener('input', function () {
            fonteLegendaRodapeHboMax = Number(this.value);
            addStyleElementHboMax();
        });

        let posicaoRodapeInput = document.querySelector('#posicaoRodape');
        posicaoRodapeInput.addEventListener('input', function () {
            posicaoLegendaRodapeHboMax = Number(this.value);
            addStyleElementHboMax();
        });

        let backgroundColorRodapeInput = document.querySelector('#backgroundColorRodape');
        backgroundColorRodapeInput.addEventListener('input', function () {
            backgroundColorRodapeHboMax = this.value;
            addStyleElementHboMax();
        });
    }, 5000);

    setInterval(() => {
        let fundo = document.querySelector('div[aria-label="Ignorar Controles"]');
        if (fundo) {
            fundo.previousSibling.style.height = '0px'
            fundo.previousSibling.previousSibling.style.height = '0px'
        }
    }, (100));



    setInterval(() => {
        var legenda = pegarLegendaHbo();
        if (!legenda) {
            //console.log('Nada!');
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    pularIntro2(1);

    setTimeout(() => {
        tituloPagina = document.title;
    }, 4000);

    setTimeout(() => {
        acelerarVideoHbo();
    }, 9000);

    setInterval(() => {
        acelerarVideoHbo();
    }, (1000 * 60 * 1));


    setInterval(() => {
        mediaSession = navigator.mediaSession;
    }, 9000);

    setTimeout(() => {
        console.log('Fone Helper Rodando! - play.hbomax.com');

        foneHbo();

    }, 15000);

    setTimeout(() => {
        console.log('Video Helper Rodando! - play.hbomax.com');
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        foneHbo();

        document.onkeydown = checkKey;

        async function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.keyCode == '78') { // N

                proxy(() => {
                    // console.log("Trocar audio e legenda");

                    document.querySelector('div[aria-label="Exibir áudio e legendas CC"]').click();

                    // audio
                    var portugues = document.querySelector('div[aria-label="Áudio"] div[aria-label="Português (Brasil)"]');

                    var ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Descrição áudio"]');
                    if (!ingles) {
                        ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Original"]');
                    }

                    if (ingles) {

                        if (ingles.querySelector('img')) {
                            portugues.click()
                        } else {
                            ingles.click()
                        }
                    }

                    // legenda
                    var ingles = document.querySelector('div[aria-label="Legendas"] div[aria-label="Inglês CC"]');
                    if (!ingles) {
                        ingles = document.querySelector('div[aria-label="Legendas"] div[aria-label="Inglês"]');
                    }

                    var portugues = document.querySelector('div[aria-label="Legendas"] div[aria-label="Português (Brasil)"]');
                    if (!portugues) {
                        portugues = document.querySelector('div[aria-label="Legendas"] div[aria-label="Português"]');
                        if (!portugues) {
                            portugues = document.querySelector('div[aria-label="Legendas"] div[aria-label="Português (Brasil) CC"]');
                        }
                    }

                    if (ingles) {

                        if (ingles.querySelector('img')) {
                            portugues.click()
                        } else {
                            ingles.click()
                        }
                    }

                    document.querySelector('div[aria-label="Fechar diálogo Áudio e legendas CC"]')?.click();
                });

            }


            if (e.keyCode == '86') { // V     
                proxy(() => {
                    // console.log("Trocar legenda ingles");

                    document.querySelector('div[aria-label="Exibir áudio e legendas CC"]').click();

                    var ingles = document.querySelector('div[aria-label="Legendas"] div[aria-label="Inglês CC"]');
                    if (!ingles) {
                        ingles = document.querySelector('div[aria-label="Legendas"] div[aria-label="Inglês"]');
                    }

                    if (ingles) {

                        if (ingles.querySelector('img')) {
                            document.querySelector('div[aria-label="Legendas"] div[aria-label="Desativar"]').click();
                        } else {
                            ingles.click()
                        }

                        document.querySelector('div[aria-label="Fechar diálogo Áudio e legendas CC"]').click();

                        // video.currentTime = video.currentTime - 1;
                    }
                });
            }



            if (e.keyCode == '80') { // P      
                proxy(() => {
                    // console.log("Trocar legenda português");

                    document.querySelector('div[aria-label="Exibir áudio e legendas CC"]').click();

                    var portugues = document.querySelector('div[aria-label="Legendas"] div[aria-label="Português (Brasil)"]');
                    if (!portugues) {
                        portugues = document.querySelector('div[aria-label="Legendas"] div[aria-label="Português"]');
                    }

                    if (portugues) {

                        if (portugues.querySelector('img')) {
                            document.querySelector('div[aria-label="Legendas"] div[aria-label="Desativar"]').click();
                        } else {
                            portugues.click()
                        }

                        document.querySelector('div[aria-label="Fechar diálogo Áudio e legendas CC"]').click();

                        // video.currentTime = video.currentTime - 1;
                    }
                });
            }



            if (e.keyCode == '66') { // B    
                proxy(() => {
                    // console.log("Trocar audio");

                    document.querySelector('div[aria-label="Exibir áudio e legendas CC"]').click();

                    var portugues = document.querySelector('div[aria-label="Áudio"] div[aria-label="Português (Brasil)"]');

                    var ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Descrição áudio"]');
                    if (!ingles) {
                        ingles = document.querySelector('div[aria-label="Áudio"] div[aria-label="Inglês - Original"]');
                    }

                    if (ingles) {

                        if (ingles.querySelector('img')) {
                            portugues.click()
                        } else {
                            ingles.click()
                        }

                        document.querySelector('div[aria-label="Fechar diálogo Áudio e legendas CC"]').click();

                        // video.currentTime = video.currentTime - 1;
                    }
                });
            }



            if (e.keyCode == '96') { // 0
                // voltarNoTempo(skipTime)
                video.currentTime = video.currentTime - skipTime;
            }

            if (e.keyCode == '110') { // ` '
                // voltarNoTempo(7)
                video.currentTime = video.currentTime - 7;
            }

            if (e.keyCode == '107' || e.keyCode == '187') { // -
                video.playbackRate = Number((video.playbackRate + playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;

                localStorage.setItem("playbackRate", video.playbackRate);
            }

            if (e.keyCode == '109' || e.keyCode == '189') { // +
                video.playbackRate = Number((video.playbackRate - playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;

                localStorage.setItem("playbackRate", video.playbackRate);
            }

            // Repete Pedaço do video
            if (e.keyCode == '81') { // Q
                tempoInicial = video.currentTime;
                console.log("Tempo Inicial: " + tempoInicial + " - Tempo Final: " + tempoFinal);
            }

            if (e.keyCode == '87') { // W
                tempoFinal = video.currentTime;
                console.log("Tempo Inicial: " + tempoInicial + " - Tempo Final: " + tempoFinal);
            }

            function Rodar() {
                tempo = tempoFinal - tempoInicial;

                console.log("Tempo Inicial: " + tempoInicial + " - Tempo Final: " + tempoFinal + " - Tempo: " + tempo);

                var video = getVideo();
                video.currentTime = tempoFinal - tempo;

                timer = setInterval(() => {
                    var video = getVideo();
                    video.currentTime = tempoFinal - tempo;
                }, (tempo * 1000));
            }

            if (e.keyCode == '69' && tempoInicial != 0 && tempoFinal != 0) { // E
                clearInterval(timer);
                Rodar();
            }

            if (e.keyCode == '82') { // R
                clearInterval(timer);
                // console.log("Interval cancelado!")
            }

            if (e.keyCode == '106') { // *
                var acelerar = localStorage.getItem("acelerar") === "false" ? true : false;
                localStorage.setItem("acelerar", acelerar);
                acelerarVideoHbo();
            }

            if (e.keyCode == '192') { // . /
                var legenda = pegarLegendaHbo();
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

function proxy(funcao) {

    let contadorTempo = 0;
    let idInterval = setInterval(() => {
        let botaoVoltar = document.querySelector('div[aria-label="Retroceder 15 segundos"]');
        if (!botaoVoltar) {
            contadorTempo += 5;
            // console.log("botão nulo: " + contadorTempo);
            return;
        }
        clearInterval(idInterval);

        funcao();
    }, 5);
}

function voltarNoTempo(tempo) {
    proxy(() => {
        let botaoVoltar = document.querySelector('div[aria-label="Retroceder 15 segundos"]');
        botaoVoltar.click();

        setTimeout(() => {
            var video = getVideo();
            video.currentTime = video.currentTime + (15 - tempo);
        }, 100);
    });
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}


function pegarLegendaHbo() {
    var elemento = document.querySelector('div[data-testid="CueBoxContainer"]');
    if (!elemento) {
        elemento = document.getElementById('legendaRodapeHtml');
        if (!elemento) {
            return '';
        }
    }

    // if (!elemento) {
    //     elemento = document.querySelector('.css-175oi2r .css-175oi2r');
    //     if (!elemento) {
    //         elemento = document.querySelector('.css-1rynq56').parentElement;;
    //         if (!elemento) {
    //             return '';
    //         }
    //     }
    // }

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