// show after installed/updated
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.windows.create({
        url: "html/default_popup.html",
        width: 500,
        height: 500,
        type: "popup"
    });
});