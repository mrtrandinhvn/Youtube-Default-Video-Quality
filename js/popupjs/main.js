// ======== Key Objects ============
// settings option elements
var qualityValueElements = document.getElementsByClassName("qualityValue");
var annotationValueElements = document.getElementsByClassName("annotationValue");
var loopValueElements = document.getElementsByClassName("loopValue");
// local setting object
var youtubeSettingsObj = {
		defaultQualty: "default",
		loop: false,
		showAnnotation: true
	};
// chrome storage object
var chromeStorage = chrome.storage.sync;
// ======= END Key Objects =========

// ====== Executing =========
(function () {
    function doMain(event) {
        bindEventToElements();
        loadSettings(chromeStorage);
    };
	// Wait for all markup finish loading
    document.addEventListener("DOMContentLoaded", doMain);
})();
// ====== END Executing =========