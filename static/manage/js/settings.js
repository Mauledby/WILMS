function enable(id) {
	$.ajax({
		url:'ajax/enable',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$($(".able-"+id)[0]).text("DISABLE");
			$($(".able-"+id)[0]).attr("href", "class", "modal", "javascript:disable('" + id + "')");
		},
	});
	window.location.reload();
}

function enable_modal(id){
	$("#enable_ok").attr("onClick", "enable('"+ id +"')");
	$("#enUser").modal("show");
}

function disable(id) {
	$.ajax({
		url:'ajax/disable',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$($(".able-"+id)[0]).text("ENABLE");
			$($(".able-"+id)[0]).attr("href", "class", "modal", "javascript:enable('" + id + "')");
		},
	});
	window.location.reload();
}

function disable_modal(id){
	$("#disable_ok").attr("onClick", "disable('"+ id +"')");
	$("#disUser").modal("show");
}

var gl_id = 0;
function show_user_transaction(id) {
	gl_id = id;
	reload_transaction(id, '2020-01-01', '2100-01-01');
	$("#trans-filter").attr("onclick", "transaction_filter(\'"+id+"\')");
	$("#myModalTransaction").modal("show");
}

function kewk(id){
	$("#myModalTransactions").modal("show");
	$.ajax({
		url:'ajax/disable',
		data:{
			'id': id,
		},
		dataType: 'json',
		success: function() {
			$($(".able-"+id)[0]).text("ENABLE");
			$($(".able-"+id)[0]).attr("href", "class", "modal", "javascript:enable('" + id + "')");
		},
	});
}

function kewk2(id){
	$("#myModalTransactions").modal("show");
}

function add_facility() {
	$("#nf-name").val("");
	$("#nf-cap").val("");
	$("#nf-comp").val("");
	$("#nf-comp-cost").val("");
	$("#nf-rate").val("");
	$("#mdl-add-facility").find("input").each(function(index) {
		removeVal($(this));
	});
	$("#mdl-add-facility").modal("show");
}

function save_new_facility() {
	var err = false;
	$("#mdl-add-facility").find(".required").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "This field is required.");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	var name = $("#nf-name").val();
	var cap = $("#nf-cap").val();
	var comp = $("#nf-comp").val();
	var comp_cost = $("#nf-comp-cost").val();
	var rate = $("#nf-rate").val();
	if (cap <= 0) {
		err_mesg("nf-cap", "Capacity must be more than 0.");
		if (!err) {
			err = true;
			$(this).focus();
		}
	}
	if (comp < 0) {
		err_mesg("nf-comp", "Computer count must be more than or equal to 0.");
		if (!err) {
			err = true;
			$(this).focus();
		}
	} else if (comp > 0 && comp_cost <= 0) {
		err_mesg("nf-comp-cost", "Computer use cost must be more than or equal to 0.");
		if (!err) {
			err = true;
			$(this).focus();
		}
	} else if (comp == 0 && comp_cost < 0) {
		$("#nf-comp-cost").val("0");
		comp_cost = 0;
	}
	if (!err) {
		$.ajax({
			url: 'ajax/add_fac',
			data: {
				'name': name,
				'cap': cap,
				'comp': comp,
				'comp-cost': comp_cost,
				'cost': rate,
			},
			success: function(data) {
				if (data.message != "") {
					alert(data.message);
					err_mesg("nf-name", "This name is already taken.");
					if (!err) {
						err = true;
						$(this).focus();
					}
				} else {
					alert("Facility added successfully. Refresh the page to reload.");
					$("#mdl-add-facility").modal("hide");
				}
			}
		});
	}
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
			'url': 'ajax/transactions_user/'+id+'/' + from + '/' + to +'/',
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
			url: 'ajax/transactions_payment/'+id+'/' + from + '/' + to +'/',
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
		url:'ajax/user_update_get',
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
				url: 'ajax/change_'+a.split("-")[1],
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
			url: 'ajax/add_type',
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
			url: 'ajax/delete_type',
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
	$('#user').DataTable().ajax.reload();
}

