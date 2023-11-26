function autocomplete(inp, arr, added_arr, table, no_label, remove_row) {
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
        console.log(arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added_arr.includes(arr[i]));
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added_arr.includes(arr[i])) {
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
            $.ajax({
              async: false,
              url: 'ajax/find_basic_data',
              data: {
                'name': name
              },
              success: function(data) {
                var add = "<tr id='" + data.id + "'><td>" + data.first_name + "</td><td>" + data.last_name + "</td><td>" +  data.email + "</td><td>" +  data.phone_number + "</td><td><button type=\"button\" class=\"delete-row\" onclick=\"" + remove_row + "(this)\">DELETE</button></td></tr>";
                $(table).append(add);
                $(no_label).attr("hidden", true);
              }
            });
            added_arr.push(name);
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
    function err_mesg(inp, err) {
        if ($(inp).next(".validation").length == 0) { // only add if not added
            $(inp).css("background-color", "#FFBABA");
            $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
        }
    }
	//screen movement
	$("#fieldset2").hide();
    $("#fieldset3").hide();
    $("#fieldset4").hide();

    $("#next-btn1").on("click",function(){    
        var err = false;
        $("#fieldset1").find("input").each(function(index) {
            if ($(this).val().trim() == "" && $(this).attr("required")) {
                err_mesg(this, "Please enter " + $(this).parent().children().first().text());
                if (!err) {
                    err = true;
                    $(this).focus();
                }
            }
        });
        if (added_founder.length == 0) {
          err_mesg("#attInput", "Please add at least one founder for your startup.");
          if (!err) {
            err = true;
            $("#attInput").focus();
          }
        }     
        if (!err) {
            $("#fieldset1").hide();
            $("#fieldset2").show();
        }
    }); //end next-btn 1 for fieldset 1    
        
    $("#next-btn2").on("click",function(){    
      var err = false;
      $("#fieldset2").find("input").each(function(index) {
        if ($(this).val().trim() == "" && $(this).attr("required")) {
          err_mesg(this, "Please enter " + $(this).parent().children().first().text());
          if (!err) {
            err = true;
            $(this).focus();
          }
        }
      });
      if ($("#id_type_business option:selected").text() == "--Select Type of Business--") {
        err_mesg("#id_type_business", "Please select one type of business that best applies to you.");
        if (!err) {
          err = true;
          $("#type_business").focus();
        }
      }
      if ($("#id_industry option:selected").text() == "--Select Industry--") {
        err_mesg("#id_industry", "Please select one industry that best applies to you.");
        if (!err) {
          err = true;
          $("#id_industry").focus();
        }
      }
      $("#fieldset2").find(".mentor-days").each(function(index) {
        var days_selected = 0;
        $(this).children().each(function(index) {
          if ($(this).hasClass("clicked")) {
            days_selected++;
          }
        });
        if (days_selected == 0) {
          err_mesg(this, "Please select at least one (1) day.");
          if (!err) {
            err = true;
          }
        }
      });
      $("#fieldset2").find(".mentor-to").each(function(index) {
        if ($(this).val() <= $($("#fieldset2").find(".mentor-from").get(index)).val()) {
          err_mesg(this, "\"Time To\" must be after \"Time From\"");
          if (!err) {
            err = true;
            $(this).focus();
          }
        }
      });
      if ($("#id_end_date").val() < $("#id_start_date").val()) {
        err_mesg("#id_end_date", "\"End Date\" must be after \"Start Date\"");
          if (!err) {
            err = true;
            $("#id_end_date").focus();
          }
      }
      if(!($("#id_sys_business").is(":checked") || $("#id_sys_customer").is(":checked"))) {
        err_mesg("#bus_sys", "Choose at least one system of business.");
        err = true;
      }
      if (!err) {
        $("#fieldset2").hide();
        $("#fieldset3").show();
      }
    }); //end next-btn 1 for fieldset 1      
   
    $("#next-btn3").on("click",function(){
        var err = false;
        $("#fieldset3").find("input").each(function(index) {
            if ($(this).val().trim() == "" && $(this).attr("required")) {
                err_mesg(this, "Please enter " + $(this).parent().children().first().text());
                if (!err) {
                    err = true;
                    $(this).focus();
                }
            }
        });
        $("#fieldset3").find(".my-co-incubators").each(function(index) {
          var found = false;
          $(this).find("input").each(function(index) {
            if ($(this).val().trim() != "") {
              found = true;
              return;
            }
          });
          if (found) {
            $(this).find("input").each(function(index) {
              if ($(this).val().trim() == "") {
                err_mesg(this, "Please enter " + $(this).attr("placeholder"));
                if (!err) {
                  err = true;
                  $(this).focus();
                }
              }
            });
          } else {
            $(this).find("input").each(function(index) {
              removeVal(this);
            });
            $(this).find("select").each(function(index) {
              removeVal(this);
            });
          }
        });
        $("#fieldset3").find(".my-investors").each(function(index) {
          var found = false;
          $(this).find("input").each(function(index) {
            if ($(this).val().trim() != "") {
              found = true;
              return;
            }
          });
          if (found) {
            $(this).find("select option:selected").each(function(index) {
              if ($(this).text().includes("...")) {
                err_mesg($(this).parent(), "Please enter " + $(this).text());
                if (!err) {
                  err = true;
                  $(this).focus();
                }
              }
            });
            $(this).find("input").each(function(index) {
              if ($(this).val().trim() == "") {
                err_mesg(this, "Please enter " + $(this).attr("placeholder"));
                if (!err) {
                  err = true;
                  $(this).focus();
                }
              }
            });
          } else {
            $(this).find("input").each(function(index) {
              removeVal(this);
            });
            $(this).find("select").each(function(index) {
              removeVal(this);
            });
          }
        });
        $("#fieldset3").find(".my-revenues").each(function(index) {
          var found = false;
          $(this).find("input").each(function(index) {
            if ($(this).val().trim() != "") {
              found = true;
              return;
            }
          });
          if (found) {
            $(this).find("select option:selected").each(function(index) {
              if ($(this).text().includes("...")) {
                err_mesg($(this).parent(), "Please enter " + $(this).text().substring(7, 12));
                if (!err) {
                  err = true;
                  $(this).focus();
                }
              }
            });
            $(this).find("input").each(function(index) {
              if ($(this).val().trim() == "") {
                err_mesg(this, "Please enter " + $(this).attr("placeholder"));
                if (!err) {
                  err = true;
                  $(this).focus();
                }
              }
            });
          } else {
            $(this).find("input").each(function(index) {
              removeVal(this);
            });
            $(this).find("select").each(function(index) {
              removeVal(this);
            });
          }
        });
        $("#fieldset3").find("textarea").each(function(index) {
            if ($(this).val().trim() == "" && $(this).attr("required")) {
                err_mesg(this, "Please enter " + $(this).parent().children().first().text());
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

  
function mentor_day(inp, event) {
  event.preventDefault();
  $(inp).toggleClass("clicked");
  removeVal($(inp).parent());
}
     
    //functions needed
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

  $('.show-create-employee-modal').click(function(){
            $.ajax({
                url: 'startup/employee/add',
                type: 'get',
                dataType: 'json',
                beforeSend: function(){
                    $('#modal-create-employee').modal('show'); 
                },
                success: function(data){
                    $('#modal-create-employee .modal-content').html(data.html_form)
                }
            })
        }); //end show-create-founder-modal
    $(document).ready(function(){
      $("#id_letter_intent").attr("accept", "application/pdf");
      $("#id_letter_intent").attr("style", "height:50px;");
      $("#id_business_permit").attr("accept", "application/pdf");
      $("#id_business_permit").attr("style", "height:50px;");
      $("#id_business_plan").attr("accept", "application/pdf");
      $("#id_business_plan").attr("style", "height:50px;");
      $("#id_financial_statement").attr("accept", "application/pdf");
      $("#id_financial_statement").attr("style", "height:50px;");
      $("#id_list_references").attr("accept", "application/pdf");
      $("#id_list_references").attr("style", "height:50px;");
      $("#id_business_license").attr("accept", "application/pdf");
      $("#id_business_license").attr("style", "height:50px;");
      $("#id_startup_logo").attr("accept", "image/*");
      $("#id_startup_logo").attr("style", "height:50px;");

      $("#create-startup-form input").attr("class", "form-input form-control form-control-sm");
      $("#create-startup-form textarea").attr("class", "form-control");
      $("#create-startup-form textarea").attr("rows", "3");
      $("#create-startup-form select").attr("class", "form-input form-control form-control-sm");
      $("#id_start_date").attr("type", "date");
      $("#id_end_date").attr("type", "date");
      $("#id_sys_business").removeClass("form-input form-control form-control-sm");
      $("#id_sys_customer").removeClass("form-input form-control form-control-sm");
        //request mentor modal
        $('.show-request-mentor-modal').click(function(){
            $.ajax({
                url: 'startup/mentor/add',
                type: 'get',
                dataType: 'json',
                beforeSend: function(){
                    $('#modal-request-mentor').modal('show'); 
                },
                success: function(data){
                    $('#modal-request-mentor .modal-content').html(data.html_form)
                }
            })
        }) //end show-request-mentor-modal

        //display create founder modal
        $('.show-create-employee-modal').click(function(){
            $.ajax({
                url: 'startup/employee/add',
                type: 'get',
                dataType: 'json',
                beforeSend: function(){
                    $('#modal-create-employee').modal('show'); 
                },
                success: function(data){
                    $('#modal-create-employee .modal-content').html(data.html_form)
                }
            })
        }) //end show-create-founder-modal
  

        //save employee modalnform data
        $('#modal-create-employee').on('submit', '.create-employee', function(e){
          e.preventDefault();
          var form = $(this);
          var err = false;
          $("#modal-create-employee").find("input").each(function(index) {
            if ($(this).val().trim() == "" && $(this).attr("required")) {
                err_mesg(this, "Please enter " + $(this).parent().parent().children().first().children().first().text());
                if (!err) {
                    err = true;
                    $(this).focus();
                }
            }
          });
          var email_sp = $("#employee_email").val().split("@");
          if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
            err_mesg("#employee_email", "Enter a valid email");
            if (!err) {
              err = true;
              $("#employee_email").focus();
            }
          }
          if ($("#employee_phone").val().length < 11 || $("#employee_phone").val().length > 13) {
            err_mesg("#employee_phone", "Enter a valid mobile phone");
            if (!err) {
              err = true;
              $("#employee_phone").focus();
            }
          }
          if (!err) {
            var firstname = $('input[name="firstname"]').val();
            var lastname = $('input[name="lastname"]').val();
            var email = $('input[name="employee_email"]').val();
            var phone = $('input[name="employee_phone"]').val();
            var add = "<tr id=''><td>" + firstname + "</td><td>" + lastname + "</td><td>" + email + "</td><td>" + phone + "</td><td><button type=\"button\" class=\"delete-row\" onclick=\"remove_row(this)\">DELETE</button></td></tr>";
            $("#my_employees").append(add);
            $("#no-employees").attr("hidden", true);
            $("#modal-create-employee").modal("hide");
          return false;
        }
        })//end modal-create-founder-submit

    })  //end document ready 1 
        
        
    //display create founder modal
    $(document).ready(function(){
        $('.show-create-founder-modal').click(function(){
            $.ajax({
                url: 'startup/founder/add',
                type: 'get',
                dataType: 'json',
                beforeSend: function(){
                    $('#modal-create-founder').modal('show'); 
                },
                success: function(data){
                    $('#modal-create-founder .modal-content').html(data.html_form);
                    $("#modal-create-founder").find("input").each(function(index) {
                      if (index > 1)
                      $(this).val("");
                    });
                }
            })
        }) //end show-create-founder-modal

  

        //save founder modalnform data
        $('#modal-create-founder').on('submit', '.create-founder', function(e){
          e.preventDefault();
          var form = $(this);
          var err = false;
          $("#modal-create-founder").find("input").each(function(index) {
            if ($(this).val().trim() == "" && $(this).attr("required")) {
                err_mesg(this, "Please enter " + $(this).parent().parent().children().first().children().first().text());
                if (!err) {
                    err = true;
                    $(this).focus();
                }
            }
          });
          var email_sp = $("#founder_email").val().split("@");
          if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
            err_mesg("#founder_email", "Enter a valid email");
            if (!err) {
              err = true;
              $("#founder_email").focus();
            }
          }
          if ($("#founder_phone").val().length < 11 || $("#founder_phone").val().length > 13) {
            err_mesg("#founder_phone", "Enter a valid mobile phone");
            if (!err) {
              err = true;
              $("#founder_phone").focus();
            }
          }
          if (!err) {
            var firstname = $('input[name="firstname"]').val();
            var lastname = $('input[name="lastname"]').val();
            var email = $('input[name="founder_email"]').val();
            var phone = $('input[name="phone"]').val();
            var add = "<tr id=''><td>" + firstname + "</td><td>" + lastname + "</td><td>" + email + "</td><td>" + phone + "</td><td><button type=\"button\" class=\"delete-row\" onclick=\"remove_row(this)\">DELETE</button></td></tr>";
            // <i style='color:gray' class='fa fa-minus-circle' aria-hidden='true'></i>
            $("#my_founders").append(add);
            $("#no-founders").attr("hidden", true);
            $("#modal-create-founder").modal("hide");
          // var etype = $('input[name="emp_type"]').val();
          // $.ajax({
          //   url: form.attr('data-url'),
          //   type: form.attr('method'),
          //   dataType: 'json',
          //   data: {
          //        'etype' : etype,
          //        'firstname' : firstname,
          //        'lastname' : lastname,
          //        'email' : email,
          //        'phone' : phone,
          //        'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
          //   },
          //   success: function(data){
          //     if (data.form_is_valid){
          //       console.log('Data is saved')
          //     }else{
          //       $('#modal-create-founder .modal-content').html(data.html_form)
          //     }
          //   }

          // }) //end ajax

        }
          return false;
        })//end modal-create-founder-submit
    })  //end document ready 1  

    //display revenue modal
    $(document).ready(function(){
        $('.show-revenue-modal').click(function(){
            $.ajax({
                url: 'startup/revenue/add',
                type: 'get',
                dataType: 'json',
                beforeSend: function(){
                    $('#modal-revenue').modal('show'); 
                },
                success: function(data){
                    $('#modal-revenue .modal-content').html(data.html_form)
                }
            })
        })

    })


    //save revenue modal
    $('#modal-revenue').on('submit', '.create-revenue', function(e){
       e.preventDefault();
        var form = $(this);
        var revenue_month = $('select[name="revenue_month"]').val();
        var revenue_value = $('input[name="revenue_value"]').val();
       //alert(status)
        $.ajax({
          url: form.attr('data-url'),
          type: form.attr('method'),
          dataType: 'json',
          data: {
               'revenue_month' : revenue_month,
               'revenue_value' : revenue_value,
               'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
          },
          success: function(data){
            if (data.form_is_valid){
              console.log('Data is saved')
            }else{
              $('#modal-create-revenue .modal-content').html(data.html_form)
            }
          }

        })
        return false;
    })//end modal-revenue

      $("#save-btn").on("click",function(){
        // var mentorss = document.getElementById("listOfMentors").innerText
        //Ajax Accelarator & Investor
        var startup_n = 0;
        var acc_names = to_str_array("input[name=acc_name]");
        var acc_supports = to_str_array("input[name=acc_support]");
        var inv_sources = to_str_array("input[name=inv_source]");
        var inv_types = to_str_select("select[name=inv_type]");
        var inv_amounts = to_str_array("input[name=inv_amount]");
        var inv_remarkss = to_str_array("input[name=inv_remarks]");
        var rev_months = to_str_select("select[name=rev_month]");
        var rev_years = to_str_select("select[name=rev_year]");
        var rev_revenues = to_str_array("input[name=rev_amount]");
        var mentor_mondays = to_str_bool(".monday");
        var mentor_tuesdays = to_str_bool(".tuesday");
        var mentor_wednesdays = to_str_bool(".wednesday");
        var mentor_thursdays = to_str_bool(".thursday");
        var mentor_fridays = to_str_bool(".friday");
        var mentor_saturdays = to_str_bool(".saturday");
        var mentor_sundays = to_str_bool(".sunday");
        var mentor_from = to_str_array("input[name=sch-time-from]");
        var mentor_to = to_str_array("input[name=sch-time-to]");
        var my_mentors = [];
        $("#my-mentors").find(".mentorsnamelist").each(function(index) {
          my_mentors.push($(this).children().first().text().split("[")[1].split("]")[0]);
        });
        var the_founders_exi = [];
        var the_founders_new = [];
        $("#my_founders").children().each(function(index) {
          if($(this).attr("id") != "") {
            the_founders_exi.push($(this).attr("id"));
          } else {
            $(this).children().each(function(index) {
              if (index < 4) {
                the_founders_new.push($(this).text());
              }
            });
          }
        });
        var the_employees_exi = [];
        var the_employees_new = [];
        $("#my_employees").children().each(function(index) {
          if($(this).attr("id") != "") {
            the_employees_exi.push($(this).attr("id"));
          } else {
            $(this).children().each(function(index) {
              if (index < 4) {
                the_employees_new.push($(this).text());
              }
            });
          }
        });
        $.ajax({
          url: 'accinv/registration/ajax',
          type: 'POST',
          dataType: 'json',
          data: {
            'startup_n': startup_n,
            'acc_names' : acc_names,
            'acc_supports' : acc_supports,
            'inv_sources' : inv_sources,
            'inv_types' : inv_types,
            'inv_amounts' : inv_amounts,
            'inv_remarkss': inv_remarkss,
            'rev_months' : rev_months,
            'rev_years' : rev_years,
            'rev_revenues': rev_revenues,
            'my_mentors': my_mentors.toString(),
            'founders_new': the_founders_new.toString(),
            'founders_exi': the_founders_exi.toString(),
            'employees_new': the_employees_new.toString(),
            'employees_exi': the_employees_exi.toString(),
            'mondays': mentor_mondays,
            'tuesdays': mentor_tuesdays,
            'wednesdays': mentor_wednesdays,
            'thursdays': mentor_thursdays,
            'fridays': mentor_fridays,
            'saturdays': mentor_saturdays,
            'sundays': mentor_sundays,
            'sch_from': mentor_from,
            'sch_to': mentor_to,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
          },
          success: function(data){
            if (data.form_is_valid){
              console.log('Startup Data is saved')
            }else{
              console.log('error')
            }
          } //end success           
        })//end ajax
        //alert(startup_n)
    });
    // 
var added = [];
$("#st-mentors").change(function() {
  var name = $("#st-mentors option:selected").text();
  if (!added.includes(name) && name != "Select more mentors..."){
    var add = '<span class="mentorsnamelist"><span>' + name + '</span><a style="float: right; " href="javascript:void(0);" onclick="remove_mentor(this)">&times;</a></div>'
    if ($("#my-mentors").children().first().prop("id") == "no-mentors") {
      $("#no-mentors").prop("hidden", true);
    }
    $("#my-mentors").append(add);
    added.push(name);
  }
  $("#st-mentors").empty();
  var opt = "<option>Select more mentors...</option>";
  for (var mentor of mentors) {
    opt += "<option>" + mentor + "</option>";
  }
  $("#st-mentors").append(opt);
});

function to_str_array(inp) {
  var arr = [];
  $(inp).each(function(index) {
    arr.push($(this).val());
  });
  console.log(arr.toString());
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

function remove_row(inp) {
  var children = $(inp).parent().parent().children();
  var str = children.first().text() + " " + children.first().next().text() + " [" + children.parent().attr("id")+ "]";
  if (children.parent().attr("id") != "") {
    const index = added_founder.indexOf(str);
    added_founder.splice(index, 1);
  }
  $(inp).parent().parent().remove();
  console.log($("#my_founders").children().length);
  if ($("#my_founders").children().length == 0) {
    $("#no-founders").attr("hidden", false);
  } else {
    $("#no-founders").attr("hidden", true);
  }
}

function remove_row_emp(inp) {
  var children = $(inp).parent().parent().children();
  var str = children.first().text() + " " + children.first().next().text() + " [" + children.parent().attr("id")+ "]";
  if (children.parent().attr("id") != "") {
    const index = added_employee.indexOf(str);
    added_employee.splice(index, 1);
  }
  $(inp).parent().parent().remove();
  console.log($("#my_employees").children().length);
  if ($("#my_employees").children().length == 0) {
    $("#no-employees").attr("hidden", false);
  } else {
    $("#no-employees").attr("hidden", true);
  }
}

function remove_mentor(inp) {
  var str = $(inp).parent().children().first().text();
  const index = added.indexOf(str);
  added.splice(index, 1);
  $(inp).parent().remove();
  if (added.length == 0) {
    $("#no-mentors").prop("hidden", false);
  }
}

$("select").change(function(){
  removeVal(this);
});

$("#id_sys_customer").change(function(){
  removeVal($(this).parent());
});

$("#id_sys_business").change(function(){
  removeVal($(this).parent());
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