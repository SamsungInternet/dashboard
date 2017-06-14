# Samsung Internet Developer Advocacy Dashboard

**In progress...** 

For now, this is all quite manual. Hopefully over time we can automate it a lot more.

## How to update general stats

Add a new stats JSON file with today's date, e.g. `data/stats-2017-06-14.json`.

* To find Medium stats, see [here](https://medium.com/samsung-internet-dev/stats/overview) and the followers [here](https://medium.com/samsung-internet-dev/latest).
* To find Twitter stats, see [here](https://analytics.twitter.com). (Ask Daniel for the login).
* To find Facebook stats, check the 28 day like increase [here](https://www.facebook.com/samsunginternet/insights/) and look for 'follows' on the right-hand side [here](https://www.facebook.com/samsunginternet).
* To find Instagram followers, see [here](https://www.instagram.com/samsunginternet/).
* Update `index.js` with the new stats JSON filename.

## How to update Medium graph

* Visit [medium.com/samsung-internet-dev/stats/overview](https://medium.com/samsung-internet-dev/stats/overview)
* Update `scripts/medium-stats-overview-to-csv.js` with the `initialDay` (also the `minutesReadMaxAxis`, `viewsMaxAxis` and `visitorsMaxAxis` if necessary?).
* Paste the content of `scripts/medium-stats-overview-to-csv.js` into the Chrome debug console.
* Copy/move the downloaded CSV file to the `data` directory.
* Update `src/index.js` with the new filename.

## How to update the survey pie chart

For survey feedback, see [the Google spreadsheet here](https://docs.google.com/spreadsheets/d/1SxnLKkhqOPZPCEYzX0S0WVPaNN6Hs5vFhOi4Py8bLHs/edit#gid=2048114756).

