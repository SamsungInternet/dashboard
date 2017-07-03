// Injects our script into the page where it can have access 
// to the __data__ expando properties of the bar graphs.
// (See: https://stackoverflow.com/questions/44889907/chrome-extension-does-not-have-access-to-dom-data)
var s = document.createElement('script');
s.src = chrome.extension.getURL('page-script-medium.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
