document.getElementById('scan').addEventListener('click', () => {
  document.getElementById('sender').textContent = "Scanning...";
  document.getElementById('links').innerHTML = "";
  document.getElementById('attachments').innerHTML = "";
  const bodyEl = document.getElementById('emailBody');
  if (bodyEl) bodyEl.textContent = "";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { command: "scrapeEmail" }, (response) => {
      if (!response) {
        document.getElementById('sender').textContent = "No response from content script.";
        return;
      }

      document.getElementById('sender').textContent = response.sender || "Sender not found";

      // Check before looping through links
      if (Array.isArray(response.links)) {
        response.links.forEach(link => {
          const li = document.createElement('li');
          li.textContent = link;
          document.getElementById('links').appendChild(li);
        });
      }

      // Check before looping through images
      if (Array.isArray(response.images)) {
        response.images.forEach(src => {
          const li = document.createElement('li');
          li.textContent = src;
          document.getElementById('attachments').appendChild(li);
        });
      }

      if (bodyEl) bodyEl.textContent = response.body || "";
    });
  });
});