function edit_credit(type, data) {
	$("#modalheader-credit").text("EDIT " + type);
	$("#inp-curr-cred").val($("#" + data).val());
	$("#inp-curr-total").val($("#" + data).val());
	$("#editCredit").modal("show");
	$("#inp-curr-plus").val("");
	$("#inp-curr-plus").focus();
}

function curr_change(){
	$("#inp-curr-total").val(parseInt($("#inp-curr-cred").val()) + parseInt($("#inp-curr-plus").val()));
}

function save_balance() {
	var credit = $("#modalheader-credit").text().substring(5).toLowerCase();
	var new_bal = parseInt($("#inp-curr-total").val());
	$.ajax({
		url: 'ajax/save_balance',
		data: {
			'credit': credit,
			'balance': new_bal,
			'username': $("#inputmodal-id").val(),
			'creditor': user,
		},
		dataType: 'json',
		success: function() {
			alert("Saved successfully.");
			$("#inputmodal-"+credit).val(new_bal);
			$("#editCredit").modal("hide");
			$('#user').DataTable().ajax.reload();
		}
	});
}

function fac_edit(id) {
	$(".facility").removeClass("selected");
	$("a.fac-edit").prop("hidden", false);
	$("#fac-"+id).addClass("selected");
	$("#edit-"+id).prop("hidden", true);
	$.ajax({
		url: 'ajax/get_fac',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function(data) {
			$("#fac-name").val(data.name);
			$("#fac-cap").val(data.cap);
			$("#fac-comp").val(data.computers);
			$("#fac-comp-rate").val(data.computer_fee);
			$("#fac-rate").val(data.cost);
			$("#fac-save").attr("onclick", "save_facility(" + id + ")")
		},
	});
	$("#spratetable").DataTable().destroy();
	$('#spratetable').dataTable({
			language: lang,
	        order: [[ 1, "desc" ]],
	        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	        columnDefs: [
	            {orderable: false,
	             searchable: true,
	             className: "center",
	             targets: [5, 6, 7]
	            },
	            {
	                data: 'start_day',
	                targets: [0]
	            },
	            {
	                data: 'end_day',
	                targets: [1]
	            },
	            {
	                data: 'start_time',
	                targets: [2]
	            },
	            {
	                data: 'end_time',
	                targets: [3]
	            },
	            {
	                data: 'rate',
	                targets: [4]
	            },
	            {
	                data: 'days_active',
	                targets: [5]
	            },
	            {
	                data: 'user_type',
	                targets: [6]
	            },
	            {
	                data: 'action',
	                targets: [7]
	            },
	        ],
	        searching: false,
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/special_rates/'+id,
		});
}

function save_facility(id) {
	var err = false;
	$("input.fac-edit").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter a value!");
			if (!err) {
				$("a.fac-edit").prop("hidden", true);
				err = true;
			}
		}
	});
	if (!err) {
		$("a.fac-edit").prop("hidden", false);
		$("#edit-"+id).prop("hidden", true);
		$.ajax({
			url: 'ajax/save_fac',
			data: {
				'id': id,
				'name': $("#fac-name").val(),
				'cap': $("#fac-cap").val(),
				'cost': $("#fac-rate").val(),
				'comp': $("#fac-comp").val(),
				'comp-cost': $("#fac-comp-rate").val(),
			},
			dataType: 'json',
			success: function() {
				alert("SAVE SUCCESSFUL");
			}
		});
	}
}

function trig_edit_time(){
	$.ajax({
		url: 'ajax/get_optime',
		success: function(data) {
			$("input#inp-from").val(data.from);
			$("input#inp-to").val(data.to);
		}
	});
	$("#editTime").modal("show");
}

