document.addEventListener("DOMContentLoaded", function () {
    // Load stored values when popup opens
    chrome.storage.sync.get(
        ["font", "fontSize", "fontColor"],
        (storedValues) => {
            document.getElementById("font").value =
                storedValues.font || "inherit";
            document.getElementById("fontSize").value =
                storedValues.fontSize || "16";
            document.getElementById("fontColor").value =
                storedValues.fontColor || "black";
        }
    );

    document.getElementById("apply").addEventListener("click", function () {
        // First, get the stored values
        chrome.storage.sync.get(
            ["font", "fontSize", "fontColor"],
            (storedValues) => {
                // Retrieve values from inputs, fallback to previous values if unchanged
                let selectedFont =
                    document.getElementById("font").value || storedValues.font;
                let fontSize =
                    document.getElementById("fontSize").value ||
                    storedValues.fontSize;
                let fontColor =
                    document.getElementById("fontColor").value ||
                    storedValues.fontColor;

                // Ensure no values become undefined
                if (!selectedFont) selectedFont = storedValues.font;
                if (!fontSize) fontSize = storedValues.fontSize;
                if (!fontColor) fontColor = storedValues.fontColor;

                // Save the updated settings
                chrome.storage.sync.set(
                    { font: selectedFont, fontSize, fontColor },
                    function () {
                        chrome.tabs.query(
                            { active: true, currentWindow: true },
                            function (tabs) {
                                if (tabs.length === 0) return; // Ensure a tab exists

                                chrome.scripting.executeScript({
                                    target: { tabId: tabs[0].id },
                                    function: applyFontSettings,
                                    args: [selectedFont, fontSize, fontColor],
                                });
                            }
                        );
                    }
                );
            }
        );
    });

    // Function to modify webpage styles
    function applyFontSettings(font, fontSize, fontColor) {
        let styleTag = document.getElementById("fontChangerStyles");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "fontChangerStyles";
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = `
            * {
                font-family: ${font} !important;
                font-size: ${fontSize}px !important;
                color: ${fontColor} !important;
            }
        `;
    }
});
