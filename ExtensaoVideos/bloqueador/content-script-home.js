var sitesHome = [
    {
        host: "twitter.com",
        href: "https://twitter.com/explore",
        seletor: 'body'
    },
    {
        host: "x.com",
        href: "https://x.com/explore",
        seletor: 'body'
    },
    {
        host: "www.instagram.com",
        href: "https://www.instagram.com/",
        seletor: 'body'
    },
    {
        host: "g1.globo.com",
        href: "https://g1.globo.com/",
        seletor: 'body'
    },
    {
        host: "ge.globo.com",
        href: "https://ge.globo.com/",
        seletor: 'body'
    },
    {
        host: "www.campograndenews.com.br",
        href: "https://www.campograndenews.com.br/",
        seletor: 'body'
    },
    {
        host: "midiamax.uol.com.br",
        href: "https://midiamax.uol.com.br/",
        seletor: 'body'
    },
    // {
    //     host: "www.youtube.com/watch",
    //     href: "https://www.youtube.com/",
    //     seletor: '#related'
    // },
    {
        host: "www.youtube.com",
        href: "https://www.youtube.com/",
        seletor: 'ytd-browse[page-subtype="home"]'
    }
]

var siteHome = sitesHome.filter(x => location.href.includes(x.host))[0];

console.log(siteHome);

if (siteHome) {
    console.log('Home');
    document.body.style.opacity = 0;
}

if (siteHome) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedHome);
    } else {
        afterDOMLoadedHome();
    }
}

var skipTime = 4;
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

                setTimeout(() => {
                    replaceHtml(html)
                }, 1000)
            }
        }
    }
    rawFile.send(null);
}

function replaceHtml(html) {

    if (document.querySelector(siteHome?.seletor)) {
        document.querySelector(siteHome?.seletor).innerHTML = html;
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

        var index = Number(localStorage.getItem('indexImagens'));
        index++;
        if (index >= links.length) {
            index = 0;
        }

        localStorage.setItem('indexImagens', index);

        document.title = `${(index + 1)}/${links.length} - Youtube`;
        img.src = links[index].imagem;
    }

    function trocarImagemInterval() {
        setTimeout(() => {
            trocarImagem();
            trocarImagemInterval();
        }, 1000 * 60 * 2);
    }

    document.body.style.opacity = 1;
}

var intervaloLimparHome = 0;

function tratamentoTelaInicial() {
    var oldHref = document.location.href;
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

                if (document.location.href.includes('https://www.youtube.com/shorts')) {
                    document.querySelector('video').pause();
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

    if (document.querySelector(siteHome?.seletor)) {
        document.querySelector(siteHome?.seletor).innerHTML = '';
    }
}

function afterDOMLoadedHome() {

    tratamentoTelaInicial();

    // if (document.location.href.includes('https://www.youtube#####.com')) {
    //     setInterval(() => {
    //         if (document.querySelector(siteHome?.seletor)) {
    //             document.querySelector(siteHome?.seletor).innerHTML = '';
    //         }
    //     }, 1000);

    //     for (let i = 0; i < 10; i++) {
    //         setTimeout(() => {
    //             if (document.querySelector(siteHome?.seletor)) {
    //                 document.querySelector(siteHome?.seletor).innerHTML = '';
    //             }
    //         }, (50 * i));
    //     }
    // }

    setTimeout(() => {
        readTextFile();
    }, 500);

    setTimeout(() => {
        for (let i = 0; i < links.length; i++) {
            const imagem = links[i].imagem;

            var oImg = document.createElement("img");
            oImg.setAttribute('src', imagem);

            var container = document.querySelector(`.imagens-cache`);
            if(container) {
                container.appendChild(oImg);
                container.style.display = 'none';
            }
        }
    }, 5000);

    setTimeout(() => {
        var title = document.title;

        document.addEventListener('keydown', function (e) {
            e = e || window.event;

            if (siteHome) {
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
        });
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
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/01.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/02.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/03.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/04.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/05.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/06.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/07.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/08.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/09.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/10.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/11.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/12.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/13.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/14.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/15.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/16.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/17.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/18.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/19.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/20.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/21.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/22.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/23.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/24.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/25.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/26.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/27.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/28.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/29.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/30.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/31.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/32.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/33.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/34.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/35.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/36.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/37.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/38.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/39.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/40.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/41.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/42.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/43.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/44.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/45.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/46.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/47.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/48.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/49.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/50.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/51.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/52.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/53.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/54.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/55.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/56.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/57.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/58.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/59.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/60.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/61.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/62.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/63.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/64.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/65.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/66.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/67.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/68.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/69.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/70.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/71.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/72.jpg' },
    { imagem: 'https://raw.githubusercontent.com/AntonioCesar96/youtube-imagens/refs/heads/main/73.jpg' },
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