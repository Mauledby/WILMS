function autocomplete(inp, arr, search) {
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
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              if (search) {
                $("#lbl-see").text("See namelist below...");
              }
              /*insert the value for the autocomplete text field:*/
              name = this.getElementsByTagName("input")[0].value;
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
              if (search) {
                $("#ment-name").text("" + name.split("[")[0]);
                $.ajax({
                  url: 'ajax/get_three', 
                  data: {
                    'username': name.split("[")[1].split("]")[0]
                  },
                  success: function(data) {
                    $("#main-exp").empty();
                    $("#main-sch").empty();
                    var j;
                    for (j=0; j < data.exp.length; j++) {
                      ex = data.exp[j];
                      var lbl = "<div><label style='margin-bottom: 0rem;'>" + ex + "</label>";
                      var rate = "";
                      var i = 0;
                      while (i < data.exp_r[j]) {
                        rate = rate.concat('★');
                        i += 1;
                      }
                      while (i < 5) {
                        rate = rate.concat('☆');
                        i += 1;
                      }
                      var st = "<span class='rated' style='font-size:1rem; float:right' >" + rate + "</span></div>"
                      $("#main-exp").append(lbl+st);
                    }
                    console.log(data.exp);
                    console.log(data.exp_r);
                    $("#ment-sch").text(": " + data.schedule);
                    for (j=0; j < data.schedule.length; j++) {
                      sch = data.schedule[j];
                      var lbl = "<div><label style='margin-bottom: 0rem;'>" + sch + "</label>";
                      $("#main-sch").append(lbl);
                    }
                    $("#ment-cost").text(" " + data.cost);
                    $("#ment-mentees").text("" + data.mentees);
                    $("#ment-hours").text(" " + data.hours);
                    $("#lbl-see").prop("hidden", true);
                    $("#tbl-1").prop("hidden", false);
                  }
                });
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

var curr_view = 1;
$("#nav-expected-tab").on('click', function() {
  curr_view = 1;
});
$("#nav-actual-tab").on('click', function() {
  curr_view = 2;
});

$("#search-mentor").click(function() {
  $(this).val("");
  // $("#lbl-see").text("Search a mentor to see mentor details");
  $("#lbl-see").prop("hidden", false);
  $("#tbl-1").prop("hidden", true);
});

$("#search-mentor").focus(function() {
  $(this).val("");
  // $("#lbl-see").text("Search a mentor to see mentor details");
  $("#lbl-see").prop("hidden", false);
  $("#tbl-1").prop("hidden", true);
});

$("#mentor-1").click(function() {
  $(this).val("");
});

$("#mentor-1").focus(function() {
  $(this).val("");
});

$("#mentor-2").click(function() {
  $(this).val("");
});

$("#mentor-2").focus(function() {
  $(this).val("");
});

$("#mentor-1").change(function() {
  var val = $("#mentor-1").val();
  if (!cli.includes(val)) {
    $(this).val("");
  }
})

$("#mentor-2").change(function() {
  var val = $("#mentor-2").val();
  if (!cli.includes(val)) {
    $(this).val("");
  }
})

$("#ment-all").click(function(){
  all_ment_exp($("#ment-name").text().substring(2).trim() , "#main-exp", true);
});

$("#sched-all").click(function() {
  all_ment_exp($("#ment-name").text().substring(2).trim() , "#main-sch", false);
});

function all_ment_exp(name, exp, isExp) {
  if (isExp) {
    $("#mod-lbl").text(name + "'s Expertise List");
  } else {
    $("#mod-lbl").text(name + "'s Schedule List");
  }
  $("#mod-cont").empty();
  $exp = $(exp).clone();
  $exp.prop("style", false);
  $("#mod-cont").append($exp);
  $("#modal-all").modal("show");

}

$("#err-ok").click(function() {
  console.log(curr_view);
  $.ajax({
    url: 'ajax/add_booking_force',
    data: {
      'booker': self,
      'group': $("#group-"+curr_view+" option:selected").text(),
      'desc': $("#desc-"+curr_view+"").val(),
      'mentor': $("#mentor-"+curr_view+"").val().split('[')[1].split(']')[0],
      'day': $("#day-"+curr_view+"").val(),
      'from': $("#from-"+curr_view+"").val(),
      'to': $("#to-"+curr_view+"").val(),
      'venue': $("#venue-"+curr_view+"").val(),
    },
    success: function(data){
      if (data.message == "") {
        alert("Booking successful");
        location.reload(true);
      } else {
        alert(data.message);
      }
    }
  });
});

$("#main-book").click(function() {
  book(1);
});

$("#other-book").click(function() {
  book(2);
});

function calculate_cost(num) {
  var err = false;
  $("#boxcontent-" + num).find("input").each(function(index) {
    if ($(this).val().trim() == "" && $(this).attr("id") != "cost-1") {
      err_mesg(this, "Please enter " + $(this).parent().parent().children().first().children().first().text());
      if (!err) {
        err = true;
        $(this).focus();
      }
    }
  });
  var mess = "";
  var ok = false;
  if(!err) {
    $.ajax({
      url: 'ajax/see_mentor',
      async: false,
      data: {
        'username': $("#mentor-" + num).val().split('[')[1].split(']')[0],
        'day': $("#day-" + num).val(),
        'from': $("#from-" + num).val(),
        'to': $("#to-" + num).val()
      },
      dataType: 'json',
      success: function(data) {
        mess = data.message;
        if(data.message != "") {
          alert(data.message);
          $("#day-" + num).val("");
          $("#from-" + num).val("");
          $("#to-" + num).val("");
        }
        return data.message;
      }
    });
    return mess;
  } else {
    return mess;
  }
}

function book(num) {
  var err = false;
  if ($("#group-" + num + " option:selected").text() == "Select group...") {
    err_mesg("#group-" + num, "Please select group. For individual booking, choose \"As an individual\"");
    err = true;
  }
  if ($("#desc-" + num).val() == "") {
    err_mesg("#desc-" + num, "Please enter a description to let the mentor know about the booking.");
    err = true;
  }
  var cla = calculate_cost(num);
  // alert(cla);
  err = cla != "" || err;
  if (!err) {
    $.ajax({
      url: 'ajax/add_booking',
      data: {
        'booker': self,
        'group': $("#group" + num + " option:selected").text(),
        'desc': $("#desc-" + num).val(),
        'mentor': $("#mentor-" + num).val().split('[')[1].split(']')[0],
        'day': $("#day-" + num).val(),
        'from': $("#from-" + num).val(),
        'to': $("#to-" + num).val(),
        'venue': $("#venue-" + num).val(),
      },
      success: function(data){
        if (data.message == "") {
          alert("Booking successful");
          location.reload(true);
        } else if (data.message == "Inadequate points"){
          $("#sp-bal").text(data.bal);
          $("#modal-err").modal("show");
        } else {
          alert(data.message);
        }
      }
    });
  }
}

$("#sel-field").change(function() {
  var sel = $("#sel-field option:selected").text();
  if (sel == "Select Field...") {
    $("#div-rec").prop("hidden", true);
    $("#lbl-rec").text("Select an expertise field to display all mentors who have this particular expertise");
    $("#div-lbl").prop("hidden", false);
  } else {
    $("#div-rec").prop("hidden", true);
    $("#div-lbl").prop("hidden", false);
    $("#lbl-rec").text("See namelist below...");
    $.ajax({
      url: 'ajax/mentor_exp',
      data: {
        'field': sel,
      },
      dataType: 'json',
      success: function(data) {
        if (Object.keys(data).length == 0) {
          $("#lbl-rec").text("No mentor currently has that expertise. Try searching another field of expertise.");
        } else {
          $("#div-rec").empty();
          names = data.name.split("|");
          rates = data.rates.split("|");
          exp = data.exp.split("|");
          exp_r = data.exp_r.split("|");
          mentees = data.mentees.split("|");
          hours = data.hours.split("|");
          scheds = data.scheds.split("|");
          cost = data.cost.split("|");
          ids = data.ids.split("|")
          var i;
          for (i=0; i < names.length; i++) {
            // var new_div = '<div class="boxstyle" disabled><table disabled><tr> <td disabled><span class="labelstyle">Name</span></td> <td><label>: ' + names[i] + '</label></td> </tr><tr> <td ><span class="labelstyle">Self-Rating for '+ sel +'</span></td> <td>: <span class="rated">'
            var new_div = '<div class="boxstyle col-md-12" disabled><hr/><div class="row"><div class="col-md-4" disabled><span class="labelstyle">Name</span></div><div class="col-md-1">:</div><div class="col-md-7"><label class="col-form-label">' + names[i] + '</label></div></div><div class="row"><div class="col-md-4" ><span class="labelstyle col-form-label">Self-Rating for '+ sel +'</span></div><div class="col-md-1">:</div><div class="col-md-7"><span class="rated" style="float:right">'
            var j;
            for (j=0; j < parseInt(rates[i]); j++){
              new_div += '&#x2605;'
            }
            new_div += '</span><span class="rated" style="float:right">'
            for (; j < 5; j++) {
              new_div += '&#x2606;'
            }
            var nam = "'" + names[i] + ' [' + ids[i] + ']\''
            nam = nam.split(" ").join("%20");
            console.log(nam);
            // new_div += '</span> </td></tr><tr><td class="labelstyle">Other Expertise</td><td> <div id="exp-'+ ids[i]+'" disabled></div></td></tr><tr><td ></td><td><a href="javascript:void(0);" onclick="all_ment_exp(\''+names[i]+'\', \'#exp-'+ids[i]+'\', true)" disabled><label>View All</label></a></td></tr><tr><td ><span class="labelstyle">Available Schedule</span></td><td><div style="overflow: hidden; min-height: 1.1rem; max-height: 2.1rem;" id="sch-'+ ids[i] +'" disabled></div></td></tr><tr><td ></td><td><a href="javascript:void(0);" onclick="all_ment_exp(\''+names[i]+'\', \'#sch-'+ids[i]+'\', false)" disabled><label>View All</label></a></td> </tr><tr><td ><span class="labelstyle">Customer Rating</span></td><td>: <span class="rated">&#x2605; &#x2605; &#x2605; </span> <span class="rated"> &#x2606; &#x2606;</span></td> </tr><tr><td ><span class="labelstyle">Mentees</span></td><td><label>: '+mentees[i]+'</label></td> </tr><tr><td ><span class="labelstyle">Total Hours</span></td><td><label>: '+ hours[i] +'</label></td> </tr><tr><td ><span class="labelstyle">Cost per Hour</span></td><td><label>: '+ cost[i] +'</label></td> </tr> </table><br><br><center><button class="button button1" onclick=mentor_sel('+ nam + ')> SELECT</button><div style="color:#fff200; font-weight:500; margin-left:5rem; float: right; display:block;"> <a href="javascript:void(0);" onclick=view_mentor(\''+ ids[i] +'\')> MORE >> </a></div></center></div>'
            new_div += '</span></div></div><div class="row"><div class="col-md-4"><span class="labelstyle col-form-label">Other Expertise</span></div><div class="col-md-1">:</div><div class="col-md-7"><div id="exp-'+ ids[i]+'" disabled></div></div></div><div class="row"><div class="col-md-5"></div><div class="col-md-7 text-center"><a href="javascript:void(0);" onclick="all_ment_exp(\''+names[i]+'\', \'#exp-'+ids[i]+'\', true)" disabled></a></div></div><div class="row"><div class="col-md-4"><span class="labelstyle col-form-label">Available Schedule</span></div><div class="col-md-1">:</div><div class="col-md-7"><div id="sch-'+ ids[i] +'" disabled></div></div></div><div class="row"><div class="col-md-5"></div><div class="col-md-7 text-center"><a href="javascript:void(0);" onclick="all_ment_exp(\''+names[i]+'\', \'#sch-'+ids[i]+'\', false)" disabled></a></div></div><div class="row"><div class="col-md-4"><span class="labelstyle col-form-label">Customer Rating</span></div><div class="col-md-1">:</div><div class="col-md-7"><span class="rated" style="float:right" >&#x2605; &#x2605; &#x2605;  &#x2606; &#x2606;</span></div></div><div class="row"><div class="col-md-4"><span class="labelstyle col-form-label">Mentees</span></div><div class="col-md-1">:</div><div class="col-md-7"><label>'+mentees[i]+'</label></div></div><div class="row"><div class="col-md-4"><span class="labelstyle col-form-label">Total Hours</span></div><div class="col-md-1">:</div><div class="col-md-7"><label>'+ hours[i] +'</label></div></div><div class="row"><div class="col-md-4"><span class="labelstyle">Cost per Hour</span></div><div class="col-md-1">:</div><div class="col-md-7"><label> '+ cost[i] +'</label></div></div><div class="row"><div class="col-md-2"></div><div class="col-md-4 text-center"><button class="btn btn-sm btnView font-weight-bold" onclick=mentor_sel('+ nam + ')> SELECT</button></div><div class="col-md-2 text-center"><a href="javascript:void(0);" class="btn btnMore" onclick=view_mentor(\''+ ids[i] +'\')> More Details >> </a></div><div class="col-md-4"></div></div></div>'
            $("#div-rec").append(new_div);
            var this_exp = exp[i].split(',');
            var this_exp_r = exp_r[i].split(',');
            var j;
            if (this_exp == "") {
              $("#exp-" + ids[i]).append("(none)");
            } else {
              for (j=0; j < this_exp.length; j++) {
                ex = this_exp[j];
                var lbl = "<div><label style='margin-bottom: 0rem;'>" + ex + "</label>";
                var rate = "";
                var k = 0;
                while (k < this_exp_r[j]) {
                  rate = rate.concat('★');
                  k += 1;
                }
                while (k < 5) {
                  rate = rate.concat('☆');
                  k += 1;
                }
                var st = "<span class='rated' style='font-size:1rem; float:right'>" + rate + "</span></div>"
                $("#exp-" + ids[i]).append(lbl+st);
              }
            }
            var this_sched = scheds[i].split(",");
            for (j=0; j < this_sched.length; j++) {
              sch = this_sched[j];
              var lbl = "<div><label style='margin-bottom: 0rem;'>" + sch + "</label>";
              $("#sch-" + ids[i]).append(lbl);
            }
          }
          $klo = $("#div-reqmen").clone();
          $("#div-rec").append($klo);
          $("#div-rec").prop("hidden", false);
          $("#div-lbl").prop("hidden", true);
        }
      }
    });
  }
});

function mentor_sel(mentor) {
  $("#mentor-2").val(mentor.split("%20").join(" "));
  $("#mentor-1").val(mentor.split("%20").join(" "));
}

$("#req-submit").click(function() {
  var err = false;
  $("#mdl-request input").each(function(index) {
    if ($(this).val().trim() == "") {
      err_mesg(this, "This field is required");
      if (!err) {
        err = true;
        $(this).focus();
      }
    }
  });
  var email_sp = $("#req-email").val().split("@");
  if (email_sp.length !== 2 || email_sp[1].split(".").length < 2) {
    err_mesg("#req-email", "Enter a valid email");
    if (!err) {
      err = true;
      $("#req-email").focus();
    }
  }
  if ($("#req-field option:selected").text() == "Select Field...") {
    err_mesg("#req-field", "This field is required");
    err = true;
  }
  if ($("#req-group option:selected").text() == "Select group...") {
    err_mesg("#req-group", "This field is required");
    err = true;
  }
  if (!err) {
    $.ajax({
      url:'ajax/request_mentor',
      data: {
        'requestor': $("#req-group option:selected").text(),
        'first_name': $("#req-fname").val().trim(),
        'last_name': $("#req-lname").val().trim(),
        'email': $("#req-email").val().trim(),
        'expertise': $("#req-field option:selected").text(),
      },
      dataType: 'json',
      success: function() {
        $("#modal-req-suc").modal("show");
        $("#mdl-request").modal("hide");
      },
    });
  }
});

function view_mentor(id) {
  $.ajax({
    url: 'ajax/view_mentor',
    data: {
      id: id,
    },
    dataType: 'json',
    success: function(data) {
      $("#last_name").val(data.last_name);
      $("#first_name").val(data.first_name);
      $("#position").val(data.position);
      var elem_school = data.elem_school.split(',');
      var elem_grade = data.elem_grade.split(',');
      var elem_public = data.elem_public.split(',');
      var elem_from = data.elem_from.split(',');
      var elem_to = data.elem_to.split(',');
      var elem_awards = data.elem_awards.split(',');
      $("#elem").empty();
      var i;
      for (i=0; i < elem_school.length; i++){
        // $("#elem").append('<div class="row"><div class="col-md-9"><input type="text" placeholder="School" class="form-control-sm w-100 inputmodal" value="'+elem_school[i]+'" disabled></div><div class="col-md-3"><input type="text" placeholder="Grade / Year Level" class="form-control-sm w-100 inputmodal" value="'+elem_grade[i]+'" disabled></div></div><div class="row mt-1"><div class="col-md-4"><input type="text" placeholder="Private/Public" class="form-control-sm w-100 inputmodal" value="'+elem_public[i]+'" disabled></div><div class="col-md-4"><input type="text" placeholder="From" class="form-control-sm w-100 inputmodal" value="'+elem_from[i]+'" disabled></div>  <div class="col-md-4"><input type="text" placeholder="To" class="form-control-sm w-100 inputmodal" value="'+elem_to[i]+'" disabled></div></div><div class="row mt-1"><div class="col-md-12"><input type="text" placeholder="Awards" class="form-control-sm w-100 inputmodal" value="'+elem_awards[i]+'" disabled></div></div><hr/>')
        $("#elem").append('<div class="row"><div class="col-md-9"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="School" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_school[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">School</label></div></div><div class="col-md-3"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Grade / Year Level" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_grade[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Grade Level</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Private/Public" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_public[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">School Type</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Awards" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+elem_awards[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Awards</label></div></div></div><hr/>')
      }
      var junior_school = data.junior_school.split(',');
      var junior_grade = data.junior_grade.split(',');
      var junior_public = data.junior_public.split(',');
      var junior_from = data.junior_from.split(',');
      var junior_to = data.junior_to.split(',');
      var junior_awards = data.junior_awards.split(',');
      $("#junior").empty();
      for (i=0; i < junior_school.length; i++){
        // $("#junior").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+junior_school[i]+'" disabled><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+junior_grade[i]+'" disabled><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+junior_public[i]+'" disabled><input type="text" placeholder="From" class="form-control inputmodal" value="'+junior_from[i]+'" disabled><input type="text" placeholder="To" class="form-control inputmodal" value="'+junior_to[i]+'" disabled><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+junior_awards[i]+'" disabled><hr>')
        $("#junior").append('<div class="row"><div class="col-md-9"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="School" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_school[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">School</label></div></div><div class="col-md-3"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Grade / Year Level" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_grade[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Grade Level</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Private/Public" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_public[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">School Type</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Awards" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+junior_awards[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Awards</label></div></div></div><hr/>')
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
        // $("#senior").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+senior_school[i]+'" disabled><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+senior_grade[i]+'" disabled><input type="text" placeholder="Strand" class="form-control inputmodal" value="'+senior_strand[i]+'" disabled><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+senior_public[i]+'" disabled><input type="text" placeholder="From" class="form-control inputmodal" value="'+senior_from[i]+'" disabled><input type="text" placeholder="To" class="form-control inputmodal" value="'+senior_to[i]+'" disabled><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+senior_awards[i]+'" disabled><hr>')
        $("#senior").append('<div class="row"><div class="col-md-9"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="School" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_school[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">School</label></div></div><div class="col-md-3"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Grade / Year Level" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_grade[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Grade Level</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Private/Public" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_public[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">School Type</label>  </div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Strand/Track" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_strand[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Strand/Track</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Awards" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+senior_awards[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Awards</label></div></div><div><hr/>')
      }
      var college_school = data.college_school.split(',');
      var college_grade = data.college_grade.split(',');
      var college_public = data.college_public.split(',');
      var college_from = data.college_from.split(',');
      var college_to = data.college_to.split(',');
      var college_awards = data.college_awards.split(',');
      $("#college").empty();
      for (i=0; i < college_school.length; i++){
        // $("#college").append('<input type="text" placeholder="School" class="form-control inputmodal" value="'+college_school[i]+'" disabled><input type="text" placeholder="Grade / Year Level" class="form-control inputmodal" value="'+college_grade[i]+'" disabled><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+college_public[i]+'" disabled><input type="text" placeholder="From" class="form-control inputmodal" value="'+college_from[i]+'" disabled><input type="text" placeholder="To" class="form-control inputmodal" value="'+college_to[i]+'" disabled><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+college_awards[i]+'" disabled><hr>')
        $("#college").append('<div class="row"><div class="col-md-9"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="School" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_school[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">School</label></div></div><div class="col-md-3"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Grade / Year Level" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_grade[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Grade Level</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Private/Public" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_public[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">School Type</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Awards" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+college_awards[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Awards</label></div></div></div><hr/>')
      }
      var tr_training = data.tr_training.split(',');
      var tr_sector = data.tr_sector.split(',');
      var tr_from = data.tr_from.split(',');
      var tr_to = data.tr_to.split(',');
      var tr_awards = data.tr_awards.split(',');
      $("#trainings").empty();
      for (i=0; i < tr_training.length; i++){
        // $("#trainings").append('<input type="text" placeholder="Training" class="form-control inputmodal" value="'+tr_training[i]+'" disabled><input type="text" placeholder="Private/Public" class="form-control inputmodal" value="'+tr_sector[i]+'" disabled><input type="text" placeholder="From" class="form-control inputmodal" value="'+tr_from[i]+'" disabled><input type="text" placeholder="To" class="form-control inputmodal" value="'+tr_to[i]+'" disabled><input type="text" placeholder="Awards" class="form-control inputmodal" value="'+tr_awards[i]+'" disabled><hr>')
        $("#trainings").append('<div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="School" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+tr_training[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Training</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Private/Public" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+tr_sector[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Sector</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+tr_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+tr_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><div class="row"><div class="col-md-12"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Awards" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+tr_awards[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Awards</label></div></div></div><hr/>')
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
        // $("#companies").append('<input type="text" placeholder="Company" class="form-control inputmodal" value="'+co_company[i]+'" disabled><input type="text" placeholder="Industry" class="form-control inputmodal" value="'+co_industry[i]+'" disabled><input type="text" placeholder="Status" class="form-control inputmodal" value="'+co_status[i]+'" disabled><input type="text" placeholder="Position" class="form-control inputmodal" value="'+co_position[i]+'" disabled><input type="text" placeholder="Salary" class="form-control inputmodal" value="'+co_salary[i]+'" disabled><input type="text" placeholder="From" class="form-control inputmodal" value="'+co_from[i]+'" disabled><input type="text" placeholder="To" class="form-control inputmodal" value="'+co_to[i]+'" disabled><input type="text" placeholder="Industry" class="form-control inputmodal" value="'+co_startup[i]+'" disabled><hr>')
        $("#companies").append('<div class="row"><div class="col-md-9"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Company" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_company[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Company Name</label></div></div><div class="col-md-3"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Industry" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_industry[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Industry</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Status" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_status[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Status</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Position" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_position[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Position</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Salary" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_salary[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">Salary</label></div></div></div><div class="row"><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="Industry" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_startup[i]+'" disabled><label style="float:left; position:relative; left:30%; font-size:12px;" class="font-italic">Industry</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="From" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_from[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">From</label></div></div><div class="col-md-4"><div class="wrap w-100" style="div clear:both; float:left;"><input type="text" placeholder="To" style="display:block;" class="form-control-sm w-100 inputmodal" value="'+co_to[i]+'" disabled><label style="float:left; position:relative; left:45%; font-size:12px;" class="font-italic">To</label></div></div></div><hr/>')
      }
      $("#myModal").modal("show");
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