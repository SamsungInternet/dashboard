/**
 * Logs the total articles view count to the console
 */

var viewsCount = 0;
var statsTableBody = document.getElementsByClassName('js-statsTableBody')[0];
var trs = statsTableBody.getElementsByTagName('tr');

for (var i=0; i < trs.length; i++) {
  
  var tr = trs[i];
  
  if (tr.children.length < 2) {
    continue;
  }
  
  var viewsTd = tr.children[1];
  var viewsValue = viewsTd.getElementsByClassName('sortableTable-value')[0].innerText;
  
  console.log('views', viewsValue);
  
  viewsCount += parseInt(viewsValue, 10);
}

console.log('Total views count', viewsCount);
