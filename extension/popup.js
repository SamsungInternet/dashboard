var MEDIUM_URL = 'https://medium.com/samsung-internet-dev/stats/overview';
var btnMedium;

// Based on popup sample, copyright (c) 2014 The Chromium Authors
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function updateEnabledButtons() {

  getCurrentTabUrl(function(url) {
    if (btnMedium) {
      btnMedium.disabled = (url !== MEDIUM_URL);
    }
  });

}

document.addEventListener('DOMContentLoaded', function() {

  updateEnabledButtons();

  btnMedium = document.getElementById('btn-medium');

  btnMedium.addEventListener('click', function() {

    getCurrentTabUrl(function(url) {
      if (url === MEDIUM_URL) {
        
        console.log('Medium page - download Medium stats...');

        chrome.tabs.executeScript({
          file: 'content-script-medium.js',
          runAt: 'document_end'
        });
      }
    });
  });

  chrome.tabs.onUpdated.addListener( updateEnabledButtons );

});
