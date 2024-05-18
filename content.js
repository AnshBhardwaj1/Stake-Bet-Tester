chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('Received message from popup script', request);
        if (request.message === "get_data") {
            var returns = document.getElementsByClassName('weight-bold line-height-default align-left size-default text-size-default variant-action with-icon-space svelte-17v69ua');
            var teams = document.getElementsByClassName('name svelte-3mqlbj');
            var overDiv = document.querySelector('.sr-simcrick-scb__status');
            var currentOver = overDiv ? overDiv.getElementsByTagName('span')[2].textContent.trim() : null;
            console.log('Selected elements', returns, teams, currentOver);
            var returnData = Array.from(returns).map(element => element.innerText);
            var teamNames = Array.from(teams).map(element => element.innerText);
            sendResponse({data: returnData, teamNames: teamNames, currentOver: currentOver});
        }
    }
);