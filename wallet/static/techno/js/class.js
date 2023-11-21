var added = [];

function warning(id) {
  $("#delete_warning").modal('show');
  $("#delete_con").attr('onclick', 'delete_class('+id+')');
}

function delete_class(id) {
  $("#myModal").modal("hide");
  $.ajax({
    url: 'ajax/delete_class',
    data: {
      'id': id,
    }, 
    success: function() {
      $('#example').DataTable().ajax.reload();
    }
  });
}

function view_details(id) {
	added = [];
  $("#delete_btn").attr('onclick', 'warning(' + id + ')');
	$.ajax({
		url: 'ajax/view_class',
		data: {
			'id': id,
		},
		success: function(data) {
			$("#cl-instructor").val(data.instructor);
			$("#cl-semester").val(data.semester);
			$("#cl-section").val(data.section);
			$("#cl-sched").empty();
			for (sched of data.schedule.split(",")) {
				if (sched.trim() != "") {
					$("#cl-sched").append('<input type="text" class="inputmodal" class="form-control" value="' + sched + '"disabled>');
				}
			}
			for (stud of data.students.split(",")) {
				if (stud.trim() != "") {
					added.push(stud);
				}
			}

		},
	});
	$("#students").DataTable().destroy();
	$("#students").DataTable({
		language: lang,
        order: [[ 0, "desc" ]],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        columnDefs: [
            {orderable: false,
             searchable: false,
             targets: [4]
            },
            {
            data: 'name',
                targets: [0]
            },
            {
            data: 'program',
                targets: [1]
            },
            {
            data: 'year',
                targets: [2]
            },
            {
            data: 'gender',
                targets: [3]
            },
            {
            data: 'action',
                targets: [4]
            },
        ],
        serverSide: true,
        stateSave: true,
        ajax: 'ajax/view_class_stud/'+id,
    });
    $("#btn-student").attr("onclick", "add_student(" + id + ")")
	$("#myModal").modal("show");
}

$("#sem").change(function() {
	var chg = $("#sem option:selected").text();
	var year = chg.split(" ", 1)[0];
	var sem = chg.substring(year.length+1);
	$("#example").DataTable().destroy();
	$('#example').DataTable({
		language: lang,
        order: [[ 0, "desc" ]],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        columnDefs: [
           {orderable: false,
             searchable: true,
             targets: [2,4]
            },
            {
                data: 'section',
                targets: [0]
            },
            {
                data: 'room',
                targets: [1]
            },
            {
                data: 'schedule',
                targets: [2]
            },
            {
                data: 'instructor',
                targets: [3]
            },
            {
                data: 'action',
                targets: [4]
            },
        ],
        serverSide: true,
        stateSave: true,
        ajax: 'ajax/all_classes/'+year+'/'+sem,
	});
});

function add_student(id) {
	if (students.includes($("#add-student").val())) {
	    $.ajax({
	      	url: 'ajax/add_student',
	       	data: {
	       		'class': id,
	       		'name': $("#add-student").val().split('[')[1].split(']')[0],
	       	},
	       	success: function() {
	       		alert("Student added succesfully");
	       		$("#add-student").val("");
	       		$("#students").DataTable().ajax.reload();
	       	}
	    });
	} else {
		alert("This user does not exist");
	    $("#add-student").val("");
	}
}

function remove_student(_class, id) {
	$.ajax({
	  	url: 'ajax/remove_student',
	   	data: {
	   		'class': _class,
	   		'name': id,
	   	},
	   	success: function(data) {
	   		alert("Student removed succesfully");
        for (var i=added.length-1; i>=0; i--) {
            if (added[i] === data.name) {
                added.splice(i, 1);
                break;
            }
        }
	   		$("#students").DataTable().ajax.reload();
	   	}
	});
}

function autocomplete(inp, arr) {
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
            $(inp).val(name);
            closeAllLists();
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