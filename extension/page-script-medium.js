/**
 * Originally based on the script by Esteban Pintos:
 * https://gist.github.com/epintos/a30876b1ce61bf5fafbd884e024b3361
 */
(function() {

  var minutesReadValues = []
  var viewsValues = [];
  var visitorsValues = [];

  // Number of days shown in the graphs
  var numDays = 30;

  var initialDay = addDays(new Date(), -numDays + 1);

  function addDays(date, numDays) {
      var newDate = new Date(date);
      newDate.setDate(date.getDate() + numDays);
      return newDate;
  }

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
  function generateCSVContent(minutesReadValues, viewsValues, visitorsValues) {

    var content = 'Date, Minutes Read, Views, Visitors\n';

    for (var i=0; i < numDays; i++) {
      content += addDays(initialDay, i).toLocaleDateString('en-US') + ',' +
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
  function getValuesFromBars(bars) {
    var values = [];
    for (var i=0; i < bars.length; i++) {
      var bar = bars[i];
      console.log('Data ' + i, bar.__data__.value);
      values.push(bar.__data__.value);
    }
    return values;
  }

  function downloadMediumStats() {

    var barGraphs = document.getElementsByClassName('js-barGraphBars');

    var minutesReadBars = barGraphs[0].getElementsByTagName('rect');
    var viewsBars = barGraphs[1].getElementsByTagName('rect');
    var visitorsBars = barGraphs[2].getElementsByTagName('rect');

    var minutesReadValues = getValuesFromBars(minutesReadBars);
    var viewsValues = getValuesFromBars(viewsBars);
    var visitorsValues = getValuesFromBars(visitorsBars);

    var content = generateCSVContent(minutesReadValues, viewsValues, visitorsValues);

    download(new Date().toISOString().slice(0, 10) + 'medium-overview.csv', content);

  }

  console.log('Download Medium stats');

  downloadMediumStats();

})();
