if (location.host === "www.netflix.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMNetflix222);
    } else {
        afterDOMNetflix222();
    }
}

function inject() {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('netflix-rewind-2-sec.js');
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

var legendas = [];

function afterDOMNetflix222() {
    console.log('Fone Helper Rodando! - Netflix');

    inject();

    setInterval(() => {
        var legenda = pegarLegendaNetflix();
        if (!legenda) {
            return;
        }

        var achou = legendas.filter(x => x == legenda);
        if (achou.length === 0) {
            legendas.push(legenda);
        }

    }, 250);

    setTimeout(() => {

        document.addEventListener('keydown', checkKey);

        async function checkKey(e) {
            e = e || window.event;

            if (e.keyCode == '192') { // . /
                var legenda = pegarLegendaNetflix();
                if (!legenda) {
                    return;
                }

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

function pegarLegendaNetflix() {
    var legenda = document.querySelector('.player-timedtext')?.innerText;
    if (!legenda) {
        let qualLegendaCopiar = localStorage.getItem('qualLegendaCopiar');
        legenda = document.getElementById(`${qualLegendaCopiar}`)?.innerText;
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