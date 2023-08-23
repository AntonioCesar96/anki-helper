if (location.host === "www.youtube.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedYoutube2);
    } else {
        afterDOMLoadedYoutube2();
    }
}

var skipTime = 4;
var tempoInicial = 0;
var tempoFinal = 0;
var tempo = 0;
var timer = 0;
var styleElementYoutube2;
var esconderBarra = false;

var startHoursInput;
var endHoursInput;
var toggleCheckboxRepetir;
var toggleCheckboxPular;

var dadosYoutube;

function repetirVideo() {
    if (this.currentTime >= fimSeconds) {
        this.currentTime = inicioSeconds;
    }
}

function afterDOMLoadedYoutube2() {

    dadosYoutube = getObjectFromLocalStorage();

    addstyleElementYoutube2();

    let intervalAddTimer = setInterval(() => {
        if (!document.querySelector('#below')) {
            return;
        }
        clearInterval(intervalAddTimer);

        document.querySelector('#below').appendChild(AAAAAAAAAAAAA());

        tratarVideo();

        function handleHashChange(event) {
            console.log("Fragmento da URL foi modificado para:", window.location.search);
            dadosYoutube = getObjectFromLocalStorage();
            redefinirTimer();
            tratarVideo();
        }

        window.addEventListener("yt-navigate-finish", handleHashChange);

    }, 300);

    setTimeout(() => {
        document.addEventListener('keydown', function (e) {
            e = e || window.event;
            console.log(e.keyCode);

            if (e.keyCode == '65') { // A
                document.querySelector('#startHoursInput').value = document.querySelector('.ytp-time-current').textContent;

                dadosYoutube = getObjectFromLocalStorage();
                dadosYoutube.inicio = document.querySelector('#startHoursInput').value;
                let inicioParts = dadosYoutube.inicio.split(":");
                dadosYoutube.inicioSecs = parseInt(inicioParts[0]) * 60 + parseFloat(inicioParts[1]);

                dadosYoutube.pular = false;
                dadosYoutube.repetir = false;

                toggleCheckboxPular.setAttribute("aria-checked", dadosYoutube.pular);
                toggleCheckboxRepetir.setAttribute("aria-checked", dadosYoutube.repetir);

                saveObjectToLocalStorage(dadosYoutube);
            }

            if (e.keyCode == '83') { // S
                document.querySelector('#endHoursInput').value = document.querySelector('.ytp-time-current').textContent;

                dadosYoutube = getObjectFromLocalStorage();
                dadosYoutube.fim = document.querySelector('#endHoursInput').value;

                var fimParts = dadosYoutube.fim.split(":");
                dadosYoutube.fimSecs = parseInt(fimParts[0]) * 60 + parseFloat(fimParts[1]);

                dadosYoutube.pular = false;
                dadosYoutube.repetir = false;

                toggleCheckboxPular.setAttribute("aria-checked", dadosYoutube.pular);
                toggleCheckboxRepetir.setAttribute("aria-checked", dadosYoutube.repetir);

                saveObjectToLocalStorage(dadosYoutube);
            }

            if (e.keyCode == '68') { // D
                const elem = document.createElement('textarea');
                elem.value = localStorage.getItem('DADOS-YOUTUBE');
                document.body.appendChild(elem);
                elem.select();
                document.execCommand('copy');
                document.body.removeChild(elem);
            }
        });
    }, 3000);

    function keyboard_event_handler(e) {
        // Don't prevent entering numbers in input areas
        if (e.target.tagName == 'INPUT' ||
            e.target.tagName == 'SELECT' ||
            e.target.tagName == 'TEXTAREA' ||
            e.target.isContentEditable) {
            return;
        }
        // Trap number keys
        if ((e.code >= 'Digit0' && e.code <= 'Digit9') || (e.code >= 'Numpad0' && e.code <= 'Numpad9')) {
            e.stopImmediatePropagation();
        }
    }
    window.addEventListener('keydown', keyboard_event_handler, true);
}

