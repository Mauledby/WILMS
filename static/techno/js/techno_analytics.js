
$("input[name=render]").change(function() {
    reload_chart();
});
$("input[name=data]").change(function() {
    reload_chart();
});

$(".util-dates").change(function() {
    reload_chart();
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var chart;

function reload_chart() {
  var render = $("input[name=render]:checked").val();
  var _data = $("input[name=data]:checked").val();
  $.ajax({
    url: '../ajax/view_dash_util_chart',
    data: {
      'students': added_stud.toString(),
      'teams': added,
      'data': _data,
      'render': render,
      'from': $("#util-from").val(),
      'to': $("#util-to").val(),
    },
    success: function(data) {
      var all_data = [];
      var all_data2 = [];
      var labels = [];
      var labels_done = false;
      for (i = 0; i < added_stud.length + 1; i++) {
        var all_x = data.x.split("|")[i]
        var all_y = data.y.split("|")[i]
        var xs = all_x.split(",")
        var ys = all_y.split(",")
        var datapoints = [];
        var datapoints2 = [];
        for (j = 0; j < xs.length; j++) {
          var x = xs[j];
          var date = new Date(x.split(" ")[2], parseInt(x.split(" ")[0])-1, x.split(" ")[1]);
          var dict = {
            x: date,
            y: parseInt(ys[j])
          }
          if (labels_done == false && x.split(" ")[2] != null) {
            if (render == "week") {
              labels.push(x.split(" ")[2]+"-"+x.split(" ")[0]+"-"+x.split(" ")[1]);
            } else if (render == 'month') {
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            } else {
              labels.push(date.getFullYear());
            }
          }
          if (x.split(" ")[2] != null) {
            datapoints2.push(parseInt(ys[j]));
          }
          datapoints.push(dict);
        };
        labels_done = true;
        if (i < 1) {
          var my_data = {
            type: "line",
            showInLegend: true,
            name: "My Team",
            dataPoints: datapoints,
          };
          var my_data2 = {
            label: "My Team",
            data: datapoints2,
            borderColor: getRandomColor(),
            fill: false
          };
        } else {
          var my_data = {
            type: "line",
            showInLegend: true,
            name: added_stud[i-1].toString(),
            dataPoints: datapoints,
          };
          var my_data2 = {
            label: added_stud[i-1].toString(),
            data: datapoints2,
            borderColor: getRandomColor(),
            fill: false
          };
        }
        all_data.push(my_data);
        all_data2.push(my_data2);
      }
      var ax_y = {
        crosshair: {
          enabled: true,
        }
      };
      var title = "";
      if (_data == "points") {
        title = "Points";
      } else if (_data == "coins") {
        title = "Coins";
      } else if (_data == "internet"){
        title = "Internet (in Mb)";
      }
      ax_y.title = title;
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: all_data2,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    },
  });
}

function toogleDataSeries(e){
  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else{
    e.dataSeries.visible = true;
  }
  chart.render();
  $(".canvasjs-chart-credit").remove();
}