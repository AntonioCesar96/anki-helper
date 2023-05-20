if (location.host === "www.disneyplus.com" || location.host === "www.starplus.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMDisney);
    } else {
        afterDOMDisney();
    }
}

function afterDOMDisney() {
    console.log('Fone Helper Rodando! - disney ou starplus');

    setTimeout(() => {

        document.onkeydown = checkKey;

        async function checkKey(e) {
            e = e || window.event;
            var video = getVideo();

            console.log(e.keyCode);

            if (e.keyCode == '96') { // 0
                // voltarNoTempo(skipTime)
                video.currentTime = video.currentTime - 4;
            }

            if (e.keyCode == '110') { // ` '
                // voltarNoTempo(7)
                video.currentTime = video.currentTime - 7;
            }
        }
    }, 5000);
}