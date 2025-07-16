//debug
const DEBUG = true;

function debugLog(message, data = null) {
  if (DEBUG) {
    console.log(`[POPUP] ${message}`, data);
  }
}

// listen for scan click from popup.html
document.getElementById('scan').addEventListener('click', () => {
    document.getElementById('sender').textContent = "Scanning...";
    document.getElementById('links').innerHTML = "";
    document.getElementById('attachments').innerHTML = "";
    
    const resultEl = document.getElementById('scanResult') || (() => {
        const p = document.createElement('p');
        p.id = 'scanResult';
        document.body.appendChild(p);
        return p;
    })();
    resultEl.textContent = "Extracting email content...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { command: "scrapeEmail" }, (response) => {
            if (!response) {
                document.getElementById('sender').textContent = "No response from content script. Try Refreshing the page."; // check why it doesnt always respond
                resultEl.textContent = "Scan failed.";
                return;
            }

            // display info from contentScript scraping
            // TODO make prettier
            document.getElementById('sender').textContent = response.sender || "Sender not found";

            if (Array.isArray(response.links)) {
                response.links.forEach(link => {
                    const li = document.createElement('li');
                    li.textContent = link;
                    document.getElementById('links').appendChild(li);
                });
            }

            if (Array.isArray(response.images)) {
                response.images.forEach(src => {
                    const li = document.createElement('li');
                    li.textContent = src;
                    document.getElementById('attachments').appendChild(li);
                });
            }

            // send body to background.js for prediction
            if (response.body) {
                resultEl.textContent = "Analyzing email for phishing...";
                
                chrome.runtime.sendMessage({
                    // send analze email email signal to background.js
                    action: 'ANALYZE_EMAIL',
                    emailData: {
                        body: response.body,
                        sender: response.sender,
                        links: response.links,
                        images: response.images
                    }
                }, (analysisResponse) => {
                    if (analysisResponse.success) {
                        // rating done in backround.js. be sure to re-bundle
                        resultEl.textContent = `${analysisResponse.score}`;
                    } else {
                        resultEl.textContent = `Analysis failed: ${analysisResponse.error}`;
                    }
                });
            } else {
                resultEl.textContent = "No email body found to analyze.";
            }
        });
    });
});