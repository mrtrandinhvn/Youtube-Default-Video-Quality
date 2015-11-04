// check if object is an array or not
function isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
}

function loadSettings(chromeStorage, callback) {
    chromeStorage.get(null, function (data) {
        if (data.youtubeSettingsObj) {
            youtubeSettingsObj = data.youtubeSettingsObj;
        }
		// execute callback function after finish loading settings
		if(typeof(callback) == "function"){
			callback();
		}
    });
}
function injectCodeFromSourceFileToBackgroundPage(filePaths) {
    if (isArray(filePaths)) {
        for (var i = 0; i < filePaths.length; i++) {
            var script = document.createElement('script');
            script.src = chrome.extension.getURL(filePaths[i]);
            (document.head || document.documentElement).appendChild(script);
        }
    }
}

function injectScriptToBackgroundPage(scripts) {
    if (isArray(scripts)) {
        for (var i = 0; i < scripts.length; i++) {
            var script = document.createElement('script');
            script.textContent = scripts[i];
			
            (document.head || document.documentElement).appendChild(script); // inject scripts to <head>
			script.parentNode.removeChild(script); // remove injected scripts
        }
    }
}