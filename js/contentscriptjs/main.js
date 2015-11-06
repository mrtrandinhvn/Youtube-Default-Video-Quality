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
(function() {
    
    // execute after settings are fully loaded
    function doMain() {
        var firstRun = setInterval(function() {
            // check if player is ready every 500ms
            if (isPlayerReady()) {
                setVideoQuality(youtubeSettingsObj.defaultQualty);
                showAnnotation(youtubeSettingsObj.showAnnotation);
                clearInterval(firstRun);
            }
        }
        , 500);
        // create an observer instance for video player to check if video.src has changed
        var target = movie_player.getElementsByTagName("video")[0];
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === "src") {
                    if (mutation.target.src) {
                        // Apply Settings when player src is changed
                        setVideoQuality(youtubeSettingsObj.defaultQualty);
                    }
                }
            }
            );
        }
        );
        
        // configuration of the observer:
        var config = {
            attributes: true
        };
        
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
    // load settings then execute doMain callback function
    loadSettings(chromeStorage, doMain);
}
)();
// #endregion ====== END Executing =========
