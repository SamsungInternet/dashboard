var GITHUB_API_REPOS_URL = 'https://api.github.com/search/repositories?q=org%3Asamsunginternet';

var twitterSurveyAwarePercent = 37;
var eventSurveyAwarePercent = 42;

var upArrow = '↑';
var downArrow = '↓';

var labelCount = 0;

var comparisonDaysDiff = 0;


function setupSurveyChart(chartId, awarePercent) {

    var data = {
        series: [awarePercent, 100 - awarePercent]
    };

    var sum = function(a, b) { return a + b };

    var options = {
        width: 250,
        height: 250,
        fullWidth: false,
        labelInterpolationFnc: function(value) {
            return value + '%';
        }
    };

    new Chartist.Pie(`#${chartId}-survey-chart`, data, options);
}

function setupSurveyCharts() {
    setupSurveyChart('twitter', twitterSurveyAwarePercent);
    setupSurveyChart('event', eventSurveyAwarePercent);

    window.addEventListener('resize', function(event) {
        labelCount = 0;
    });

}

function parseMediumCSV() {
    Papa.parse(mediumStatsCSVPath, {
        download: true,
        complete: function(data) {
            console.log('Medium data', data);
            setupMediumChart(data);
        }
    });
}

function setupMediumChart(mediumData) {

    // Date, Minutes Read, Views, Visitors

    var labels = [];
    var totalTimeReadMins = [];
    var views = [];
    var dailyUniqueVisitors = [];

    var rows = mediumData.data.slice(1, mediumData.data.length - 1);

    rows.forEach(function(row) {
        if (row[2] !== 'null') {
            labels.push( row[0] );
            totalTimeReadMins.push( row[1] );
            views.push( row[2] );
            dailyUniqueVisitors.push( row[3] );
        }
    });

    var data = {
        labels: labels,
        series: [
            totalTimeReadMins,
            views,
            dailyUniqueVisitors
        ]
    };

    var options = {
        labelOffset: 50,
        height: 240,
        axisX: {
            showGrid: false,
            labelInterpolationFnc: function(value) {
                // Display one label every week
                if (labelCount++ % 7 === 0) {
                    return moment(value).format('D/M/Y');
                }
            }
        },
        axisY: {
            onlyInteger: true
        },
        seriesBarDistance: 5,
        showPoint: false,
        lineSmooth: false
    };

    Chartist.Line('#medium-chart', data, options);
}

function parseStatsJSON() {

    fetch(statsJSONPath)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            fetch(comparisonStatsJSONPath)
                .then(function(comparisonResponse) {
                    return comparisonResponse.json();
                })
                .then(function(comparisonData) {
                    return updateStats(data, comparisonData);
                });
        })
        .catch(function(error) {
            console.error('Error parsing stats JSON', error);
        });

}

function parseGithubJSON() {

    fetch(GITHUB_API_REPOS_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return updateGithubStats(data);
        })
        .catch(function(error) {
            console.error('Error parsing Github JSON', error);
        });

}

function updateChangeArrow(arrowEl, count, comparisonCount, lowerIsBetter) {

    if (count - comparisonCount < 0) {
        if (lowerIsBetter) {
            arrowEl.innerHTML = upArrow;
            arrowEl.classList.add('up');
        } else {
            arrowEl.innerHTML = downArrow;
            arrowEl.classList.add('down');
        }
    } else {
        if (lowerIsBetter) {
            arrowEl.innerHTML = downArrow;
            arrowEl.classList.add('down');
        } else {
            arrowEl.innerHTML = upArrow;
            arrowEl.classList.add('up');
        }
    }

}

function updateGithubStats(data) {

    var totalStars = 0;
    var totalForks = 0;

    for (var i=0; i < data.items.length; i++) {

        var repo = data.items[i];

        totalStars += repo['stargazers_count'];
        totalForks += repo['forks'];

    }

    document.getElementById('github-repositories').innerHTML = data['total_count'];
    document.getElementById('github-stars').innerHTML = totalStars;
    document.getElementById('github-forks').innerHTML = totalForks;

}

function updateStatWithChange(data, comparisonData, pathToStat, lowerIsBetter) {

    var statAndComparison = getStatWithComparison(data, comparisonData, pathToStat),  
        stat = statAndComparison[0],
        comparisonStat = statAndComparison[1],
        groupName = pathToStat[0],
        statId = pathToStat[pathToStat.length - 1],
        count = stat.count,
        comparisonCount = comparisonStat.count,
        link = stat.link;

    document.getElementById(`${groupName}-${statId}`).innerHTML = formatNumberValue(count);
    document.getElementById(`${groupName}-${statId}-change`).innerHTML = formatChangeValue(count, comparisonCount, lowerIsBetter);

    var changeLabelEl = document.getElementById(`${groupName}-${statId}-change-label`);

    if (changeLabelEl) {
        changeLabelEl.innerHTML = comparisonDaysDiff + ' days';
    }
 
    var arrowEl = document.getElementById(`${groupName}-${statId}-change-arrow`); 

    updateChangeArrow(arrowEl, count, comparisonCount, lowerIsBetter);
    
    var linkEl = document.getElementById(`${groupName}-${statId}-link`);

    if (link && linkEl) {
        linkEl.href = link;
    }

}

function updateStats(data, comparisonData) {

    if (data.updated) {
        document.getElementById('last-updated').innerHTML = moment(data.updated).format('DD MMMM YYYY');
        comparisonDaysDiff = getDaysDiff(data.updated, comparisonData.updated);
    }

    updateStatWithChange(data, comparisonData, ['devhub', 'audience', 'uniquevisitors']);
    updateStatWithChange(data, comparisonData, ['medium', 'audience', 'followers']);
    updateStatWithChange(data, comparisonData, ['twitter', 'audience', 'followers']);
    updateStatWithChange(data, comparisonData, ['facebook', 'audience', 'followers']);
    updateStatWithChange(data, comparisonData, ['facebook', 'audience', 'reach']);
    updateStatWithChange(data, comparisonData, ['instagram', 'audience', 'followers']);

    updateStatWithChange(data, comparisonData, ['twitter', 'engagement', 'impressions']);
    updateStatWithChange(data, comparisonData, ['twitter', 'engagement', 'mentions']);
    updateStatWithChange(data, comparisonData, ['facebook', 'engagement', 'views']);
    updateStatWithChange(data, comparisonData, ['facebook', 'engagement', 'engagements']);
    updateStatWithChange(data, comparisonData, ['medium', 'engagement', 'views']);

    updateStatWithChange(data, comparisonData, ['seo', 'webvr'], true);
    updateStatWithChange(data, comparisonData, ['seo', 'webpayments'], true);
    updateStatWithChange(data, comparisonData, ['seo', 'pwas'], true);
    updateStatWithChange(data, comparisonData, ['seo', 'physicalweb'], true);

    document.getElementById('total-followers').innerHTML = formatNumberValue(
        data.medium.audience.followers.count +
        data.twitter.audience.followers.count + 
        data.facebook.audience.followers.count +
        data.instagram.audience.followers.count);

    document.getElementById('total-impressions').innerHTML = formatNumberValue(
        data.twitter.engagement.impressions.count +
        data.facebook.engagement.views.count +
        data.medium.engagement.views.count);

    console.log('Updated stats from JSON data', data);

}

parseStatsJSON();
parseMediumCSV();
parseGithubJSON();
setupSurveyCharts();
setupServiceWorker();
