const fs = require('fs');
const dotenv = require('dotenv');
const assert = require('assert');
const template = require('es6-template-strings');
const fetch = require('node-fetch');
const httpsProxyAgent = require('https-proxy-agent');
const moment = require('moment');
const utils = require('./utils');

/**
 * Update these appropriately each time. Also see: `src/data-paths.js`.
 */
const stats = require('./data/general/2017-11-27-stats.json');
const comparisonStats = require('./data/general/2017-10-31-stats.json');

// Load local environment variables from .env
dotenv.load({silent: true});

assert(process.env.STACK_OVERFLOW_API_KEY, 'missing STACK_OVERFLOW_API_KEY in env');

const STACK_OVERFLOW_FROM_DATE_SECS = Math.floor(moment(comparisonStats.updated).valueOf() / 1000);
const STACK_OVERFLOW_KEY = process.env.STACK_OVERFLOW_API_KEY;
const STACK_OVERFLOW_USER_IDS = [396246,4007679,2144525];
const STACK_OVERFLOW_QUESTIONS_URL = `https://api.stackexchange.com/2.2/search/advanced?site=stackoverflow&order=desc&sort=creation&key=${STACK_OVERFLOW_KEY}&q=samsung%20internet&fromdate=${STACK_OVERFLOW_FROM_DATE_SECS}`; 
const STACK_OVERFLOW_ANSWERS_URL = `https://api.stackexchange.com/2.2/users/${STACK_OVERFLOW_USER_IDS.join(';')}/answers?site=stackoverflow&order=desc&sort=activity&key=${STACK_OVERFLOW_KEY}&fromdate=${STACK_OVERFLOW_FROM_DATE_SECS}`;

const GITHUB_API_REPOS_URL = 'https://api.github.com/search/repositories?q=org%3Asamsunginternet';

const upArrow = '↑';
const downArrow = '↓';
const noChangeArrow = '‒';

const comparisonDaysDiff = utils.getDaysDiff(stats.updated, comparisonStats.updated);

const proxy = process.env.http_proxy;
let fetchOptions = null;

if (proxy) {
    console.log('Using proxy server', proxy);
    fetchOptions = {agent: new httpsProxyAgent(proxy)};
}

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
  processedStats.changeSinceLabel = comparisonDaysDiff + ' days';
  
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

async function fetchGithubStats() {

    console.log('Fetching Github stats...');

    try {
        const response = await fetch(GITHUB_API_REPOS_URL, fetchOptions);
        return await response.json();  
    } catch(error) {
        console.log('Error fetching Github stats', error);
    };

}

async function fetchStackOverflowQuestionStats() {

    console.log('Fetching Stack Overflow question stats');

    try {
        const response = await fetch(STACK_OVERFLOW_QUESTIONS_URL, fetchOptions);
        return await response.json();
    } catch(error) {
        console.log('Error fetching Stack Overflow question stats', error);
    }

} 

async function fetchStackOverflowAnswerStats() {

    console.log('Fetching Stack Overflow answer stats');

    try {
        const response = await fetch(STACK_OVERFLOW_ANSWERS_URL, fetchOptions);
        return await response.json();
    } catch(error) {
        console.log('Error fetching Stack Overflow question stats', error);
    }

}

async function fetchStackOverflowStats() {

    try {
        const questionStats = await fetchStackOverflowQuestionStats();
        const answerStats = await fetchStackOverflowAnswerStats();
        return {questions: questionStats, answers: answerStats};
    } catch(error) {
        console.log('Error fetching Stack Overflow stats', error);
    }

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

function updateWithStackOverflowStats(processedStats, stackOverflowStats) {

    processedStats.stackoverflow = {
        questions: stackOverflowStats.questions.items.length,
        answers: stackOverflowStats.answers.items.length
    };

}

function writeHtml(processedStats) {

    const templateHtml = fs.readFileSync('src/template.html', 'utf8');    
    const html = template(templateHtml, processedStats);

    fs.writeFile('index.html', html, function(err) {
        if (err) {
        console.log('Error writing index.html', err);
        } else {
        console.log('Updated index.html ✔');
        }
    });
}

async function fetchStatsAndWriteHtml() {

    let processedStats = processStats(stats, comparisonStats);

    const githubStats = await fetchGithubStats();
    updateWithGithubStats(processedStats, githubStats);

    const stackOverflowStats = await fetchStackOverflowStats();
    updateWithStackOverflowStats(processedStats, stackOverflowStats);

    writeHtml(processedStats);

}

fetchStatsAndWriteHtml();
