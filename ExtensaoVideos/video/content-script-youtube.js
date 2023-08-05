if (location.host === "www.youtube.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedYoutube);
    } else {
        afterDOMLoadedYoutube();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoadedPronunciation);
} else {
    afterDOMLoadedPronunciation();
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
        video.currentTime = video.currentTime - 7;
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
var legendas = [];

var styleElementYoutube;
var esconderBarra = false;

function addstyleElementYoutube() {
    if (styleElementYoutube) {
        styleElementYoutube.parentElement.removeChild(styleElementYoutube);
    }

    styleElementYoutube = document.createElement('style');

    styleElementYoutube.innerHTML = ``;

    if (esconderBarra) {
        styleElementYoutube.innerHTML += `.caption-window.ytp-caption-window-bottom { margin-bottom: 0 !important; }`;
        styleElementYoutube.innerHTML += `.ytp-chrome-bottom, .ytp-gradient-bottom { display: none !important; }`;
        styleElementYoutube.innerHTML += `.jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: ${posicaoLegendaRodapeSoaper}% !important; line-height: 1.27 !important;}  `;
    }

    document.head.appendChild(styleElementYoutube);
}

function afterDOMLoadedYoutube() {

    setInterval(() => {
        // document.querySelectorAll('.ytp-panel-menu [role="menuitem"] .ytp-menuitem-content')

        var legenda = pegarLegendaYoutube();
        if (!legenda) {
            //console.log('Nada!');
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    setInterval(() => {
        fone();
    }, 5000);

    setTimeout(() => {
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        fone();

        document.addEventListener('keydown', function (e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.key === '.') {
                esconderBarra = !esconderBarra;
                addstyleElementYoutube();
            }

            if (e.keyCode == '110') { // ,
                video.currentTime = video.currentTime - 4;
            }

            if (e.code == 'KeyZ') { 
                video.currentTime = video.currentTime - 3.5;
            }
            
            if (e.code == 'KeyX') { 
                video.currentTime = video.currentTime - 3;
            }

            if (e.keyCode == '192') { // aspas simples '
                var legenda = pegarLegendaYoutube();
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

            if (e.ctrlKey === false && (e.keyCode == '220' || e.keyCode == '221')) { // ] [
                window.open(location.href.replace('youtube.com', 'youtubezz.com'));
                window.open(`https://pt.onlymp3.to/TIL/?url=${location.href}`);
            }

            if (e.keyCode == '111') { //    /
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
                            var video = document.querySelector('video');
                            const elem = document.createElement('textarea');
                            elem.value = text;
                            video.parentElement.appendChild(elem);
                            elem.select();
                            document.execCommand('copy');
                            video.parentElement.removeChild(elem);
                        }
                    }, 3000);

                }, 300);
            }
        });
    }, 3000);
}

function pegarLegendaYoutube() {
    var elemento = document.querySelector('.caption-window.ytp-caption-window-bottom')

    if (!elemento) {
        return '';
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




function afterDOMLoadedPronunciation() {

    console.log("Pronunciation");

    setTimeout(() => {
        document.addEventListener('contextmenu', function (e) {

            let palavraMarcada = window.getSelection()?.toString().trim() ?? "";

            if (e.ctrlKey) {
                e.preventDefault();

                var audio = new Audio(`http://localhost:3000/google/pronunciation?palavra=${palavraMarcada}`);
                audio.play();

            }
        }, true);

        document.addEventListener('keydown', function (e) {

            let palavraMarcada = window.getSelection()?.toString().trim() ?? "";

            if (e.ctrlKey === true && (e.keyCode == '220' || e.keyCode == '221')) { // ] [

                window.open("https://www.google.com/search?q=" + palavraMarcada + "+pronunciation+english");
            }

            if (e.ctrlKey === true && e.keyCode == '194') { // ] [

                window.open("https://context.reverso.net/traducao/ingles-portugues/" + palavraMarcada);
            }

        });
    }, 1000);

}