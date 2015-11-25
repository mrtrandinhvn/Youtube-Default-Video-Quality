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
    function onDocumentReady() { // execute after settings are fully loaded
        console.log("Ready");
        function doMain() { // execute after extension's saved settings have been loaded
            // Apply Settings when player src is changed
            function applySettings() {
                var functions = [];
                var injectFn;
                // set quality
                injectFn = new InjectFn(setVideoQualityByAPI, youtubeSettingsObj.defaultQualty);
                functions.push(injectFn);
                // set annotation
                injectFn = new InjectFn(setAnnotation, youtubeSettingsObj.showAnnotation);
                functions.push(injectFn);
                // set loop
                injectFn = new InjectFn(setLoop, youtubeSettingsObj.loop);
                functions.push(injectFn);
                // inject code to page
                injectScriptsFromFunctions(functions);
            }

            var injectFns = [];
            function addEventToPlayer() {
                ytdf.Controller.player.addEventListener("onStateChange", function (state) {
                    console.log(state + ": " + ytdf.Controller.player.getPlaybackQuality());
                    //if (state === 1) {
                    //    applySettings();
                    //}
                });
            }
            function passSettingObj(settingObj) {
                ytdf.Controller.settings = settingObj;
            }
            injectFns.push(new InjectFn(passSettingObj, youtubeSettingsObj));
            injectFns.push(new InjectFn(addEventToPlayer));
            injectScriptsFromFunctions(injectFns); // execute
            //var runTime = 0;
            //    var firstRun = setInterval(function () {
            //        if (isPlayerReady()) {// check if player is ready every 500ms
            //            applySettings();
            //            runTime++;
            //            // create an observer instance for video player to check if video.src has changed
            //            var target = document.getElementById("movie_player").getElementsByTagName("video")[0];
            //            var observer = new MutationObserver(function (mutations) {
            //                mutations.forEach(function (mutation) {
            //                    if (mutation.attributeName === "src") {
            //                        if (mutation.target.src && runTime > 0) {
            //                            // Handling second run and beyond
            //                            // Apply Settings when player src is changed
            //                            applySettings();
            //                        }
            //                    }
            //                });
            //            });
            //            // configuration of the observer:
            //            var config = {
            //                attributes: true
            //            };
            //            // pass in the target node, as well as the observer options
            //            observer.observe(target, config);
            //            clearInterval(firstRun);
            //        }
            //    }, 500);
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
