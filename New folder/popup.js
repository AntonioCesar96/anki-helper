// // popup.js
// const sendMessageButton = document.getElementById('sendMessage')
// sendMessageButton.onclick = async function(e) {
//     let queryOptions = { active: true, currentWindow: true };
//     let tab = await chrome.tabs.query(queryOptions);

//     chrome.tabs.sendMessage(tabs[0].id, {color: "#00FF00"}, function(response) {
//         console.log(response.status);
//     });
// }

setTimeout(async () => {
  let queryOptions = { active: true, currentWindow: true };
  let tab = await chrome.tabs.query(queryOptions);

  chrome.tabs.sendMessage(tabs[0].id, {color: "#00FF00"}, function(response) {
      console.log(response.status);
  });
}, 2000)