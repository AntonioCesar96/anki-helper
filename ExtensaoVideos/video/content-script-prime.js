/*
    . = esconder tudo
    4 = colocar em letra minuscula
    Q = abrir menu
    W = desligar legenda superior
    E = desligar legenda inferior
    + = acelerar
    - = desacelerar
    N = trocar idioma e legenda pra portugues ou ingles
    B = trocar idioma
    V = ligar ou desligar legenda ingles
    P = ligar ou desligar legenda portugues
*/

site = {
    host: "www.primevideo.com",
    seletorAudioIngles: '.atvwebplayersdk-audiomenu-container [aria-label="English"]',
    seletorAudioIngles2: '.atvwebplayersdk-audiomenu-container [aria-label="English [Audio Description]"]',
    seletorAudioPortugues: '.atvwebplayersdk-audiomenu-container [aria-label="Português"]',
    seletorAudioPortugues2: '.atvwebplayersdk-audiomenu-container [aria-label="Português (Brasil)"]',
    seletorLegendaIngles: '.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="English [CC]"]',
    seletorLegendaOff: '.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Off"]',
    seletorLegendaPortugues: '.atvwebplayersdk-subtitleoption-container [aria-label="Português"]',
    seletorLegendaPortuguesBr: '.atvwebplayersdk-subtitleoption-container [aria-label="Português (Brasil)"]',
};

var legendas = [];
var usarLowercase = false;
var nomeSerie = '';

if (location.host === "www.primevideo.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedPrime);
    } else {
        afterDOMLoadedPrime();
    }
}

var skipTime = 4;

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

function fonePrime() {
    function pularIntro() {
        var skipButton = document.querySelector('.atvwebplayersdk-skipelement-button');
        if (skipButton) {
            skipButton.click()
            return true;
        }

        skipButton = document.querySelector('.fu4rd6c.f1cw2swo');
        if (skipButton) {
            skipButton.click()
            return true;
        }


        skipButton = document.querySelector('.fmy9x71.f1pl57tw.fr7nx1g');
        if (skipButton) {
            skipButton.click()
            return true;
        }

        return false;
    }

    // navigator.mediaSession.setActionHandler("play", function () {
    //     var video = getVideo();
    //     video.play();
    // });

    navigator.mediaSession.setActionHandler("pause", function () {
        var video = getVideo();
        video.pause();

        var tempoElemento = document.querySelector('.atvwebplayersdk-timeindicator-text');
        if (!tempoElemento) {
            return;
        }

        // console.log(`Possível legenda: ${tempoElemento.textContent} - `);

        var legenda = pegarLegendaPrime2222();
        if (!legenda) {
            return;
        }

        // console.log(`${tempoElemento.textContent} - ` + legenda);
    });

    navigator.mediaSession.setActionHandler('previoustrack', function () {
        if (pularIntro()) {
            return;
        }

        var video = getVideo();
        video.currentTime = video.currentTime - 6;
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        if (pularIntro()) {
            return;
        }

        var audioIngles = document.querySelector(site.seletorAudioIngles2);
        if (!audioIngles) {
            audioIngles = document.querySelector(site.seletorAudioIngles);
        }
        if (audioIngles) {
            if (audioIngles.checked) {

                var audioPtBr = document.querySelector(site.seletorAudioPortugues);
                if (!audioPtBr) {
                    audioPtBr = document.querySelector(site.seletorAudioPortugues2);
                }

                audioPtBr.parentElement.querySelector('label').click();
            } else {
                audioIngles.parentElement.querySelector('label').click();
            }

            var video = getVideo();
            video.currentTime = video.currentTime - 7;
        }
    });
}

var tempoInicial = 0;
var tempoFinal = 0;
var tempo = 0;
var timer = 0;

