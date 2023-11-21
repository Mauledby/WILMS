var added = [];
var assign_added = [];
var ass_to_class = {};
function autocomplete(inp, arr, no_label, my_attendees, added_a, remove_att) {
  return autocomplete(inp, arr, no_label, my_attendees, added_a, remove_att, null, "");
}
function autocomplete(inp, arr, no_label, my_attendees, added_a, remove_att, ass_to_cla, my_tigs) {
  if (ass_to_cla != null) {
    ass_to_class = ass_to_cla;
  }
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  if (remove_att == "remove_attendees") {
    added = added_a;
  }
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
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && !added_a.includes(arr[i])) {
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
            if (name.search("{ CLASS ") > 0) {
              added_a.push(name);
              ass_to_class[name.split(" { ")[0]].split(",").forEach(function(item, index){
                var add = '<span class="mentorsnamelist"><span>' + item + '</span><a style="float: right; " href="javascript:void(0);" onclick="'+ remove_att + '(this)">&times;</a></div>'
                if ($("#" + my_attendees).children().first().prop("id") == no_label) {
                  $("#" + no_label).prop("hidden", true);
                }
                $("#" + my_attendees).append(add);
                added_a.push(item);
                if (all_techno.includes(item)) {
                  $("#" + my_tigs).prop("hidden", false);
                }
              });
            }
            else {
              var add = '<span class="mentorsnamelist"><span>' + name + '</span><a style="float: right; " href="javascript:void(0);" onclick="'+ remove_att + '(this)">&times;</a></div>'
              if ($("#" + my_attendees).children().first().prop("id") == no_label) {
                $("#" + no_label).prop("hidden", true);
              }
              $("#" + my_attendees).append(add);
              added_a.push(name);
              if (all_techno.includes(name)) {
                $("#" + my_tigs).prop("hidden", false);
              }
            }
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

function remove_attendees(inp) {
  var str = $(inp).parent().children().first().text();
  const index = added.indexOf(str);
  added.splice(index, 1);
  $(inp).parent().remove();
  if (added.length == 0) {
    $("#no-attendees").prop("hidden", false);
    $("#id_attendee").attr("disabled", false);
  }
  var team = false;
  for (var i in added) {
    if (all_techno.includes(added[i])) {
      team = true;
      break;
    }
  }
  if (!team) {
    $("#new-tigs").prop("hidden", true);
    $("#id_enable_tigs").prop("checked", false);
  }
}

function remove_assign_attendees(inp) {
  var str = $(inp).parent().children().first().text();
  const index = assign_added.indexOf(str);
  assign_added.splice(index, 1);
  $(inp).parent().remove();
  if (assign_added.length == 0) {
    $("#assign-no-attendees").prop("hidden", false);
  }
  var team = false;
  for (var i in assign_added) {
    if (all_techno.includes(assign_added[i])) {
      team = true;
      break;
    }
  }
  if (!team) {
    $("#assdiv-tigs").prop("hidden", true);
    $("#assign_tigs").prop("checked", false);
  }
}

function remove_bundle_attendees(inp) {
  var str = $(inp).parent().children().first().text();
  const index = bundle_added.indexOf(str);
  bundle_added.splice(index, 1);
  $(inp).parent().remove();
  if (bundle_added.length == 0) {
    $("#bundle-no-attendees").prop("hidden", false);
  }
  var team = false;
  for (var i in bundle_added) {
    if (all_techno.includes(bundle_added[i])) {
      team = true;
      break;
    }
  }
  if (!team) {
    $("#bundiv-tigs").prop("hidden", true);
    $("#bundle-tigs").prop("checked", false);
  }
}

function remove_updass_attendees(inp) {
  var str = $(inp).parent().children().first().text();
  const index = updass_added.indexOf(str);
  updass_added.splice(index, 1);
  $(inp).parent().remove();
  if (updass_added.length == 0) {
    $("#updass-no-attendees").prop("hidden", false);
  }
}


    function err_mesg(inp, err) {
        if ($(inp).next(".validation").length == 0) { // only add if not added
            $(inp).css("background-color", "#FFBABA");
            $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
        }
    }


$("#id_attendee").change(function() {
  $("#id_attendee").css("background-color", "");
  $("#id_attendee").next(".validation").remove();
});


$("#createActForm").submit(function(event) {
  event.preventDefault(); 
  var formId = this.id;
  form = this;
  if (added.length == 0) {
    err_mesg("#id_attendee", "You must add at least one attendee");
    return false;
  }
  $("#id_attendee").val(added.toString());
  $("#succ-mess").text("Saving activity. Please do not close this window until refresh.");
  $("#mysuccessmodal").modal("show");
  setTimeout( function () { 
    form.submit();
  }, 1500);
  $('#mysuccessmodal').on('hidden.bs.modal', function () {
    // form.submit();
  });
});

