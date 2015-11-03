(function () {
    var playerList = document.getElementsByClassName('html5-video-player');
    var mainPlayer;
    for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].getPlayerState() != -1) {
            playerList[i].stopVideo();
            mainPlayer = playerList[i];
        }
        if (mainPlayer) {
            mainPlayer.setPlaybackQuality("hd1080");
            mainPlayer.playVideo();
        }
    }
})();