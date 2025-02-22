chrome.storage.sync.get(
    ["font", "fontSize", "fontColor"],
    ({ font, fontSize, fontColor }) => {
        let styleTag = document.createElement("style");
        styleTag.id = "fontChangerStyles";

        let styles = `
        * {
            font-family: ${font || "inherit"} !important;
            font-size: ${fontSize || "16"}px !important;
            color: ${fontColor || "black"} !important;
        }
    `;

        styleTag.textContent = styles;

        // Remove existing style tag if it exists
        let existingStyle = document.getElementById("fontChangerStyles");
        if (existingStyle) existingStyle.remove();

        document.head.appendChild(styleTag);
    }
);

// Listen for storage changes and update dynamically
chrome.storage.onChanged.addListener((changes) => {
    let newFont = changes.font?.newValue || "inherit";
    let newFontSize = changes.fontSize?.newValue || "16";
    let newFontColor = changes.fontColor?.newValue || "black";

    let updatedStyles = `
        * {
            font-family: ${newFont} !important;
            font-size: ${newFontSize}px !important;
            color: ${newFontColor} !important;
        }
    `;

    let styleTag = document.getElementById("fontChangerStyles");
    if (styleTag) {
        styleTag.textContent = updatedStyles;
    }
});
