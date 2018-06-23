var MEDIUM_OVERVIEW_URL = 'https://medium.com/samsung-internet-dev/stats/overview';
var MEDIUM_STORIES_URL = 'https://medium.com/samsung-internet-dev/stats/stories';
var MEDIUM_STORIES_ME_URL = 'https://medium.com/me/stats';

var btnMediumOverview;

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
    if (btnMediumOverview) {
      btnMediumOverview.disabled = (url !== MEDIUM_OVERVIEW_URL);
    }
    if (btnMediumStories) {
      btnMediumStories.disabled = (url !== MEDIUM_STORIES_URL && url !== MEDIUM_STORIES_ME_URL);
    }
  });

}

document.addEventListener('DOMContentLoaded', function() {

  updateEnabledButtons();

  btnMediumOverview = document.getElementById('btn-medium-overview');
  btnMediumStories = document.getElementById('btn-medium-stories');

  btnMediumOverview.addEventListener('click', function() {

    getCurrentTabUrl(function(url) {
      if (url === MEDIUM_OVERVIEW_URL) {
        
        console.log('Medium Overview');

        chrome.tabs.executeScript({
          file: 'content-script-medium-overview.js',
          runAt: 'document_end'
        });
      }
    });
  });

  btnMediumStories.addEventListener('click', function() {

    getCurrentTabUrl(function(url) {
      if (url === MEDIUM_STORIES_URL || url === MEDIUM_STORIES_ME_URL) {
        
        console.log('Medium Stories');

        chrome.tabs.executeScript({
          file: 'content-script-medium-stories.js',
          runAt: 'document_end'
        });
      }
    });
  });

  chrome.tabs.onUpdated.addListener( updateEnabledButtons );

});
