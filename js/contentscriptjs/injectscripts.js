var ytdf = {
    Controller: {
        player: document.getElementById(ytplayer.config.attrs.id),
        settings: null
    },
    Utilities: {
        // check if object is an array or not
        isArray: function (object) {
            return Object.prototype.toString.call(object) === "[object Array]";
        },
        //#region ============ Utillities ===========
        getUrlVariables: function () {
            var variables = {};
            var pair;
            var variablesString = window.location.href.slice(window.location.href.indexOf("?") + 1);
            var variablesSplit = variablesString.split("&");
            for (var i = 0; i < variablesSplit.length; i++) {
                pair = variablesSplit[i].split("=");
                variables[pair[0]] = pair[1];
            }
            return variables;
        },
        //#endregion ========= Utillities ===========

        //#region ============= Player Controls =============
        // order of those 2 array must be identical
        qualityValues: [
            "default",
            "tiny",
            "small",
            "medium",
            "large",
            "hd720",
            "hd1080",
            "highres"
        ],
        qualityNumberText: [
            "Auto", "144p", "240p", "360p", "480p", "720p", "1080p", "2160p"
        ],
        setLoop: function (loop) {
            if (loop) {
                if (document.querySelector("#movie_player video")) {
                    document.querySelector("#movie_player video").loop = loop;
                }
            }
        },
        setAnnotation: function (show) {
            if (show === false) {
                var annotationCssText = ".annotation.annotation-type-custom.iv-branding {display: none!important;}  div.video-annotations{display:none!important;} .annotation{display:none!important;}";
                if (document.head.getElementsByClassName("ytdfqlt-annotation").length === 0) { // if this css text has already existed, skip this function
                    var styleTag = document.createElement("style");
                    styleTag.className = "ytdfqlt-annotation";
                    styleTag.type = "text/css";
                    styleTag.appendChild(document.createTextNode(annotationCssText));
                    document.head.appendChild(styleTag);
                }
            }
        },
        setVideoQualityByAPI: function (qualityValue) {
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
        },

        setVideoQualityByClicks: function (qualityValue) {
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
        },
        getQualityIndex: function (qualityValue) {
            for (var i = 0; i < qualityValues.length; i++) {
                if (qualityValues[i] === qualityValue) {
                    return i;
                }
            }
            return 0;
        },
        isPlayerReady: function () {
            if (document.getElementById("movie_player") && document.getElementById("movie_player").getElementsByTagName("video")[0].src) {
                return true;
            }
            return false;
        },
        //#endregion ========== Player Controls =============
    }
};
