# Samsung Internet Developer Advocacy Dashboard

**In progress...** 

For now, this is all quite manual. Hopefully over time we can automate it a lot more.

## How to update Medium stats

* Visit [medium.com/samsung-internet-dev/stats/overview](https://medium.com/samsung-internet-dev/stats/overview)
* Update `scripts/medium-stats-overview-to-csv.js` with the latest `minutesReadMaxAxis`, `viewsMaxAxis`, `visitorsMaxAxis` and `initialDay`.
* Paste the content of `scripts/medium-stats-overview-to-csv.js` into the Chrome debug console.
* Copy/move the downloaded CSV file to `data/medium-stats-overview-[date].csv`.
* Update `src/index.js` with the new filename.
