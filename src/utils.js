function isInteger(number) {
    return typeof number === 'number' && number % 1 === 0;
}

function getDaysDiff(dateString1, dateString2) {
    return moment(dateString1).diff(moment(dateString2), 'days');
}

// If thousands or more, use format like 12.3K
function formatNumberValue(number, forceThousandsFormat) {
    return forceThousandsFormat || number >= 1000 ? (number/1000).toFixed(1) + 'K' : number;
}

function formatChangeValue(count, compareWithCount, lowerIsBetter) {

    if (typeof count === 'undefined' || typeof compareWithCount === 'undefined') {
        return 'N/A';
    }

    if (count === 'N/A' || compareWithCount === 'N/A') {
        return 'N/A';
    }

    // Use percentage change values for larger numbers
    if (count > 1000 || compareWithCount > 1000) {
        return ((count - compareWithCount) / compareWithCount * 100).toFixed(1) + '%';
    }

    return formatNumberValue(lowerIsBetter ? compareWithCount - count : count - compareWithCount);

}

// Traverse down pathToStat to get to the specific data point, if it exists
function getStatWithComparison(data, comparisonData, pathToStat) {

    var stat = data,
        comparisonStat = comparisonData;

    for (var i=0; i < pathToStat.length; i++) {
        
        var attribute = pathToStat[i];

        if (stat[attribute]) {
            stat = stat[attribute];
        }
        
        if (comparisonStat[attribute]) {
            comparisonStat = comparisonStat[attribute];        
        }

    }

    return [stat, comparisonStat];

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
