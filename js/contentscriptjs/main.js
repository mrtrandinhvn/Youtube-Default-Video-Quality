// #region ======== Key Objects ============
// quality option elements
var qualityValueElements;
// local setting object
var youtubeSettingsObj = { defaultQualty: "default" };
// chrome storage object
var chromeStorage = chrome.storage.sync;
// #endregion ======= END Key Objects =========

// #region ====== Executing =========
(function () {
    // execute after settings are fully loaded
    function doMain() {
        // inject code to background page.
        //var scriptList = ["js/contentscriptjs/execute.js"];
        var injectScriptList = [];
        var executeScript = "(" + // stringify script
            function doMain(youtubeSettingsObj) {
                var playerList = document.getElementsByClassName('html5-video-player');
                if (playerList.length == 0) {
                    var findPlayerListInterval = setInterval(function () {
                        debugger;
                        playerList = document.getElementsByClassName('html5-video-player');
                        if (playerList.length > 0) {
                            doMain(youtubeSettingsObj);
                            clearInterval(findPlayerListInterval);
                        }
                    }, 1000);
                }
                var playerState = {
                    // youtube player's states
                    UNSTARTED: -1,
                    END: 0,
                    PLAYING: 1,
                    PAUSED: 2,
                    BUFFERING: 3,
                    CUED: 5
                }
                var mainPlayer; // running player
                var onPlayerStateChange = function (state) {
                    console.log(state);
                    if ((state == playerState.PLAYING)) {
                        mainPlayer.setPlaybackQuality(youtubeSettingsObj.defaultQualty);
                    }
                };
                for (var i = 0; i < playerList.length; i++) {
                    playerList[i].addEventListener("onStateChange", onPlayerStateChange);
                    // set replay
                    playerList[i].getElementsByTagName("video").loop = youtubeSettingsObj.replay;
                    // set video quality
                    playerList[i].setPlaybackQuality(youtubeSettingsObj.defaultQualty);
                    if (playerList[i].getPlayerState() != -1) {
                        mainPlayer = playerList[i];
                        mainPlayer.pauseVideo();
                        mainPlayer.setPlaybackQuality(youtubeSettingsObj.defaultQualty);
                        mainPlayer.seekTo(mainPlayer.getCurrentTime(), true);
                        mainPlayer.playVideo();
                    }
                }
            }
            + ")(" + JSON.stringify(youtubeSettingsObj) + ");";
        injectScriptList.push(executeScript); // add to inject code list
        // inject code to background page
        injectScriptToBackgroundPage(injectScriptList);
    }

    // load settings then execute doMain callback function
    loadSettings(chromeStorage, doMain);
})();
// #endregion ====== END Executing =========