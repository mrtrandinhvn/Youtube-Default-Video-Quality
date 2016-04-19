// #region ======== Key Objects ============
// quality option elements
var qualityValueElements;
// local setting object
var youtubeSettingsObj = {
    defaultQuality: "default"
};
// chrome storage object
var chromeStorage = chrome.storage.sync;
var chromeAppManifest = chrome.runtime.getManifest();

// #endregion ======= END Key Objects =========
// #region ====== Executing =========
(function () {
    var reg = new RegExp("https://www.youtube.com/embed/", "gi");
    if (reg.test(window.location.href)) {
        doMainEmbedPage();
    } else {
        doMainNormalPage();
    }
})();
// #endregion ====== END Executing =========