function redefinirTimer() {
    startHoursInput.value = dadosYoutube.inicio;
    endHoursInput.value = dadosYoutube.fim;
    toggleCheckboxPular.setAttribute("aria-checked", dadosYoutube.pular);
    toggleCheckboxRepetir.setAttribute("aria-checked", dadosYoutube.repetir);
}

function tratarVideo() {
    
    let intervalAddTimer = setInterval(() => {
        let videoElement = getVideo();
        if (!videoElement || videoElement.readyState !== 4) {
            return;
        }

        clearInterval(intervalAddTimer);

        videoElement.removeEventListener("timeupdate", timeupdate);
        videoElement.addEventListener("timeupdate", timeupdate);

        if (dadosYoutube.repetir || (getQueryParamValue('list') && dadosYoutube.pular)) {
            videoElement.currentTime = dadosYoutube.inicioSecs;
            videoElement.play();
        }
    }, 10);
}

function timeupdate() {
    if (dadosInvalidos()) {
        return;
    }

    if (dadosYoutube.repetir && this.currentTime >= dadosYoutube.fimSecs) {
        this.currentTime = dadosYoutube.inicioSecs;
    }

    if (getQueryParamValue('list') && dadosYoutube.pular && this.currentTime >= dadosYoutube.fimSecs) {
        dadosYoutube = criaDadosYoutubeVazio();
        redefinirTimer();
        document.querySelector('a[title="Next (SHIFT+n)"]')?.click();
    }
}

function dadosInvalidos() {
    return (dadosYoutube.inicio === "0:00" && dadosYoutube.fim === "0:00") ||
        (dadosYoutube.fimSecs - dadosYoutube.inicioSecs) <= 1;
}

// function saveObjectToLocalStorage(obj) {
//     var serializedObj = JSON.stringify(obj);
//     localStorage.setItem(obj.videoId, serializedObj);

//     console.log(serializedObj);
// }

// function getObjectFromLocalStorage() {
//     var serializedObj = localStorage.getItem(getQueryParamValue('v'));
//     if (!serializedObj) {
//         serializedObj = criaDadosYoutubeVazio();
//         saveObjectToLocalStorage(serializedObj);
//         return serializedObj;
//     }
//     return JSON.parse(serializedObj);
// }

function saveObjectToLocalStorage(obj) {
    let tituloVideo = document.querySelector('#above-the-fold #title')?.textContent?.replace(/\n/g, "")?.trim();
    obj.tituloVideo = tituloVideo;

    var storedData = getObjectDadosYoutubeFromLocalStorage();
    storedData[obj.videoId] = obj;

    localStorage.setItem("DADOS-YOUTUBE", JSON.stringify(storedData));
}

function getObjectFromLocalStorage() {
    var storedData = getObjectDadosYoutubeFromLocalStorage();
    var serializedObj = storedData[getQueryParamValue('v')];

    if (!serializedObj) {
        serializedObj = criaDadosYoutubeVazio();
        storedData[serializedObj.videoId] = serializedObj;
        localStorage.setItem("DADOS-YOUTUBE", JSON.stringify(storedData));

        return serializedObj;
    }

    return serializedObj;
}

function getObjectDadosYoutubeFromLocalStorage() {
    var storedData = localStorage.getItem("DADOS-YOUTUBE");
    if (!storedData) {
        storedData = {};
        localStorage.setItem("DADOS-YOUTUBE", JSON.stringify(storedData));
    } else {
        storedData = JSON.parse(storedData);
    }

    for (var key in storedData) {
        if (storedData[key].inicio === "0:00" && storedData[key].fim === "0:00") {
            delete storedData[key];
        }
    }

    localStorage.setItem("DADOS-YOUTUBE", JSON.stringify(storedData));

    return storedData;
}

function criaDadosYoutubeVazio() {
    return {
        videoId: getQueryParamValue('v'),
        inicio: "0:00",
        inicioSecs: 0,
        fim: "0:00",
        fimSecs: 0,
        repetir: false,
        pular: false
    };
}

