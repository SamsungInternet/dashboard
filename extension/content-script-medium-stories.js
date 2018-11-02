/**
 * Logs the year's total articles and view count to the console
 */

// Update this each year - it will keep counting until it reaches a heading
// that doesn't include this year in the string.
var YEAR_TO_COUNT = '2018';

var viewsCountTotal = 0;
var statsTableBody = document.getElementsByClassName('js-statsTableBody')[0];
var trs = statsTableBody.getElementsByTagName('tr');

var storiesCount = 0;
var viewsCount = 0;

/**
 * For each row
 */
for (var i=0; i < trs.length; i++) {
  
  var tr = trs[i];

  if (tr.children.length < 2) {

    // Check date heading
    if (tr.classList.contains('sortableTable-row--dateBucket')) {
      var dateHeading = tr.querySelector('.heading-title');

      if (dateHeading) {

        if (dateHeading.innerHTML.includes(YEAR_TO_COUNT)) {
          console.log('Counting:', dateHeading.innerHTML);
        } else {
          console.log(`Reached end of year ${YEAR_TO_COUNT}, stopping counting.`);
          break;
        }
      }
    }

    // Continue with next 'tr'
    continue;
  }

  var viewsTd = tr.children[1];
  var viewsValue = viewsTd.getElementsByClassName('sortableTable-value')[0].innerText;
  
  if (viewsValue) {
    console.log('Views', viewsValue);
  
    var viewsInt = parseInt(viewsValue, 10);
  
    viewsCount += viewsInt;
    storiesCount++;
  }

}

console.log('* Number of stories for ' + YEAR_TO_COUNT, storiesCount);
console.log('* Total views for ' + YEAR_TO_COUNT, viewsCount);
