function onPlaybackQualityChange(data, args) {
    console.log("onPlaybackQualityChange");
    console.log(data);
    console.log(args);
}

function onYouTubePlayerReady(player) {
    console.log("onYouTubePlayerReady");
    console.log(player);
}

function onYouTubeHTML5PlayerReady(player) {
    console.log("onYouTubeHTML5PlayerReady");
    console.log(player);
}
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