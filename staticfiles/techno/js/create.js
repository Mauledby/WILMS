$(document).ready(function() {
	var d = new Date();
	var curr_year = d.getFullYear();
	$("#acad-year").append("<option>" + (curr_year-1) + "-" + curr_year + "</option>");
	$("#acad-year").append("<option>" + curr_year + "-" + (curr_year+1) + "</option>");
});

$("#next-btn1").click(function() {
	var err = false;
	$("#fieldset1").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "This field is required");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if ($("#instructor option:selected").text() == "Select Instructor...") {
		err_mesg("#instructor", "This field is required");
		if (!err) {
			err = true;
		}
	}
	if ($("#enrolees").val() == "") {
		err_mesg("#enrolees", "This field is required");
		if (!err) {
			err = true;
		}
	}
	var proc = process_enrolees(true);
	if (proc) {
		err = true;
	}
	if (!err) {
		$("#fin-section").val($("#section").val());
		$("#fin-room").val($("#room").val());
		$("#fin-instructor").val($("#instructor").val());
		$("#fin-enrolees").val($("#enrolees")[0].files[0].name);
	    $("#fieldset1").hide();
	    $("#fieldset2").show();
    }
});

$("#next-btn2").click(function() {
	var err = false;
	var scheds = "";
	$("#fieldset2").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "This field is required");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if ($("#acad-year option:selected").text() == "Select School Year...") {
		err_mesg("#acad-year", "This field is required");
		if (!err) {
			err = true;
		}
	}
	$("#fieldset2").find(".sched-all").each(function(index) {
		var days_selected = 0;
		$(this).find(".sched-days").children().each(function(index) {
			if ($(this).hasClass("clicked")) {
				days_selected++;
				scheds += $(this).text().substring(0,2);
			}
		});
		if (days_selected == 0) {
			err_mesg($(this).find(".sched-days"), "Please select at least one (1) day.");
			if (!err) {
				err = true;
			}
		}
		var from = $($(this).find(".sched-from")).val();
		var d_to = $($(this).find(".sched-to")).val();
		if (d_to <= from) {
			err_mesg($(this).find(".sched-to"), "\"Time To\" must be after \"Time From\"");
			if (!err) {
				err = true;
				$(this).find(".sched-to").focus();
			}
		}
		scheds += " " + from + "-" + d_to + " | ";
	});
	if (!err) {
		$("#fin-year").val("A.Y. " + $("#acad-year").val());
		$("#fin-semester").val($('input[name="acad-sem"]:checked').val());
		$("#fin-schedule").val(scheds);
        $("#fieldset2").hide();
        $("#fieldset4").show();
    }
});

$("#next-btn4").click(function() {
	$.ajax({
		async: false,
		url: 'ajax/create_class',
		data: {
			'section': $("#fin-section").val(),
			'room': $("#fin-room").val(),
			'instructor': $("#fin-instructor").val().split('[')[1].split(']')[0],
			'school_year': $("#fin-year").val().substring(5),
			'semester': $("#fin-semester").val(),
			'schedule': $("#fin-schedule").val(),
		},
		success: function(data) {
			process_enrolees(false);
		}
	});
});

function mentor_day(inp, event) {
	event.preventDefault();
	$(inp).toggleClass("clicked");
	removeVal($(inp).parent());
}

function add_fields(evt) {
	var $klo = $(evt).parent().parent().clone();
	$klo.find("input").val("");
	$klo.find(".mentor-day").removeClass("clicked");
	$(evt).parent().parent().parent().append($klo);
}

function remove_field(evt) {
	if ($(evt).parent().parent().parent().children().length > 2) {
		$(evt).parent().parent().remove();
	} else {
		alert("Cannot remove this set of fields.");
	}
}

function process_enrolees(prelim) {
	var _complete = add_class;
	if (prelim) {
		_complete = prelim_add_students;
	}
	$('#enrolees').parse({
		config: {
			delimiter: "auto",
			complete: _complete,
		},
		before: function(file, inputElem)
		{
			// console.log("Parsing file...", file);
		},
		error: function(err, file)
		{
			// console.log("ERROR:", err, file);
		},
		complete: function()
		{
			// console.log("Done with all files");
		}
	});
}

function prelim_add_students(results) {
	var data = results.data;
	var header = data[0].join(",").split(",");
	var err = false;
	var accepted_fields = ["username", "first_name", "last_name", "email", "program", "year", "section", "gender"]
	if (!(header.includes("username") && header.includes("first_name") && header.includes("last_name") && header.includes("email"))) {
		alert("The following columns must be present: username, first_name, last_name, email");
		err = true;
	}
	var unknown = [];
	for (head of header) {
		// console.log(head);
		if (!accepted_fields.includes(head)) {
			unknown.push(head);
		}
	}
	if (unknown.length > 0) {
		alert("Unknown column/s: " + unknown + ". Accepted header values are: username,first_name,last_name,email,program,year,section,gender");
		err = true;
	}
	return err;
}

function add_class(results) {
	var data = results.data;
	var header = data[0].join(",").split(",");
	var rows_error = [];
	for(i=1;i<data.length;i++){
		var row = data[i];
		var cells = row.join(",").split(",");
		var send = {};
		err = false;
		if (header.length == cells.length) {
			for(j=0;j<cells.length;j++){
				if (cells[j].trim() == "") {
					err = true;
					rows_error.push(i+1);
				}
				send[header[j]] = cells[j];
			}
			if (!err) {
				$.ajax({
					url: 'ajax/add_students',
					data: send,
					success: function(data) {
						// console.log(data.name + " successfully added");
					},
					error: function(status, error) {
						rows_error.push(i+1);
					}
				});
			}
		} else {
			rows_error.push(i+1);
		}
	}
	if (rows_error.length == 0 || rows_error[0] == data.length) {
		alert("All " + (data.length-2).toString() + " users added successfully.");
	} else {
		alert("Partial success. The following rows failed to be added: " + rows_error);
	}
	window.location.href = '/techno/class';
}

$("input").click(function() {
	removeVal(this);
});
$("input").change(function() {
	removeVal(this);
});

$("select").click(function() {
	removeVal(this);
});
$("select").change(function() {
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