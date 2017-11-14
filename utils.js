var MAX_DISPLAY_URL_LENGTH = 35;

const moment = require('moment');

const utils = {

    isInteger: function(number) {
        return typeof number === 'number' && number % 1 === 0;
    },

    getDaysDiff: function(dateString1, dateString2) {
        return moment(dateString1).diff(moment(dateString2), 'days');
    },

    /**
     * If thousands or more, use format like 12.3
     */
    formatNumberValue: function(number, forceThousandsFormat) {
        return forceThousandsFormat || number >= 1000 ? (number/1000).toFixed(1) + 'K' : number;
    },

    formatChangeValue: function(count, compareWithCount, lowerIsBetter) {

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

        return this.formatNumberValue(lowerIsBetter ? compareWithCount - count : count - compareWithCount);

    },

    /**
     * Crop URL, add ellipsis, remove protocol
     */
    formatDisplayUrl: function(url) {
        var formattedUrl = url.length > MAX_DISPLAY_URL_LENGTH ? (url.substring(0,MAX_DISPLAY_URL_LENGTH) + '...') : url;
        formattedUrl = formattedUrl.replace('http://', '');
        formattedUrl = formattedUrl.replace('https://', '');
        return formattedUrl;
    },

    /**
     * Traverse down pathToStat to get to the specific data point, if it exists
     */
    getStatWithComparison: function(data, comparisonData, pathToStat) {

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

    },

    /**
     * Return 'up' or 'down' string
     */
    getChangeDirection: function(count, comparisonCount, lowerIsBetter) {

        if (count - comparisonCount < 0) {
            return lowerIsBetter ? 'up' : 'down';
        } else {
            return lowerIsBetter ? 'down' : 'up';
        }

    }

}

module.exports = utils;