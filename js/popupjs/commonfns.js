//#region Utilities
// click to choose an option
function click_SelectOption(event) {
    saveDefaultQuality(event.currentTarget.dataset.quality);
}

function saveDefaultQuality(value) {
    youtubeSettingsObj.defaultQualty = value;
    updateSettingObj();
    updateSelectedOption();
}
// Update local setting object to match value in localStorage
function updateSettingObj() {
    chromeStorage.set({ youtubeSettingsObj: youtubeSettingsObj }, function () {

    });
}

// Update selected setting: add "selected" css class to selected option
function updateSelectedOption() {
    for (var i = 0; i < qualityValueElements.length; i++) {
        if (qualityValueElements[i].dataset.quality == youtubeSettingsObj.defaultQualty) {
            qualityValueElements[i].className = "qualityValue selected";
        } else {
            qualityValueElements[i].className = "qualityValue";
        }
    }
}
//#endregion utilities

//#region onLoaded
function bindEventToElements() {
    qualityValueElements = document.getElementsByClassName("qualityValue");
    for (var i = 0; i < qualityValueElements.length; i++) {
        // click
        qualityValueElements[i].addEventListener("click", click_SelectOption);
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