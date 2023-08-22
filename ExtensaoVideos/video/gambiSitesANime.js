var playbackRate = false ? 0.1 : 0.05;
var title = document.title;
var playbackRateAtual = 1;
var idTimeoutVelocidade;

document.addEventListener('keydown', function (e) {

    var video = document.querySelector('video');

    if (e.keyCode == '96') { // 0
        video.currentTime = video.currentTime - 3;
    }

    if (e.keyCode == '110') { // ,
        video.currentTime = video.currentTime - 4;
    }

    if (e.code == 'KeyZ' || e.code == 'KeyX') {
        if (playbackRateAtual === 1) {
            playbackRateAtual = video.playbackRate;
        }

        if (video.playbackRate === 1) {
            video.playbackRate = playbackRateAtual;
        } else {
            video.playbackRate = 1;
        }

        mostrarVelocidade(video);
    }

    if (e.keyCode == '107' || e.keyCode == '187') { // -
        video.playbackRate = Number((video.playbackRate + playbackRate).toPrecision(3));
        playbackRateAtual = video.playbackRate;
        mostrarVelocidade(video);
    }

    if (e.keyCode == '109' || e.keyCode == '189') { // +
        video.playbackRate = Number((video.playbackRate - playbackRate).toPrecision(3));
        playbackRateAtual = video.playbackRate;
        mostrarVelocidade(video);
    }
});

function mostrarVelocidade(video) {
    clearTimeout(idTimeoutVelocidade);

    spanVelocidade.innerText = video.playbackRate;
    spanVelocidade.style.display = 'block';

    idTimeoutVelocidade = setTimeout(() => {
        spanVelocidade.style.display = 'none';
    }, 2000);
}

var spanVelocidade = document.createElement('span');
spanVelocidade.setAttribute('id', 'spanVelocidade');
spanVelocidade.innerText = document.querySelector('video')?.playbackRate;
spanVelocidade.style.padding = '8px 16px';
spanVelocidade.style.display = 'block';
spanVelocidade.style.border = 'none';
spanVelocidade.style.backgroundColor = '#000';
spanVelocidade.style.color = '#fff';
spanVelocidade.style.fontFamily = 'sans-serif';
spanVelocidade.style.cursor = 'pointer';
spanVelocidade.style.borderRadius = '5px';
spanVelocidade.style.position = 'fixed';
spanVelocidade.style.top = '10px';
spanVelocidade.style.left = '10px';

document.querySelector('video').parentElement.appendChild(spanVelocidade);

idTimeoutVelocidade = setTimeout(() => {
    spanVelocidade.style.display = 'none';
}, 2000);