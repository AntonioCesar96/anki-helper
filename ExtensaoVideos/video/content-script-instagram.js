if (location.host === "www.instagram.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedInstagram);
    } else {
        afterDOMLoadedInstagram();
    }
}

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

function afterDOMLoadedInstagram() {

    setTimeout(() => {
        var title = document.title;

        var playbackRate = false ? 0.1 : 0.05;

        document.addEventListener('keydown', function (e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.keyCode === 13) { // Enter
                video.currentTime = 0;
                video.muted = false;
                video.play();
            }

            if (e.keyCode == '110') { // ,
                video.currentTime = video.currentTime - 4;
                video.muted = false;
            }

            if (e.keyCode == '96') {
                video.currentTime = video.currentTime - 3;
                video.muted = false;
            }

            if (e.keyCode == '37') {  // seta esquerda
                video.currentTime = video.currentTime - 5;
                video.muted = false;
            }

            if (e.keyCode == '39') {  // seta esquerda
                video.currentTime = video.currentTime + 5;
                video.muted = false;
            }

            if (e.keyCode == '106') { // *
                if (video.playbackRate == 1) {
                    video.playbackRate = playbackRateAux;
                } else {
                    video.playbackRate = 1;
                }

                document.title = video.playbackRate + ' - ' + title;
            }

            if (e.keyCode == '107' || e.keyCode == '187') { // -
                video.playbackRate = Number((video.playbackRate + playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;

                playbackRateAux = video.playbackRate;
            }

            if (e.keyCode == '109' || e.keyCode == '189') { // +
                video.playbackRate = Number((video.playbackRate - playbackRate).toPrecision(3));
                document.title = video.playbackRate + ' - ' + title;

                playbackRateAux = video.playbackRate;
            }
        });
    }, 3000);
}
