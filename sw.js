'use strict';

var version = 2;

importScripts('lib/sw-toolbox.js');
importScripts('src/data-paths.js');

var precacheList = [
  'index.html',
  'src/index.js',
  'images/favicon.png',
  'images/icon192.png',
  'images/icon512.png',
  'images/samsung-internet-logo-text.svg',
  mediumStatsCSVPath,
  statsJSONPath
];

console.log('precacheList', precacheList);

toolbox.precache(precacheList);

toolbox.router.get('/images/*', toolbox.cacheFirst);

toolbox.router.get('/*', toolbox.networkFirst, {
  networkTimeoutSeconds: 5
});

console.log('Service worker version', version);