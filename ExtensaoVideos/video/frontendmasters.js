// Proporção inicial
let drawerWidth = window.innerWidth * 0.36;
let videoWidth = window.innerWidth - drawerWidth;

// Elementos
const drawer = document.querySelector('.FMPlayer2-BottomDrawer');
const videoContainer = document.querySelector('.FMPlayer2-VideoContainer');

// Estilos base do drawer
Object.assign(drawer.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    height: '100%',
    width: drawerWidth + 'px',
    background: '#000',
    zIndex: '99999',
    display: 'flex',
    boxSizing: 'border-box'
});

// Estilo inicial do vídeo
videoContainer.style.width = videoWidth + 'px';

// === Resizer (barra lateral esquerda) ===
const resizer = document.createElement('div');
Object.assign(resizer.style, {
    width: '6px',
    cursor: 'ew-resize',
    background: '#333',
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    zIndex: '10'
});

drawer.appendChild(resizer);

// === Lógica de resize ===
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const newDrawerWidth = window.innerWidth - e.clientX;

    const minWidth = 250;
    const maxWidth = window.innerWidth * 0.8;

    if (newDrawerWidth < minWidth || newDrawerWidth > maxWidth) return;

    // Atualiza drawer
    drawer.style.width = newDrawerWidth + 'px';

    // Atualiza vídeo respeitando o espaço restante
    videoContainer.style.width = (window.innerWidth - newDrawerWidth) + 'px';
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = 'default';
});


var transcriptsText = document.querySelector('.FMPlayer2-BottomDrawer .transcripts');
transcriptsText.style.fontSize = '20px';


const legendas = [];
var tempoInicial, tempoFinal, onTimeUpdate;


document.addEventListener('keydown', function (e) {
    e = e || window.event;
    var video = document.querySelector('video');

    console.log(e.keyCode);
    
    if (e.keyCode == '110') { // ,
        video.currentTime = video.currentTime - 6;
    }

    if (e.keyCode == '96') { // zero
        video.currentTime = video.currentTime - 4;
    }

    if (e.keyCode == '90') { // zzzzzzzzzzzzzzz
        tempoInicial = video.currentTime;
         console.log("tempoInicial: " + tempoInicial);
    }

    if (e.keyCode == '88') { // xxxxxxxxxxxxxxx
        tempoFinal = video.currentTime;
        console.log("tempoFinal: " + tempoFinal);
    }

    if (e.keyCode == '13' && tempoInicial != 0 && tempoFinal != 0) { // Enter
        Rodar();
    }

    if (e.keyCode == '46') { // Del
        pararLoop();
    }

    function Rodar() {
        const video = document.querySelector('video');
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
        const video = document.querySelector('video');
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
    }
});