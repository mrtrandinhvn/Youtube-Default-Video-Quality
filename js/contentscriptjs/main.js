// #region ======== Key Objects ============
// quality option elements
var qualityValueElements;
// local setting object
var youtubeSettingsObj = {
    defaultQuality: "default"
};
// chrome storage object
var chromeStorage = chrome.storage.sync;
// #endregion ======= END Key Objects =========

// #region ====== Executing =========
(function () {
    function onDocumentReady() { // execute after settings are fully loaded
        console.log("Ready");
        function doMain() { // execute after extension's saved settings have been loaded
            // Apply Settings when player src is changed

            var injectFns = [];
            function addEventToPlayer() {
                console.log("addEventToPlayer");
                var runTime = 0;
                if (!yt.player.getPlayerByElement(ytplayer.config.attrs.id)) {
                    var initPlayerInterval = setInterval(function () { // check for player to be created
                        console.log("initPlayerInterval");
                        if (yt.player.getPlayerByElement(ytplayer.config.attrs.id)) { // create new element if it doesn't exist
                            ytdf.Player = document.getElementById(ytplayer.config.attrs.id);
                            ytdf.Player.addEventListener("onStateChange", function (state) {
                                if (state === 1 && runTime > 0) {
                                    // set quality
                                    ytdf.Controller.setVideoQualityByAPI(ytdf.Controller.settings.defaultQuality);
                                    // set annotation
                                    ytdf.Controller.setAnnotation(ytdf.Controller.settings.showAnnotation);
                                    // set loop
                                    ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                                }
                            });
                            clearInterval(initPlayerInterval);
                        }
                    }, 500);
                } else {
                    ytdf.Player.addEventListener("onStateChange", function (state) {
                        if (state === 1 && runTime > 0) { // second run
                            // set quality
                            ytdf.Controller.setVideoQualityByAPI(ytdf.Controller.settings.defaultQuality);
                            // set annotation
                            ytdf.Controller.setAnnotation(ytdf.Controller.settings.showAnnotation);
                            // set loop
                            ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                        }
                    });
                    if (ytdf.Player.getPlayerState() === 1) { // first run to avoid the case that the video play before the handler for onStateChange event was set
                        // set quality
                        ytdf.Controller.setVideoQualityByAPI(ytdf.Controller.settings.defaultQuality);
                        // set annotation
                        ytdf.Controller.setAnnotation(ytdf.Controller.settings.showAnnotation);
                        // set loop
                        ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                    }
                }
                runTime++;
            }
            function passSettingObj(settingObj) {
                ytdf.Controller.settings = settingObj;
            }
            injectFns.push(new InjectFn(passSettingObj, youtubeSettingsObj));
            injectFns.push(new InjectFn(addEventToPlayer));
            injectScriptsFromFunctions(injectFns); // execute
        };
        // inject ytdf object to source page
        injectCodeFromSourceFileToBackgroundPage("js/contentscriptjs/injectscripts.js", function () {
            // load youtube settings then execute doMain callback function
            loadSettings(chromeStorage, doMain);
        });
    }

    $(document).ready(onDocumentReady());
})();
// #endregion ====== END Executing =========
