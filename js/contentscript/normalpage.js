function doMainNormalPage() {
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
                                    //// set loop
                                    //ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                                    window.postMessage({ type: "INITIALIZE_TIMER" }, "*");
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
                            //// set loop
                            //ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                            window.postMessage({ type: "INITIALIZE_TIMER" }, "*");
                        }
                    });
                    if (ytdf.Player.getPlayerState() === 1) { // first run to avoid the case that the video play before the handler for onStateChange event was set
                        // set quality
                        ytdf.Controller.setVideoQualityByAPI(ytdf.Controller.settings.defaultQuality);
                        // set annotation
                        ytdf.Controller.setAnnotation(ytdf.Controller.settings.showAnnotation);
                        //// set loop
                        //ytdf.Controller.setLoop(ytdf.Controller.settings.loop);
                        window.postMessage({ type: "INITIALIZE_TIMER" }, "*");
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
        injectCodeFromSourceFileToBackgroundPage(chromeAppManifest.web_accessible_resources[0], function () {
            // load youtube settings then execute doMain callback function
            loadSettings(chromeStorage, doMain);
        });
    }
    $(document).ready(onDocumentReady());

    // wait for a right time to initialize loop timer
    window.addEventListener("message", function (event) {
        // We only accept messages from ourselves
        if (event.source != window)
            return;
        if (event.data.type && (event.data.type == "INITIALIZE_TIMER")) {
            initializeTimer();
        }
    }, false);
}