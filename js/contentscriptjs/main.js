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
	function doMain(){
		// inject code to background page.
		//var scriptList = ["js/contentscriptjs/execute.js"];
		var injectScriptList = [];
		var executeScript = "(" + // stringify script
			function (youtubeSettingsObj) {
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
				var onPlayerStateChange = function (state,player) {
					console.log(state);
					if (state == playerState.BUFFERING) {
						if(mainPlayer.getPlaybackQuality()!= youtubeSettingsObj.defaultQualty)
						mainPlayer.setPlaybackQuality(youtubeSettingsObj.defaultQualty);
					}
				};
				debugger;
				for (var i = 0; i < playerList.length; i++) {
					// set replay
					playerList[i].getElementsByTagName("video").loop = youtubeSettingsObj.replay;
					// set video quality
					playerList[i].setPlaybackQuality(youtubeSettingsObj.defaultQualty);
					if (playerList[i].getPlayerState() != -1) {
						mainPlayer = playerList[i];
						mainPlayer.pauseVideo();
						mainPlayer.seekTo(playerList[i].getCurrentTime(),true);
						mainPlayer.playVideo();
					}
					playerList[i].addEventListener("onStateChange", onPlayerStateChange);
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