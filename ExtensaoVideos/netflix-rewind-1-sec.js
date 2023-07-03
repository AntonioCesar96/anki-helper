window.netflixRewindPlugin = {};
window.netflixRewindPlugin.player = undefined;

window.netflixRewindPlugin.seek = function (e) {
    if (window.netflixRewindPlugin.player) {
        let currentTime = window.netflixRewindPlugin.player.getCurrentTime();
        switch (e.key) {
            case '0':
                window.netflixRewindPlugin.player.seek(currentTime - 4 * 1000);
                break;
            case ',':
                window.netflixRewindPlugin.player.seek(currentTime - 7 * 1000);
                break;
        }
    } else {
        window.netflixRewindPlugin.initPluginLogic();
    }
}

window.netflixRewindPlugin.initPluginLogic = function () {

    window.netflixRewindPlugin.foneNetflix();

    if (netflix && netflix.appContext && netflix.appContext.state
        && netflix.appContext.state.playerApp
        && netflix.appContext.state.playerApp.getAPI()
        && netflix.appContext.state.playerApp.getAPI().videoPlayer) {

        let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        let playerSessionId;

        if (videoPlayer.getAllPlayerSessionIds() && videoPlayer.getAllPlayerSessionIds()[0]) {

            playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];

            window.netflixRewindPlugin.player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
        }
    }
}

window.netflixRewindPlugin.foneNetflix = function () {
    if (!navigator.mediaSession) {
        return;
    }

    navigator.mediaSession.setActionHandler('previoustrack', function () {

        console.log('previoustrack');

        let currentTime = window.netflixRewindPlugin.player.getCurrentTime();
        window.netflixRewindPlugin.player.seek(currentTime - 6 * 1000);
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        // voltar 6 segundos e então mudar legenda, o elemento precisa estar visivel, ele
        // so fica visivel quando voltando 6 segundos
        // dps de voltar uma vez com o botao de previous o elemento fica travado visivel toda hora, então da pra 
        // mudar o idioma sem precisar voltar 6 segundos
        if (!document.querySelector('button[aria-label="Idioma e legendas"]')) {
            return;
        }

        let currentTime = window.netflixRewindPlugin.player.getCurrentTime();
        window.netflixRewindPlugin.player.seek(currentTime - 7 * 1000);

        document.querySelector('button[aria-label="Idioma e legendas"]').click();

        var audioInglesSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês"]');
        var audioInglesOriginalSelected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original] (5.1)"]');
        var audioInglesOriginal5Selected = document.querySelector('li[data-uia="audio-item-selected-Inglês [original]"]');

        if (audioInglesSelected || audioInglesOriginalSelected || audioInglesOriginal5Selected) {

            let audioPortugues = document.querySelector('li[data-uia="audio-item-Português"]');
            let audioPortugues5 = document.querySelector('li[data-uia="audio-item-Português (5.1)"]');

            if (audioPortugues5) {
                audioPortugues5.click();
            }
            else if (audioPortugues) {
                audioPortugues.click();
            }

            // legenda
            let legendaPortuguesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Português"]');
            if (!legendaPortuguesSelected) {
                let legendaPortugues = document.querySelector('li[data-uia="subtitle-item-Português"]');

                if (legendaPortugues) {
                    legendaPortugues.click();
                }

            }

        } else {
            let audioIngles = document.querySelector('li[data-uia="audio-item-Inglês"]');
            let audioInglesOriginal = document.querySelector('li[data-uia="audio-item-Inglês [original]"]');
            let audioInglesOriginal5 = document.querySelector('li[data-uia="audio-item-Inglês [original] (5.1)"]');

            if (audioInglesOriginal5) {
                audioInglesOriginal5.click();
            }
            else if (audioInglesOriginal) {
                audioInglesOriginal.click();
            }
            else if (audioIngles) {
                audioIngles.click();
            }

            // legenda
            let legendaInglesCCSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês (CC)"]');
            let legendaInglesSelected = document.querySelector('li[data-uia="subtitle-item-selected-Inglês"]');

            if (!legendaInglesCCSelected && !legendaInglesSelected) {

                let legendaInglesCC = document.querySelector('li[data-uia="subtitle-item-Inglês (CC)"]');
                let legendaIngles = document.querySelector('li[data-uia="subtitle-item-Inglês"]');

                if (legendaInglesCC) {
                    legendaInglesCC.click();
                }
                else if (legendaIngles) {
                    legendaIngles.click();
                }
            }
        }

        document.querySelector('.ltr-4dcwks')?.classList.remove('show');
    });
}

setInterval(window.netflixRewindPlugin.initPluginLogic, 3000);

document.addEventListener('keydown', window.netflixRewindPlugin.seek);
