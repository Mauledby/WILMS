
    $("#fieldset2").hide();
    $("#fieldset3").hide();
    $("#fieldset4").hide();
    $("#prev-btn1").on("click",function(){
        $("#fieldset2").hide();
        $("#fieldset1").show();
    });
    $("#prev-btn2").on("click",function(){
        $("#fieldset3").hide();
        $("#fieldset2").show();
    });
    $("#prev-btn3").on("click",function(){
        $("#fieldset4").hide();
        $("#fieldset3").show();
    });

$(document).ready(function() {
	$("#studRegForm input").addClass("form-input form-control");
	$("#studRegForm select").addClass("form-input form-control");
    $("#studRegForm").find("input[name='gender']").removeClass("form-control");
    $("#id_date_of_birth").attr("type", "date");
    $("#id_children_num").attr("type", "number");
});

$("#next-btn1").click(function() {
          var err = false;
          $("#fieldset1").find("input").each(function(index) {
              if ($(this).attr("required") && $(this).val().trim() == "") {
                  err_mesg(this, "Please enter " + $(this).parent().children().first().text());
                  if (!err) {
                      err = true;
                      $(this).focus();
                  }
              }
          });
            if ($("#fieldset1 #id_phone_number").val().length < 11 || $("#fieldset1 #id_phone_number").val().length > 13) {
                err_mesg("#fieldset1 #id_phone_number", "Enter a valid mobile phone");
                if (!err) {
                    err = true;
                    $("#fieldset1 #id_phone_number").focus();
                }
            }
            var email_sp = $("#fieldset1 #id_email").val().split("@");
            if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
                err_mesg("#fieldset1 #id_email", "Enter a valid email");
                if (!err) {
                    err = true;
                    $("#fieldset1 #id_email").focus();
                }
            }
           if (!err) {
                $("#fieldset1").hide();
                $("#fieldset2").show();
            }
        }); //end next-btn 1 for fieldset 1

        $("#next-btn2").click(function() {
          var err = false;
          $("#fieldset2").find("input").each(function(index) {
            if ($(this).attr("required") && $(this).val().trim() == "") {
              err_mesg(this, "Please enter " + $(this).parent().children().first().text());
              if (!err) {
                err = true;
                $(this).focus();
              }
            }
          });
          if ($("#fieldset1 #id_children_num").val() < 0) {
            err_mesg("#fieldset1 #id_children_num", "Enter a valid number of children");
            if (!err) {
              err = true;
              $("#fieldset1 #id_children_num").focus();
            }
          }
          if (!err) {
                $("#fieldset2").hide();
                $("#fieldset3").show();
          }
        });//end next-btn 2 for fieldset 2
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
$("#save-btn").click(function() {
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
          if (err) {
          	return false;
          }
          else {
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
            // var myurl = $(form).attr('data-url')
            // alert('URL' + myurl)
            // preventDefault()
            $.ajax({
            	async: false,
               url: '../ajax/stud_registration',
               type: 'POST',
               dataType: 'json',
               data: {
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
                  'college_courses': college_programs,
                  'college_levels': college_levels,
                  'college_sectors': college_sectors,
                  'college_froms': college_froms,
                  'college_tos': college_tos,
                  'college_awards': college_awards,
                  'postgrad_schools': postgrad_schools,
                  'postgrad_courses': postgrad_programs,
                  'postgrad_levels': postgrad_levels,
                  'postgrad_sectors': postgrad_sectors,
                  'postgrad_froms': postgrad_froms,
                  'postgrad_tos': postgrad_tos,
                  'postgrad_awards': postgrad_awards,
                  'training_titles': trainings,
                  'training_sectors': trainings_sectors,
                  'training_froms': trainings_froms,
                  'training_tos': trainings_tos,
                  'training_awards': trainings_awards,
                  'hist_companies': hist_company,
                  'hist_industries': hist_industry,
                  'hist_statuss': hist_status,
                  'hist_positions': hist_position,
                  'hist_salaries': hist_salary,
                  'hist_froms': hist_from,
                  'hist_tos': hist_to,
                  'hist_startups': hist_startup,
                  'prev_startup_names': others_profile,
                  'prev_startup_salaries': others_salary,
                  'prev_startup_froms': others_from,
                  'prev_startup_tos': others_to,
                  'prev_startup_ns': others_startup,
                  'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
              },
              success: function(data){
              	alert("Saving. Press OK to continue.");
                $("#studRegForm").submit();
              	return true;
              },
              error: function(response) {
                  alert("error: " +response.status + " " + response.statusText);
                  err = true;
              }            
            });//end ajax
            // alert(languages)
          }//end if !err
          return !err;
        }); //end save-btn
function err_mesg(inp, err) {
    if ($(inp).next(".validation").length == 0) { // only add if not added
        $(inp).css("background-color", "#FFBABA");
        $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
    }
}
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

        function add_fields(evt) {
          var $klo = $(evt).parent().parent().clone();
          $klo.find("input").val("");
          $(evt).parent().parent().parent().append($klo);
        } //end add_fields function

        function remove_field(evt) {
          if ($(evt).parent().parent().parent().children().length > 2) {
            $(evt).parent().parent().remove();
          } else {
            alert("Cannot remove this set of fields.");
          }
        }// end remove_fields function



function add_fields_jhs(evt) {
  add_fields($(evt).parent());
};

function remove_field_jhs(evt) {
  remove_field($(evt).parent());
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