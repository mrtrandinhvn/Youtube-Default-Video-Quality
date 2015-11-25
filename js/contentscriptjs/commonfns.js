// check if object is an array or not
function isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
}
//#region ============ Utillities ===========

// load youtube settings
function loadSettings(chromeStorage, callback) {
    chromeStorage.get(null, function (data) {
        if (data.youtubeSettingsObj) {
            youtubeSettingsObj = data.youtubeSettingsObj;
        }
        // execute callback function after finish loading settings
        if (typeof (callback) == "function") {
            callback();
        }
    }
    );
}

// inject script from js files array or filename string
function injectCodeFromSourceFileToBackgroundPage(filePaths, callbackFn) {
    var script;
    if (isArray(filePaths)) {
        for (var i = 0; i < filePaths.length; i++) {
            script = document.createElement('script');
            script.src = chrome.extension.getURL(filePaths[i]);
            (document.head || document.documentElement).appendChild(script);
        }
    } else if (filePaths) {
        script = document.createElement('script');
        script.src = chrome.extension.getURL(filePaths);
        if (typeof (callbackFn) == "function") script.onload = callbackFn;
        (document.head || document.documentElement).appendChild(script);
    }
}
// inject script from a function or a functions array
function injectScriptsFromFunctions(functions, callbackFn) {
    var functionStringified;
    var script;
    if (isArray(functions)) {
        for (var i = 0; i < functions.length; i++) {
            functionStringified = '(';
            functionStringified += functions[i].fn;
            functionStringified += ')(' + JSON.stringify(functions[i].args) + ');';
            script = document.createElement('script');
            script.textContent = functionStringified;
            (document.head || document.documentElement).appendChild(script); // inject scripts to <head>
            script.parentNode.removeChild(script); // remove injected scripts
        }
    } else if (functions) {
        functionStringified = '(';
        functionStringified += functions.fn;
        functionStringified += ')(' + JSON.stringify(functions.args) + ');';
        script = document.createElement('script');
        script.textContent = functionStringified;
        if (typeof (callbackFn) == "function") script.onload = callbackFn;
        (document.head || document.documentElement).appendChild(script); // inject scripts to <head>
        script.parentNode.removeChild(script); // remove injected scripts
    }
}
function getUrlVariables() {
    var variables = {};
    var pair;
    var variablesString = window.location.href.slice(window.location.href.indexOf("?") + 1);
    var variablesSplit = variablesString.split("&");
    for (var i = 0; i < variablesSplit.length; i++) {
        pair = variablesSplit[i].split("=");
        variables[pair[0]] = pair[1];
    }
    return variables;
}
//#region ========= Constructors =============

function InjectFn(fn, args) { // An injectable function
    this.fn = fn;
    this.args = args;
    return this;
}

//#endregion ========= Constructors =============
//#endregion ========= Utillities ===========

//#region ============= Player Controls =============
// order of those 2 array must be identical
var qualityValues = [
    "default",
    "tiny",
    "small",
    "medium",
    "large",
    "hd720",
    "hd1080",
    "highres"
];
var qualityNumberText = [
    "Auto", "144p", "240p", "360p", "480p", "720p", "1080p", "2160p"
];

function setLoop(loop) {
    if (loop) {
        if (document.querySelector("#movie_player video")) {
            document.querySelector("#movie_player video").loop = loop;
        }
    }
}
function setAnnotation(show) {
    if (show === false) {
        var annotationCssText = ".annotation.annotation-type-custom.iv-branding {display: none!important;}  div.video-annotations{display:none!important;} .annotation{display:none!important;}";
        if (document.head.getElementsByClassName("ytdfqlt-annotation").length > 0 !== annotationCssText) { // if this css text has already existed, skip this function
            var styleTag = document.createElement("style");
            styleTag.className = "ytdfqlt-annotation";
            styleTag.type = "text/css";
            styleTag.appendChild(document.createTextNode(annotationCssText));
            document.head.appendChild(styleTag);
        }
    }
}
function setVideoQualityByAPI(qualityValue) {
    var urlVariables = getUrlVariables();
    var args = {
        videoId: urlVariables.v,
        startSeconds: urlVariables.t,
        endSeconds: null,
        suggestedQuality: qualityValue
    };
    if (movie_player.getPlaybackQuality() != args.suggestedQuality) {
        movie_player.loadVideoById(args);
        movie_player.setPlaybackQuality(args.suggestedQuality);
        movie_player.setAutonavState(document.querySelector("#autoplay-checkbox").checked ? 2 : 1);
    }
}

function setVideoQualityByClicks(qualityValue) {
    var qualityArrayIndex = getQualityIndex(qualityValue);
    var allowClick;
    // hide setting popup
    var cssText = ".ytp-popup.ytp-settings-menu{display:none!important;}";
    var styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.appendChild(document.createTextNode(cssText));
    document.head.appendChild(styleTag);
    // end hide setting popup

    // click on setting icon
    document.querySelectorAll("button.ytp-button.ytp-settings-button")[0].click();
    // click on quality option
    var clickQualityButtonInterval = setInterval(function () {
        var popupSetting = document.querySelectorAll(".ytp-menuitem[aria-haspopup=true] .ytp-menuitem-content");
        if (popupSetting.length > 0) {
            // hide quality selecting menu
            document.querySelectorAll(".ytp-popup.ytp-settings-menu")[0].style.display = "none";
            // find Quality button and click on it
            for (var row in popupSetting) {
                if (popupSetting[row].getElementsByTagName("span").length > 0) {
                    popupSetting[row].click();
                    allowClick = true;
                    clearInterval(clickQualityButtonInterval);
                    break;
                }
            }
        }
    }, 100);
    var clickQualityValueInterval = setInterval(function () {
        if (allowClick && document.querySelectorAll(".ytp-menu.ytp-quality-menu").length > 0) {
            clearInterval(clickQualityValueInterval);
            // click on the approriate quality option
            setTimeout(function () {
                var qualityOptions = document.querySelectorAll(".ytp-menu.ytp-quality-menu")[0].querySelectorAll(".ytp-menuitem");
                var isDone = false;
                // video might not support the selected value
                while (!isDone) {
                    for (var i = 0; i < qualityOptions.length; i++) {
                        var qualityNumberSpan = qualityOptions[i].querySelectorAll("span")[0];
                        if (qualityNumberSpan.textContent.includes(qualityNumberText[qualityArrayIndex])) {
                            qualityNumberSpan.click();
                            isDone = true;
                            break;
                        }
                    }
                    qualityArrayIndex--;
                }
                // un-hide setting popup
                document.head.removeChild(styleTag);
            }, 400);
        }
    }, 100);
}
function getQualityIndex(qualityValue) {
    for (var i = 0; i < qualityValues.length; i++) {
        if (qualityValues[i] === qualityValue) {
            return i;
        }
    }
    return 0;
}
function isPlayerReady() {
    if (document.getElementById("movie_player") && document.getElementById("movie_player").getElementsByTagName("video")[0].src) {
        return true;
    }
    return false;
}
//#endregion ========== Player Controls =============
