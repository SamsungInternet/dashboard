const fs = require('fs');
const template = require('es6-template-strings');
const fetch = require('isomorphic-fetch');
const moment = require('moment');
const utils = require('./utils');
const stats = require('./data/general/2017-11-13-stats.json');
const comparisonStats = require('./data/general/2017-10-10-stats.json');

const GITHUB_API_REPOS_URL = 'https://api.github.com/search/repositories?q=org%3Asamsunginternet';

const upArrow = '↑';
const downArrow = '↓';
const noChangeArrow = '‒';

const comparisonDaysDiff = utils.getDaysDiff(stats.updated, comparisonStats.updated);


function updateStatWithChange(data, comparisonData, pathToStat, lowerIsBetter) {

    var statAndComparison = utils.getStatWithComparison(data, comparisonData, pathToStat),
        stat = statAndComparison[0],
        comparisonStat = statAndComparison[1],
        groupName = pathToStat[0],
        statId = pathToStat[pathToStat.length - 1],
        count = stat.count,
        comparisonCount = comparisonStat.count,
        changeDirection = utils.getChangeDirection(count, comparisonCount, lowerIsBetter);

    stat.formattedCount = utils.formatNumberValue(count);
    stat.change = utils.formatChangeValue(count, comparisonCount, lowerIsBetter);
    stat.changeLabel = comparisonDaysDiff + ' days';
    stat.changeDirection = changeDirection;

    if (changeDirection === 'up') {
        stat.changeArrow = upArrow;
    } else if (changeDirection === 'down') {
        stat.changeArrow = downArrow;
    } else {
        stat.changeArrow = noChangeArrow;
    }
    
    if (stat.link) {
        stat.formattedlink = `<a href="${stat.link}">${utils.formatDisplayUrl(stat.link)}</a>`;
    }

}

function processStats(stats, comparisonStats) {

  let processedStats = {};
  
  // Copy stats to keep the original object clean
  Object.assign(processedStats, stats);

  // Add the comparison data for each stat we want to display 
  updateStatWithChange(processedStats, comparisonStats, ['devHub', 'audience', 'uniqueVisitors']);
  updateStatWithChange(processedStats, comparisonStats, ['medium', 'audience', 'followers']);
  updateStatWithChange(processedStats, comparisonStats, ['twitter', 'audience', 'followers']);
  updateStatWithChange(processedStats, comparisonStats, ['facebook', 'audience', 'followers']);
  updateStatWithChange(processedStats, comparisonStats, ['facebook', 'audience', 'reach']);
  updateStatWithChange(processedStats, comparisonStats, ['instagram', 'audience', 'followers']);

  updateStatWithChange(processedStats, comparisonStats, ['twitter', 'engagement', 'impressions']);
  updateStatWithChange(processedStats, comparisonStats, ['twitter', 'engagement', 'mentions']);
  updateStatWithChange(processedStats, comparisonStats, ['facebook', 'engagement', 'views']);
  updateStatWithChange(processedStats, comparisonStats, ['facebook', 'engagement', 'engagements']);
  updateStatWithChange(processedStats, comparisonStats, ['medium', 'engagement', 'views']);
  updateStatWithChange(processedStats, comparisonStats, ['github', 'issues', 'closeTimeAvg']);

  updateStatWithChange(processedStats, comparisonStats, ['seo', 'webvr'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'webPayments'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'pwas'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'physicalWeb'], true);

  // Add some additional data we want to display
  processedStats.lastUpdated = moment(stats.updated).format('DD MMMM YYYY');
  
  processedStats.totalFollowers = utils.formatNumberValue(
        stats.medium.audience.followers.count +
        stats.twitter.audience.followers.count +
        stats.facebook.audience.followers.count +
        stats.instagram.audience.followers.count);

  processedStats.totalImpressions = utils.formatNumberValue(
        stats.twitter.engagement.impressions.count +
        stats.facebook.engagement.views.count +
        stats.medium.engagement.views.count);

  return processedStats;

}

function updateWithGithubStats(processedStats, githubStats) {

    var totalStars = 0;
    var totalForks = 0;
    var supportRepo;

    for (var i=0; i < githubStats.items.length; i++) {

        var repo = githubStats.items[i];

        totalStars += repo['stargazers_count'];
        totalForks += repo['forks'];

        if (repo.name === 'support') {
            supportRepo = repo;
        }

    }

    processedStats.github.repositories = githubStats['total_count'];
    processedStats.github.stars = totalStars;
    processedStats.github.forks = totalForks;

    processedStats.github.issues.openIssues = supportRepo['open_issues_count'];

}

const templateHtml = fs.readFileSync('src/template.html', 'utf8');
let processedStats = processStats(stats, comparisonStats);

console.log('Fetching Github stats...');

fetch(GITHUB_API_REPOS_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(githubStats) {
  
      updateWithGithubStats(processedStats, githubStats);

      const html = template(templateHtml, processedStats);

      fs.writeFile('index.html', html, function(err) {
        if (err) {
          console.log('Error writing index.html', err);
        } else {
          console.log('Updated index.html ✔');
        }
      });
  })
  .catch(function(error) {
      console.log('Error fetching Github stats', error);
  });
