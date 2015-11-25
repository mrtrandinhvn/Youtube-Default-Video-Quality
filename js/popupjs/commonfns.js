//#region Utilities
// =============  Events Binding- click to choose an option
function click_qualityValue(event) {
    saveDefaultQuality(event.currentTarget.dataset.quality);
}
function click_annotationValue(event) {
    saveAnnotationSetting(event.currentTarget.checked);
}
function click_loopValue(event) {
    saveLoopSetting(event.currentTarget.checked);
}
// ============ END Events Binding ===========

// =============  Events Handling =============
function saveDefaultQuality(value) {
    youtubeSettingsObj.defaultQualty = value;
    var successMes = "Default Video Quality: " + value;
    updateSettingObj(successMes);
    updateSelectedOption();
}
function saveAnnotationSetting(value) {
    youtubeSettingsObj.showAnnotation = value;
    var successMes = value ? "Annotation: Show" : "Annotation: Hide";
    updateSettingObj(successMes);
}
function saveLoopSetting(value) {
    youtubeSettingsObj.loop = value;
    var successMes = value ? "Loop Video" : "Do Not Loop Video";
    updateSettingObj(successMes);
}
// ============ END Events Handling ===========

// Update local setting object to match value in localStorage
function updateSettingObj(successMessage) {
    chromeStorage.set({ youtubeSettingsObj: youtubeSettingsObj }, function () {
        document.getElementById("message").innerHTML = "Saved Setting: " + successMessage;
    });
}

// Update selected setting: add "selected" css class to selected option
function updateSelectedOption() {
    // quality
    for (var i = 0; i < qualityValueElements.length; i++) {
        if (qualityValueElements[i].dataset.quality == youtubeSettingsObj.defaultQualty) {
            qualityValueElements[i].className = "qualityValue selected";
        } else {
            qualityValueElements[i].className = "qualityValue";
        }
    }
    // annotation
    for (var j = 0; j < annotationValueElements.length; j++) {
        annotationValueElements[j].checked = youtubeSettingsObj.showAnnotation;
    }
    // loop
    for (var k = 0; k < loopValueElements.length; k++) {
        loopValueElements[k].checked = youtubeSettingsObj.loop;
    }
}
//#endregion utilities

//#region onLoaded
function bindEventToElements() {
    for (var i = 0; i < qualityValueElements.length; i++) {
        // click
        qualityValueElements[i].addEventListener("click", click_qualityValue);
    }
    for (var j = 0; j < annotationValueElements.length; j++) {
        // click
        annotationValueElements[j].addEventListener("click", click_annotationValue);
    }
    for (var k = 0; k < loopValueElements.length; k++) {
        // click
        loopValueElements[k].addEventListener("click", click_loopValue);
    }

}
function loadSettings(chromeStorage) {
    chromeStorage.get(null, function (data) {
        if (data.youtubeSettingsObj) {
            youtubeSettingsObj = data.youtubeSettingsObj;
        }
        updateSelectedOption();
    });
}
//#endregion onLoaded