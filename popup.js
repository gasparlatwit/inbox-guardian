document.getElementById('scan').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: () => {
        alert("Will run the thing once its working i think");
      }
    });
  });
});
