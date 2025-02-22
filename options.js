document.addEventListener("DOMContentLoaded", function () {
    // Load stored settings
    chrome.storage.sync.get(
        ["font", "fontSize", "fontColor"],
        ({ font, fontSize, fontColor }) => {
            if (font) {
                document.getElementById("font").value = font;
                if (!["Arial", "Verdana", "Times New Roman"].includes(font)) {
                    document.getElementById("font").value = "Custom";
                    document.getElementById("customFont").value = font;
                    document.getElementById("customFont").style.display =
                        "block";
                }
            }
            if (fontSize) document.getElementById("fontSize").value = fontSize;
            if (fontColor)
                document.getElementById("fontColor").value = fontColor;
        }
    );

    // Show custom font input when "Custom" is selected
    document.getElementById("font").addEventListener("change", function () {
        document.getElementById("customFont").style.display =
            this.value === "Custom" ? "block" : "none";
    });

    // Save settings
    document.getElementById("save").addEventListener("click", function () {
        let selectedFont = document.getElementById("font").value;
        if (selectedFont === "Custom") {
            selectedFont = document.getElementById("customFont").value;
        }
        let fontSize = document.getElementById("fontSize").value;
        let fontColor = document.getElementById("fontColor").value;

        chrome.storage.sync.set(
            { font: selectedFont, fontSize, fontColor },
            function () {
                alert("Settings saved! Refresh pages to apply.");
            }
        );
    });
});
