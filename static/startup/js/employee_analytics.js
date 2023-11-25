
   		function err_msg(inp, err) {
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

$("#eng-book-venue").change(function() {
	alert($("#eng-book-venue option:selected").text());
});

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
			if($('#emp-email').prop('disabled')){
			 $('#emp-email').prop('disabled', false)
			}
			else{
			 $('#emp-email').prop('disabled', true)
			}
		});
		$('#disablebuttonp').click(function(){
			if($('#phone-number').prop('disabled')){
			 $('#phone-number').prop('disabled', false)
			}
			else{
			     $('#phone-number').prop('disabled', true)
			  }
		});

		$('#btn-save-profile').click(function(){
			var id = $("#employee_id").val();
			var emp_email = $("#emp-email").val();
			var phone_number = $("#phone-number").val();
			var len_phone = $("#phone-number").val().length;
			var err = false;
            if (phone_number.length < 11 || phone_number.length > 13) {
                err_mesg("#phone-number", "Enter a valid mobile phone");
                if (!err) {
                    err = true;
                    $("#phone-number").focus();
                }
            }
            var email_sp = $("#emp-email").val().split("@");
            if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
                err_mesg("#emp-email", "Enter a valid email");
                if (!err) {
                    err = true;
                    $("#emp-email").focus();
                }
            }
			if (!err){
				$.ajax({
		               url: '/startup/employee/analytics/profile/ajax',
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
		                console.log('Email and Phone Number updated.')		                
		              }else{
		                alert('Email and Phone Number updated.')
		              }
		            }            
		        })//end ajax	
			}//end if
		}) //save-btn-profile

		$('#btn-save-password').click(function(){			
			var id = $("#employee_id").val();			
			var old_pwd = $("#old-pwd").val();
			var new_pwd = $("#new-pwd").val();
			var con_pwd = $("#confirm-pwd").val();
			if (old_pwd == '')
				alert('Please enter old password')
			else
			{
				$.ajax({
		               url: '/startup/employee/analytics/password/ajax',
		               type: 'POST',
		               dataType: 'json',
		               data: {
		                  'id': id,
		                  'old_pwd' : old_pwd,
		                  'new_pwd' : new_pwd,
		                  'con_pwd' : con_pwd,
		                  'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
		               },
		               success: function(data){
		              if (data.error == ''){
		                alert('Password Changed Successfully');

						$("#old-pwd").val("");
						$("#new-pwd").val("");
						$("#confirm-pwd").val("");
		              }else{
		                alert(data.error);
		              }
		            }            
		        })//end ajax	
		    }
		}) //save-btn-password

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
    url: '../../ajax/view_dash_util_chart',
    data: {
      'employees': [self].toString(),
      'startups': ',',
      'data': _data,
      'render': render,
      'from': $("#util-from").val(),
      'to': $("#util-to").val(),
    },
    success: function(data) {
      var all_data2 = [];
      var labels = [];
        var all_x = data.x
        var all_y = data.y
        var xs = all_x.split(",")
        var ys = all_y.split(",")
        var datapoints2 = [];
        for (j = 0; j < xs.length; j++) {
          var x = xs[j];
          var date = new Date(x.split(" ")[2], parseInt(x.split(" ")[0])-1, x.split(" ")[1]);
          if (x.split(" ")[2] != null) {
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
        };
          var my_data2 = {
            label: "",
            data: datapoints2,
            borderColor: getRandomColor(),
            fill: false
          };
        
        all_data2.push(my_data2);
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: all_data2,
        },
        options: {
        	legend: {
        		display: false,
        	},
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