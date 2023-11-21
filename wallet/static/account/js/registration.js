$("#next-btn1").click(function() {
	var err = false;
	$("#fieldset1").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter " + $(this).parent().children().first().text());
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if ($("#mphone").val().length < 11 || $("#mphone").val().length > 13) {
		err_mesg("#mphone", "Enter a valid mobile phone");
		if (!err) {
			err = true;
			$("#mphone").focus();
		}
	}
	if ($("#foe option:selected").text() == "Select one...") {
		err_mesg("#foe", "Please select one expertise that best applies to you.");
		if (!err) {
			err = true;
			$("#foe").focus();
		}
	}
	var email_sp = $("#email").val().split("@");
	if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
		err_mesg("#email", "Enter a valid email");
		if (!err) {
			err = true;
			$("#email").focus();
		}
	}
	if (!err) {
        $("#fieldset1").hide();
        $("#fieldset2").show();
	}
});
$("#next-btn2").click(function() {
	var err = false;
	$("#fieldset2").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter " + $(this).parent().children().first().text());
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if ($("#children-num").val() < 0) {
		err_mesg("#children-num", "Enter a valid number of children");
		if (!err) {
			err = true;
			$("#children-num").focus();
		}
	}
	if (!err) {
        $("#fieldset2").hide();
        $("#fieldset3").show();
	}
});
$("#next-btn3").click(function() {
	var err = false;
	$("#fieldset3").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter " + $(this).parent().children().first().text());
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	$(".strand").each(function(index) {
		if ($(this).children("option:selected").text() == "Select one...") {
			err_mesg(this, "Please select a strand. Choose N/A if not applicable.");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	})
	$("#fieldset3").find(".many-entries").each(function(index) {
		if ($(this).val().includes(",")) {
			err_mesg(this, "This field does not accept commas.");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if (!err) {
        $("#fieldset3").hide();
        $("#fieldset4").show();
	}
});
$("#next-btn4").click(function() {
	var err = false;
	$("#fieldset4").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter " + $(this).parent().children().first().text());
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if (!err) {
        $("#fieldset4").hide();
        $("#fieldset5").show();
	}
});
$("input.selector").next().click(function() {
	alert($(this).parent().children());
	$(this).parent().children().first().attr('selected', true);
});


function mentor_day(inp, event) {
	event.preventDefault();
	$(inp).toggleClass("clicked");
	removeVal($(inp).parent());
}

$("input").click(function() {
	removeVal(this);
});
$("input").change(function() {
	removeVal(this);
});
// $("input").focus(function() {
// 	removeVal(this);
// });

$("#finish-btn").click(function() {
	var err = false;
	$("#fieldset4").find("input").each(function(index) {
		if ($(this).val().trim() == "") {
			err_mesg(this, "Please enter " + $(this).parent().children().first().text());
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if (!err) {
		var first_name = $("#fname").val();
		var last_name = $("#lname").val();
		var middle_name = $("#mname").val();
		var exp_field = $("#foe").val();
		var position = $("#position").val();
		var emp_status = $("#task").val();
		var mobile_phone = $("#mphone").val();
		var email = $("#email").val();
		var gender = $("input[name=gender]:checked").val();
		var street_name = $("#st-name").val();
		var subdivision = $("#subdivision").val();
		var barangay = $("#barangay").val();
		var city = $("#city").val();
		var province = $("#province").val();
		var country = $("#country").val();
		var zip_code = $("#zip-code").val();
		var date_of_birth = $("#birthdate").val();
		var place_of_birth = $("#birthplace").val();
		var nationality = $("#nationality").val();
		var civil_status = $("#civil-status option:selected").val();
		var spouse = $("#spouse").val();
		var spouse_occupation = $("#spouse-occupation").val();
		var children_num = $("#children-num").val();
		var father = $("#father").val();
		var father_occupation = $("#father-occupation").val();
		var mother = $("#mother").val();
		var mother_occupation = $("#mother-occupation").val();
		var language = $("#language").val();
		var height = $("#height").val();
		var weight = $("#weight").val();
		var religion = $("#religion").val();
		var elem_schools = to_str_array(".elem-school");
		var elem_levels = to_str_array(".elem-level");
		var elem_sectors = to_str_array(".elem-sector option:selected");
		var elem_froms = to_str_array(".elem-from");
		var elem_tos = to_str_array(".elem-to");
		var elem_awards = to_str_array(".elem-awards");
		var junior_schools = to_str_array(".junior-school");
		var junior_levels = to_str_array(".junior-level");
		var junior_sectors = to_str_array(".junior-sector option:selected");
		var junior_froms = to_str_array(".junior-from");
		var junior_tos = to_str_array(".junior-to");
		var junior_awards = to_str_array(".junior-awards");
		var senior_schools = to_str_array(".senior-school");
		var senior_levels = to_str_array(".senior-level");
		var senior_sectors = to_str_array(".senior-sector option:selected");
		var senior_froms = to_str_array(".senior-from");
		var senior_tos = to_str_array(".senior-to");
		var senior_awards = to_str_array(".senior-awards");
		var senior_strands = to_str_select(".strand"); 
		var college_schools = to_str_array(".college-school");
		var college_programs = to_str_array(".college-program");
		var college_levels = to_str_array(".college-level");
		var college_sectors = to_str_array(".college-sector option:selected");
		var college_froms = to_str_array(".college-from");
		var college_tos = to_str_array(".college-to");
		var college_awards = to_str_array(".college-awards");
		var postgrad_schools = to_str_array(".postgrad-school");
		var postgrad_programs = to_str_array(".postgrad-program");
		var postgrad_levels = to_str_array(".postgrad-level");
		var postgrad_sectors = to_str_array(".postgrad-sector option:selected");
		var postgrad_froms = to_str_array(".postgrad-from");
		var postgrad_tos = to_str_array(".postgrad-to");
		var postgrad_awards = to_str_array(".postgrad-awards");
		var trainings = to_str_array(".trainings");
		var trainings_sectors = to_str_array(".trainings-sector option:selected");
		var trainings_froms = to_str_array(".trainings-from");
		var trainings_tos = to_str_array(".trainings-to");
		var trainings_awards = to_str_array(".trainings-awards");
		var hist_company = to_str_array(".hist-company");
		var hist_industry = to_str_array(".hist-industry");
		var hist_status = to_str_array(".hist-status");
		var hist_position = to_str_array(".hist-position");
		var hist_salary = to_str_array(".hist-salary");
		var hist_from = to_str_array(".hist-from");
		var hist_to = to_str_array(".hist-to");
		var hist_startup = to_str_array(".hist-startup");
		var others_profile = to_str_array(".others-profile");
		var others_salary = to_str_array(".others-salary");
		var others_from = to_str_array(".others-from");
		var others_to = to_str_array(".others-to");
		var others_startup = to_str_array(".others-startup");
		$.ajax({
			url: 'ajax/usr_reg',
			data: {
				'first_name': first_name,
				'last_name': last_name,
				'middle_name': middle_name,
				'exp_field': exp_field,
				'position': position,
				'emp_status': emp_status,
				'mobile_phone': mobile_phone,
				'email': email,
				'gender': gender,
				'street_name': street_name,
				'subdivision': subdivision,
				'barangay': barangay,
				'city': city,
				'province': province,
				'country': country,
				'zip_code': zip_code,
				'date_of_birth': date_of_birth,
				'place_of_birth': place_of_birth,
				'nationality': nationality,
				'civil_status': civil_status,
				'spouse': spouse,
				'spouse_occupation': spouse_occupation,
				'children_num': children_num,
				'father': father,
				'father_occupation': father_occupation,
				'mother': mother,
				'mother_occupation': mother_occupation,
				'language': language,
				'height': height,
				'weight': weight,
				'religion': religion,
				'elem_schools': elem_schools,
				'elem_levels': elem_levels,
				'elem_sectors': elem_sectors,
				'elem_froms': elem_froms,
				'elem_tos': elem_tos,
				'elem_awards': elem_awards,
				'junior_schools': junior_schools,
				'junior_levels': junior_levels,
				'junior_sectors': junior_sectors,
				'junior_froms': junior_froms,
				'junior_tos': junior_tos,
				'junior_awards': junior_awards,
				'senior_schools': senior_schools,
				'senior_levels': senior_levels,
				'senior_sectors': senior_sectors,
				'senior_froms': senior_froms,
				'senior_tos': senior_tos,
				'senior_awards': senior_awards,
				'senior_strands': senior_strands,
				'college_schools': college_schools,
				'college_programs': college_programs,
				'college_levels': college_levels,
				'college_sectors': college_sectors,
				'college_froms': college_froms,
				'college_tos': college_tos,
				'college_awards': college_awards,
				'postgrad_schools': postgrad_schools,
				'postgrad_programs': postgrad_programs,
				'postgrad_levels': postgrad_levels,
				'postgrad_sectors': postgrad_sectors,
				'postgrad_froms': postgrad_froms,
				'postgrad_tos': postgrad_tos,
				'postgrad_awards': postgrad_awards,
				'trainings': trainings,
				'trainings_sectors': trainings_sectors,
				'trainings_froms': trainings_froms,
				'trainings_tos': trainings_tos,
				'trainings_awards': trainings_awards,
				'hist_company': hist_company,
				'hist_industry': hist_industry,
				'hist_status': hist_status,
				'hist_position': hist_position,
				'hist_salary': hist_salary,
				'hist_from': hist_from,
				'hist_to': hist_to,
				'hist_startup': hist_startup,
				'others_profile': others_profile,
				'others_salary': others_salary,
				'others_from': others_from,
				'others_to': others_to,
				'others_startup': others_startup,
			},
			dataType: 'json',
			success: function(data) {
				if (data.is_okay) {
					alert("Saved successfully");
					$("#modDetails").modal("hide");
				}
			},
			error: function(xhr,status,error) {
				alert(error);
			}
		});
	}
});

function to_str_array(inp) {
	var arr = [];
	$(inp).each(function(index) {
		arr.push($(this).val());
	});
	return arr.toString();
}

function to_str_select(inp) {
	var arr = [];
	$(inp).each(function(index) {
		arr.push($(this).children("option:selected").text());
	});
	return arr.toString();
}

function to_str_bool(inp) {
	var arr = [];
	$(inp).each(function(index) {
		arr.push($(this).hasClass("clicked"));
	});
	return arr.toString();
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

function add_fields_jhs(evt) {
	add_fields($(evt).parent());
};

function remove_field_jhs(evt) {
	remove_field($(evt).parent());
}

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