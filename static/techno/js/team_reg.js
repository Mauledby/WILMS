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
              url: '../startup/ajax/find_basic_data',
              data: {
                'name': name
              },
              success: function(data) {
                var add = "<tr id='" + data.id + "'><td>" + data.first_name + "</td><td>" + data.last_name + "</td><td>" +  data.email + "</td><td>" +  data.phone_number + "</td><td><select><option>Team Leader</option><option selected>Member</option></select></td><td><button type=\"button\" class=\"delete-row\" onclick=\"" + remove_row + "(this)\"><i class=\"fas fa-minus-circle\"></button></td></tr>";
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


    $("#fieldset2").hide();
    $("#fieldset3").hide();
    $("#prev-btn1").on("click",function(){
        $("#fieldset2").hide();
        $("#fieldset1").show();
    });
    $("#prev-btn2").on("click",function(){
        $("#fieldset3").hide();
        $("#fieldset2").show();
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
          $("#fieldset1").find("textarea").each(function(index) {
              if ($(this).attr("required") && $(this).val().trim() == "") {
                  err_mesg(this, "Please enter " + $(this).parent().children().first().text());
                  if (!err) {
                      err = true;
                      $(this).focus();
                  }
              }
          });
            if ($("#id_contact_number").val().length < 11 || $("#id_contact_number").val().length > 13) {
                err_mesg("#id_contact_number", "Enter a valid mobile phone");
                if (!err) {
                    err = true;
                    $("#id_contact_number").focus();
                }
            }
            var email_sp = $("#id_email").val().split("@");
            if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
                err_mesg("#id_email", "Enter a valid email");
                if (!err) {
                    err = true;
                    $("#id_email").focus();
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
          $("#fieldset2").find("textarea").each(function(index) {
            if ($(this).attr("required") && $(this).val().trim() == "") {
              err_mesg(this, "Please enter " + $(this).parent().parent().parent().children().first().children().first().children().first().text());
              if (!err) {
                err = true;
                $(this).focus();
              }
            }
          });
          $("#fieldset2").find("select").each(function(index) {
            if ($(this).attr("required") && $(this).find("option:selected").text() == "---------") {
              err_mesg(this, "Please enter " + $(this).attr('name'));
              if (!err) {
                err = true;
                $(this).focus();
              }
            }
          });
          if ($("#id_industry").find("option:selected").length == 0) {
            err_mesg("#id_industry", "Have at least one industry applicable to your project.");
            err = true;
          }
          if ($("#business_system input:checked").length == 0) {
            err_mesg("#business_system", "Have at least one business system applicable to your project.");
            err = true;
          }
          // if ($("#id_start_date").val() >= $("#id_end_date").val()) {
          //   err_mesg("#id_end_date", "Start Date must be earlier than End Date ");
          //     if (!err) {
          //       err = true;
          //       $("#id_end_date").focus();
          //     }
          // }
          if (!err) {
                $("#fieldset2").hide();
                $("#fieldset3").show();
          }
        });
$("#save-btn").click(function() {
          var err = false;
          if ($("#my_founders").children().length == 0) {
            err_mesg("#attInput", "Enter at least one member");
            if (!err) {
              err = true;
              $("#attInput").focus();
            }
          }
          var team_lead = 0;
          var members = [];
          var roles = [];
          $("#my_founders").children().each(function(index) {
            members.push($(this).attr('id'));
            var role = $(this).find("select option:selected").text();
            roles.push(role);
            if (role == "Team Leader") {
              team_lead++;
            }
          });
          if (team_lead == 0 || team_lead > 1) {
            err_mesg("#attInput", "Enter exactly one team leader");
            if (!err) {
              err = true;
              $("#attInput").focus();
            }
          }
          var mentors = [];
          for (var add of added) {
            mentors.push(add.split('[')[1].split(']')[0]);
          }
          var industries = [];
          $("#id_industry").find("option:selected").each(function(index) {
            industries.push($(this).text());
          });
          if (err) {
          	return false;
          }
          else {
            // var myurl = $(form).attr('data-url')
            // alert('URL' + myurl)
            // preventDefault()
            $.ajax({
            	async: false,
               url: 'ajax/team_registration',
               type: 'POST',
               dataType: 'json',
               data: {
                'mentors': mentors.toString(),
                'members': members.toString(),
                'roles': roles.toString(),
                'industries': industries.toString(),
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
              },
              success: function(data){
                $("#regForm").submit();
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
  removeVal("#business_system");
});
$("input").change(function() {
  removeVal(this);
  removeVal("#business_system");
});
$("textarea").click(function() {
  removeVal(this);
});
$("textarea").change(function() {
  removeVal(this);
});
$("select").change(function() {
  removeVal(this);
});
$("#fieldset3 select").click(function() {
  removeVal("#attInput");
});
$("#fieldset3 select").change(function() {
  removeVal("#attInput");
});

function removeVal(inp) {
  $(inp).css("background-color", "");
    $(inp).next(".validation").remove();
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

$("#st-mentors").change(function() {
  var name = $("#st-mentors option:selected").text();
  if (!added.includes(name) && name != "Select more mentors..."){
    var add = '<span class="mentorsnamelist"><span>' + name + '</span><a style="float: right; " href="javascript:void(0);" onclick="remove_mentor(this)">&times;</a></span>'
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