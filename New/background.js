// background.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "popup_opened") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "scrape_odds"}, function(response) {
                    chrome.runtime.sendMessage({message: "odds_scraped", odds1: response.odds1, odds2: response.odds2});
                });
            });
        }
    }
);