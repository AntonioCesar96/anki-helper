if (location.host === "www.instagram.com" || location.origin === 'file://') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedInstagram);
    } else {
        afterDOMLoadedInstagram();
    }
}

function getVideo() {
    var videos = document.querySelectorAll('video');
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].className != 'tst-video-overlay-player-html5') {
            return videos[i];
        }
    }
    return null;
}

var tempoInicial = 0, tempoFinal = 0;
let onTimeUpdate;
let tempoInicialInput, tempoFinalInput;

// variável de controle (true por padrão)
let useGrayscale = false;

function afterDOMLoadedInstagram() {

    setTimeout(() => {
        // cria o botão
        const toggleBtn = document.createElement('div');
        toggleBtn.innerText = 'GS';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.left = '20px';
        toggleBtn.style.width = '25px';
        toggleBtn.style.height = '25px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.background = '#000';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontWeight = 'bold';
        toggleBtn.style.zIndex = '999999';
        toggleBtn.style.opacity = '0.7';

        // efeito visual de ligado/desligado
        function updateButtonStyle() {
            toggleBtn.style.background = useGrayscale ? '#000' : '#888';
        }

        // clique do botão
        toggleBtn.addEventListener('click', () => {
            useGrayscale = !useGrayscale;
            updateButtonStyle();
        });

        // adiciona o botão à página
        document.body.appendChild(toggleBtn);
        updateButtonStyle();
    }, 5000);

    setInterval(() => {

        if (location.host === 'www.instagram.com') {
            document.querySelectorAll('video').forEach(function name(video) {
                video.volume = .3
            });

            document
                .querySelectorAll('body, [data-pagelet="IGDChatTabsRootContent"], a[href="/direct/inbox/"]')
                .forEach(function name(el) {
                    el.style.filter = useGrayscale ? 'grayscale(100%)' : '';
                });
        }
    }, 1000);

    setTimeout(() => {
        if (location.origin === 'file://') {
            //criarPainelControles();

            // recuperar valores salvos
            let saved = localStorage.getItem("crop_" + location.href);
            if (saved) {
                try {
                    let obj = JSON.parse(saved);
                    tempoInicial = obj.inicio || 0;
                    tempoFinal = obj.fim || 0;
                    if (tempoInicialInput) tempoInicialInput.value = tempoInicial;
                    if (tempoFinalInput) tempoFinalInput.value = tempoFinal;
                } catch (e) { }
            }

            var video = getVideo();
            onTimeUpdate = () => {
                if (video.currentTime >= video.duration) {
                    video.currentTime = 0;
                    video.play();
                }
            };
            video.addEventListener('timeupdate', onTimeUpdate);
        }

        document.addEventListener('keydown', function (e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.keyCode == '81') { // Q
                tempoInicial = video.currentTime;
                if (tempoInicialInput) tempoInicialInput.value = tempoInicial;
                if (location.origin === 'file://') {
                    localStorage.setItem("crop_" + location.href, JSON.stringify({ inicio: tempoInicial, fim: tempoFinal }));
                }
            }

            if (e.keyCode == '87') { // W
                tempoFinal = video.currentTime;
                if (tempoFinalInput) tempoFinalInput.value = tempoFinal;
                if (location.origin === 'file://') {
                    localStorage.setItem("crop_" + location.href, JSON.stringify({ inicio: tempoInicial, fim: tempoFinal }));
                }
            }

            if (e.keyCode == '69' && tempoInicial != 0 && tempoFinal != 0) { // E
                Rodar();
            }

            if (e.keyCode == '82') { // R
                pararLoop();
            }


            //if (location.origin === 'file://') {
            if (e.keyCode == '37') {  // seta esquerda
                video.currentTime = video.currentTime - 5;
            }

            if (e.keyCode == '39') {  // seta esquerda
                video.currentTime = video.currentTime + 5;
            }


            if (e.keyCode == '110') { // ,
                video.currentTime = video.currentTime - 2;
            }

            if (e.keyCode == '96') { // zero
                video.currentTime = video.currentTime - 1;
                video.muted = false;
            }

            if (e.keyCode == '13') { // zero
                video.currentTime = tempoInicial;
                video.muted = false;
            }
            //}
        });

        function Rodar() {
            const video = getVideo();
            if (onTimeUpdate) {
                video.removeEventListener('timeupdate', onTimeUpdate);
            }
            video.currentTime = tempoInicial;
            video.muted = false;
            video.play();
            onTimeUpdate = () => {
                if (tempoFinal > 0 && video.currentTime >= tempoFinal) {
                    video.currentTime = tempoInicial;
                }
                if (video.currentTime >= video.duration) {
                    video.currentTime = tempoInicial;
                    video.play();
                }
            };
            video.addEventListener('timeupdate', onTimeUpdate);
            console.log("Rodando do " + tempoInicial + " até " + tempoFinal);
        }

        function pararLoop() {
            const video = getVideo();
            if (onTimeUpdate) {
                video.removeEventListener('timeupdate', onTimeUpdate);
                onTimeUpdate = null;
                console.log("Loop cancelado!");

                onTimeUpdate = () => {
                    if (video.currentTime >= video.duration) {
                        video.currentTime = 0;
                        video.play();
                    }
                };
                video.addEventListener('timeupdate', onTimeUpdate);
            }
            //video.pause();
        }

        function criarPainelControles() {
            const panel = document.createElement("div");
            panel.id = "controls-panel";
            document.body.appendChild(panel);

            // estilos via JS
            panel.style.position = "fixed";
            panel.style.top = "10px";
            panel.style.left = "10px";
            panel.style.background = "rgba(0,0,0,0.7)";
            panel.style.color = "white";
            panel.style.padding = "10px";
            panel.style.borderRadius = "10px";
            panel.style.fontFamily = "sans-serif";

            // input início
            const lblIni = document.createElement("label");
            lblIni.innerText = "Início:";
            lblIni.style.marginRight = "5px";

            tempoInicialInput = document.createElement("input");
            tempoInicialInput.type = "number";
            tempoInicialInput.style.width = "80px";
            tempoInicialInput.style.margin = "5px";
            tempoInicialInput.style.textAlign = "center";

            // atualizar variável ao editar
            tempoInicialInput.addEventListener("change", () => {
                tempoInicial = parseFloat(tempoInicialInput.value) || 0;
                if (location.origin === 'file://') {
                    localStorage.setItem("crop_" + location.href, JSON.stringify({ inicio: tempoInicial, fim: tempoFinal }));
                }
            });

            panel.appendChild(lblIni);
            panel.appendChild(tempoInicialInput);
            panel.appendChild(document.createElement("br"));

            // input fim
            const lblFim = document.createElement("label");
            lblFim.innerText = "Fim:";
            lblFim.style.marginRight = "5px";

            tempoFinalInput = document.createElement("input");
            tempoFinalInput.type = "number";
            tempoFinalInput.style.width = "80px";
            tempoFinalInput.style.margin = "5px";
            tempoFinalInput.style.textAlign = "center";

            // atualizar variável ao editar
            tempoFinalInput.addEventListener("change", () => {
                tempoFinal = parseFloat(tempoFinalInput.value) || 0;
                if (location.origin === 'file://') {
                    localStorage.setItem("crop_" + location.href, JSON.stringify({ inicio: tempoInicial, fim: tempoFinal }));
                }
            });

            panel.appendChild(lblFim);
            panel.appendChild(tempoFinalInput);
            panel.appendChild(document.createElement("br"));

            // botão play
            const playBtn = document.createElement("button");
            playBtn.innerText = "▶ Play (E)";
            playBtn.style.margin = "5px";
            playBtn.style.padding = "5px 10px";
            playBtn.style.borderRadius = "5px";
            playBtn.style.border = "none";
            playBtn.style.cursor = "pointer";
            playBtn.onclick = () => {
                if (tempoInicial != 0 && tempoFinal != 0) Rodar();
            };

            // botão pause
            const pauseBtn = document.createElement("button");
            pauseBtn.innerText = "⏸ Cancelar (R)";
            pauseBtn.style.margin = "5px";
            pauseBtn.style.padding = "5px 10px";
            pauseBtn.style.borderRadius = "5px";
            pauseBtn.style.border = "none";
            pauseBtn.style.cursor = "pointer";
            pauseBtn.onclick = () => {
                pararLoop();
            };

            panel.appendChild(playBtn);
            panel.appendChild(pauseBtn);
        }
    }, 1000);

    setTimeout(() => {
        if (location.origin === 'file://') {
            let videoElement = getVideo();
            videoElement.style.width = '75%';
            videoElement.style.height = '85%';
            videoElement.style.marginBottom = 'auto';
            videoElement.style.top = '0';
            videoElement.style.bottom = 'auto';

            videoElement.pause();
        }

    }, 50);
}
