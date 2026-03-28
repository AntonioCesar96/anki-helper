var botaoDireitoPronunciation = false;

if (location.host === "www.youtube.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedYoutube);
    } else {
        afterDOMLoadedYoutube();
    }


    (function () {
        let lastUrl = location.href;

        function isYoutubeHome(url) {
            return url === "https://www.youtube.com/" || url === "https://www.youtube.com";
        }

        function flashWhiteScreen() {
            // Evita duplicar
            if (document.getElementById("yt-white-flash")) return;

            const overlay = document.createElement("div");
            overlay.id = "yt-white-flash";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "#ffffff";
            overlay.style.zIndex = "999999";
            overlay.style.pointerEvents = "none";

            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.remove();
            }, 5000);
        }

        function checkUrlChange() {
            const currentUrl = location.href;

            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;

                if (isYoutubeHome(currentUrl)) {
                    //flashWhiteScreen();
                }
            }
        }

        // Observa mudanças de navegação SPA
        const observer = new MutationObserver(checkUrlChange);
        observer.observe(document, { childList: true, subtree: true });

        // Caso abra direto na home
        window.addEventListener("load", () => {
            if (isYoutubeHome(location.href)) {
                //flashWhiteScreen();
            }
        });
    })();

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
var playbackRateAux = 1.1;
var legendas = [];

var styleElementYoutube;
var esconderBarra = false;

function addstyleElementYoutube() {
    if (styleElementYoutube) {
        styleElementYoutube.parentElement.removeChild(styleElementYoutube);
    }

    styleElementYoutube = document.createElement('style');

    styleElementYoutube.innerHTML = ``;

    //styleElementYoutube.innerHTML += `ytd-browse[page-subtype="home"] #contents {  display: none !important; }`;
    //styleElementYoutube.innerHTML += `#related #items, #big-yoodle {  display: none !important; }`;

    styleElementYoutube.innerHTML += `body.efyt-mini-player._top-right #movie_player:not(.ytp-fullscreen), body.efyt-mini-player._bottom-right #movie_player:not(.ytp-fullscreen) { right: 300px !important}`;
    styleElementYoutube.innerHTML += `body._top-right #efyt-progress, body._bottom-right #efyt-progress { right: 300px !important}`;

    if (esconderBarra) {
        styleElementYoutube.innerHTML += `.caption-window.ytp-caption-window-bottom { margin-bottom: 0 !important; }`;
        styleElementYoutube.innerHTML += `.ytp-chrome-bottom, .ytp-gradient-bottom { display: none !important; }`;
        styleElementYoutube.innerHTML += `.jw-text-track-display {height: auto !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: ${posicaoLegendaRodapeSoaper}% !important; line-height: 1.27 !important;}  `;
    }

    document.head.appendChild(styleElementYoutube);
}

function getTitleYoutube() {
    var title = document.title.replace(/^(\d+(\.\d+)?\s*-\s*)*/, '');
    return title;
}

var playbackRateAuxInterval;
function playbackRateInterval() {
    if (playbackRateAuxInterval)
        clearInterval(playbackRateAuxInterval);

    playbackRateAuxInterval = setInterval(() => {
        var title = getTitleYoutube();
        if (!sessionStorage.getItem('playbackRateAux')) {
            clearInterval(playbackRateAuxInterval);
            return;
        }

        var video = getVideo();
        if (!video) {
            return;
        }

        const rate = Number(sessionStorage.getItem('playbackRateAux')).toPrecision(3);
        video.playbackRate = rate;
        playbackRateAux = video.playbackRate;

        if (!title.startsWith('' + rate)) {
            document.title = video.playbackRate + ' - ' + title;
            mostrarVelocidade();
        }
    }, 2000);
}

