// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "scrape_odds") {
            let oddsElements = document.querySelectorAll('.weight-bold.line-height-default.align-left.size-default.text-size-default.variant-action.with-icon-space.svelte-17v69ua');
            let teamElements = document.querySelectorAll('.name.svelte-1yo4ude');
            
            let team1 = teamElements[0].innerText;
            let team2 = teamElements[1].innerText;
            
            let odds1 = parseFloat(oddsElements[0].innerText);
            let odds2 = parseFloat(oddsElements[1].innerText);
            
            console.log(team1, odds1);  // print the team name and odds to the console
            console.log(team2, odds2);  // print the team name and odds to the console
            
            sendResponse({team1: team1, odds1: odds1, team2: team2, odds2: odds2});
        }
    }
);