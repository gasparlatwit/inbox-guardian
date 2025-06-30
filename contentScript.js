chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "scrapeEmail") {
    try {
      let sender = "Not found";
      
      // Look for sender in the currently opened email conversation
      // Try different selectors for the opened email view
      let senderElement = 
        // For opened email in conversation view
        document.querySelector('.nH.if .ha span[email]') ||
        document.querySelector('.nH.if .gD[email]') ||
        // For single email view
        document.querySelector('.ii.gt .ha span[email]') ||
        document.querySelector('.ii.gt .gD[email]') ||
        // More specific selectors for email header area
        document.querySelector('.adn.ads .go span[email]') ||
        document.querySelector('.adn.ads .gD[email]') ||
        // Alternative approach - look within the email container
        document.querySelector('div[data-message-id] .ha span[email]') ||
        document.querySelector('div[data-message-id] .gD[email]') ||
        // Fallback to original selectors but within email body area
        document.querySelector('.nH .ha span[email]') ||
        document.querySelector('.nH .gD[email]');

      if (senderElement?.getAttribute) {
        sender = senderElement.getAttribute('email') || "Not found";
      }

      // Also look for the email body in the opened email
      const bodyElement = document.querySelector('div.a3s.aiL') || 
                         document.querySelector('div.a3s') ||
                         document.querySelector('.ii.gt div[dir="ltr"]');
      
      const bodyText = bodyElement ? bodyElement.innerText : "Body not found";

      const linkElements = bodyElement ? bodyElement.querySelectorAll('a') : [];
      const links = Array.from(linkElements).map(link => link.href);

      const imageElements = bodyElement ? bodyElement.querySelectorAll('img') : [];
      const images = Array.from(imageElements).map(img => img.src);

      sendResponse({ sender, body: bodyText, links, images });
    } catch (err) {
      console.error('Error scraping email:', err);
      sendResponse({ sender: "Error", body: "", links: [], images: [] });
    }
  }
  return true;
});