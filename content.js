chrome.storage.sync.get("font", ({ font }) => {
    if (font) {
        document.body.style.fontFamily = font;
    }
});

// Listen for storage changes and update the font dynamically
chrome.storage.onChanged.addListener((changes) => {
    if (changes.font) {
        document.body.style.fontFamily = changes.font.newValue;
    }
});