function AAAAAAAAAAAAA() {
    const loopPanel = document.createElement("div");
    loopPanel.id = "efyt-loop-panel2";

    const startDiv = document.createElement("div");
    const startSpan = document.createElement("span");
    startSpan.setAttribute("data-message", "loop_start2");
    startSpan.textContent = "Iniciar";
    startDiv.appendChild(startSpan);

    const startHoursLabel = document.createElement("label");
    startHoursLabel.classList.add("hours");

    startHoursInput = document.createElement("input");
    startHoursInput.setAttribute("id", "startHoursInput");
    startHoursInput.type = "text";
    startHoursInput.name = "start-hours";
    startHoursInput.value = dadosYoutube.inicio;
    startHoursInput.addEventListener('input', function () {
        dadosYoutube.inicio = startHoursInput.value;
        let inicioParts = dadosYoutube.inicio.split(":");
        dadosYoutube.inicioSecs = parseInt(inicioParts[0]) * 60 + parseFloat(inicioParts[1]);

        toggleCheckboxPular.setAttribute("aria-checked", false);
        dadosYoutube.pular = false;
        toggleCheckboxRepetir.setAttribute("aria-checked", false);
        dadosYoutube.repetir = false;

        saveObjectToLocalStorage(dadosYoutube);
    });

    startHoursLabel.appendChild(startHoursInput);
    startDiv.appendChild(startHoursLabel);

    const endDiv = document.createElement("div");
    const endSpan = document.createElement("span");
    endSpan.setAttribute("data-message", "loop_end2");
    endSpan.textContent = "Parar";
    endDiv.appendChild(endSpan);

    const endHoursLabel = document.createElement("label");
    endHoursLabel.classList.add("hours");

    endHoursInput = document.createElement("input");
    endHoursInput.setAttribute("id", "endHoursInput");
    endHoursInput.type = "text";
    endHoursInput.name = "end-hours";
    endHoursInput.value = dadosYoutube.fim;
    endHoursInput.addEventListener('input', function () {
        dadosYoutube.fim = endHoursInput.value;
        var fimParts = dadosYoutube.fim.split(":");
        dadosYoutube.fimSecs = parseInt(fimParts[0]) * 60 + parseFloat(fimParts[1]);

        toggleCheckboxPular.setAttribute("aria-checked", false);
        dadosYoutube.pular = false;
        toggleCheckboxRepetir.setAttribute("aria-checked", false);
        dadosYoutube.repetir = false;

        saveObjectToLocalStorage(dadosYoutube);
    });

    endHoursLabel.appendChild(endHoursInput);
    endDiv.appendChild(endHoursLabel);

    toggleCheckboxPular = document.createElement("div");
    toggleCheckboxPular.classList.add("toggle-checkbox");
    toggleCheckboxPular.setAttribute("title", "Pular");
    toggleCheckboxPular.setAttribute("aria-checked", dadosYoutube.pular);

    toggleCheckboxPular.addEventListener("click", (e) => {
        let checked = toggleCheckboxPular.getAttribute("aria-checked") == "true" ? false : true;
        toggleCheckboxPular.setAttribute("aria-checked", checked);
        dadosYoutube.pular = checked;

        toggleCheckboxRepetir.setAttribute("aria-checked", false);
        dadosYoutube.repetir = false;

        saveObjectToLocalStorage(dadosYoutube);

        if (checked && !dadosInvalidos() && getQueryParamValue('list')) {
            let videoElement = getVideo();
            videoElement.currentTime = dadosYoutube.inicioSecs;
            videoElement.play();
        }
    });

    toggleCheckboxRepetir = document.createElement("div");
    toggleCheckboxRepetir.classList.add("toggle-checkbox");
    toggleCheckboxRepetir.setAttribute("aria-checked", dadosYoutube.repetir);
    toggleCheckboxRepetir.setAttribute("title", "Repetir");

    toggleCheckboxRepetir.addEventListener("click", (e) => {
        let checked = toggleCheckboxRepetir.getAttribute("aria-checked") == "true" ? false : true;
        toggleCheckboxRepetir.setAttribute("aria-checked", checked);
        dadosYoutube.repetir = checked;

        toggleCheckboxPular.setAttribute("aria-checked", false);
        dadosYoutube.pular = false;

        saveObjectToLocalStorage(dadosYoutube);

        if (checked && !dadosInvalidos()) {
            let videoElement = getVideo();
            videoElement.currentTime = dadosYoutube.inicioSecs;
            videoElement.play();
        }
    });

    loopPanel.appendChild(startDiv);
    loopPanel.appendChild(endDiv);
    loopPanel.appendChild(toggleCheckboxPular);
    loopPanel.appendChild(toggleCheckboxRepetir);

    return loopPanel;
}

