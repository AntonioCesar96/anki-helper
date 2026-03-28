const valorTempo = 4000;

window.netflixRewindPlugin = {};
window.netflixRewindPlugin.player = undefined;

window.netflixRewindPlugin.seek = function (e) {
    if (e.key === "ArrowLeft") { 
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    if (window.netflixRewindPlugin.player) {
        let currentTime = window.netflixRewindPlugin.player.getCurrentTime();

        if (e.key === "ArrowLeft") {
            window.netflixRewindPlugin.player.seek(Math.max(0, currentTime - valorTempo));
        }

    } else {
        window.netflixRewindPlugin.initPluginLogic();
    }
}

window.netflixRewindPlugin.initPluginLogic = function () {

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

setInterval(window.netflixRewindPlugin.initPluginLogic, 3000);

document.addEventListener('keydown', window.netflixRewindPlugin.seek, true);
