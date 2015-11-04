// ======== Key Objects ============
// quality option elements
var qualityValueElements;
// local setting object
var youtubeSettingsObj = { defaultQualty: "default" };
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