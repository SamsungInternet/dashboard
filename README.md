# Samsung Internet Developer Advocacy Dashboard

[![A preview of part of the dashboard](images/dashboard-preview-crop.png)](https://samsunginter.net/dashboard)

## What is this?

It's a dashboard showing metrics for our Samsung Internet developer advocacy work, as well as 
trends for web technologies such as PWAs and WebVR.

## When and how is it updated?

We intend to update it each week. Unfortunately for now, it will involve a few minutes of manual work. 
Our social media platforms do not currently provide analytics data via APIs. However, hopefully over time 
we can automate it more, either using APIs if/when provided, automated scraping, or (at least) additions 
to the [Dashboard Updater browser extension](extension/README.md).

(For the Samsung Internet team) here are the current instructions:

### General stats

* Add a new stats JSON file with today's date, e.g. `data/general/2017-06-14-stats.json`, and update with the latest data:
  * To find Medium stats, see [here](https://medium.com/samsung-internet-dev/stats/overview) and the followers [here](https://medium.com/samsung-internet-dev/latest).
  * To find Twitter stats, see [here](https://analytics.twitter.com). (Ask Daniel for the login).
  * To find Facebook stats, check the 28 day like increase [here](https://www.facebook.com/samsunginternet/insights/) and look for 'follows' on the right-hand side [here](https://www.facebook.com/samsunginternet).
  * To find Instagram followers, see [here](https://www.instagram.com/samsunginternet/).
  * To find the average Github issue response time, see [here and click the little refresh link](http://issuestats.com/github/samsunginternet/support).
  * To get the SEO rankings, I previously used [serps.com/tools/rank-checker/](https://serps.com/tools/rank-checker/) but it seems to no longer work, so I'm now testing at google.com (select "Use google.com" or it will redirect back), using a private browsing session.
* Update the filenames in `src/data-paths.js`.

### Medium graph

* Install the Dashboard Updater Chrome extension from the `extension` subdirectory. [Here's how](https://developer.chrome.com/extensions/getstarted#unpacked).
* Visit [medium.com/samsung-internet-dev/stats/overview](https://medium.com/samsung-internet-dev/stats/overview).
* Click the 'Download Medium stats' button.
* Copy/move the downloaded CSV file to the `data/medium` directory & update `src/data-paths.js` with the new filename.

### Survey pie charts

* For our event survey feedback, see [the Google spreadsheet here](https://docs.google.com/spreadsheets/d/1SxnLKkhqOPZPCEYzX0S0WVPaNN6Hs5vFhOi4Py8bLHs/edit#gid=2048114756).
* Update the variable at the top of `index.js`.

### And then...

```
npm start
```

This will run `update.js` and spit out the new `index.html`, based on the template in `src/template.html`.

Now this page can be served with any static HTML server. We're hosting on Github Pages - just push to `master` to deploy.
