/**
 * Logs the total articles view count to the console
 */

var viewsCount = 0;
var statsTableBody = document.getElementsByClassName('js-statsTableBody')[0];
var trs = statsTableBody.getElementsByTagName('tr');
var printed2017Total = false;

for (var i=0; i < trs.length; i++) {
  
  var tr = trs[i];

  if (tr.children.length < 2) {

    // Check date heading
    if (!printed2017Total && tr.classList.contains('sortableTable-row--dateBucket')) {
      var dateHeading = tr.querySelector('.heading-title');
      if (dateHeading && dateHeading.innerHTML.indexOf('2017') < 0) {
        console.log('* 2017 total', viewsCount);
        printed2017Total = true;
        continue;
      }
    } 

    continue;
  }

  var viewsTd = tr.children[1];
  var viewsValue = viewsTd.getElementsByClassName('sortableTable-value')[0].innerText;
  
  console.log('Views', viewsValue);
  
  viewsCount += parseInt(viewsValue, 10);
}

console.log('* Total views count', viewsCount);