function save_optime() {
	if($("#inp-to").val() <= $("#inp-from").val()) {
		err_mesg($("#inp-to"), "\"Time To\" must be after \"Time From\"");
	} else {
		$.ajax({
			url: 'ajax/save_optime',
			data: {
				'from': $("#inp-from").val(),
				'to': $("#inp-to").val(),
			},
			dataType: 'json',
			success: function(data) {
				$("#disp-from").text(data.from_str);
				$("#disp-to").text(data.to_str);
				$("#editTime").modal("hide");
			}
		});
	}
}

$("#add-specops").click(function() {
	$("#mdl-add-specops").find("input").each(function(index) {
		removeVal($(this));
	})
	removeVal("#aso-days");
	$("#aso-reason").val("");
	$("#aso-start-day").val("");
	$("#aso-end-day").val("");
	$("#aso-closed").prop("checked", false);
	$("#aso-start-time").prop("disabled", false);
	$("#aso-end-time").prop("disabled", false);
	$("#aso-start-time").val("");
	$("#aso-end-time").val("");
	$("#aso-monday").prop("checked", true);
	$("#aso-tuesday").prop("checked", true);
	$("#aso-wednesday").prop("checked", true);
	$("#aso-thursday").prop("checked", true);
	$("#aso-friday").prop("checked", true);
	$("#aso-saturday").prop("checked", true);
	$("#aso-save").text("ADD");
	$("#aso-save").attr("onclick", "save_specops(0)");
	$("#mdl-add-specops").modal("show");
});

$("#aso-closed").change(function() {
	if ($(this).prop("checked")) {
		$("#aso-start-time").prop("disabled", true);
		$("#aso-end-time").prop("disabled", true);
		removeVal("#aso-start-time");
		removeVal("#aso-end-time");
	} else {
		$("#aso-start-time").prop("disabled", false);
		$("#aso-end-time").prop("disabled", false);
	}
});

$("#aso-days").find("input").change(function() {
	removeVal("#aso-days");
});

$("#td-types").find("input").change(function() {
	removeVal("#td-types");
});

