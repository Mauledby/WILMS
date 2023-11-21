function invite(id) {
	$.ajax({
		url: 'ajax/invite_mentor',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$("#new").DataTable().ajax.reload();
		}
	});
}

function reject(id) {
	$("#rej-ok").attr("onclick", "reject_mentor("+id+")");
	$("#rej-reason").val("");
	$("#reject-mentor").modal("show");
}

function reject_mentor(id) {
	$.ajax({
		url: 'ajax/reject_mentor',
		data: {
			'id': id,
			'reason': $("#rej-reason").val().trim(),
		},
		dataType: 'json',
		success: function() {
			alert("Reject successful.");
			$("#reject-mentor").modal("hide");
			$("#new").DataTable().ajax.reload();
		}
	});
}

function view(id) {
	$.ajax({
		url: 'ajax/view_mentor',
		data: {
			id: id,
		},
		dataType: 'json',
		success: function(data) {
			$("#last_name").val(data.last_name);
			$("#first_name").val(data.first_name);
			$("#middle_name").val(data.middle_name);
			$("#expertise").val(data.expertise);
			$("#number").val(data.number);
			$("#email").val(data.email);
			$("#gender").val(data.gender);
			$("#street").val(data.street);
			$("#subdivision").val(data.subdivision);
			$("#barangay").val(data.barangay);
			$("#city").val(data.city);
			$("#province").val(data.province);
			$("#country").val(data.country);
			$("#zip").val(data.zip);
			$("#birthday").val(data.birthday);
			$("#birthplace").val(data.birthplace);
			$("#nationality").val(data.nationality);
			$("#position").val(data.position);
			$("#employment").val(data.employment);
			$("#civil").val(data.civil);
			$("#spouse").val(data.spouse);
			$("#sp_occupation").val(data.sp_occupation);
			$("#children").val(data.children);
			$("#father").val(data.father);
			$("#fa_occupation").val(data.fa_occupation);
			$("#mother").val(data.mother);
			$("#mo_occupation").val(data.mo_occupation);
			$("#language").val(data.language);
			$("#height").val(data.height);
			$("#weight").val(data.weight);
			$("#religion").val(data.religion);
			var elem_school = data.elem_school.split(',');
			var elem_grade = data.elem_grade.split(',');
			var elem_public = data.elem_public.split(',');
			var elem_from = data.elem_from.split(',');
			var elem_to = data.elem_to.split(',');
			var elem_awards = data.elem_awards.split(',');
			$("#elem").empty();
			var i;
			for (i=0; i < elem_school.length; i++){
				$("#elem").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+elem_school[i]+'"><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+elem_grade[i]+'"><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+elem_public[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+elem_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+elem_to[i]+'"><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+elem_awards[i]+'"><hr>')
			}
			var junior_school = data.junior_school.split(',');
			var junior_grade = data.junior_grade.split(',');
			var junior_public = data.junior_public.split(',');
			var junior_from = data.junior_from.split(',');
			var junior_to = data.junior_to.split(',');
			var junior_awards = data.junior_awards.split(',');
			$("#junior").empty();
			for (i=0; i < junior_school.length; i++){
				$("#junior").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+junior_school[i]+'"><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+junior_grade[i]+'"><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+junior_public[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+junior_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+junior_to[i]+'"><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+junior_awards[i]+'"><hr>')
			}
			var senior_school = data.senior_school.split(',');
			var senior_grade = data.senior_grade.split(',');
			var senior_public = data.senior_public.split(',');
			var senior_from = data.senior_from.split(',');
			var senior_to = data.senior_to.split(',');
			var senior_awards = data.senior_awards.split(',');
			var senior_strand = data.senior_strand.split(',');
			$("#senior").empty();
			for (i=0; i < senior_school.length; i++){
				$("#senior").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+senior_school[i]+'"><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+senior_grade[i]+'"><input type="text" placeholder="Strand" class="form-control inputmodal" value="'+senior_strand[i]+'"><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+senior_public[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+senior_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+senior_to[i]+'"><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+senior_awards[i]+'"><hr>')
			}
			var college_school = data.college_school.split(',');
			var college_grade = data.college_grade.split(',');
			var college_public = data.college_public.split(',');
			var college_from = data.college_from.split(',');
			var college_to = data.college_to.split(',');
			var college_awards = data.college_awards.split(',');
			$("#college").empty();
			for (i=0; i < college_school.length; i++){
				$("#college").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+college_school[i]+'"><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+college_grade[i]+'"><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+college_public[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+college_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+college_to[i]+'"><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+college_awards[i]+'"><hr>')
			}
			var tr_training = data.tr_training.split(',');
			var tr_sector = data.tr_sector.split(',');
			var tr_from = data.tr_from.split(',');
			var tr_to = data.tr_to.split(',');
			var tr_awards = data.tr_awards.split(',');
			$("#trainings").empty();
			for (i=0; i < tr_training.length; i++){
				$("#trainings").append('<input type="text" placeholder="Training" class="form-control inputmodal" value="'+tr_training[i]+'"><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+tr_sector[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+tr_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+tr_to[i]+'"><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+tr_awards[i]+'"><hr>')
			}
			var co_company = data.co_company.split(',');
			var co_industry = data.co_industry.split(',');
			var co_status = data.co_status.split(',');
			var co_position = data.co_position.split(',');
			var co_salary = data.co_salary.split(',');
			var co_from = data.co_from.split(',');
			var co_to = data.co_to.split(',');
			var co_startup = data.co_startup.split(',');
			$("#companies").empty();
			for (i=0; i < co_company.length; i++){
				$("#companies").append('<input type="text" placeholder="Company" class="form-control inputmodal" value="'+co_company[i]+'"><input type="text" placeholder="Industry" class="form-control inputmodal" value="'+co_industry[i]+'"><input type="text" placeholder="Status" class="form-control inputmodal" value="'+co_status[i]+'"><input type="text" placeholder="Position" class="form-control inputmodal" value="'+co_position[i]+'"><input type="text" placeholder="Salary" class="form-control inputmodal" value="'+co_salary[i]+'"><input type="text" placeholder="From" class="form-control inputmodal" value="'+co_from[i]+'"><input type="text" placeholder="To" class="form-control inputmodal" value="'+co_to[i]+'"><input type="text" placeholder="Industry" class="form-control inputmodal" value="'+co_startup[i]+'"><hr>')
			}
			var exp = data.exp.split(',');
			var exp_r = data.exp_r.split(',');
			$("#exp").empty();
			for (i=0; i < exp.length; i++){
				var stars = "";
				var j;
				for(j=0;j<parseInt(exp_r[i]); j++) {
					stars += '★';
				}
				for(;j<5;j++) {
					stars += '☆';
				}
				$("#exp").append('<input type="text" placeholder="Expertise" class="form-control inputmodal" value="'+exp[i]+''+stars+'">');
			}
			var sc_day = data.sc_day.split(',');
			var sc_from = data.sc_from.split(',');
			var sc_to = data.sc_to.split(',');
			$("#sch").empty();
			for(i=0; i<sc_day.length; i++) {
				$("#sch").append('<input type="text" placeholder="Schedule" class="form-control inputmodal" value="'+sc_day[i]+' '+sc_from[i]+'-'+sc_to[i]+'">');
			}
			$("#btn-submit").attr('onclick', "submit("+id+")")
			$("#myModal").modal("show");
		}
	});
}

