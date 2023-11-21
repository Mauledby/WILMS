 $("#fieldset2").hide();
        $("#fieldset3").hide();
        $("#fieldset4").hide();
        $("#fieldset5").hide();
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
        $("#prev-btn4").on("click",function(){
            $("#fieldset5").hide();
            $("#fieldset4").show();
        });

        function err_mesg(inp, err) {
            if ($(inp).next(".validation").length == 0) { // only add if not added
                $(inp).css("background-color", "#FFBABA");
                    $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
            }
        }

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
            if ($("#contact_number").val().length < 11 || $("#contact_number").val().length > 13) {
                err_mesg("#contact_number", "Enter a valid mobile phone");
                if (!err) {
                    err = true;
                    $("#contact_number").focus();
                }
            }
            var email_sp = $("#emp_email").val().split("@");
            if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
                err_mesg("#emp_email", "Enter a valid email");
                if (!err) {
                    err = true;
                    $("#emp_email").focus();
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
        });//end next-btn 3 for fieldset 3

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
        }); //end next-btn 4 for fieldset 4

        $("input.selector").next().click(function() {
          alert($(this).parent().children());
          $(this).parent().children().first().attr('selected', true);
        }); //end input selector

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
          //'http://127.0.0.1:8000/startup/employee/registration/ajax'
          if (!err) {
            var id = $("#id-number").val();
            var first_name = $("#first_name").val();
            var last_name = $("#last_name").val();
            var middle_name = $("#middle_name").val();
            var position = $("#position").val();
            var salary = $("#salary").val();
            var emp_status = $("#emp_status").val();
            var phone_number = $("#contact_number").val();
            var email = $("#emp_email").val();
            var gender = $("input[name='gender']:checked").val();
            var street_name = $("#street_name").val();
            var subdivision = $("#subdivision").val();
            var barangay = $("#barangay").val();
            var city = $("#city").val();
            var province = $("#province").val();
            var zip_code = $("#zip_code").val();
            var date_of_birth = $("#date_of_birth").val();
            var place_of_birth = $("#place_of_birth").val();
            var nationality = $("#nationality").val();
            var civil_status = $("#civil_status option:selected").val();
            var spouse = $("#spouse_name").val();
            var spouse_occupation = $("#spouse_occupation").val();
            var no_children = $("#no_children").val();
            var father_name = $("#father_name").val();
            var father_occupation = $("#father_occupation").val();
            var mother_name = $("#mother_name").val();
            var mother_occupation = $("#mother_occupation").val();
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
               url: '/startup/employee/registration/ajax',
               type: 'POST',
               dataType: 'json',
               data: {
                  'id': id,
                  'first_name' : first_name,
                  'last_name' : last_name,
                  'middle_name' : middle_name,
                  'position': position,
                  'salary' : salary,
                  'emp_status': emp_status,
                  'phone_number':phone_number,
                  'email':email,
                  'gender': gender,
                  'street_name': street_name,
                  'subdivision':subdivision,
                  'barangay' : barangay,
                  'city':city,
                  'province':province,
                  'zip_code': zip_code,
                  'date_of_birth': date_of_birth,
                  'place_of_birth': place_of_birth,
                  'nationality': nationality,
                  'civil_status' : civil_status,
                  'spouse': spouse,
                  'spouse_occupation': spouse_occupation,
                  'no_children' : no_children,
                  'father_name' : father_name,
                  'father_occupation ': father_occupation,
                  'mother_name': mother_name,
                  'mother_occupation ': mother_occupation,
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
                if (data.form_is_valid){
                  alert('Saved successfully');
                }else{
                  console.log('error');
                }
              },
              error: function(response) {
                  console.log("error: " +response.status + " " + response.statusText);
              }            
            })//end ajax
            // alert(languages)
          }//end if !err
        }); //end save-btn
    
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