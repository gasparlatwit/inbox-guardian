document.getElementById('scan').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const senderElement = document.querySelector('span[email]');
        return senderElement ? senderElement.getAttribute('email') : "Sender not found";
      }
    }).then((results) => {
      const result = results[0]?.result || "Error retrieving sender";
      document.getElementById('sender').textContent = result;
    }).catch((err) => {
      console.error("Script injection failed:", err);
      document.getElementById('sender').textContent = "Script error";
    });
  });
});
