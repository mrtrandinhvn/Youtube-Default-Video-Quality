// #region ======== Key Objects ============
// quality option elements
var qualityValueElements;
// local setting object
var youtubeSettingsObj = {
    defaultQualty: "default"
};
// chrome storage object
var chromeStorage = chrome.storage.sync;
// #endregion ======= END Key Objects =========

// #region ====== Executing =========
(function () {
    function onDocumentReady() {
        // execute after settings are fully loaded

        // Apply Settings when player src is changed
        function applySettings() {
            setVideoQuality(youtubeSettingsObj.defaultQualty);
            setAnnotation(youtubeSettingsObj.showAnnotation);
            setLoop(youtubeSettingsObj.loop);
        }
        function doMain() {
            var runTime = 0;
            var firstRun = setInterval(function () {
                if (isPlayerReady()) {// check if player is ready every 500ms
                    applySettings();
                    runTime++;
                    // create an observer instance for video player to check if video.src has changed
                    var target = document.getElementById("movie_player").getElementsByTagName("video")[0];
                    var observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.attributeName === "src") {
                                if (mutation.target.src && runTime > 0) {
                                    // Handling second run and beyond
                                    // Apply Settings when player src is changed
                                    applySettings();
                                }
                            }
                        });
                    });
                    // configuration of the observer:
                    var config = {
                        attributes: true
                    };
                    // pass in the target node, as well as the observer options
                    observer.observe(target, config);
                    clearInterval(firstRun);
                }
            }, 500);
        };
        // load settings then execute doMain callback function
        loadSettings(chromeStorage, doMain);
        // remove event
        document.onreadystatechange = undefined;
    }
    if (document.readyState === "complete") { // Check if document is fully loaded
        onDocumentReady();
    } else {
        document.onreadystatechange = onDocumentReady();
    }
})();
// #endregion ====== END Executing =========
