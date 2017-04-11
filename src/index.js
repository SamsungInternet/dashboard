var mediumCanvas = document.getElementById('medium'),
    mediumData,
    mediumChart;

Papa.parse('data/medium-history.csv', {
    download: true,
    complete: function(data) {
        console.log('Medium data', data);
        setupMediumChart(data);
    }
});

function setupMediumChart(data) {
    mediumData = data;

    // ['Daily unique visitors', 'Total time read (mins)', 'Views'],

    var labels = [];
    var dailyUniqueVisitors = [];
    var totalTimeReadMins = [];
    var views = [];

    var rows = mediumData.data.slice(1, mediumData.data.length - 1);

    var labelCount = 0;
    
    rows.forEach(function(row) {
        if (row[2] !== 'null') {
            labels.push( row[0] );
            dailyUniqueVisitors.push( row[1] );
            totalTimeReadMins.push( row[2] );
            views.push( row[3] );
        }
    });
    
    var data = {
        labels: labels,
        series: [
            dailyUniqueVisitors,
            totalTimeReadMins,
            views
        ]   
    };

    var options = {
        axisX: {showGrid: false, labelInterpolationFnc: function(value) {
            // Only use one in every 14 days
            return (labelCount++ % 14 === 0) ? value : null;
        }}, // type: Chartist.AutoScaleAxis
        axisY: {onlyInteger: true},
        seriesBarDistance: 5,
        showPoint: false,
        lineSmooth: false,
    };
    
    new Chartist.Line('#medium-chart', data, options);

    // Earlier I tried using Chart.js :horror-face:
    /*
    mediumChart = new Chart(mediumCanvas, {
        type: 'bar',
//        data: {
//            labels: ['foo', 'bar'],
//            datasets: [
//                {
//                    backgroundColor: [
//                        '#ff0000',
//                        '#0000ff'
//                    ],
//                    data: [33, 22]
//                }
//            ]
//        }
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    data: [65, 59, 80, 81, 56, 55, 40],
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
*/
}