function save_specops(id) {
	var err = false;
	$("#mdl-add-specops").find("input.required").each(function(index) {
		if ($(this).val() == "") {
			err_mesg(this, "This field is required");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	var reason = $("#aso-reason").val().trim();
	var start_day = $("#aso-start-day").val();
	var end_day = $("#aso-end-day").val();
	if (start_day > end_day) {
		err_mesg("#aso-end-day", "End day must not be before Start day");
		err = true;
		$("#aso-end-day").focus();
	}
	var closed = $("#aso-closed").prop("checked");
	var start_time = $("#aso-start-time").val();
	var end_time = $("#aso-end-time").val();
	if (!closed) {
		if (start_time > end_time) {
			err_mesg("#aso-end-time", "End time must not be before Start time");
			if (!err) {
				err = true;
				$("#aso-end-time").focus();
			}
		}
		if (start_time == "") {
			err_mesg("#aso-start-time", "This field is required");
			if (!err) {
				err = true;
				$("#aso-start-time").focus();
			}
		}
		if (end_time == "") {
			err_mesg("#aso-end-time", "This field is required");
			if (!err) {
				err = true;
				$("#aso-end-time").focus();
			}
		}
	}
	var monday = $("#aso-monday").prop("checked");
	var tuesday = $("#aso-tuesday").prop("checked");
	var wednesday = $("#aso-wednesday").prop("checked");
	var thursday = $("#aso-thursday").prop("checked");
	var friday = $("#aso-friday").prop("checked");
	var saturday = $("#aso-saturday").prop("checked");
	if (!(monday || tuesday || wednesday || thursday || friday || saturday)) {
		err = true;
		err_mesg("#aso-days", "Select at least one day of the week that this special operating time must be applied (default: all).");
	}
	if (!err) {
		$.ajax({
			url: 'ajax/save_specops',
			data: {
				'id': id,
				'reason': reason,
				'start_day': start_day,
				'end_day': end_day,
				'closed': closed,
				'start_time': start_time,
				'end_time': end_time,
				'monday': monday,
				'tuesday': tuesday,
				'wednesday': wednesday,
				'thursday': thursday,
				'friday': friday,
				'saturday': saturday
			},
			dataType: 'json',
			success: function() {
				alert("Saved successfully");
				$("#scheduletable").DataTable().ajax.reload();
				$("#mdl-add-specops").modal("hide");
			}
		});
	}
}

function update_specops(id) {
	$.ajax({
		url: 'ajax/view_specops',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function(data) {
			$("#aso-reason").val(data.reason);
			$("#aso-start-day").val(data.start_day);
			$("#aso-end-day").val(data.end_day);
			if (data.closed) {
				$("#aso-closed").prop("checked", true);
				$("#aso-start-time").val("");
				$("#aso-end-time").val("");
				$("#aso-start-time").prop("disabled", true);
				$("#aso-end-time").prop("disabled", true);
			} else {
				$("#aso-closed").prop("checked", false);
				$("#aso-start-time").val(data.start_time);
				$("#aso-end-time").val(data.end_time);
				$("#aso-start-time").prop("disabled", false);
				$("#aso-end-time").prop("disabled", false);
			}
			$("#aso-monday").prop("checked", data.monday);
			$("#aso-tuesday").prop("checked", data.tuesday);
			$("#aso-wednesday").prop("checked", data.wednesday);
			$("#aso-thursday").prop("checked", data.thursday);
			$("#aso-friday").prop("checked", data.friday);
			$("#aso-saturday").prop("checked", data.saturday);
			$("#aso-save").text("SAVE");
			$("#aso-save").attr("onclick", "save_specops(" + id + ")");
			$("#mdl-add-specops").modal("show");
		}
	});
}

function delete_specops(id) {
	$.ajax({
		url: 'ajax/delete_specops',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function() {
			alert("Deleted successfully");
			$("#scheduletable").DataTable().ajax.reload();
		},
	});
}

function add_specrate() {
	var ven = $("#fac-name").val();
	$("#asr-venue option:contains(" + ven + ")").attr('selected', 'selected');
	$("#mdl-add-specrate").find("input").each(function(index) {
		removeVal($(this));
	})
	removeVal("#asr-days");
	removeVal("#td-types");
	$("#td-types").children().each(function(index) {
		$(this).prop("checked", true);
	});
	$("#asr-discount").val("");
	$("#asr-start-day").val("");
	$("#asr-end-day").val("");
	$("#asr-start-time").val("");
	$("#asr-end-time").val("");
	$("#asr-monday").prop("checked", true);
	$("#asr-tuesday").prop("checked", true);
	$("#asr-wednesday").prop("checked", true);
	$("#asr-thursday").prop("checked", true);
	$("#asr-friday").prop("checked", true);
	$("#asr-saturday").prop("checked", true);
	$("#asr-save").text("ADD");
	$("#asr-save").attr("onclick", "save_specrate(0)");
	$("#mdl-add-specrate").modal("show");
}

function save_specrate(id) {
	var err = false;
	$("#mdl-add-specrate").find("input.required").each(function(index) {
		if ($(this).val() == "") {
			err_mesg(this, "This field is required");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	var venue = $("#asr-venue option:selected").text();
	var discount = $("#asr-discount").val();
	var start_day = $("#asr-start-day").val();
	var end_day = $("#asr-end-day").val();
	if (start_day > end_day) {
		err_mesg("#asr-end-day", "End day must not be before Start day");
		err = true;
		$("#asr-end-day").focus();
	}
	var start_time = $("#asr-start-time").val();
	var end_time = $("#asr-end-time").val();
	if (start_time > end_time) {
		err_mesg("#asr-end-time", "End time must not be before Start time");
		if (!err) {
			err = true;
			$("#asr-end-time").focus();
		}
	}
	if (discount >= 100 || discount <= 0) {
		err_mesg("#asr-discount", "Discount value must be between 1 and 99");
		if (!err) {
			err = true;
			$("#asr-discount").focus();
		}
	}
	var monday = $("#asr-monday").prop("checked");
	var tuesday = $("#asr-tuesday").prop("checked");
	var wednesday = $("#asr-wednesday").prop("checked");
	var thursday = $("#asr-thursday").prop("checked");
	var friday = $("#asr-friday").prop("checked");
	var saturday = $("#asr-saturday").prop("checked");
	if (!(monday || tuesday || wednesday || thursday || friday || saturday)) {
		err = true;
		err_mesg("#asr-days", "Select at least one day of the week that this special rate must be applied (default: all).");
	}
	var user_types = "";
	$('.asr-user-type:checkbox:checked').each(function(index) {
		user_types += $(this).attr("id").substring(4) + ',';
	});
	if (user_types == "") {
		err = true;
		err_mesg("#td-types", "Select at least one user type that this special rate is applicable to (default: all).");
	}
	if (!err) {
		$.ajax({
			url: 'ajax/save_specrate',
			data: {
				'id': id,
				'venue': venue,
				'discount': discount,
				'start_day': start_day,
				'end_day': end_day,
				'start_time': start_time,
				'end_time': end_time,
				'user_type': user_types,
				'monday': monday,
				'tuesday': tuesday,
				'wednesday': wednesday,
				'thursday': thursday,
				'friday': friday,
				'saturday': saturday
			},
			dataType: 'json',
			success: function() {
				alert("Saved successfully");
				$("#spratetable").DataTable().ajax.reload();
				$("#mdl-add-specrate").modal("hide");
			}
		});
	}
}

function update_specrate(id) {
	$.ajax({
		url: 'ajax/view_specrate',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function(data) {
			$("#asr-venue option:contains(" + data.venue + ")").attr('selected', 'selected');
			$("#asr-discount").val(data.discount);
			$("#asr-start-day").val(data.start_day);
			$("#asr-end-day").val(data.end_day);
			$("#asr-start-time").val(data.start_time);
			$("#asr-end-time").val(data.end_time);
			$("#asr-monday").prop("checked", data.monday);
			$("#asr-tuesday").prop("checked", data.tuesday);
			$("#asr-wednesday").prop("checked", data.wednesday);
			$("#asr-thursday").prop("checked", data.thursday);
			$("#asr-friday").prop("checked", data.friday);
			$("#asr-saturday").prop("checked", data.saturday);
			$("#td-types").children().each(function(index) {
				$(this).prop("checked", false);
			});
			for (user_type of data.user_types.split(',')) {
				$("#asr-"+user_type).prop("checked", true);
			}
			$("#asr-save").text("SAVE");
			$("#asr-save").attr("onclick", "save_specrate(" + id + ")");
			$("#mdl-add-specrate").modal("show");
		}
	});
}

function delete_specrate(id) {
	$.ajax({
		url: 'ajax/delete_specrate',
		data: {
			'id': id,
		},
		dataType: 'json',
		success: function() {
			alert("Deleted successfully");
			$("#spratetable").DataTable().ajax.reload();
		},
	});
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

function err_mesg(inp, err) {
	if ($(inp).next(".validation").length == 0) { // only add if not added
		$(inp).css("background-color", "#FFBABA");
        $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
    }
}

var added = [];
function autocomplete(inp, arr, keep) {
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
        console.log(arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added.includes(arr[i]));
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
            if (!keep) {
	            var add = '<div class="namelist"><span>' + name + '</span><a style="float: right; " href="javascript:void(0);" onclick="remove_comm(this)">&times;</a></div>'
	            $("#div-comms").append(add);
            } else {
            	$(inp).val(name);
            }
            added.push(name);
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

function remove_comm(inp) {
  var str = $(inp).parent().children().first().text();
  console.log(str);
  const index = added.indexOf(str);
  added.splice(index, 1);
  $(inp).parent().remove();
}

$("#comms-add").click(function() {
	var err = false;
	var group_name = $("#comms-name").val().trim();
	if (group_name == "") {
		err = true;
		err_mesg("#comms-name", "Please enter a group name");
		$("#group_name").focus();
	}
	if ($("#div-comms").children().length == 0) {
		err_mesg("#inp-comms", "Please enter at least one committee member");
		if (!err) {
			err = true;
			$("#inp-comms").focus();
		}
	}
	var comm_mems = "";
	$("#div-comms").children().each(function(index) {
		var add = ", ";
		if (index == $("#div-comms").children().length - 1) {
			add = "";
		}
		comm_mems += $(this).children().first().text().split("[")[1].split("]")[0] + add;
	});
	if (!err) {
		$.ajax({
			url: 'ajax/add_comm_group',
			data: {
				'name': group_name,
				'members': comm_mems,
			},
			success: function() {
				alert("Committee group created successfully");
				$("#inp-comms").val("");
				$("#comms-name").val("");
				$("#div-comms").empty();
				$("#grouptable").DataTable().ajax.reload();
			}
		});
	}
});

var added = [];

function update_group(id) {
	added = [];
	$.ajax({
		url: 'ajax/view_committee',
		data: {
			'id': id,
		},
		success: function(data) {
			$("#com-name").val(data.name);
			for (stud of data.members.split(",")) {
				if (stud.trim() != "") {
					added.push(stud);
				}
			}

		},
	});
	$("#committee-members").DataTable().destroy();
	$("#committee-members").DataTable({
		language: lang,
        order: [[ 0, "desc" ]],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        columnDefs: [
            {orderable: false,
             searchable: false,
             targets: [1]
            },
            {
            data: 'name',
                targets: [0]
            },
            {
            data: 'action',
                targets: [1]
            },
        ],
        serverSide: true,
        stateSave: true,
        ajax: 'ajax/view_members_comm/'+id,
    });
    $("#btn-add-comm").attr("onclick", "add_committee_member(" + id + ")")
	$("#mdl-group").modal("show");
}

function add_committee_member(id) {
	if (committee.includes($("#add-committee").val())) {
	    $.ajax({
	      	url: 'ajax/add_committee_member',
	       	data: {
	       		'class': id,
	       		'name': $("#add-committee").val().split('[')[1].split(']')[0],
	       	},
	       	success: function() {
	       		alert("Committee member added succesfully");
	       		$("#add-committee").val("");
	       		$("#committee-members").DataTable().ajax.reload();
	   			$("#grouptable").DataTable().ajax.reload();
	       	}
	    });
	} else {
		alert("This user does not exist");
	    $("#add-committee").val("");
	}
}

function remove_committee_member(group, id) {
	$.ajax({
	  	url: 'ajax/remove_committee_member',
	   	data: {
	   		'group': group,
	   		'name': id,
	   	},
	   	success: function() {
	   		alert("Committee member removed succesfully");
	   		$("#committee-members").DataTable().ajax.reload();
	   		$("#grouptable").DataTable().ajax.reload();
	   	}
	});
}

function remove_committee(id) {
	$.ajax({
	  	url: 'ajax/delete_committee',
	   	data: {
	   		'id': id,
	   	},
	   	success: function() {
	   		alert("Committee removed succesfully");
	   		$("#grouptable").DataTable().ajax.reload();
	   	}
	});
}

$('#mdl-group').on('hidden', function () {
    added = [];
});

$('#mdl-group').on('hidden.bs.modal', function () {
    added = [];
});

$('#disUser').on('shown.bs.modal', function () {
	$('#disUser').trigger('focus')
  })
  $('#disUser').modal(options)
  $('#enUser').modal(options)