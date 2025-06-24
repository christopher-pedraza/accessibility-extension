document.addEventListener("DOMContentLoaded", function () {
    // Load saved values when popup opens
    chrome.storage.sync.get(
        ["font", "fontSize", "fontColor", "colorBlindness"],
        (storedValues) => {
            document.getElementById("font").value =
                storedValues.font || "inherit";
            document.getElementById("fontSize").value =
                storedValues.fontSize || "16";
            document.getElementById("fontColor").value =
                storedValues.fontColor || "#000000";
            document.getElementById("colorBlindness").value =
                storedValues.colorBlindness || "none";
        }
    );

    document.getElementById("apply").addEventListener("click", function () {
        // Fetch selected values
        const selectedFont = document.getElementById("font").value;
        const fontSize = document.getElementById("fontSize").value;
        const fontColor = document.getElementById("fontColor").value;
        const colorBlindness = document.getElementById("colorBlindness").value;

        // Save the updated settings
        chrome.storage.sync.set(
            { font: selectedFont, fontSize, fontColor, colorBlindness },
            function () {
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        if (tabs.length === 0) return; // Ensure a tab exists

                        // Inject the font and filter settings
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            function: applyFontSettings,
                            args: [
                                selectedFont,
                                fontSize,
                                fontColor,
                                colorBlindness,
                            ],
                        });
                    }
                );
            }
        );
    });

    // Function to modify webpage styles
    function applyFontSettings(font, fontSize, fontColor, colorBlindness) {
        console.log("Applying font settings to page...");

        // Check if the style tag exists, if not, create it
        let styleTag = document.getElementById("fontChangerStyles");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "fontChangerStyles";
            document.head.appendChild(styleTag);
        }

        // Check if the SVG filter definitions are already in the page, if not, add them
        let svgDef = document.getElementById("colorBlindnessFilters");
        if (!svgDef) {
            svgDef = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            svgDef.setAttribute("width", "0");
            svgDef.setAttribute("height", "0");
            svgDef.setAttribute("id", "colorBlindnessFilters");

            // Create the filter definitions (Protanopia, Deuteranopia, Tritanopia)
            svgDef.innerHTML = `
                <defs>
                    <filter id="protanopia">
                        <feColorMatrix
                            type="matrix"
                            values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"
                        />
                    </filter>
                    <filter id="deuteranopia">
                        <feColorMatrix
                            type="matrix"
                            values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"
                        />
                    </filter>
                    <filter id="tritanopia">
                        <feColorMatrix
                            type="matrix"
                            values="0.95,0.05,0,0,0 0.0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"
                        />
                    </filter>
                </defs>
            `;
            document.body.appendChild(svgDef);
        }

        console.log("SVG Filters injected!");

        // Apply the color blindness filter based on the user's selection
        let colorBlindFilter = "";
        if (colorBlindness === "protanopia") {
            colorBlindFilter = "filter: url(#protanopia);";
        } else if (colorBlindness === "deuteranopia") {
            colorBlindFilter = "filter: url(#deuteranopia);";
        } else if (colorBlindness === "tritanopia") {
            colorBlindFilter = "filter: url(#tritanopia);";
        }

        console.log("Color Blind Filter Applied: ", colorBlindFilter);

        // Apply the font and color settings
        styleTag.textContent = `
            body {
                font-family: ${font} !important;
                font-size: ${fontSize}px !important;
                color: ${fontColor} !important;
                ${colorBlindFilter}
            }
        `;
    }
});
