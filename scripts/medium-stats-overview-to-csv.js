/**
 * Based on the script by Esteban Pintos:
 * https://gist.github.com/epintos/a30876b1ce61bf5fafbd884e024b3361
 */

/**
 * These are just an estimate of the max now and don't necessarily need to be updated each time?
 */
// Max value of the Minutes Read Graph
var minutesReadMaxAxis = 6000;
// Max value of the Views Graph
var viewsMaxAxis = 5000;
// Max value of the Visitors Graph
var visitorsMaxAxis = 4000;

// First date of the graph (US Format)
var initialDay = new Date('05/21/2017')

// Days in the graphs
var days = 30;

// Returns max value of an array
function max(array) {
  return Math.max.apply(Math, array);
}

// Downloads a string with a certain filename
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

// Generates CSV format string with dates and values
function generateCSVContent() {

  var content = 'Date, Minutes Read, Views, Visitors\n';

  for (var i=0; i < days; i++) {
    content += initialDay.addDays(i).toLocaleDateString('en-US') + ',' +
        Math.round(minutesReadValues[i]) + ',' +
        viewsValues[i] + ',' +
        visitorsValues[i] + '\n';
  }
  return content
}

// Calculates the maximum height (which is relative to, but not equal to, the max value)
function getGraphMaxHeight(graph) {

  var heights = [];
  var rects = graph.getElementsByTagName('rect');

  for (var i=0; i < rects.length; i++) {
    var rect = rects[i];
    heights.push( rect.getAttribute('height') );
  };

  return Math.max(...heights);
}

// Generates array of values from given bar elements
function getValuesFromBars(bars, heightConvertor) {
  var values = [];
  for (var i=0; i < bars.length; i++) {
    var bar = bars[i];
    var height = bar.getAttribute('height');
    values.push(height * heightConvertor);
  }
  return values;
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var barGraphs = document.getElementsByClassName('js-barGraphBars');

// For converting from heights to values
var minutesReadHeightConvertor = minutesReadMaxAxis / getGraphMaxHeight(barGraphs[0]);
var viewsHeightConvertor = viewsMaxAxis / getGraphMaxHeight(barGraphs[1]);
var visitorsHeightConvertor = visitorsMaxAxis / getGraphMaxHeight(barGraphs[2]);

var minutesReadValues = []
var viewsValues = [];
var visitorsValues = [];

var minutesReadBars = barGraphs[0].getElementsByTagName('rect');
var viewsBars = barGraphs[1].getElementsByTagName('rect');
var visitorsBars = barGraphs[2].getElementsByTagName('rect');

var minutesReadValues = getValuesFromBars(minutesReadBars, minutesReadHeightConvertor);
var viewsValues = getValuesFromBars(viewsBars, viewsHeightConvertor);
var visitorsValues = getValuesFromBars(visitorsBars, visitorsHeightConvertor);

var content = generateCSVContent();

download('medium-stats-overview-' + new Date().toISOString().slice(0, 10) + '.csv', content);
