# Samsung Internet Developer Advocacy Dashboard

**In progress...** 

For now, this is all quite manual. Hopefully over time we can automate it a lot more.

## How to update general stats

Update `data/stats.json`.

* To find Medium stats, see [here](https://medium.com/samsung-internet-dev/stats/overview) and the followers [here](https://medium.com/samsung-internet-dev/latest).
* To find Twitter stats, see [here](https://analytics.twitter.com). (Ask Daniel for the login).
* To find Facebook stats, check the 28 day like increase [here](https://www.facebook.com/samsunginternet/insights/) and look for 'follows' on the right-hand side [here](https://www.facebook.com/samsunginternet).
* To find Instagram followers, see [here](https://www.instagram.com/samsunginternet/).

## How to update Medium graph

* Visit [medium.com/samsung-internet-dev/stats/overview](https://medium.com/samsung-internet-dev/stats/overview)
* Update `scripts/medium-stats-overview-to-csv.js` with the `initialDay` (also the `minutesReadMaxAxis`, `viewsMaxAxis` and `visitorsMaxAxis` if necessary?).
* Paste the content of `scripts/medium-stats-overview-to-csv.js` into the Chrome debug console.
* Copy/move the downloaded CSV file to `data/medium-stats-overview-[date].csv`.
* Update `src/index.js` with the new filename.
