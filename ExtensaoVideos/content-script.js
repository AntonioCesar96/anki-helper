if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
    afterDOMLoaded();
}

var skipTime = 4;

function getVideo() {
    var videos = document.querySelectorAll('video');
    var video;
    for (let i = 0; i < videos.length; i++) {
        if(videos[i].className != 'tst-video-overlay-player-html5') {
            return videos[i];
        }
    }

    return null;
}

function fone() {

    navigator.mediaSession.setActionHandler('previoustrack', function () {
        var video = getVideo();
        video.currentTime = video.currentTime - skipTime;
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        var audioIngles = document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="English"]');
        if (audioIngles) {
            if (audioIngles.checked) {
                document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="Português"]')
                    .parentElement.querySelector('label').click();
            } else {
                document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="English"]')
                    .parentElement.querySelector('label').click();
            }

            var video = getVideo();
            video.currentTime = video.currentTime - skipTime;
        }
    });
}

var tempoInicial = 0;
var tempoFinal = 0;
var tempo = 0;
var timer = 0;

function afterDOMLoaded() {
    setTimeout(() => {
        console.log('Video Helper Rodando!');
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        fone();

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            var ingles = document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="English [CC]"]');
            if (e.keyCode == '86' && ingles) { // V
                if (ingles.checked) {
                    document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Off"]')
                        .parentElement.querySelector('label').click()
                } else {
                    document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="English [CC]"]')
                        .parentElement.querySelector('label').click()
                }
            }

            // var portugues = document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Português"]');
            // if(!portugues) {
            //     portugues = document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Português (Brasil)"]');
            // }
            var portugues = document.querySelector('.atvwebplayersdk-subtitleoption-container [aria-label="Português"]');
            if(!portugues) {
                portugues = document.querySelector('.atvwebplayersdk-subtitleoption-container [aria-label="Português (Brasil)"]');
            }
            if (e.keyCode == '80' && portugues) { // P
                if (portugues.checked) {
                    document.querySelector('.atvwebplayersdk-subtitleandaudiomenu-container [aria-label="Off"]')
                        .parentElement.querySelector('label').click()
                } else {
                    portugues.parentElement.querySelector('label').click()
                }
            }

            var audioIngles = document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="English"]');
            if (e.keyCode == '66' && audioIngles) { // B
                if (audioIngles.checked) {
                    document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="Português"]')
                        .parentElement.querySelector('label').click();
                } else {
                    document.querySelector('.atvwebplayersdk-audiomenu-container [aria-label="English"]')
                        .parentElement.querySelector('label').click();
                }
            }

            if (e.keyCode == '96' || e.keyCode == '192') { // 0
                video.currentTime = video.currentTime - skipTime;
            }

            if (e.keyCode == '107' || e.keyCode == '187') { // -
                video.playbackRate = Number((video.playbackRate + playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;
            }

            if (e.keyCode == '109' || e.keyCode == '189') { // +
                video.playbackRate = Number((video.playbackRate - playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;
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
        }
    }, 5000);
}