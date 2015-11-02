(function () {
    // inject code to background page.
    var inj1 = document.createElement('script');
    inj1.src = chrome.extension.getURL("js/contentscriptjs/commonfns.js");
    (document.head || document.documentElement).appendChild(inj1);
})();