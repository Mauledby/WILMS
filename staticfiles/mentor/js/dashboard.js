var added = [];
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
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added.includes(arr[i])) {
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
            var add = '<div id="mentorsnamelist"><span>' + name + '</span><a style="float: right; " href="javascript:void(0);" onclick="remove_mentor(this)">&times;</a></div>'
            $("#div-mentor").append(add);
            added.push(name);
            reload_chart();
            $("#lbl-chart").prop("hidden", true);
            $("#chart").prop("hidden", false);
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

function remove_mentor(inp) {
  var str = $(inp).parent().children().first().text();
  const index = added.indexOf(str);
  added.splice(index, 1);
  $(inp).parent().remove();
  if (added.length == 0) {
    $("#lbl-chart").prop("hidden", false);
    $("#chart").prop("hidden", true);
  } else {
    reload_chart();
  }
}

$("input[name=render]").change(function() {
  if (added.length > 0)
    reload_chart();
});
$("input[name=sat-render]").change(function() {
  more_details(false);
});
$("input[name=data]").change(function() {
  if (added.length > 0)
    reload_chart();
});

$(".util-dates").change(function() {
  if (added.length > 0)
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
function reload_chart() {
  var render = $("input[name=render]:checked").val();
  var _data = $("input[name=data]:checked").val();
  $.ajax({
    url: 'ajax/view_mentor_dash',
    data: {
      'mentor': added.toString(),
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
      for (i = 0; i < added.length; i++) {
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
            } else {
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            }
          }
          if (x.split(" ")[2] != null) {
            datapoints2.push(parseInt(ys[j]));
          }
          datapoints.push(dict);
        };
        labels_done = true;
        var my_data = {
          type: "line",
          showInLegend: true,
          name: added[i],
          dataPoints: datapoints,
        };
        var my_data2 = {
          label: added[i],
          data: datapoints2,
          borderColor: getRandomColor(),
          fill: false
        };
        all_data.push(my_data);
        all_data2.push(my_data2);
      }
      var ax_y = {
        crosshair: {
          enabled: true,
        }
      };
      var title = "";
      if (_data == "hours") {
        title = "Number of Hours";
      } else if (_data == "percent") {
        title = "Hours Booked / Available Time (%)";
        ax_y.maximum = 100;
      } else if (_data == "points"){
        title = "Points Obtained";
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

$("#satis-from").change(function() {
  get_mensat();
});

$("#satis-to").change(function() {
  get_mensat();
});

function get_mensat() {
  var from = $("#satis-from").val();
  var to = $("#satis-to").val();
  $.ajax({
    url: 'ajax/get_mensat',
    data: {
      'from': from,
      'to': to,
    },
    success: function(data) {
      $("#ratings").text(data.data);
    },
  });
}

function more_details(disp) {
  var render = $("input[name=sat-render]:checked").val();
  var from = $("#satis-from").val();
  var to = $("#satis-to").val();
  $.ajax({
    url: 'ajax/more_mensat',
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
      for (j = 0; j < xs.length; j++) {
        var x = xs[j];
        var date = new Date(x.split(" ")[2], parseInt(x.split(" ")[0])-1, x.split(" ")[1]);
        var dict = {
          x: date,
          y: parseFloat(ys[j])
        }
          if (x.split(" ")[2] != null) {
            if (render == "week") {
              labels.push(x.split(" ")[2]+"-"+x.split(" ")[0]+"-"+x.split(" ")[1]);
            } else {
              labels.push(months[date.getMonth()] + " " + date.getFullYear());
            }
            datapoints2.push(parseFloat(ys[j]));
          }
        datapoints.push(dict);
      };
      var all_data = {
          label: "Customer Satisfaction",
          data: datapoints2,
          borderColor: getRandomColor(),
      }
      var ctx = document.getElementById('myChartModal').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [all_data],
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
  if (disp) {
    $("#more-sat").modal("show");
  }
}