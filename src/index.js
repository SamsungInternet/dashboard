var GITHUB_API_REPOS_URL = 'https://api.github.com/search/repositories?q=org%3Asamsunginternet';

var twitterSurveyAwarePercent = 37;
var eventSurveyAwarePercent = 42;

var upArrow = '↑';
var downArrow = '↓';

var labelCount = 0;


function isInteger(number) {
    return typeof number === 'number' && number % 1 === 0;
}

// If thousands or more, use format like 12.3K
function formatNumberValue(number, forceThousandsFormat) {
    return forceThousandsFormat || number >= 1000 ? (number/1000).toFixed(1) + 'K' : number;
}

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
            return updateStats(data);
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

function updateStats(data) {

    if (data.updated) {
        document.getElementById('last-updated').innerHTML = moment(data.updated).format('DD MMMM YYYY');
    }

    updateStatWithChange('medium', 'followers', data.medium.audience);
    updateStatWithChange('twitter', 'followers', data.twitter.audience);
    updateStatWithChange('facebook', 'followers', data.facebook.audience);
    updateStatWithChange('facebook', 'reach', data.facebook.audience);
    updateStatWithChange('instagram', 'followers', data.instagram.audience);

    updateStatWithChange('twitter', 'impressions', data.twitter.engagement);
    updateStatWithChange('twitter', 'mentions', data.twitter.engagement);
    updateStatWithChange('facebook', 'views', data.facebook.engagement);
    updateStatWithChange('facebook', 'engagements', data.facebook.engagement);
    updateStatWithChange('medium', 'views', data.medium.engagement);

    /*
    updateStatWithChange('twitterreach', 'webvr', data.twitterreach);
    updateStatWithChange('twitterreach', 'webpayments', data.twitterreach);
    updateStatWithChange('twitterreach', 'pwas', data.twitterreach);
    updateStatWithChange('twitterreach', 'physicalweb', data.twitterreach);
    */

    updateStatWithChange('seo', 'webvr', data.seo);
    updateStatWithChange('seo', 'webpayments', data.seo);
    updateStatWithChange('seo', 'pwas', data.seo);
    updateStatWithChange('seo', 'physicalweb', data.seo);

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

function formatChangeValue(data) {

    var change = data.change;

    if (change !== 'undefined') {

        if (change === 'string') {
            return change;
        } else if (!isInteger(change)) {
            // XXX For now, if value is a non-integer, we presume it's a percentage...
            return change + '%';
        } else if (data.count >= 1000) {
            // If count is in the thousands, use same format for the change value
            return formatNumberValue(change, true);
        } else {
            return change;
        }
    }

    return '';
}

function updateStatWithChange(groupName, dataId, data) {

    document.getElementById(`${groupName}-${dataId}`).innerHTML = formatNumberValue(data[dataId].count);
    document.getElementById(`${groupName}-${dataId}-change`).innerHTML = formatChangeValue(data[dataId]);
   

    var changeLabelEl = document.getElementById(`${groupName}-${dataId}-change-label`);

    if (changeLabelEl && data[dataId]['change-label']) {
        changeLabelEl.innerHTML = data[dataId]['change-label'];
    } 
  
    var arrowEl = document.getElementById(`${groupName}-${dataId}-change-arrow`); 

    if (data[dataId].change < 0) {
        arrowEl.innerHTML = downArrow;
        arrowEl.classList.add('down');
    } else {
        arrowEl.innerHTML = upArrow;
        arrowEl.classList.add('up');
    }

    var linkEl = document.getElementById(`${groupName}-${dataId}-link`);

    if (data[dataId].link && linkEl) {
        linkEl.href = data[dataId].link;
    }

}

function setupServiceWorker() {
    if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/sw.js')
      .then(function() {
        console.log('Service worker successfully registered');
      })
      .catch(function(err) {
        console.error('Service worker failed to register', err);
      });

  } else {
    console.log('Service workers not supported');
  }
}

parseStatsJSON();
parseMediumCSV();
parseGithubJSON();
setupSurveyCharts();
setupServiceWorker();
