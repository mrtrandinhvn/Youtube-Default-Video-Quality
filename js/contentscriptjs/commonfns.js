// check if object is an array or not
function isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
}
//#region ============ Utillities ===========

// load youtube settings
function loadSettings(chromeStorage, callback) {
    chromeStorage.get(null , function(data) {
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

function injectScriptToBackgroundPage(scripts) {
    if (isArray(scripts)) {
        for (var i = 0; i < scripts.length; i++) {
            var script = document.createElement('script');
            script.textContent = scripts[i];
            
            (document.head || document.documentElement).appendChild(script);
            // inject scripts to <head>
            script.parentNode.removeChild(script);
            // remove injected scripts
        }
    }
}
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


function showAnnotation(show) {
    if (show === false) {
        document.querySelector("div.video-annotations").style.display = "none";
    }
}
function setVideoQuality(qualityValue) {
    var qualityArrayIndex = getQualityIndex(qualityValue);
    document.querySelectorAll("button.ytp-button.ytp-settings-button")[0].click();
    document.querySelectorAll(".ytp-menuitem[aria-haspopup=true] .ytp-menuitem-content")[1].click();
    document.querySelectorAll(".ytp-popup.ytp-settings-menu")[0].style.display = "none";
    // hide quality selecting menu
    setTimeout(function() {
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
    }
    , 300);
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
    if (movie_player.getElementsByTagName("video")[0].src) {
        return true;
    }
    return false;
}
//#endregion ========== Player Controls =============
