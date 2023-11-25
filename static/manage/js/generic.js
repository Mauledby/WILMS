$(document).ready(function() {
	$("#tbl-export").DataTable({
		dom: 'B',
	    buttons: [
	     	{extend: 'excel', action: newExportAction, text: 'Export', filename: "Users", className: 'btn form-control-sm font-weight-bold btn-yellow'},
	    ],
		    order: [[ 0, "desc" ]],
		    columnDefs: [
		        {
	                data: 'username',
	                targets: [0]
	            },
	            {
	                data: 'first_name',
	                targets: [1]
	            },
	            {
	                data: 'last_name',
	                targets: [2]
	            },
	            {
	                data: 'email',
	                targets: [3]
	            },
	        ],
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/users/1970-01-01/2050-12-12/'
	});
});

$("#exp-from").change(function() {
	exp_change();
});

$("#exp-to").change(function() {
	exp_change();
});

function exp_change() {
	var from = $("#exp-from").val();
	var to = $("#exp-to").val();
	if (from == "") {
		from = "1970-01-01";
	}
	if (to == "") {
		to = "2050-12-12";
	}
	$("#tbl-export").DataTable().destroy();
	$("#tbl-export").DataTable({
		dom: 'B',
	    buttons: [
	     	{extend: 'excel', text: 'Export', filename: "Users-"+from+"-"+to, className: 'btn form-control-sm font-weight-bold btn-yellow'},
	    ],
		    order: [[ 0, "desc" ]],
		    columnDefs: [
		        {
	                data: 'username',
	                targets: [0]
	            },
	            {
	                data: 'first_name',
	                targets: [1]
	            },
	            {
	                data: 'last_name',
	                targets: [2]
	            },
	            {
	                data: 'email',
	                targets: [3]
	            },
	        ],
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/users/'+ from + '/'+ to + '/'
	});
}

$("#btn-import").click(function() {
	$('#files').parse({
		config: {
			delimiter: "auto",
			complete: add_users,
		},
		before: function(file, inputElem)
		{
			console.log("Parsing file...", file);
		},
		error: function(err, file)
		{
			console.log("ERROR:", err, file);
		},
		complete: function()
		{
			console.log("Done with all files");
		}
	});
});

