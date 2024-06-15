// popup.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateInvestment);

    document.getElementById('n1').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('calculate').click();
        }
    });

    document.getElementById('n2').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('calculate').click();
        }
    });

    // background.js
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "scrape_odds"}, function(response) {
            console.log(response.odds);  // print the odds to the extension's console
        });
    });

    // popup.js
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "odds_scraped") {
                document.getElementById('n1').value = request.odds1;
                document.getElementById('n2').value = request.odds2;
                calculateInvestment();  // Call the function here
            }
        }
    );

    // Send a message to the background script when the popup is opened
    chrome.runtime.sendMessage({message: "popup_opened"});

});

// Rest of the calculateInvestment function...

function calculateInvestment() {
    var n1 = parseFloat(document.getElementById('n1').value);
    var n2 = parseFloat(document.getElementById('n2').value);
    var cash = 1000;
    var team1 = "Team1";
    var team2 = "Team2";

    var invest1_raw = Math.round(((cash / (1 + n1 / n2)) * 100) / 100);
    var invest2_raw = Math.round(cash - invest1_raw);
    var factor;
    var invest1;
    var invest2;
    if (invest1_raw > invest2_raw){
        factor = 500/invest2_raw;
        invest1 = Math.round(factor*invest1_raw);
        invest2 = 500;
    }
    else{
        factor = 500/invest1_raw;
        invest2 = Math.round(factor*invest2_raw);
        invest1 = 500;
    }
    cash = invest1+invest2;

    var pinvested = [invest1, invest2];  // Define pinvested here

    var profit1 = Math.round(pinvested[0] * n1 * 100) / 100;
    var profit2 = Math.round(pinvested[1] * n2 * 100) / 100;
    var profit = Math.round((profit1 + profit2) / 2);
    var loss = Math.round(cash - profit);
    var risk_percentage = Math.round((loss / cash) * 100 * 100) / 100;

    var result = '<table>';
    result += '<tr><td>' + pinvested[0] + '</td><td>' + n1 + '</td><td>' + team1 + '</td></tr>';
    result += '<tr><td>' + pinvested[1] + '</td><td>' + n2 + '</td><td>' + team2 + '</td></tr>';
    result += '<tr><td colspan="3">Loss = ' + loss + '</td></tr>';
    result += '<tr><td colspan="3">Profit if promo happens = ' + profit + '</td></tr>';
    result += '<tr><td colspan="3">Risk % = ' + risk_percentage + '</td></tr>';
    result += '</table>';

    document.getElementById('result').innerHTML = result;
}
