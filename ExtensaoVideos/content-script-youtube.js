if (location.host === "www.youtube.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoaded);
    } else {
        afterDOMLoaded();
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

function fone() {

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

    navigator.mediaSession.setActionHandler('previoustrack', function () {
        if (pularIntro()) {
            return;
        }

        var video = getVideo();
        video.currentTime = video.currentTime - skipTime;
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        if (pularIntro()) {
            return;
        }
    });
}

var tempoInicial = 0;
var tempoFinal = 0;
var tempo = 0;
var timer = 0;

function afterDOMLoaded() {
    setInterval(() => {
        console.log('Fone Helper Rodando! - www.youtube.com');

        fone();

    }, 5000);

    setTimeout(() => {
        console.log('Video Helper Rodando! - www.youtube.com');
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        fone();

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.keyCode == '110') { // ,
                video.currentTime = video.currentTime - 2;
            }

            if (e.keyCode == '192') { // aspas simples '
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

            if (e.keyCode == '194' || e.keyCode == '111') { // . /
                document.querySelector('button[aria-label="More actions"]').click();

                setTimeout(() => {
                    var lista = Array.from(document.querySelectorAll('tp-yt-paper-item'));
                    lista.find(el => el.textContent.trim() === 'Show transcript').click();

                    setTimeout(() => {
                        var legendas = document.querySelectorAll('.ytd-transcript-segment-list-renderer');

                        var texto = '';

                        for (let i = 0; i < legendas.length; i++) {
                            const legenda = legendas[i];

                            var split = legenda.innerText.split('\n');

                            texto += split[1] + '\n';
                        }

                        copyToClipboard(texto);
                        console.log(texto);

                        console.log('Legenda copiada!')

                        function copyToClipboard(text) {
                            const elem = document.createElement('textarea');
                            elem.value = text;
                            document.body.appendChild(elem);
                            elem.select();
                            document.execCommand('copy');
                            document.body.removeChild(elem);
                        }
                    }, 3000);

                }, 300);

            }
        }
    }, 5000);
}