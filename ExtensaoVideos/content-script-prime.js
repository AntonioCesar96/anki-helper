site = {
    host: "www.primevideo.com",
    seletorAudioIngles: '.atvwebplayersdk-audiomenu-container [aria-label="English"]',
    seletorAudioIngles2: '.atvwebplayersdk-audiomenu-container [aria-label="English [Audio Description]"]',
    seletorAudioPortugues: '.atvwebplayersdk-audiomenu-container [aria-label="Português"]',
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

        console.log(`Possível legenda: ${tempoElemento.textContent} - `);

        var legenda = pegarLegendaPrime2222();
        if (!legenda) {
            return;
        }

        console.log(`${tempoElemento.textContent} - ` + legenda);
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

        var audioIngles = document.querySelector(site.seletorAudioIngles);
        if (!audioIngles) {
            audioIngles = document.querySelector(site.seletorAudioIngles2);
        }
        if (audioIngles) {
            if (audioIngles.checked) {
                document.querySelector(site.seletorAudioPortugues)
                    .parentElement.querySelector('label').click();
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
    if (video) {
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

function afterDOMLoadedPrime() {
    pularIntroducao(1);
    pularPropaganda(1);

    setInterval(() => {
        let fundo = document.querySelector('.atvwebplayersdk-overlays-container .fkpovp9.f8hspre');
        if(fundo) {
            fundo.style.display = 'none';
        }

    }, (5000));

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

                var audioIngles = document.querySelector(site.seletorAudioIngles);
                if (!audioIngles) {
                    audioIngles = document.querySelector(site.seletorAudioIngles2);
                }
                if (audioIngles.checked) {
                    document.querySelector(site.seletorAudioPortugues)
                        .parentElement.querySelector('label').click();
                } else {
                    audioIngles.parentElement.querySelector('label').click();
                }
            }

            var ingles = document.querySelector(site.seletorLegendaIngles);
            if (e.keyCode == '86' && ingles) { // V
                if (ingles.checked) {
                    document.querySelector(site.seletorLegendaOff)
                        .parentElement.querySelector('label').click()
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
                    document.querySelector(site.seletorLegendaOff)
                        .parentElement.querySelector('label').click()
                } else {
                    portugues.parentElement.querySelector('label').click()
                }
            }

            var audioIngles = document.querySelector(site.seletorAudioIngles);
            if (!audioIngles) {
                audioIngles = document.querySelector(site.seletorAudioIngles2);
            }
            if (e.keyCode == '66' && audioIngles) { // B
                if (audioIngles.checked) {
                    document.querySelector(site.seletorAudioPortugues)
                        .parentElement.querySelector('label').click();
                } else {
                    audioIngles.parentElement.querySelector('label').click();
                }
            }

            if (e.keyCode == '96') { // 0
                video.currentTime = video.currentTime - skipTime;
            }

            if (e.keyCode == '110') { // ` '
                video.currentTime = video.currentTime - 6;
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
                console.log("Interval cancelado!")
            }

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
    var elemento = document.querySelector('div p span');
    if (!elemento) {
        return '';
    }

    var legenda = document.querySelector('div p span').innerText;
    if (!legenda) {
        return '';
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