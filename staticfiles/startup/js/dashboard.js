var added_stud = [];
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added_stud.includes(arr[i])) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.setAttribute("style", "font-weight: normal; font-size: 0.85rem;")
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            name = this.getElementsByTagName("input")[0].value;
            $(inp).val("");
            closeAllLists();
            added_stud.push(name);
            reload_chart();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

$("input[name=render]").change(function() {
    reload_chart();
});
$("input[name=data]").change(function() {
    reload_chart();
});

$(".util-dates").change(function() {
    reload_chart();
});

$(document).ready(function() {
  reload_chart();

  var bgColors_pie = [];
  var i = 0;
  while (i < no_incub) {
    bgColors_pie.push(getRandomColor());
    i++;
  }
  $.ajax({
    url: 'ajax/pie_revenue',
    success: function(data) {
      var datapoints_pie2 = [];
      var labels_pie = [];
      for (var key in data) {
        var value = data[key];
        if (key == ""){
          key = "?";
        }
        datapoints_pie2.push(value);
        labels_pie.push(key);
      }
      var ctx = document.getElementById('chartContainer').getContext('2d');
      var chart_pie = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
      });
      ctx = document.getElementById('barContainer').getContext('2d');
      var chart_bar = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
            label: "Amount in PhP",
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie,
        },
        options: {
          maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });
      $("#bar-charts").attr("hidden", true);
    },
  });
  $.ajax({
    url: 'ajax/pie_jobscreated',
    success: function(data) {
      var datapoints_pie2 = [];
      var labels_pie = [];
      for (var key in data) {
        var value = data[key];
        if (key == ""){
          key = "?";
        }
        datapoints_pie2.push(value);
        labels_pie.push(key);
      }
      var ctx = document.getElementById('chartContainer2').getContext('2d');
      var chart_pie = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
      });
      ctx = document.getElementById('barContainer2').getContext('2d');
      var chart_bar = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
            label: "No. of Employees",
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie,
        },
        options: {
          maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });
      $("#bar-charts").attr("hidden", true);
    },
  });
  $.ajax({
    url: 'ajax/pie_investment',
    success: function(data) {
      var datapoints_pie2 = [];
      var labels_pie = [];
      for (var key in data) {
        var value = data[key];
        if (key == ""){
          key = "?";
        }
        datapoints_pie2.push(value);
        labels_pie.push(key);
      }
      var ctx = document.getElementById('chartContainer3').getContext('2d');
      var chart_pie = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
      });
      ctx = document.getElementById('barContainer3').getContext('2d');
      var chart_bar = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
            label: "Amount in PhP",
            data: datapoints_pie2,
            backgroundColor: bgColors_pie,
          }],
          labels: labels_pie,
        },
        options: {
          maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });
      $("#bar-charts").attr("hidden", true);
    },
  });
  $("#startupTbl").dataTable({
    dom: "lfrtipB",
    buttons: [
      {extend: 'excel', action: newExportAction, text: 'EXPORT TO EXCEL', filename: "Startup Details", className: 'btnExp'},
    ],
    order: [0, "desc"],
    columnDefs: [
          {
            orderable: false,
            searchable: false,
            className: "",
            targets: [1,2,3,4,5,6]
          },
      {
        data: 'name',
        targets: [0]
      }, 
      {
        data: 'mos_customer',
        targets: [1]
      }, 
      {
        data: 'mos_revenue',
        targets: [2]
      }, 
      {
        data: 'engagement',
        targets: [3]
      }, 
      {
        data: 'turnover',
        targets: [4]
      }, 
      {
        data: 'technology',
        targets: [5]
      }, 
      {
        data: 'investment',
        targets: [6]
      }
    ],
      searching: true,
      processing: true,
      serverSide: true,
      stateSave: true,
    ajax: 'ajax/view_startup_dash'
  });
})

var chart;

function reload_chart() {
  var render = $("input[name=render]:checked").val();
  var _data = $("input[name=data]:checked").val();
  $.ajax({
    url: 'ajax/view_dash_util_chart',
    data: {
      'employees': added_stud.toString(),
      'startups': added.toString(),
      'data': _data,
      'render': render,
      'from': $("#util-from").val(),
      'to': $("#util-to").val(),
    },
    success: function(data) {
      var all_data = [];
      var all_data2 = [];
      var labels = [];
      for (i = 0; i < added.length + added_stud.length; i++) {
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
          if (i==0 && x.split(" ")[2] != null) {
            if (render == "week") {
              labels.push(x.split(" ")[2]+"-"+x.split(" ")[0]+"-"+x.split(" ")[1]);
            } else if (render == "month"){
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            } else {
              labels.push(date.getFullYear());
            }
          }
          datapoints.push(dict);
          datapoints2.push(parseInt(ys[j]));
        };
        if (i < added.length) {
          var my_data = {
            type: "line",
            showInLegend: true,
            name: added_name[i].toString(),
            dataPoints: datapoints,
          };
          var my_data2 = {
            label: added_name[i].toString(),
            data: datapoints2,
            borderColor: getRandomColor(),
            fill: false
          };
        } else {
          var my_data = {
            type: "line",
            showInLegend: true,
            name: added_stud[i-added.length].toString(),
            dataPoints: datapoints,
          };
          var my_data2 = {
            label: added_stud[i-added.length].toString(),
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
      
      var myChart = new Chart('myChart', {
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


$("#a_bar").click(function() {
  $(this).addClass("clicked");
  $("#a_pie").removeClass("clicked");
  $("#pie-charts").attr("hidden", true);
  $("#bar-charts").attr("hidden", false);
});

$("#a_pie").click(function() {
  $(this).addClass("clicked");
  $("#a_bar").removeClass("clicked");
  $("#bar-charts").attr("hidden", true);
  $("#pie-charts").attr("hidden", false);
});
    var acurrent = 1;
    function getToday(){
      var today = new Date();
      var dd = today.getDate();

      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10)
      {
          dd='0'+dd;
      }

      if(mm<10)
      {
          mm='0'+mm;
      }

      return mm+'/'+dd+'/'+yyyy;
    }
      $(function () {
          $("#cb_all").click(function(){
            if(this.checked)
              $('.space_option').prop("checked", true);
            else
              $('.space_option').prop("checked", false);

          });
          $(".space_option").click(function(){
          if(this.checked==false)
            $('#cb_all').prop("checked", false);
          $.get('ajax/utilization',{'data':'maoni'},function(data){
            $("#chartContainer").html(data);
          });

          });

      $("#bar-charts").attr("hidden", true);
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