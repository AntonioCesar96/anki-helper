if (location.host === "www.youtube.com") {
    document.body.style.opacity = 0;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedYoutube);
    } else {
        afterDOMLoadedYoutube();
    }
}

var skipTime = 4;
// var links = [
//     { imagem: chrome.runtime.getURL('/youtube-imagens/01.png') },
//     { imagem: chrome.runtime.getURL('/youtube-imagens/02.png') },
//     { imagem: chrome.runtime.getURL('/youtube-imagens/03.jpeg') },
// ]

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

function readTextFile() {
    var file = chrome.runtime.getURL('/youtube.html');
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var html = rawFile.responseText;

                replaceHtml(html)
            }
        }
    }
    rawFile.send(null);
}

function replaceHtml(html) {

    if (document.querySelector('ytd-browse[page-subtype="home"]')) {
        document.querySelector('ytd-browse').innerHTML = html;
    }

    var index = Number(localStorage.getItem('indexImagens'));
    index = randomIntFromIntervalGenerate(index);
    localStorage.setItem('indexImagens', index);

    trocarImagem();
    trocarImagemInterval();

    function trocarImagem() {
        var img = document.querySelector('.imagens-container img');
        if (!document.querySelector('.imagens-container img')) {
            return;
        }

        document.title = `${(index + 1)}/${links.length} - Youtube`;
        img.src = links[index].imagem;

        index++;
        if (index >= links.length) {
            index = 0;
        }
    }

    function trocarImagemInterval() {
        setTimeout(() => {
            trocarImagem();
            trocarImagemInterval();
        }, 1000 * 60 * 3);
    }

    document.body.style.opacity = 1;
}

function tratamentoTelaInicial() {
    var oldHref = document.location.href;
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

                if (document.location.href.includes('https://www.youtube.com/shorts')) {
                    if (document.querySelector('#shorts-container')) {
                        document.querySelector('#shorts-container').innerHTML = '';
                    }
                }
                readTextFile();
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);

    if (document.querySelector('ytd-browse')) {
        document.querySelector('ytd-browse').innerHTML = '';
    }

}
function afterDOMLoadedYoutube() {

    tratamentoTelaInicial();

    setTimeout(() => {
        readTextFile();
    }, 500);

    setInterval(() => {
        fone();
    }, 5000);

    setTimeout(() => {
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

            if (location.href === "https://www.youtube.com/") {
                if (e.keyCode == '37') { // <
                    var index = Number(localStorage.getItem('indexImagens'));
                    index--;
                    localStorage.setItem('indexImagens', index);
                    trocarImagemBotao();
                }

                if (e.keyCode == '39') { // >
                    var index = Number(localStorage.getItem('indexImagens'));
                    index++;
                    localStorage.setItem('indexImagens', index);
                    trocarImagemBotao();
                }

                if (e.keyCode == '80') { // P
                    var index = Number(localStorage.getItem('indexImagens'));
                    index = randomIntFromIntervalGenerate(index);

                    localStorage.setItem('indexImagens', index);
                    trocarImagemBotao();
                }
            }
        }
    }, 5000);
}

function trocarImagemBotao() {
    var index = Number(localStorage.getItem('indexImagens'));
    var img = document.querySelector('.imagens-container img');
    if (!document.querySelector('.imagens-container img')) {
        return;
    }

    if (index >= links.length) {
        index = 0;
    }

    if (index < 0) {
        index = links.length - 1;
    }

    img.src = links[index].imagem;
    localStorage.setItem('indexImagens', index);
    document.title = `${(index + 1)}/${links.length} - Youtube`;
}

function randomIntFromIntervalGenerate(indexAtual) {
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let rndInt = randomIntFromInterval(0, (links.length - 1));

    if (indexAtual === rndInt) {
        return randomIntFromIntervalGenerate(indexAtual);
    }

    return rndInt;
}

var links = [
    { imagem: 'http://localhost:3000/youtube-imagens/01.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/02.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/03.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/04.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/05.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/06.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/07.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/08.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/09.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/10.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/11.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/12.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/13.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/14.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/15.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/16.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/17.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/18.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/19.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/20.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/21.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/22.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/23.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/24.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/25.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/26.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/27.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/28.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/29.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/30.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/31.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/32.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/33.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/34.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/35.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/36.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/37.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/38.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/39.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/40.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/41.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/42.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/43.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/44.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/45.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/46.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/47.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/48.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/49.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/50.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/51.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/52.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/53.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/54.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/55.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/56.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/57.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/58.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/59.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/60.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/61.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/62.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/63.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/64.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/65.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/66.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/67.png' },
    { imagem: 'http://localhost:3000/youtube-imagens/68.png' }
]