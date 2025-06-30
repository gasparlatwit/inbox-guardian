
let model;
let wordIndex;

async function loadModelAndIndex() {
    model = await tf.loadLayersModel(chrome.runtime.getURL('model.json'));
    const response = await fetch(chrome.runtime.getURL('word_index.json'));
    wordIndex = await response.json();
}

loadModelAndIndex();

function preprocessText(text) {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleaned.split(/\s+/);
    const seq = words.map(word => wordIndex[word] || 1);
    const maxLen = 80;
    return seq.length > maxLen ? seq.slice(0, maxLen) : Array(maxLen - seq.length).fill(0).concat(seq);
}

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
    resultEl.textContent = "Running analysis...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { command: "scrapeEmail" }, (response) => {
            if (!response) {
                document.getElementById('sender').textContent = "No response from content script.";
                resultEl.textContent = "Scan failed.";
                return;
            }

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

            if (model && wordIndex && response.body) {
                const inputSeq = preprocessText(response.body);
                const inputTensor = tf.tensor2d([inputSeq], [1, 80]);
                const prediction = model.predict(inputTensor);

                prediction.data().then(data => {
                    const score = data[0];
                    resultEl.textContent = score > 0.5
                        ? `⚠️ Potential Phishing (Confidence: ${(score * 100).toFixed(2)}%)`
                        : `✅ Likely Safe (Confidence: ${((1 - score) * 100).toFixed(2)}%)`;
                });
            } else {
                resultEl.textContent = "Model not ready or no email body.";
            }
        });
    });
});