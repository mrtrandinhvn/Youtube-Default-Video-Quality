var youtubeSettingsObj = { defaultQualty: 360 };
var chromeStorage = chrome.storage.sync;


// check if object is an array or not
function isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
}
function injectCodeToBackgroundPage(filePaths) {
    if (isArray(filePaths)) {
        for (var i = 0; i < filePaths.length; i++) {
            var script = document.createElement('script');
            script.src = chrome.extension.getURL(filePaths[i]);
            (document.head || document.documentElement).appendChild(script);
        }
    }

}