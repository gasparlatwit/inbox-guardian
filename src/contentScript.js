// debug
const DEBUG = true;

function debugLog(message, data = null) {
  if (DEBUG) {
    console.log(`[CONTENT] ${message}`, data);
  }
  
}

// TODO make sure email can be scraped in all views
//listen for scrape request from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "scrapeEmail") {
    try {
      let sender = "Not found";
      // use different methods for different views
      let senderElement = 
        // full opened email
        document.querySelector('.nH.if .ha span[email]') ||
        document.querySelector('.nH.if .gD[email]') ||
        // single email
        document.querySelector('.ii.gt .ha span[email]') ||
        document.querySelector('.ii.gt .gD[email]') ||
        // email header info
        document.querySelector('.adn.ads .go span[email]') ||
        document.querySelector('.adn.ads .gD[email]') ||
        // TODO check email container (test removing)
        document.querySelector('div[data-message-id] .ha span[email]') ||
        document.querySelector('div[data-message-id] .gD[email]') ||
        // email body checking
        document.querySelector('.nH .ha span[email]') ||
        document.querySelector('.nH .gD[email]');

      if (senderElement?.getAttribute) {
        sender = senderElement.getAttribute('email') || "Not found";
      }

      // email body in open email
      const bodyElement = document.querySelector('div.a3s.aiL') || 
                         document.querySelector('div.a3s') ||
                         document.querySelector('.ii.gt div[dir="ltr"]');
      
      const bodyText = bodyElement ? bodyElement.innerText : "Body not found";

      const linkElements = bodyElement ? bodyElement.querySelectorAll('a') : [];
      const links = Array.from(linkElements).map(link => link.href);

      const imageElements = bodyElement ? bodyElement.querySelectorAll('img') : [];
      const images = Array.from(imageElements).map(img => img.src);
      // send all scraped parts back to popup.js
      sendResponse({ sender, body: bodyText, links, images });
    } catch (err) {
      console.error('Error scraping email:', err);
      sendResponse({ sender: "Error", body: "", links: [], images: [] });
    }
  }
  return true;
});