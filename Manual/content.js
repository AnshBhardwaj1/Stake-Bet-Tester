// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "scrape_odds") {
            let oddsElement = document.querySelector('.weight-bold.line-height-default.align-left.size-default.text-size-default.variant-action.with-icon-space.svelte-17v69ua');
            let odds = parseFloat(oddsElement.innerText);
            console.log(odds);  // print the odds to the console
            sendResponse({odds: odds});
        }
    }
);