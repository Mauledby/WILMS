   		function err_mesg(inp, err) {
            if ($(inp).next(".validation").length == 0) { // only add if not added
                $(inp).css("background-color", "#FFBABA");
                    $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
            }
        }

$("input").click(function() {
  removeVal(this);
});
$("input").change(function() {
  removeVal(this);
});

function removeVal(inp) {
  $(inp).css("background-color", "");
    $(inp).next(".validation").remove();
}

		jQuery(document).ready(function() {
			jQuery('#example').DataTable({
				"searching": false,
				"paging": true,
				"info": false,
				"lengthChange":false
			});
			reload_chart();
		})

		$('#disablebuttone').click(function(){			
			if($('#startup-email').prop('disabled')){
			 $('#startup-email').prop('disabled', false)
			}
			else{
			 $('#emp-email').prop('disabled', true)
			}
		});
		$('#disablebuttonp').click(function(){
			if($('#startup-contact').prop('disabled')){
			 $('#startup-contact').prop('disabled', false)
			}
			else{
			     $('#phone-number').prop('disabled', true)
			  }
		});

		$('#btn-save-profile').click(function(){
			var id = $("#startup-id").val();			
			var emp_email = $("#startup-email").val();
			var phone_number = $("#startup-contact").val();
			var err = false;
            if (phone_number.length < 11 || phone_number.length > 13) {
                err_mesg("#startup-contact", "Enter a valid mobile phone");
                if (!err) {
                    err = true;
                    $("#startup-contact").focus();
                }
            }
            var email_sp = $("#startup-email").val().split("@");
            if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
                err_mesg("#startup-email", "Enter a valid email");
                if (!err) {
                    err = true;
                    $("#startup-email").focus();
                }
            }
			if (!err){
				$.ajax({
		               url: '/startup/analytics/profile/ajax',
		               type: 'POST',
		               dataType: 'json',
		               data: {
		                  'id': id,
		                  'emp_email' : emp_email,
		                  'phone_number' : phone_number,
		                  'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
		               },
		               success: function(data){
		              if (data.form_is_valid){
		                alert('Email and Phone Number updated.')
		              }else{
		                alert('Failed to update.')
		              }
		            }            
		        })//end ajax	
			}
		}) //save-btn-profile

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
      'employees': added_stud.toString(),
      'startups': added,
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
            name: "My Startup",
            dataPoints: datapoints,
          };
          var my_data2 = {
            label: "My Startup",
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
      chart = new CanvasJS.Chart("chart", {
        animationEnabled: true,
        theme: "light2",
        title:{
          text: "My Startup Utilization"
        },
        axisX:{
          valueFormatString: "DD MMM YY",
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        legend:{
          cursor:"pointer",
          verticalAlign: "bottom",
          horizontalAlign: "left",
          dockInsidePlotArea: false,
          itemclick: toogleDataSeries
        },
        axisY:ax_y,
        toolTip:{
          shared:true
        },
        data: all_data,
      });
      // chart.render();
      $(".canvasjs-chart-credit").remove();
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