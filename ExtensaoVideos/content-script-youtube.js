if (location.host === "www.youtube.com") {
    document.body.style.opacity = 0;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedYoutube);
    } else {
        afterDOMLoadedYoutube();
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
        }, 1000 * 60 * 2);
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
        for (let i = 0; i < links.length; i++) {
            const imagem = links[i].imagem;

            var oImg = document.createElement("img");
            oImg.setAttribute('src', imagem);

            var container = document.querySelector(`.imagens-cache`);
            container.appendChild(oImg);

            container.style.display = 'none';
        }
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
    { imagem: 'https://drive.google.com/uc?export=view&id=1Jd4zDqgSLui3NKS7yOR8VDZJ1ooHxBrP' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1GIwP7JtZd1gvcWeCQ6Nrfa6wrhAwxl48' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1r_Ls62rQEAIF-1_9HhNYpZgy3pzPD_6u' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1aluToDDzto1Oi1dqCGk_bGfThpl-G9ZE' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1pVdQY1vcez_n2uTGAVIyJQp2imYnyCXs' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1oTZ1mFsPb5EC7T2OSt3LgwOxnu5Iryjt' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1KPYUQ_8LCmuEh3S5-EIzPg1p5ot-MHai' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1jGxsZJDENVVLzYKn9M6eafkqmT7kxfKJ' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1BIYex6IVqZmSoGJTDqCNyPITywa1D3gr' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1ZjXGbWsOZCAEHJfDC84fWFqc6g3Z-tLF' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1oR77_xAymBbgGFADusiGjhqrEjuP0W_O' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1Cn5LBblA3crAIZ5anKGOiijcct9HvKEo' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1aZC3PquQp3rSBXUAuH8wdNrigRvuXzlK' },
    { imagem: 'https://drive.google.com/uc?export=view&id=11eHDchRh23m_EvpPfxKOP0KOnNVzNzkT' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1SBRQnkNTQH_UMsbx46AM15uzRnnWTgKq' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1ATrOhgibGUNaFG2YIZiransB6pCQwEQp' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1FBPpdin3ohNm6DRmzyjLzulqG2I7AZX9' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1rH1etRJlf-C1Z3BpGTjTUk4lW7UxwdEZ' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1Y4NDyd4pANt0qBm4j2FtwRJht-SLupCH' },
    { imagem: 'https://drive.google.com/uc?export=view&id=18QPtLWt9vaYgtdU_CaanVjw286KmL8Hr' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1ppjkWwVW4bHWaqb_3-M5qvAff6bhzi6m' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1LUEpxamfHDk3nk_6Sx7QCPKDnnoM6PVa' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1x95e4lVRh7pKQtWQYO3R8A2VxX6BAb2T' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1f_VkNwuK01Ao2fv5_GTLXmq-Lo4qg97z' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1HSIC4lRq0OHrhv4mUqzr8m_cTWKpzbHv' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1SAXFqUYN_B66uF1JKb3vlZkqdQpzUCPW' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1KQKEgZYRJSu8hiSOX60HkjwJ9Qfcy8pr' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1H6l7dzLCwF2NxDkTWJb85H6gS__vKn9a' },
    { imagem: 'https://drive.google.com/uc?export=view&id=15JC9TTHDOPsutvmYmdQiyRq2dC3-0QT3' },
    { imagem: 'https://drive.google.com/uc?export=view&id=17k02a6EC6y9MKKysfXsJbbp9eJ5HXkH4' },
    { imagem: 'https://drive.google.com/uc?export=view&id=17dk2TrWDAq1CxR5uRuq1Mtc_8VeiJ0dc' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1iqt2hPH65_5zRxHDDwPN6InfYwEwf5lg' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1Gz4K8jbrGpqpc7Nz1k_0zMAdTGrMBg6k' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1sP5By8EZEewNl61y92XsgaUEfVm4SZo0' },
    { imagem: 'https://drive.google.com/uc?export=view&id=18gMJ-imKq0Erxna6261GHQOHK_Qt_Fop' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1-fgK43jeGfzlNJojWM2Yb0b08RgfRI5l' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1Oz9dCC1qxxhw0ln9ETOYiRsa7dRYQbMb' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1ure9l8jQ5YINuVMAlZE8NeSp0uLvMfcA' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1-3g9hv6N-yBhTsqR-KqSkPlayyKE5DLX' },
    { imagem: 'https://drive.google.com/uc?export=view&id=19uVBfhxyrrOnoOW53jn9yDjxsFAoD7Y9' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1pMOlH9BE18GRi3cnYmRGzZCBHUFSEttW' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1J2WXA2HYS1SW0e0ZNF8Hj7F18_LRXyVh' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1-4ZHRLktEaseQ2i7w-jaS5y1QFMIBSUy' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1JOH8hYPrBY4kCSy5B4XfMC6y2UDTBPjv' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1u0Ia4oDRAFtfUy8bcGWMk2u7QKa-a6GA' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1fC-ogi47LrHoogyh1kL48UjB8h8jgf3l' },
    { imagem: 'https://drive.google.com/uc?export=view&id=16eJXtiXcPseoL1yOt_VbiiwUSurygcZm' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1BV5YaKPYjmK-xJ1Wh2AggE3iftlGSdQU' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1dUNbyaDED9nNPZYP0cqiSLxHlxyw5mJK' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1U_aaYRFTSxQSl6YwyznPHVl_q-ZnG9V7' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1c0Q_CBb0v2hyUsUC-KFKAN2qR6sqnsry' },
    { imagem: 'https://drive.google.com/uc?export=view&id=115Jt2O2M_MBqiCyfUMNAuUz3aqkhuaUg' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1FZQJobPp7V6ofT7OJkNf5xs9ZphkqDvj' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1jts8rqiIjjvT5yrktu0_yWSQAWw4IsxI' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1t1vdpyhdI1cgeMqXiOGb5Pktl8hpYJPr' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1zISu5-Y891jtDOXxBpLnQPyNq9sRsqNK' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1bgSa2v4RCa-GfFOXJZkVWWSWhsKLXpVg' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1JWK1ZbZMlR66ZUCj8fp3u1aikOuWL8cN' },
    { imagem: 'https://drive.google.com/uc?export=view&id=16m9xj1Qt1MsAWsXj3ICBObKtxwQMrHeF' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1b8SN7bASkZjM5C2Y7mwDyY6MjZAxaxpT' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1utluOwc2hOyhKsGicuWySrJFTHPgQkAU' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1IVOWVcmu4BIfXTmKaoE9Xfk0kWmJG4rl' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1F3bx4waaClCzsw9MZB73D6WGGoI2WyY4' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1i-a8cwuGphgSQdGxPGGhMM3ZgCruxYHd' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1zk5yFSSkms-f9rK3Niq7FHSqIBIxE7z4' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1NKVTwVVgGrcN83VW0w8eQ7QMAQkDROtb' },
    { imagem: 'https://drive.google.com/uc?export=view&id=12EruQ8Ex4npyjdYd6yuDi7QJ1JZ_ZXmh' },
    { imagem: 'https://drive.google.com/uc?export=view&id=1JICLelQXa01uTb6mkpwFsCqluAu6NpbV' },
]


// Pega Id do drive
// var itens = document.querySelectorAll('c-wiz div[data-id]');
// var texto = '';
// for (let i = 0; i < itens.length; i++) {
//     var aaa = itens[i].getAttribute('data-id');
//     console.log(`{ imagem: 'https://drive.google.com/uc?export=view&id=${aaa}' },`);

//     texto += `{ imagem: 'https://drive.google.com/uc?export=view&id=${aaa}' }, \n`
// }

// console.log(texto);