let onTimeUpdate222222;
function afterDOMLoadedYoutube() {

    addstyleElementYoutube();
/*
    // remove todas as opções e deixa somente a Musica clicada
    setInterval(() => {
        const chips = document.querySelectorAll('[page-subtype="home"] yt-chip-cloud-chip-renderer');

        chips.forEach(chip => {
            const text = chip.innerText?.trim();

            if (text === 'Música') {
                // Mantém visível
                chip.style.display = '';

                // Verifica se está ativo pelo critério correto
                const isActive = chip.querySelector('.ytChipShapeActive');

                // Clica se não estiver ativo
                if (!isActive) {
                    const button = chip.querySelector('button');
                    if (button) {
                        button.click();
                    }
                }
            } else {
                // Esconde os outros
                chip.style.display = 'none';
            }
        });

        document.querySelectorAll('ytd-playlist-panel-renderer, ytd-guide-renderer, [id="contents"]').forEach(function name(el) {
            el.style.filter = 'grayscale(100%)';
        });
    }, 1000);

    // remove o Todos das opções relacionadas e clica no segundo item para esconder videos e deixar musicas
    setInterval(() => {
        const chips = document.querySelectorAll('#related yt-chip-cloud-chip-renderer');

        if (chips.length < 2) return;

        const primeiro = chips[0];
        const segundo = chips[1];

        // Esconde o primeiro chip
        if (primeiro.style.display !== 'none') {
            primeiro.style.display = 'none';
        }

        // Verifica se o segundo NÃO está selecionado
        const botaoSegundo = segundo.querySelector('button[role="tab"]');
        const isSelecionado =
            segundo.hasAttribute('selected') ||
            botaoSegundo?.getAttribute('aria-selected') === 'true';

        // Clica apenas se ainda não tiver sido clicado
        if (!isSelecionado && botaoSegundo) {
            botaoSegundo.click();
        }
    }, 1000);
*/


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

    playbackRateInterval();

    setTimeout(() => {
        var title = getTitleYoutube();

        var playbackRate = false ? 0.1 : 0.05;

        fone();

        document.addEventListener('keydown', function (e) {
            e = e || window.event;
            var video = getVideo();
            var title = getTitleYoutube();

            console.log(e.keyCode);

            if (['PageUp', 'PageDown'].includes(e.code)) {
                e.preventDefault();
                e.stopPropagation();
            }


            // ----- PAGEDOWN -----
            if (e.code === 'PageDown') {
                video.currentTime = video.currentTime - 4;
                return;
            }

            if (e.code === 'PageUp') {
                video.currentTime = video.currentTime - 3;
                return;
            }

            if (e.key === '.') {
                esconderBarra = !esconderBarra;
                addstyleElementYoutube();
            }

            if (location.pathname.startsWith("/shorts")) {
                if (e.keyCode == '37') {  // seta esquerda
                    video.currentTime = video.currentTime - 5;
                }

                if (e.keyCode == '39') {  // seta esquerda
                    video.currentTime = video.currentTime + 5;
                }
            }

            if (e.keyCode == '110') { // ,
                video.currentTime = video.currentTime - 4;
            }

            if (e.keyCode == '96') { // zero
                video.currentTime = video.currentTime - 3;
                video.muted = false;
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

            if (e.keyCode == '111') { // *
                document.querySelectorAll('body').forEach(function name(el) {
                    if(el.style.filter){
                        el.style.filter = '';
                        return;
                    }
                    
                    el.style.filter = 'grayscale(100%)';
                });
            }

            if (e.keyCode == '106') { // *
                if (video.playbackRate == 1) {
                    video.playbackRate = playbackRateAux;
                    playbackRateInterval();
                } else {
                    video.playbackRate = 1;

                    if (playbackRateAuxInterval)
                        clearInterval(playbackRateAuxInterval);
                }

                document.title = video.playbackRate + ' - ' + title;
                mostrarVelocidade();
            }

            if (e.keyCode == '107' || e.keyCode == '187') { // -
                video.playbackRate = Number((video.playbackRate + playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;
                mostrarVelocidade();

                playbackRateAux = video.playbackRate;

                sessionStorage.setItem('playbackRateAux', playbackRateAux);
                playbackRateInterval();
            }

            if (e.keyCode == '109' || e.keyCode == '189') { // +
                video.playbackRate = Number((video.playbackRate - playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;
                mostrarVelocidade();

                playbackRateAux = video.playbackRate;

                sessionStorage.setItem('playbackRateAux', playbackRateAux);
                playbackRateInterval();
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

            if (e.keyCode == '69' && tempoInicial != 0 && tempoFinal != 0) { // E
                Rodar();
            }

            if (e.keyCode == '82') { // R
                if (onTimeUpdate222222) {
                    video.removeEventListener('timeupdate', onTimeUpdate222222);
                    console.log("timeupdate cancelado!")
                }
            }

            function Rodar() {
                const video = getVideo();

                // Remove listener anterior, caso exista
                if (onTimeUpdate222222) {
                    video.removeEventListener('timeupdate', onTimeUpdate222222);
                }

                video.currentTime = tempoInicial;
                video.muted = false;
                video.play();

                onTimeUpdate222222 = () => {
                    if (video.currentTime >= tempoFinal) {
                        video.currentTime = tempoInicial;
                    }
                };

                video.addEventListener('timeupdate', onTimeUpdate222222);
                console.log("timeupdate setado! Tempo Inicial: " + tempoInicial + " - Tempo Final: " + tempoFinal)
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

    function countSequences(n) {
        if (n <= 0) {
            return 0;
        }
        if (n === 1) {
            return 2; // Duas opções: pular ou dançar
        } else {
            let a1 = countSequences(n - 1);
            let a2 = countSequences(n - 2);

            return a1 + a2;
        }
    }

    const n = 3; // Número de etapas
    const totalSequences = countSequences(n);
    console.log("Número de sequências possíveis: " + totalSequences);

    setTimeout(() => {
        
        document.addEventListener('keydown', function (e) {

            let palavraMarcada = window.getSelection()?.toString().trim() ?? "";

            // if (e.ctrlKey === true && (e.keyCode == '220' || e.keyCode == '221')) { // ] [

            //     window.open("https://www.google.com/search?q=" + palavraMarcada + "+pronunciation+english");
            // }

            // if (e.ctrlKey === true && e.keyCode == '194') { // ] [

            //     window.open("https://context.reverso.net/traducao/ingles-portugues/" + palavraMarcada);
            // }

            if (e.ctrlKey === true && (e.keyCode == '220' || e.keyCode == '221')) { // ] [

                botaoDireitoPronunciation = !botaoDireitoPronunciation;
            }

        });



        function getSelectedText() {
        const sel = window.getSelection?.();
        const text = sel ? String(sel).trim() : "";
        if (text) return text;

        // Selection inside input/textarea
        const el = document.activeElement;
        if (
        el &&
        (el.tagName === "TEXTAREA" ||
            (el.tagName === "INPUT" && /text|search|url|email|tel|password/i.test(el.type)))
        ) {
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        return String(el.value || "").slice(start, end).trim();
        }

        return "";
    }

    function getWordFromTextNode(node, x, y) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return "";

        const text = node.textContent || "";
        if (!text.trim()) return "";

        const range = document.createRange();

        for (let i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);

        for (const rect of range.getClientRects()) {
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            // Expand to word (letters/numbers/_)
            let start = i;
            let end = i;

            while (start > 0 && /\w/.test(text[start - 1])) start--;
            while (end < text.length - 1 && /\w/.test(text[end + 1])) end++;

            return text.slice(start, end + 1).trim();
            }
        }
        }
        return "";
    }

    function getWordUnderCursor(e) {
        // If the user right-clicked on an input/textarea, try to use caret position
        const clickedEl = document.elementFromPoint(e.clientX, e.clientY);
        if (!clickedEl) return "";

        if (clickedEl.tagName === "INPUT" || clickedEl.tagName === "TEXTAREA") {
        const pos = clickedEl.selectionStart;
        if (pos == null) return "";
        const t = clickedEl.value || "";

        let start = Math.min(pos, t.length);
        let end = Math.min(pos, t.length);

        while (start > 0 && /\w/.test(t[start - 1])) start--;
        while (end < t.length && /\w/.test(t[end])) end++;

        return t.slice(start, end).trim();
        }

        // Modern best-effort: caret range from point (fast)
        const caretRange =
        document.caretRangeFromPoint?.(e.clientX, e.clientY) ||
        document.caretPositionFromPoint?.(e.clientX, e.clientY);

        if (caretRange) {
        let node, offset;
        if (caretRange.startContainer) {
            node = caretRange.startContainer;
            offset = caretRange.startOffset;
        } else if (caretRange.offsetNode) {
            node = caretRange.offsetNode;
            offset = caretRange.offset;
        }

        if (node && node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            if (!text.trim()) return "";

            let i = Math.max(0, Math.min(offset, text.length - 1));
            // If we landed on whitespace, try move left/right a bit
            if (!/\w/.test(text[i])) {
            if (i > 0 && /\w/.test(text[i - 1])) i = i - 1;
            else if (i < text.length - 1 && /\w/.test(text[i + 1])) i = i + 1;
            else return "";
            }

            let start = i;
            let end = i;
            while (start > 0 && /\w/.test(text[start - 1])) start--;
            while (end < text.length - 1 && /\w/.test(text[end + 1])) end++;

            return text.slice(start, end + 1).trim();
        }
        }

        // Fallback: walk text nodes under clicked element and hit-test rectangles
        const walker = document.createTreeWalker(clickedEl, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
        const w = getWordFromTextNode(n, e.clientX, e.clientY);
        if (w) return w;
        }

        return "";
    }

    function pickEnglishVoice() {
        const voices = speechSynthesis.getVoices() || [];
        return (
        voices.filter(v => v.voiceURI == "Microsoft Andrew Online (Natural) - English (United States)")[0] ||
        voices.find(v => /^en-US/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang)) ||
        voices[0] ||
        null
        );
    }

    function speak(text) {
        if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        alert("Your browser doesn't support Speech Synthesis.");
        return;
        }

        speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 0.7;
        u.pitch = 1;

        const v = pickEnglishVoice();
        if (v) u.voice = v;

        speechSynthesis.speak(u);
    }

    // Ensure voices get loaded in browsers that do it async
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();

    document.addEventListener(
        "contextmenu",
        (e) => {
            if(!botaoDireitoPronunciation) {
                if (!e.ctrlKey) return;
            }
            const selected = getSelectedText();
            const text = selected || getWordUnderCursor(e);
            if (!text) return;

            e.preventDefault(); // hide context menu for this action
            speak(text);
        },
        true
    );
    }, 1000);

}

function mostrarVelocidade() {
    const titleEl = document.querySelector('#title h1');
    if (titleEl && titleEl.textContent?.trim() !== document.title) {
        titleEl.textContent = document.title.replace('- YouTube', '');
    }

    if (!getVideo()) {
        return;
    }

    if (getVideo()?.playbackRate == 1) {
        document.getElementById('spanVelocidade')?.remove();
        return;
    }

    document.getElementById('spanVelocidade')?.remove();

    var spanVelocidade = document.createElement('span');
    spanVelocidade.setAttribute('id', 'spanVelocidade');
    spanVelocidade.innerText = getVideo()?.playbackRate;
    spanVelocidade.style.padding = '2px 5px 1px';
    spanVelocidade.style.display = 'block';
    spanVelocidade.style.border = 'none';
    spanVelocidade.style.backgroundColor = '#000';
    spanVelocidade.style.color = '#fff';
    spanVelocidade.style.fontFamily = 'sans-serif';
    spanVelocidade.style.cursor = 'pointer';
    spanVelocidade.style.borderRadius = '5px';
    spanVelocidade.style.position = 'absolute';
    spanVelocidade.style.top = '3px';
    spanVelocidade.style.left = '3px';
    spanVelocidade.style.opacity = '.5';

    document.querySelector('#container video').parentElement.style.position = 'relative';
    document.querySelector('#container video').parentElement.appendChild(spanVelocidade);
}

