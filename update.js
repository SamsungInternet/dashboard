//var mediumStatsCSVPath = 'data/medium/2017-11-13-medium-overview.csv';

const fs = require('fs');
const template = require('es6-template-strings');
const moment = require('moment');
const utils = require('./utils');
const stats = require('./data/general/2017-11-13-stats.json');
const comparisonStats = require('./data/general/2017-10-10-stats.json');

console.log('stats...', stats);

const twitterSurveyAwarePercent = 37;
const eventSurveyAwarePercent = 42;

const upArrow = '↑';
const downArrow = '↓';

const labelCount = 0;
const comparisonDaysDiff = 0;


function updateStatWithChange(data, comparisonData, pathToStat, lowerIsBetter) {

    var statAndComparison = utils.getStatWithComparison(data, comparisonData, pathToStat),
        stat = statAndComparison[0],
        comparisonStat = statAndComparison[1],
        groupName = pathToStat[0],
        statId = pathToStat[pathToStat.length - 1],
        count = stat.count,
        comparisonCount = comparisonStat.count,
        changeDirection = utils.getChangeDirection(count, comparisonCount, lowerIsBetter);

    stat.formattedcount = utils.formatNumberValue(count);
    stat.change = utils.formatChangeValue(count, comparisonCount, lowerIsBetter);
    stat.changelabel = comparisonDaysDiff + ' days';
    stat.changearrow = changeDirection === 'up' ? upArrow : downArrow;
    stat.changedirection = changeDirection;

    if (stat.link) {
        stat.formattedlink = utils.formatDisplayUrl(stat.link);
    }

}

/**
 * This adds extra comparison data for each stat to the JSON 
 */
function processStats(stats, comparisonStats) {

  let processedStats = {lastupdated: moment(stats.updated).format('DD MMMM YYYY')};

  Object.assign(processedStats, stats);

  updateStatWithChange(processedStats, comparisonStats, ['devhub', 'audience', 'uniquevisitors']);
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
  updateStatWithChange(processedStats, comparisonStats, ['github', 'issues', 'close-time-avg']);

  updateStatWithChange(processedStats, comparisonStats, ['seo', 'webvr'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'webpayments'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'pwas'], true);
  updateStatWithChange(processedStats, comparisonStats, ['seo', 'physicalweb'], true);

  return processedStats;

}

const templateHtml = fs.readFileSync('src/template.html', 'utf8');
const processedStats = processStats(stats, comparisonStats);
const html = template(templateHtml, processedStats);

// TODO write html to index.html file
console.log('RESULT\n', html);
