(function () {
    var playerList = document.getElementsByClassName('html5-video-player');
    var playerState = {
        UNSTARTED: -1,
        END: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5
    }
    var mainPlayer;
    var onPlayerStateChange = function (state) {
        if (state == playerState.PAUSED) {
            console.log("paused");
        }
    };
    for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].getPlayerState() != -1) {
            playerList[i].stopVideo();
            mainPlayer = playerList[i];
        }
        if (mainPlayer) {
            mainPlayer.setPlaybackQuality("hd1080");
            mainPlayer.playVideo();
        }
        playerList[i].addEventListener("onStateChange", onPlayerStateChange);
    }
})();