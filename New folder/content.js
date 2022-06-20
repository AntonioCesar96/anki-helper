// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.color === "green") {
        document.body.style.backgroundColor = "green";
        sendResponse({status: "done"});
      }
    }
);