var cash = 2000;
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
        var invest1 = Math.round((cash / (1 + n1/n2)) * 100) / 100;
        var invest2 = Math.round(cash - invest1);
        var profit1 = Math.round(invest1 * n1 * 100) / 100;
        var profit2 = Math.round(invest2 * n2 * 100) / 100;
        var profit = Math.round((profit1 + profit2) / 2);
        var loss = Math.round(cash - profit);
        var result = '<tr><td>' + invest1 + '</td><td>' + n1 + '</td><td>' + team1 + '</td></tr>';
        result += '<tr><td>' + invest2 + '</td><td>' + n2 + '</td><td>' + team2 + '</td></tr>';
        result += (profit1 > cash || profit2 > cash) ? '<tr><td colspan="3">Profitable</td></tr>' : '<tr><td colspan="3">Loss = ' + loss + '</td></tr>';
        result += '<tr><td colspan="3">Profit if both hit six = ' + profit + '</td></tr>';
        document.getElementById('result').innerHTML = result;
    });
});