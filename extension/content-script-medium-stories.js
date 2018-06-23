/**
 * Logs the total articles view count to the console
 */

var viewsCountTotal = 0;
var statsTableBody = document.getElementsByClassName('js-statsTableBody')[0];
var trs = statsTableBody.getElementsByTagName('tr');
var years = {
  '2016': {
     viewsCount: 0
   },
   '2017': {
     viewsCount: 0
   },
   '2018': {
     viewsCount: 0
   }
};

var year;

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
        year = dateHeading.innerHTML;
        console.log('Now counting for year:', year);
      }
    } 

    continue;
  }

  var viewsTd = tr.children[1];
  var viewsValue = viewsTd.getElementsByClassName('sortableTable-value')[0].innerText;
  
  console.log('Views', viewsValue);
  
  var viewsInt = parseInt(viewsValue, 10);

  years[year].viewsCount += viewsInt;

  viewsCountTotal += parseInt(viewsValue, 10);

}

var totalCheck = 0;

Object.keys(years).forEach(function(key) {
  var aYear = key;
  var yearViewsCount = years[key].viewsCount;
  console.log('* Views for ' + aYear, yearViewsCount);
  totalCheck += yearViewsCount;
});

console.log('* Total views count', viewsCountTotal);

console.log('* Sanity check OK?', viewsCountTotal === totalCheck);
