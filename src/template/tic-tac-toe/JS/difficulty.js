function setDifficulty(e) {
    difficulty = document.getElementById("difficulty-slider").value
}

let settingsVisibilty = false;

function displaySettings() {
    if (settingsVisibilty === false) {
        document.getElementById("settings-div").classList.remove("hidden");
        settingsVisibilty = true;
    } else {
        document.getElementById("settings-div").classList.add("hidden");
        settingsVisibilty = false;
    }
}