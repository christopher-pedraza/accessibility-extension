document.addEventListener("DOMContentLoaded", function () {
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

    document.getElementById("font").addEventListener("change", function () {
        document.getElementById("customFont").style.display =
            this.value === "Custom" ? "block" : "none";
    });

    document.getElementById("apply").addEventListener("click", function () {
        let selectedFont = document.getElementById("font").value;
        if (selectedFont === "Custom") {
            selectedFont = document.getElementById("customFont").value;
        }

        chrome.storage.sync.set({ font: selectedFont }, function () {
            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: (font) => {
                            document.body.style.fontFamily = font;
                        },
                        args: [selectedFont],
                    });
                }
            );
        });
    });
});