function acelerarVideoPrime() {
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

function pularIntroducao(tentativas) {
    var pular = document.querySelector('.atvwebplayersdk-skipelement-button');

    if (!pular) {
        setTimeout(() => {
            //console.log(new Date() + "Tentando pular INTRODUÇÃO... Tentativa: " + tentativas);
            pularIntroducao(++tentativas)
        }, 3000);

        return;
    }

    pular.click();
    reativarLegenda();

    //console.log("INTRODUÇÃO pulada, próxima tentativa será: " + new Date((Date.now() + (1000 * 60 * 5))));
    setTimeout(() => {
        //console.log(new Date() + "Iniciando processo de tentativas - INTRODUÇÃO");
        pularIntroducao(1);
    }, (1000 * 60 * 5));
}

function pularPropaganda(tentativas) {
    var pular = document.querySelector('.fu4rd6c.f1cw2swo');

    if (!pular) {
        setTimeout(() => {
            //console.log(new Date() + "Tentando pular PROPAGANDA... Tentativa: " + tentativas);
            pularPropaganda(++tentativas)
        }, 3000);

        return;
    }

    pular.click();
    reativarLegenda();

    //console.log("PROPAGANDA pulada, próxima tentativa será: " + new Date((Date.now() + (1000 * 60 * 5))));
    setTimeout(() => {
        //console.log(new Date() + "Iniciando processo de tentativas - PROPAGANDA");
        pularPropaganda(1);
    }, (1000 * 60 * 5));
}

function pularFim(tentativas) {
    var pular = document.querySelector('.fmy9x71.f1pl57tw.fr7nx1g');

    if (!pular) {
        setTimeout(() => {
            //console.log(new Date() + "Tentando pular FIM... Tentativa: " + tentativas);
            pularFim(++tentativas)
        }, 3000);

        return;
    }

    pular.click();

    //console.log("FIM pulado, próxima tentativa será: " + new Date((Date.now() + (1000 * 60 * 5))));
    setTimeout(() => {
        //console.log(new Date() + "Iniciando processo de tentativas - FIM");
        pularFim(1);
    }, (1000 * 60 * 5));
}

function reativarLegenda() {
    setTimeout(() => {
        document.querySelector(site.seletorLegendaOff)?.parentElement?.querySelector('label')?.click()
    }, 1000);

    setTimeout(() => {
        document.querySelector(site.seletorLegendaIngles)?.parentElement?.querySelector('label')?.click()
    }, 2000);
}


var mudarTudoPraMinuscula = true;
var styleElementPrime;
var posicaoLegendaSliderRodapePrime = localStorage.getItem('posicaoLegendaSliderRodape') ? Number(localStorage.getItem('posicaoLegendaSliderRodape')) : 450;
var fonteLegendaRodapePrime = localStorage.getItem('fonteLegendaRodape') ? Number(localStorage.getItem('fonteLegendaRodape')) : 34;
var posicaoLegendaRodapePrime = localStorage.getItem('posicaoLegendaRodape') ? Number(localStorage.getItem('posicaoLegendaRodape')) : 500;
var backgroundColorRodapePrime = localStorage.getItem('backgroundColorRodape') ? localStorage.getItem('backgroundColorRodape') : '0.25';
var esconderBarra = false;

function addStyleElementPrime() {
    if (styleElementPrime) {
        styleElementPrime.parentElement.removeChild(styleElementPrime);
    }

    styleElementPrime = document.createElement('style');

    styleElementPrime.innerHTML += `.atvwebplayersdk-captions-overlay.f1d63tv1 .f1iwgj00 > div {bottom: ${posicaoLegendaSliderRodapePrime}% !important;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-captions-overlay:not(.f1d63tv1) .f1iwgj00 > div {bottom: ${posicaoLegendaRodapePrime}% !important;} `;

    // em ultimo caso fazer a caixa da legenda receber position: fixed, resetar todos os atributos e usar BOTTOM em todos os sites
    styleElementPrime.innerHTML += `.f1d63tv1 {opacity: 1 !important;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-captions-overlay .f1iwgj00 > div {position: fixed !important;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-captions-text {font-family: NovaFonte, sans-serif !important; font-size: ${fonteLegendaRodapePrime}px !important; padding: 0px 5px !important;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-captions-text {background-color: rgba(0, 0, 0, ${backgroundColorRodapePrime}) !important;} `;

    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container .f124tp54  {position: absolute; right: 5px; bottom: 3px; opacity: .2} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container .f124tp54.hide {opacity: 0} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container .fkpovp9.f8hspre  {display: none !important;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container h1 {font-size: 16px !important; display: none;} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container h2 {font-size: 14px !important;} `;

    styleElementPrime.innerHTML += `.atvwebplayersdk-hideabletopbuttons-container img {opacity: .3} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-closebutton-wrapper img {opacity: .3} `;

    styleElementPrime.innerHTML += `.collapsibleXrayHeader .xrayHeaderTitle {font-size: 14px !important; opacity: .5} `;
    styleElementPrime.innerHTML += `.collapsibleXrayHeader .xrayHeaderViewAll {font-size: 14px !important; opacity: .5} `;
    styleElementPrime.innerHTML += `.atvwebplayersdk-overlays-container .f2ptdfh.fz8eask { margin-left: -35px !important; opacity: .5} `;

    if (mudarTudoPraMinuscula) { // Tecla 4
        styleElementPrime.innerHTML += `.atvwebplayersdk-captions-text {text-transform: lowercase !important;} `;
    }

    if (esconderBarra) {
        styleElementPrime.innerHTML += `.atvwebplayersdk-bottompanel-container, .xrayQuickView { display: none !important; }`;
        styleElementPrime.innerHTML += `.atvwebplayersdk-hideabletopbuttons-container, .atvwebplayersdk-closebutton-wrapper { display: none !important; }`;
        styleElementPrime.innerHTML += `.atvwebplayersdk-captions-overlay.f1d63tv1 .f1iwgj00 > div {bottom: ${posicaoLegendaRodapePrime}% !important;} `;
    }

    document.head.appendChild(styleElementPrime);
}

function afterDOMLoadedPrime() {
    // forca1080pPrimeVideo()

    pularIntroducao(1);
    pularPropaganda(1);

    let intervalCriarModal = setInterval(() => {
        if (document.querySelector('#posicaoSliderRodape')) {
            addStyleElementPrime();

            let posicaoRodapeSliderInput = document.querySelector('#posicaoSliderRodape');
            posicaoRodapeSliderInput.addEventListener('input', function () {
                posicaoLegendaSliderRodapePrime = Number(this.value);
                addStyleElementPrime();
            });

            let fonteLegendaRodapeInput = document.querySelector('#fonteRodape');
            fonteLegendaRodapeInput.addEventListener('input', function () {
                fonteLegendaRodapePrime = Number(this.value);
                addStyleElementPrime();
            });

            let posicaoRodapeInput = document.querySelector('#posicaoRodape');
            posicaoRodapeInput.addEventListener('input', function () {
                posicaoLegendaRodapePrime = Number(this.value);
                addStyleElementPrime();
            });

            let backgroundColorRodapeInput = document.querySelector('#backgroundColorRodape');
            backgroundColorRodapeInput.addEventListener('input', function () {
                backgroundColorRodapePrime = this.value;
                addStyleElementPrime();
            });

            clearInterval(intervalCriarModal);
        }
    }, 500);

    setInterval(() => {
        var legenda = pegarLegendaPrime();
        if (!legenda) {
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    setInterval(() => {
        pularFim(1);
    }, (1000 * 60 * 5));

    setTimeout(() => {
        tituloPagina = document.title;
    }, 4000);

    setTimeout(() => {
        acelerarVideoPrime();
    }, 9000);

    setInterval(() => {
        acelerarVideoPrime();
    }, (1000 * 60 * 1));

    setInterval(() => {
        //console.log('Fone Helper Rodando! - www.primevideo.com');

        fonePrime();

        nomeSerie = document.querySelector('.atvwebplayersdk-title-text')?.textContent;

    }, 5000);

    setTimeout(() => {
        //console.log('Video Helper Rodando! - www.primevideo.com');
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        fonePrime();

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.key === '.') {
                esconderBarra = !esconderBarra;
                addStyleElementPrime();
            }

            if (e.keyCode == '52') { // 4
                mudarTudoPraMinuscula = !mudarTudoPraMinuscula;
                addStyleElementPrime();
            }

            if (e.keyCode == '78') { // N
                var ingles = document.querySelector(site.seletorLegendaIngles);
                if (ingles.checked) {
                    var portugues = document.querySelector(site.seletorLegendaPortugues);
                    if (!portugues) {
                        portugues = document.querySelector(site.seletorLegendaPortuguesBr);
                    }
                    portugues.parentElement.querySelector('label').click();
                } else {
                    document.querySelector(site.seletorLegendaIngles)
                        .parentElement.querySelector('label').click()
                }

                var audioIngles = document.querySelector(site.seletorAudioIngles2);
                if (!audioIngles) {
                    audioIngles = document.querySelector(site.seletorAudioIngles);
                }
                if (audioIngles.checked) {
                    var audioPtBr = document.querySelector(site.seletorAudioPortugues);
                    if (!audioPtBr) {
                        audioPtBr = document.querySelector(site.seletorAudioPortugues2);
                    }

                    audioPtBr.parentElement.querySelector('label').click();
                } else {
                    audioIngles.parentElement.querySelector('label').click();
                }
            }

            var ingles = document.querySelector(site.seletorLegendaIngles);
            if (e.keyCode == '86' && ingles) { // V
                if (ingles.checked) {
                    if (document.querySelector(site.seletorLegendaOff)) {
                        document.querySelector(site.seletorLegendaOff)
                            .parentElement.querySelector('label').click()
                    } else if (document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Desativado"]')) {
                        document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Desativado"]')
                            .parentElement.querySelector('label').click()
                    }

                } else {
                    document.querySelector(site.seletorLegendaIngles)
                        .parentElement.querySelector('label').click()
                }
            }

            // var portugues = document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Português"]');
            // if(!portugues) {
            //     portugues = document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Português (Brasil)"]');
            // }
            var portugues = document.querySelector(site.seletorLegendaPortugues);
            if (!portugues) {
                portugues = document.querySelector(site.seletorLegendaPortuguesBr);
            }
            if (e.keyCode == '80' && portugues) { // P
                if (portugues.checked) {
                    if (document.querySelector(site.seletorLegendaOff)) {
                        document.querySelector(site.seletorLegendaOff)
                            .parentElement.querySelector('label').click()
                    } else if (document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Desativado"]')) {
                        document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Desativado"]')
                            .parentElement.querySelector('label').click()
                    }
                } else {
                    portugues.parentElement.querySelector('label').click()
                }
            }

            var audioIngles = document.querySelector(site.seletorAudioIngles2);
            if (!audioIngles) {
                audioIngles = document.querySelector(site.seletorAudioIngles);
            }
            if (e.keyCode == '66' && audioIngles) { // B
                if (audioIngles.checked) {
                    var audioPtBr = document.querySelector(site.seletorAudioPortugues);
                    if (!audioPtBr) {
                        audioPtBr = document.querySelector(site.seletorAudioPortugues2);
                    }

                    audioPtBr.parentElement.querySelector('label').click();
                } else {
                    audioIngles.parentElement.querySelector('label').click();
                }
            }

            if (e.key.toUpperCase() === localStorage.getItem('teclaTempo1').toUpperCase()) {
                video.currentTime = video.currentTime - Number(localStorage.getItem('valorTempo1'));
            }

            if (e.key.toUpperCase() === localStorage.getItem('teclaTempo2').toUpperCase()) {
                video.currentTime = video.currentTime - Number(localStorage.getItem('valorTempo2'));
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
            /* 
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
*/
            if (e.keyCode == '106') { // *
                var acelerar = localStorage.getItem("acelerar") === "false" ? true : false;
                localStorage.setItem("acelerar", acelerar);
                acelerarVideoPrime();
            }


            if (e.keyCode == '194') { // .
                usarLowercase = !usarLowercase;
            }

            if (e.keyCode == '192') { // . /
                var legenda = pegarLegendaPrime2222();
                if (!legenda) {
                    if (legendas && legendas.length > 0) {
                        legenda = legendas[legendas.length - 1]
                    } else {
                        return;
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


function pegarLegendaPrime2222() {
    var legenda = pegarLegendaPrime();
    if (!legenda) {
        return;
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

    return legenda;
}

function pegarLegendaPrime() {
    var legenda = document.querySelector('div p span')?.innerText;
    if (!legenda) {
        let qualLegendaCopiar = localStorage.getItem('qualLegendaCopiar');
        legenda = document.getElementById(`${qualLegendaCopiar}`)?.innerText;
        if (!legenda) {
            return '';
        }
    }

    legenda = legenda.replaceAll('\n', ' ');
    legenda = legenda.replaceAll('>> ', '');
    legenda = legenda.replaceAll('[', '(');
    legenda = legenda.replaceAll(']', ')');
    legenda = legenda.trim();

    if (nomeSerie === 'The Office' || usarLowercase) {
        legenda = legenda.charAt(0) + legenda.substring(1).toLowerCase();
    }

    return legenda
}


// https://github.com/logore/amazon-prime-video-1080p
// Amazon Prime Video 1080p
function injectScript(fn) {
    if (typeof fn !== 'function') {
        return
    }

    let match = fn.toString().match(/{.*}/sm)
    let fnStr = match[0].slice(1, match[0].length - 1)

    document.documentElement.setAttribute('onreset', fnStr)
    document.documentElement.dispatchEvent(new CustomEvent('reset'))
    document.documentElement.removeAttribute('onreset')
}

function forca1080pPrimeVideo() {
    injectScript(() => {
        (async () => {
            const sleep = ms => new Promise(r => setTimeout(r, ms))

            for (; ;) {
                if (document.documentElement !== null && document.body !== null) {
                    break
                }
                await sleep(100)
            }

            const startXHRHooking = () => {
                let script = document.createElement('script')
                script.src = '//unpkg.com/xhook@latest/dist/xhook.min.js'

                document.body.appendChild(script)
                script.remove()

                script.addEventListener('load', () => {
                    xhook.after(function (request, response) {
                        try {
                            if (request.url.match(/\.mpd/)) {
                                let mpd = response.text

                                const parser = new DOMParser()
                                const dom = parser.parseFromString(mpd, 'text/xml')

                                let periods = dom.querySelectorAll('Period')

                                let periodIndex = periods.length == 1 ? 0 : 1
                                let period = periods[periodIndex]
                                let representations = period.querySelectorAll('AdaptationSet[contentType="video"] > Representation')

                                let heights = []
                                let bandwidths = []
                                let ids = []

                                console.log("heights: " + heights);
                                console.log("bandwidths: " + bandwidths);
                                console.log("ids: " + ids);

                                representations.forEach(rep => {
                                    heights.push(parseInt(rep.getAttribute('height'), 10))
                                    bandwidths.push(parseInt(rep.getAttribute('bandwidth'), 10))

                                    ids.push(rep.getAttribute('id'))
                                })

                                // sort by largest number
                                heights = Array.from(new Set(heights))
                                heights.sort((a, b) => b - a)

                                // sort by largest number
                                bandwidths = Array.from(new Set(bandwidths))
                                bandwidths.sort((a, b) => b - a)

                                console.log("2 heights: " + heights);
                                console.log("2 bandwidths: " + bandwidths);


                                ids.forEach((id, i) => {
                                    if (!(representations[i].getAttribute('height') == heights[0].toString() && representations[i].getAttribute('bandwidth') == bandwidths[0].toString())) {
                                        // there may be multiple Representations with a height of 1080, so maybe there should be an option to allow the user to choose those.
                                        // the maximum bandwidth will cause the file size to be large, so it will be overloaded.

                                        // delete other representation elements
                                        dom.querySelectorAll('Period')[periodIndex].querySelector(`AdaptationSet[contentType="video"] > Representation[id="${id}"]`).remove()
                                    }
                                })

                                // revert the edited mpd xml to plain mpd
                                let mpd_ = dom.documentElement.outerHTML

                                response.text = mpd_
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    })
                })
            }

            startXHRHooking()

            const div = document.createElement('div')
            div.classList.add('anim-box')
            div.classList.add('popup')

            document.body.appendChild(div)
        })()
    })
}