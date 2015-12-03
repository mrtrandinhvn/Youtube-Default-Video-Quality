var ytdf = {
    Player: document.getElementById(ytplayer.config.attrs.id),
    Controller: {
        videoId: null,
        settings: null,
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
            var videoData = ytdf.Player.getVideoData();
            var args = {
                videoId: videoData.video_id,
                startSeconds: ytdf.Player.getCurrentTime(),
                endSeconds: null,
                suggestedQuality: qualityValue
            };
            if (args.videoId != ytdf.Controller.videoId) { // avoid duplicate set
                ytdf.Player.loadVideoById(args);
                ytdf.Player.setPlaybackQuality(args.suggestedQuality);
                ytdf.Player.setAutonavState(document.querySelector("#autoplay-checkbox").checked ? 2 : 1);
                ytdf.Controller.videoId = args.videoId;
            }
        },
        setLoop: function (loop) {
            if (loop) {
                if (ytdf.Player.querySelector("video")) {
                    ytdf.Player.querySelector("video").loop = loop;
                }
            }
        },
        isPlayerReady: function () {
            if (ytdf.Player.querySelector("video").src) {
                return true;
            }
            return false;
        },
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
        //#endregion ========== Player Controls =============
    }
};
