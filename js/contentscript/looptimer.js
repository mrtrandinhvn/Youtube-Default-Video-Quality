// control element selectors
loopBtnSelector = ".ytdf .loop-btn";
openBtnSelector = ".ytdf .open-btn";

function getTimerInputs() {
    var startH = getTimeInput(".ytdf .loopTimer .start.hour");
    var startM = getTimeInput(".ytdf .loopTimer .start.minute");
    var startS = getTimeInput(".ytdf .loopTimer .start.second");

    var endH = getTimeInput(".ytdf .loopTimer .end.hour");
    var endM = getTimeInput(".ytdf .loopTimer .end.minute");
    var endS = getTimeInput(".ytdf .loopTimer .end.second");
    return {
        start: startH * 3600 + startM * 60 + startS,
        end: endH * 3600 + endM * 60 + endS,
        loop: $(".ytdf .loopTimer input.loop ").prop("checked") ? 1 : 0,
        autoplay: $(".ytdf .loopTimer input.autoplay").prop("checked") ? 1 : 0
    }
}
function validateLoopTimer() {
    return true;
}
function openLoopLink() {
    if (validateLoopTimer()) {
        var link = generateLoopLink();
        window.open(link, "_blank");
    }
}
function toggleLoopTimer() {
    $(".ytdf.block").toggleClass("active");
}
function generateLoopLink() {
    var baseLink = "https://www.youtube.com/embed/";
    var urlVariables = getUrlVariables();
    var videoId = urlVariables.v;
    var settings = getTimerInputs();
    //baseLink += videoId + "?playlist=" + videoId + "&modestBranding=1&rel=0"; // loop feature is not working
    baseLink += videoId + "?modestBranding=1&rel=0";
    for (var prop in settings) {
        if (settings.hasOwnProperty(prop)) {
            baseLink += "&" + prop + "=" + settings[prop];
        }
    }
    return baseLink;
}

function initializeTimer() {
    if ($(loopBtnSelector).length > 0 || $(openBtnSelector).length > 0) {
        return; // avoid duplicate initialization
    }
    // Loop timer
    readTextFromFile(chromeAppManifest.web_accessible_resources[1], function (data) {
        // loop timer toggle button
        $(data).insertAfter(".yt-subscription-button-subscriber-count-branded-horizontal.yt-subscriber-count");
        $(loopBtnSelector).on("click", toggleLoopTimer);
    });
    readTextFromFile(chromeAppManifest.web_accessible_resources[2], function (data) {
        // loop timer
        $(data).insertBefore("#watch8-action-buttons");
        $(openBtnSelector).on("click", openLoopLink);
    });
    // End Loop timer
}