function add_users(results) {
	var data = results.data;
	var header = data[0].join(",").split(",");
	var err = false;
	if (!(header.includes("username") && header.includes("first_name") && header.includes("last_name") && header.includes("email"))) {
		alert("The following columns must be present: username, first_name, last_name, email");
		err = true;
	}
	var unknown = [];
	for (head of header) {
		console.log(head);
		if (head != "username" && head != "first_name" && head != "last_name" && head != "email" && !groups.includes(head)) {
			unknown.push(head);
		}
	}
	if (unknown.length > 0) {
		alert("Unknown column/s: " + unknown + ". Accepted header values are: username,first_name,last_name,email," + groups);
		err = true;
	}
	var rows_error = [];
	if (!err) {
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
						url: 'ajax/add_user',
						data: send,
						success: function(data) {
							console.log(data.name + " successfully added");
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
		if (rows_error.length == 0) {
			alert("All users added successfully.");
		} else {
			alert("Partial success. The following rows failed to be added: " + rows_error);
		}
	}
}

function add_entry() {
	var entry = $("#inp-new-entry").val();
	if (entry.trim() == "") {
		err_mesg($("#inp-new-entry"), "This field is required.");
	} else {
		var new_ent = "<div><span class=\"badge badge-pill badge-light\"><i class=\" d-flex align-items-center text-muted\">"+ entry +"<a href=\"javascript:void(0);\" onclick=\"delete_new_entry(this)\" type=\"button\" class=\"close d-flex align-items-center\" aria-label=\"Close\">&nbsp;<i class=\"fa fa-times-circle fa-sm\" style=\"font-size:15px\" aria-hidden=\"true\"></i></a></i></span></div>"
		$("#div-new-entry").append(new_ent);
		$("#inp-new-entry").val("");
		$("#inp-new-entry").focus();
	}
}

function add_cat_entry() {
	var sel_entry = $("#select-category").children("option:selected").val();
	var entry = $("#inp-new-cat-entry").val();
	if (entry.trim() == "") {
		err_mesg($("#inp-new-cat-entry"), "This field is required.");
	} else {
		var new_ent = "<div><span class=\"badge badge-pill badge-light\"><i class=\" d-flex align-items-center text-muted\">"+ sel_entry + " - " + entry +"<a href=\"javascript:void(0);\" onclick=\"delete_new_entry(this)\" type=\"button\" class=\"close d-flex align-items-center\" aria-label=\"Close\">&nbsp;<i class=\"fa fa-times-circle fa-sm\" style=\"font-size:15px\" aria-hidden=\"true\"></i></a></i></span></div>"
		$("#div-new-cat-entry").append(new_ent);
		$("#inp-new-cat-entry").val("");
		$("#inp-new-cat-entry").focus();
	}
}

function delete_new_entry(inp) {
	$(inp).parent().parent().parent().remove();
}

function save_entries() {
	var model = $("#modal-add-header").text().substring(4);
	var new_entries = "";
	$("#div-new-entry").children().each(function(index) {
		var entry = $(this).find("i").first().text().trim();
		if (index == 0) {
			new_entries = entry;
		} else {
			new_entries = entry + ',' + new_entries;
		}
	});
	$.ajax({
		url: 'ajax/add_new_entries',
		data: {
			model: model,
			data: new_entries,
		},
		dataType: 'json',
		success: function() {
			alert("Saved successfully");
			$("#div-new-entry").empty();
			$("#inp-new-entry").val("");
			refresh_dropdown(model);
			$("#addTOB").modal("hide");
		}
	});
}

function save_cat_entries() {
	var model = "Activity Category";
	var new_entries = "";
	$("#div-new-cat-entry").children().each(function(index) {
		var entry = $(this).find("i").first().text().trim();
		if (index == 0) {
			new_entries = entry;
		} else {
			new_entries = entry + ',' + new_entries;
		}
	});
	$.ajax({
		url: 'ajax/add_new_cat_entries',
		data: {
			model: model,
			data: new_entries,
		},
		dataType: 'json',
		success: function() {
			alert("Saved successfully");
			$("#div-new-cat-entry").empty();
			$("#inp-new-cat-entry").val("");
			refresh_dropdown(model);
			$("#addAct").modal("hide");
		}
	});
}

function refresh_dropdown(model){
	$.ajax({
		url: 'ajax/get_all',
		data: {
			model: model,
		},
		dataType: 'json',
		success: function(data) {
			var select = "#select-"+model.replace(/\s+/g, '').replace(/\/+/g, '');
			$(select).empty();
			var new_ent = "<option selected>"+ model +"...</option>"
			$(select).append(new_ent);
			var names = data.names.split(',');
			for (name of names) {
				new_ent = "<option>"+ name +"</option>"
				$(select).append(new_ent);
			}
		}
	});
}

function click_add_cat_modal(type){
	$("#inp-new-cat-entry").focus();
	$("#select-category").empty();
	$("#div-new-cat-entry").empty();
	$.ajax({
		url: 'ajax/get_all',
		data: {
			model: 'Category',
		},
		dataType: 'json',
		success: function(data) {
			$("#select-category").append("<option selected>New Category</option>");
			var names = data.names.split(',');
			for (name of names) {
				var new_ent = "<option>"+ name +"</option>"
				$("#select-category").append(new_ent);
			}
			$("#addAct").modal("show");
		}
	});
}

function click_add_modal(type) {
	$("#modal-add-header").text("Add " + type);
	$("#div-new-entry").empty();
	$("#inp-new-entry").attr("placeholder", type);
	$("#inp-new-entry").focus();
	$("#addTOB").modal("show");
}

function click_remove_modal(type) {
	$("#modal-remove-header").text("Remove " + type);
	$("#modal-type-header").text(type+":");
	$("#div-del-entry").empty();
	$("#div-fin-del-entry").empty();
	$.ajax({
		url: 'ajax/get_all',
		data: {
			model: type,
		},
		dataType: 'json',
		success: function(data) {
			var names = data.names.split(',');
			for (name of names) {
				var new_ent = "<div><span class=\"badge badge-pill badge-light\"><i class=\" d-flex align-items-center text-muted\">"+ name +"<a href=\"javascript:void(0);\" onclick=\"delete_exist_entry(this)\" type=\"button\" class=\"close d-flex align-items-center\" aria-label=\"Close\">&nbsp;<i class=\"fa fa-times-circle fa-sm\" style=\"font-size:15px\" aria-hidden=\"true\"></i></a></i></span></div>"
				$("#div-del-entry").append(new_ent);
			}
			$("#delTOB").modal("show");
		}
	});
}

function delete_exist_entry(inp) {
	$(inp).parent().parent().parent().prependTo($("#div-fin-del-entry"));
}

function delete_entries() {
	var model = $("#modal-remove-header").text().substring(7);
	var del_entries = "";
	$("#div-fin-del-entry").children().each(function(index) {
		var entry = $(this).find("i").first().text().trim();
		if (index == 0) {
			del_entries = entry;
		} else {
			del_entries = entry + ',' + del_entries;
		}
	});
	var url = 'ajax/delete_entries';
	if (model == "Activity Category") {
		url = 'ajax/delete_category_entries';
	}
	$.ajax({
		url: url,
		data: {
			model: model,
			data: del_entries,
		},
		dataType: 'json',
		success: function() {
			alert("Removed successfully");
			refresh_dropdown(model);
			$("#delTOB").modal("hide");
		}
	});
}

$('#inp-new-entry').keypress(function(event) {
    if (event.keyCode == 13) {
        add_entry();
    }
});

$('#inp-new-cat-entry').keypress(function(event) {
    if (event.keyCode == 13) {
        add_cat_entry();
    }
});

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