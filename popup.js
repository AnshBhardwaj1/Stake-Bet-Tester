var cash = 1000;
var oldRates = [0, 0]; 
var pinvested = [0, 0]; 
var highestObservedOdds = [0, 0];
var cashoutThreshold = [0, 0];
var oversPassed = false; 

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log('Sending message to content script');
    chrome.tabs.sendMessage(tabs[0].id, {message: "get_data"}, function(response) {
        if (chrome.runtime.lastError || !response || !response.data || !response.teamNames || response.teamNames.length < 2) {
            console.log('Failed to get data');
            document.getElementById('result').innerHTML = '<tr><td colspan="3">Failed to get data</td></tr>';
            return;
        }
        console.log('Received response from content script', response);
        var data = response.data.map(parseFloat);
        var team1 = response.teamNames[0];
        var team2 = response.teamNames[1];
        var n1 = data[0];
        var n2 = data[1];
        if (isNaN(n1) || isNaN(n2)) {
            console.log('Invalid data');
            document.getElementById('result').innerHTML = '<tr><td colspan="3">Invalid data</td></tr>';
            return;
        }

        if (!oversPassed) {
            updateHighestOdds(n1, n2);
        }

        if (oldRates[0] === 0 && oldRates[1] === 0) {
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
            pinvested = [invest1, invest2]; 
            oldRates = [n1, n2]; 
        }

        if (someConditionToCheckIf8OversHavePassed() && !oversPassed) {
            calculateCashoutThresholds();
            oversPassed = true;
        }

        var profit1 = Math.round(pinvested[0] * n1 * 100) / 100;
        var profit2 = Math.round(pinvested[1] * n2 * 100) / 100;
        var profit = Math.round((profit1 + profit2) / 2);
        var loss = Math.round(cash - profit);
        var result = '<tr><td>' + pinvested[0] + '</td><td>' + n1 + '</td><td>' + team1 + '</td></tr>';
        result += '<tr><td>' + pinvested[1] + '</td><td>' + n2 + '</td><td>' + team2 + '</td></tr>';
        result += (profit1 > cash || profit2 > cash) ? '<tr><td colspan="3" class="profit">Profitable</td></tr>' : '<tr><td colspan="3" class="loss">Loss = ' + loss + '</td></tr>';
        result += '<tr><td colspan="3">Profit if both hit six = ' + profit + '</td></tr>';
        var cashoutResult1 = calculateCashout(n1, 0);
        var cashoutResult2 = calculateCashout(n2, 1);
        result += '<tr><td colspan="3">Current Cashout for ' + team1 + ' = ' + Math.round(cashoutResult1.cashout) + '</td></tr>';
        result += '<tr><td colspan="3">Current Cashout for ' + team2 + ' = ' + Math.round(cashoutResult2.cashout) + '</td></tr>';
        document.getElementById('result').innerHTML = result;
    });
});

function updateHighestOdds(n1, n2) {
    if (highestObservedOdds[0] < n1) {
        highestObservedOdds[0] = n1;
    }
    if (highestObservedOdds[1] < n2) {
        highestObservedOdds[1] = n2;
    }
}

function calculateCashoutThresholds() {
    cashoutThreshold[0] = (oldRates[0] / highestObservedOdds[0]) * 0.9 * pinvested[0];
    cashoutThreshold[1] = (oldRates[1] / highestObservedOdds[1]) * 0.9 * pinvested[1];
}

function calculateCashout(newRate, teamIndex) {
    var cashout = (oldRates[teamIndex] / newRate) * pinvested[teamIndex] * 0.8;
    var profit = cashout - pinvested[teamIndex];
    var cashout_onesix = cashout + profit - cash;
    var optimal_exit = cashout > cashoutThreshold[teamIndex] ? "Yes" : "No";
    return {cashout: cashout, cashout_onesix: cashout_onesix, optimal_exit: optimal_exit};
}