function submit(id) {
	var comment = $("#chg-comment").val();
	var status = $("#chg-status option:selected").text();
	$.ajax({
		url: 'ajax/mentor_req_submit',
		data: {
			'id': id,
			'status': status,
			'comment': comment,
		},
		dataType: 'json',
		success: function() {
			alert("Successful.");
			$('#all').DataTable().ajax.reload();
			$('#approved').DataTable().ajax.reload();
			$('#disapproved').DataTable().ajax.reload();
			$("#new").DataTable().ajax.reload();
			$("#myModal").modal("hide");
		}
	})
}

function enable(id) {
	$.ajax({
		url:'../../booking/ajax/enable',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$($(".able-"+id)[0]).text("DISABLE");
			$($(".able-"+id)[0]).attr("href", "javascript:disable('" + id + "')");
		},
	});
}

function disable(id) {
	$.ajax({
		url:'../../booking/ajax/disable',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$($(".able-"+id)[0]).text("ENABLE");
			$($(".able-"+id)[0]).attr("href", "javascript:enable('" + id + "')");
		},
	});
}
var gl_id = 0;
function show_user_transaction(id) {
	gl_id = id;
	reload_transaction(id, '2020-01-01', '2100-01-01');
	$("#trans-filter").attr("onclick", "transaction_filter(\'"+id+"\')");
	$("#myModalTransaction").modal("show");
}

