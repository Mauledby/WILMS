$(document).ready(function() {
  get_vensat();
  reload_chart();
  get_available_now();
  get_available();
  get_headcount();
  get_overstaying();
  get_nobook();
  $('#important').DataTable({
    order: [[ 2, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
      // {
      //   data: 'purpose',
      //   targets: [4]
      // },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/important_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
  $('#employee').DataTable({
    order: [[ 0, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/employee_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
  $('#student').DataTable({
    order: [[ 0, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      // {
      //   data: 'first_name',
      //   targets: [0]
      // },
      // {
      //   data: 'last_name',
      //   targets: [1]
      // },
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/student_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
  $('#cancelled').DataTable({
    order: [[ 2, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
      // {
      //   data: 'purpose',
      //   targets: [4]
      // },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/cancelled_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
  $('#alltable').DataTable({
    order: [[ 2, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
      // {
      //   data: 'purpose',
      //   targets: [4]
      // },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/all_bookings_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
  $('#noshow').DataTable({
    order: [[ 2, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
      {
        data: 'id',
        targets: [0]
      },
      {
        data: 'title',
        targets: [1]
      },
      {
        data: 'schedule',
        targets: [2]
      },
      {
        data: 'venue',
        targets: [3]
      },
      // {
      //   data: 'purpose',
      //   targets: [4]
      // },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/noshow_bookings_table',
    "responsive": true,
    "scrollX": true,
    "dom": 'lfrtip',
  });
});

function reload_table(table) {
  $("#" + table).DataTable().ajax.reload();
}

$("input[name=sat-render]").change(function() {
  more_details(false);
});

$(".custsatdatefilter").change(function() {
  get_vensat();
});

$(".available-filter").change(function() {
  get_available_now();
});

$(".headcount-filter").change(function() {
  get_headcount();
});

function get_vensat() {
  var from = $("#customersatfrom").val();
  var to = $("#customersatto").val();
  $.ajax({
    url: 'ajax/get_vensat',
    data: {
      'from': from,
      'to': to,
    },
    success: function(data) {
      $("#custsatis").text(data.data);
    },
  });
}

function get_available_now() {
  var from = $("#availablefrom").val();
  var to = $("#availableto").val();
  $.ajax({
    url: 'ajax/get_available_now',
    data: {
      'from': from,
      'to': to,
    },
    success: function(data) {
      var dat = data.data.split(',');
      $(".val").each(function(index) {
        $(this).text(dat[index]);
      });
    },
  });
}

function get_available() {
  $.ajax({
    url: 'ajax/get_available',
    success: function(data) {
      $("#cowork").text(data.cowork);
      $("#avaA").text(data.avaA);
      $("#avaB").text(data.avaB);
    },
  });
}

function get_headcount() {
  var from = $("#headcountfrom").val();
  var to = $("#headcountto").val();
  $.ajax({
    url: 'ajax/get_headcount',
    data: {
      'from': from,
      'to': to,
    },
    success: function(data) {
      $("#expected").text(data.exp);
      $("#actual").text(data.act)
    },
  });
}

function get_overstaying() {
  $.ajax({
    url: 'ajax/get_overstaying',
    success: function(data) {
      $("#overtime").text(data.over + " hrs");
    }
  })
}

function get_nobook() {
  $.ajax({
    url: 'ajax/get_nobook',
    success: function(data) {
      // $("#overtime").text(data.over2 + " hrs");
      $("#nobook").text(data.nobook)
    }
  })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function more_details(disp) {
  var render = $("input[name=sat-render]:checked").val();
  var from = $("#customersatfrom").val();
  var to = $("#customersatto").val();
  $.ajax({
    url: 'ajax/more_vensat',
    data: {
      'render': render,
      'from': from,
      'to': to,
    },
    success: function(data) {
      var xs = data.x.split(",")
      var ys = data.y.split(",")
      var datapoints = [];
      var datapoints2 = [];
      var labels = [];
      var all_data2 = [];
      for (j = 0; j < xs.length-1; j++) {
        var x = xs[j];
        var date = new Date(x.split(" ")[2], parseInt(x.split(" ")[0])-1, x.split(" ")[1]);
        var dict = {
          x: date,
          y: parseFloat(ys[j])
        };
            if (render == "week") {
              labels.push(x.split(" ")[2]+"-"+x.split(" ")[0]+"-"+x.split(" ")[1]);
            } else {
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            }
        datapoints.push(dict);
        datapoints2.push(parseFloat(ys[j]))
      };
        var my_data2 = {
          label: "",
          data: datapoints2,
          borderColor: "#FFC001",
          backgroundColor: "rgba(255, 192, 1, 0.15)"
        };
        all_data2.push(my_data2);
      var myChart = new Chart('sat-chart', {
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
                min: 1,
                max: 5,
                steps: 0.5,
              }
            }]
          },
          legend: {
            display: false
          },
        }
    });
    },
  });
  if (disp) {
    $("#more-sat").modal("show");
  }
}

$("input[name=render]").change(function(){
  reload_chart();
});

$("input[name=data]").change(function(){
  reload_chart();
});

$(".utildatefilter").change(function() {
  reload_chart();
});

function reload_chart() {
  var render = $("input[name=render]:checked").val();
  var _data = $("input[name=data]:checked").val();
  $.ajax({
    url: 'ajax/view_facility_dash',
    data: {
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
      var venues = data.venues.split(',')
      for (i = 0; i < venues.length; i++) {
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
            y: parseFloat(ys[j])
          }
          if (labels_done == false && x.split(" ")[2] != null) {
            if (render == "week") {
              labels.push(x.split(" ")[2]+"-"+x.split(" ")[0]+"-"+x.split(" ")[1]);
            } else if (render == "year") {
              labels.push(date.getFullYear());
            } else {
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            }
          }
          if (x.split(" ")[2] != null) {
            datapoints2.push(parseFloat(ys[j]));
          }
          datapoints.push(dict);
        };
        labels_done = true;
        var my_data = {
          type: "line",
          showInLegend: true,
          name: venues[i],
          dataPoints: datapoints,
        };
        var my_data2 = {
          label: venues[i],
          data: datapoints2,
          borderColor: getRandomColor(),
          fill: false
        };
        all_data.push(my_data);
        all_data2.push(my_data2);
      }
      var myChart = new Chart("myChart", {
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