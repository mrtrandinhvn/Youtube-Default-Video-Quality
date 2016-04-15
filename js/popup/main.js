// ======== Key Objects ============
// settings option elements
var qualityValueElements = document.getElementsByClassName("qualityValue");
var annotationValueElements = document.getElementsByClassName("annotationValue");
var loopValueElements = document.getElementsByClassName("loopValue");
// local setting object
var youtubeSettingsObj = {
    defaultQuality: "default",
    loop: false,
    showAnnotation: true,
};
// chrome extension objects
var chromeStorage = chrome.storage.sync;
var chromeAppManifest = chrome.runtime.getManifest();
// ======= END Key Objects =========

// ====== Executing =========
(function () {
    function doMain(event) {
        bindEventToElements();
        loadSettings(chromeStorage);
        // show app's version
        document.getElementById("version").innerHTML = "Updated to version " + chromeAppManifest.version + " (Newest)";
    };
    // Wait for all markup finish loading
    document.addEventListener("DOMContentLoaded", doMain);
})();
// ====== END Executing =========