function minutesSecondsToMilliseconds(timeStr) {
    let splitTempo = timeStr.split(':');

    let minutos = parseInt(splitTempo[0]);
    let segundos = parseFloat(splitTempo[1]);

    let milliseconds = (minutos * 60 + segundos) * 1000;

    return milliseconds;
}

function getVideo() {
    let videos = document.querySelectorAll('video');
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].className != 'tst-video-overlay-player-html5') {
            return videos[i];
        }
    }
    return null;
}

function getQueryParamValue(paramName) {
    let queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(paramName);
}

function addstyleElementYoutube2() {
    if (styleElementYoutube2) {
        styleElementYoutube2.parentElement.removeChild(styleElementYoutube2);
    }

    styleElementYoutube2 = document.createElement('style');

    styleElementYoutube2.innerHTML = ``;

    styleElementYoutube2.innerHTML = `
        #efyt-loop-panel2 {
            background-color: rgba(28, 28, 28, 0.8);
            border-radius: 4px;
            bottom: 1.5em;
            color: #fff;
            direction: ltr;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            font-size: 1.1em;
            padding: 8px;
            position: absolute;
            z-index: 63;
            position: absolute;
            top: -6px;
            right: 0;
            height: 20px;
        }

        #efyt-loop-panel2 div:not(:last-child) {
            margin-right: 4px;
        }

        #efyt-loop-panel2 span {
            margin-right: 2px;
        }

        [hidden] {
            display: none!important;
        }

        #efyt-loop-panel2 input {
            width: 3em;
        }

        #efyt-loop-panel2 .toggle-checkbox {
            height: 14px;
            width: 36px;
            position: relative;
            border-radius: 14px;
            background-color: rgba(255, 255, 255, 0.3);
            transition: all .08s cubic-bezier(0.4, 0.0, 1, 1);
            transform: scale(1);
            cursor: pointer;
          }
          .ytp-big-mode #efyt-loop-panel2 .toggle-checkbox {
            height: 18px;
            width: 45px;
            border-radius: 18px;
          }
          #efyt-loop-panel2 .toggle-checkbox[aria-checked="true"] {
            background-color: var(--main-color, #f00);
          }
          #efyt-loop-panel2 .toggle-checkbox:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            border-radius: 20px;
            margin-top: -3px;
            background-color: #bdbdbd;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, .6);
            transition: all .08s cubic-bezier(0.4, 0.0, 1, 1);
          }
          .ytp-big-mode #efyt-loop-panel2 .toggle-checkbox:after {
            left: 0;
            height: 26px;
            width: 26px;
            border-radius: 26px;
            margin-top: -4px;
          }
          #efyt-loop-panel2 .toggle-checkbox[aria-checked="true"]:after {
            background-color: #fff;
            transform: translateX(16px);
          }
          .ytp-big-mode #efyt-loop-panel2 .toggle-checkbox[aria-checked="true"]:after {
            transform: translateX(20px);
          }
    `;

    document.head.appendChild(styleElementYoutube2);
}