function reload_transaction(id, from, to) {
	$('#bookingtransactions').DataTable().destroy();
	$('#bookingtransactions').DataTable({
		language: lang,
		dom: 't',
	    order: [[ 0, "desc" ]],
	    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	    columnDefs: [
	        {
	        	orderable: false,
	        	searchable: true,
	            className: "center",
	            targets: [2]
	        },
	        {
                data: 'date',
                targets: [0]
            },
            {
                data: 'amount',
                targets: [1]
            },
            {
                data: 'category',
                targets: [2]
            },
            {
                data: 'description',
                targets: [3]
            },
            {
                data: 'payment_mode',
                targets: [4]
            }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
		ajax: {
			'url': '../../booking/ajax/transactions_user/'+id+'/' + from + '/' + to +'/',
			'async': false,
		}
	});
	$('#paymenttransactions').DataTable().destroy();
	$('#paymenttransactions').DataTable({
		language: lang,
		dom: 't',
	    order: [[ 0, "desc" ]],
	    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	    columnDefs: [
	        {
	        	orderable: false,
	        	searchable: true,
	            className: "center",
	            targets: [2]
	        },
	        {
                data: 'date',
                targets: [0]
            },
            {
                data: 'amount',
                targets: [1]
            },
            {
                data: 'category',
                targets: [2]
            },
            {
                data: 'description',
                targets: [3]
            },
            {
                data: 'payment_mode',
                targets: [4]
            }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
		ajax: {
			async: false,
			url: '../../booking/ajax/transactions_payment/'+id+'/' + from + '/' + to +'/',
		}
	});
	var booking = $("#bookingtransactions").DataTable().rows().data();
	var payment = $("#paymenttransactions").DataTable().rows().data();
	var all = $("#modaltransactions").DataTable();
	all.clear().draw();
	booking.each(function(value, index) {
		console.log(index + " : " + value);
		all.row.add({
			"date": value.date,
			"amount": value.amount,
			"category": value.category,
			"description": value.description,
			"payment_mode": value.payment_mode,
		}).draw();
	});
	payment.each(function(value, index) {	
		console.log(index + " : " + value);
		all.row.add({
			"date": value.date,
			"amount": value.amount,
			"category": value.category,
			"description": value.description,
			"payment_mode": value.payment_mode,
		}).draw();
	});
	all.order( [ 0, 'desc' ] ).draw();
}

function transaction_filter(id) {
	var from = $("#trans-from").val();
	var to = $("#trans-to").val();
	var err = false;
	if (from == "") {
		err_mesg($("#trans-from"), "This field is required.");
		err = true;
	} else if (to == "") {
		err_mesg($("#trans-to"), "This field is required.");
		err = true;
	} else if (from > to) {
		err_mesg($("#trans-to"), "Date from must not be after Date to.");
		err = true;
	}
	if (!err) {
		reload_transaction(id, from, to);
	}
};

function show_user_update(id) {
	$("#inputmodal-id").val(id);
	$.ajax({
		url:'../../booking/ajax/user_update_get',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function(data) {
			$("#inputmodal-id").val(data.id);
			$("#inputmodal-fname").val(data.first_name);
			$("#inputmodal-lname").val(data.last_name);
			$("#inputmodal-group").val(data.user_types);
			$("#inputmodal-program").val(data.program);
			$("#inputmodal-year").val(data.year);
			$("#inputmodal-section").val(data.section);
			$("#inputmodal-datereg").val(data.date_registered);
			$("#inputmodal-points").val(data.points);
			$("#inputmodal-coins").val(data.coins);
			$("#inputmodal-cost").val(data.cost);
			$("#inputmodal-internet").val(data.internet);
			$("#userUpdate").modal({
				backdrop: 'static',
				keyboard: false
			});
			$("#userUpdate").modal('show');
			$(".check-user-type").each(function(index) {
				$(this).prop("checked", false);
			});
			if (!data.user_types.includes("Student")) {
				$("#a-program").prop("hidden", true);
				$("#a-year").prop("hidden", true);
				$("#a-section").prop("hidden", true);
			} else {
				$("#a-program").prop("hidden", false);
				$("#a-year").prop("hidden", false);
				$("#a-section").prop("hidden", false);
			}
			u_types = data.user_types.split(",")
			for (u_type in u_types){
				$("#" + u_types[u_type].trim()).prop("checked", true);
			}
		},
	});
}

var editing = 0;
function toggle_edit(inp, a) {
	if ($("#" + inp).prop("disabled")) {
		$("#" + inp).prop("disabled", false);
		$("#" + a).text("SAVE");
		$("#user-close").prop("disabled", true);
		$("button.close").prop("disabled", true);
		editing += 1;
	} else {
		if ($("#"+inp).val().trim() != "") {
			$("#" + inp).prop("disabled", true);
			$("#" + a).text("EDIT");
			$.ajax({
				url: '../../booking/ajax/change_'+a.split("-")[1],
				data: {
					'username': $("#inputmodal-id").val(),
					'data': $("#"+inp).val().trim()
				},
				dataType: 'json',
				success: function() {
					$('#user').DataTable().ajax.reload();
				}
			});
			editing -= 1;
			if (editing == 0) {
				$("#user-close").prop("disabled", false);
				$("button.close").prop("disabled", false);
			}
		} else {
			alert("You can't leave this field empty!");
		}
	}
};

function save_types(){
	var new_types = [];
	$(".check-user-type:checkbox:checked").each(function(index) {
		$.ajax({
			url: '../../booking/ajax/add_type',
			data: {
				'username': $("#inputmodal-id").val(),
				'u_type': $(this).attr("id")
			},
			dataType: 'json',
			success: function(data) {
				new_types.push(data.type);
				console.log(new_types);
				$("#inputmodal-group").val(new_types.toString());
			},
		});
		if ($(this).attr("id") === "Student") {
			$("#a-program").prop("hidden", false);
			$("#a-year").prop("hidden", false);
			$("#a-section").prop("hidden", false);
		}
	});
	$(".check-user-type:checkbox:not(:checked)").each(function(index) {
		$.ajax({
			url: '../../booking/ajax/delete_type',
			data: {
				'username': $("#inputmodal-id").val(),
				'u_type': $(this).attr("id")
			},
			dataType: 'json',
			success: function(data) {
				// alert("DONE");
			}
		});
		if ($(this).attr("id") === "Student") {
			$("#a-program").prop("hidden", true);
			$("#a-year").prop("hidden", true);
			$("#a-section").prop("hidden", true);
			$("#inputmodal-program").val("N/A");
			$("#inputmodal-year").val("0");
			$("#inputmodal-section").val("N/A");
		}
	});
	$('#all').DataTable().ajax.reload();
	$('#approved').DataTable().ajax.reload();
	$('#disapproved').DataTable().ajax.reload();
}

function edit_credit(type, data) {
	$("#modalheader-credit").text("EDIT " + type);
	$("#inp-curr-cred").val($("#" + data).val());
	$("#inp-curr-total").val($("#" + data).val());
	$("#editCredit").modal("show");
	$("#inp-curr-plus").val("");
	$("#inp-curr-plus").focus();
}

function edit_cost() {
	if ($("#a-cost").text() == "SAVE") {
		$("#inputmodal-cost").attr("disabled", true);
		$("#a-cost").text("EDIT");
		$.ajax({
			type: 'POST',
			url: 'ajax/save_mentor_cost',
			data: {
  				'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
  				'cost': $("#inputmodal-cost").val(),
				'username': $("#inputmodal-id").val(),
			}
		});
	} else {
		$("#inputmodal-cost").attr("disabled", false);
		$("#a-cost").text("SAVE");
	}
	
}

function curr_change(){
	$("#inp-curr-total").val(parseInt($("#inp-curr-cred").val()) + parseInt($("#inp-curr-plus").val()));
}

function save_balance() {
	var credit = $("#modalheader-credit").text().substring(5).toLowerCase();
	var new_bal = parseInt($("#inp-curr-total").val());
	$.ajax({
		url: '../../booking/ajax/save_balance',
		data: {
			'credit': credit,
			'balance': new_bal,
			'username': $("#inputmodal-id").val(),
			'creditor': "",
		},
		dataType: 'json',
		success: function() {
			alert("Saved successfully.");
			$("#inputmodal-"+credit).val(new_bal);
			$("#editCredit").modal("hide");
			$('#all').DataTable().ajax.reload();
			$('#approved').DataTable().ajax.reload();
			$('#disapproved').DataTable().ajax.reload();
		}
	});
}

$("select").click(function() {
  removeVal(this);
});
$("select").change(function() {
  removeVal(this);
});
$("input").click(function() {
  removeVal(this);
});
$("input").change(function() {
  removeVal(this);
});
$("textarea").click(function() {
  removeVal(this);
});
$("textarea").change(function() {
  removeVal(this);
});
function removeVal(inp) {
  $(inp).css("background-color", "");
    $(inp).next(".validation").remove();
}

function err_mesg(inp, err) {
  if ($(inp).next(".validation").length == 0) { // only add if not added
    $(inp).css("background-color", "#FFBABA");
        $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
    }
}