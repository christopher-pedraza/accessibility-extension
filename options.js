document.addEventListener("DOMContentLoaded", function () {
    // Load stored font
    chrome.storage.sync.get("font", ({ font }) => {
        if (font) {
            document.getElementById("font").value = font;
            if (!["Arial", "Verdana", "Times New Roman"].includes(font)) {
                document.getElementById("font").value = "Custom";
                document.getElementById("customFont").value = font;
                document.getElementById("customFont").style.display = "block";
            }
        }
    });

    // Show input field if "Custom" is selected
    document.getElementById("font").addEventListener("change", function () {
        const customFontInput = document.getElementById("customFont");
        customFontInput.style.display =
            this.value === "Custom" ? "block" : "none";
    });

    // Save font selection
    document.getElementById("save").addEventListener("click", function () {
        let selectedFont = document.getElementById("font").value;
        if (selectedFont === "Custom") {
            selectedFont = document.getElementById("customFont").value;
        }

        chrome.storage.sync.set({ font: selectedFont }, function () {
            alert("Font saved! Refresh pages to apply.");
        });
    });
});
