$(document).ready(function() {
	$.ajax({
		url: 'ajax/get_act_data',
		success: function(data) {
			$("#sc-on-going").text(data.on_going);
			$("#sc-upcoming").text(data.upcoming);
			$("#sc-all").text(data.all);
		},
	});
});

function view_all_acts() {
	var user = $("#user").DataTable().rows().data();
	var team = $("#team").DataTable().rows().data();
	var startup = $("#startup").DataTable().rows().data();
	var all = $("#all").DataTable();
	all.clear().draw();
	user.each(function(value, index) {	
		all.row.add({
			"name": value.first_name,
			"no_of_acts": value.no_of_acts
		}).draw();
	});
	team.each(function(value, index) {	
		all.row.add({
			"name": value.group_name + ' ('+ value.project_name + ')',
			"no_of_acts": value.no_of_acts
		}).draw();
	});
	startup.each(function(value, index) {	
		all.row.add({
			"name": value.startup_name + ' (' + value.company_name + ')',
			"no_of_acts": value.no_of_acts
		}).draw();
	});
	all
    .order( [ 1, 'desc' ] )
    .draw();
}

function view_act(id) {
	$.ajax({
		url: 'ajax/view_activity',
		data: {
			'id': id,
		},
		success: function(data) {
			$("#act-id").val(data.id);
			$("#act-title").val(data.title);
			$("#last-name").val(data.last_name);
			$('[name=act-category] option').filter(function() { 
		        return ($(this).text() == data.category);
		    }).prop('selected', true);
			$("#facilitator").val(data.facilitator);
			$("#schedule").val(data.schedule);
			$("#venue").val(data.venue);
			$("#description").val(data.description);
			$("#cost").val(data.cost);
			$("#attendees").val(data.attendees);
			$("#attachments").val(data.attachments);
			$("#viewactivity").modal("show");
		}
	});
}

function save_activity() {
	var err = false;
	$(".required").each(function() {
		if ($(this).val().trim() == "") {
			err_mesg(this, "This field is required.");
			if (!err) {
				err = true;
				$(this).focus();
			}
		}
	});
	if (!err) {
		var id = $("#act-id").val();
		var title = $("#act-title").val();
		var category = $("[name=act-category] option:selected").text();
		var faci = $("#facilitator").val();
		var schedule = $("#schedule").val();
		var venue = $("#venue").val();
		var description = $("#description").val();
		var cost = $("#cost").val();
		$.ajax({
			url: 'ajax/save_activity',
			data: {
				'id': id,
				'title': title,
				'category': category,
				'facilitator': faci,
				'schedule': schedule,
				'venue': venue,
				'description': description,
				'cost': cost,
			},
			success: function() {
				$("#viewactivity").modal("hide");
				$("#activity").DataTable().ajax.reload();
			}
		});
	}
}

function date_filter() {
	var from = $("#acts-from").val();
	var to = $("#acts-to").val();
	if (from == "") {
		err_mesg($("#acts-from"), "This field is required");
	} else if (to == "") {
		err_mesg($("#acts-to"), "This field is required");
	} else if (from > to) {
		err_mesg($("acts-to"), "Date to must be after Date from");
	} else {
		$("#user").DataTable().destroy();
		$("#team").DataTable().destroy();
		$("#startup").DataTable().destroy();
		jQuery('#user').DataTable({
			language: lang,
	        order: [[ 0, "desc" ]],
	        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	        columnDefs: [
	        	{
	        		orderable: false,
		            searchable: false,
		            targets: [2]
	        	},
	            {
	                data: 'username',
	                targets: [0]
	            },
	            {
	                data: 'first_name',
	                targets: [1]
	            },
	            {
	                data: 'no_of_acts',
	                targets: [2]
	            },
	        ],
	        searching: true,
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/activities_user/'+from+'/'+to+'/'
		});
		jQuery('#team').DataTable({
			language: lang,
	        order: [[ 0, "desc" ]],
	        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	        columnDefs: [
	        	{
	        		orderable: false,
		            searchable: false,
		            targets: [2]
	        	},
	            {
	                data: 'group_name',
	                targets: [0]
	            },
	            {
	                data: 'project_name',
	                targets: [1]
	            },
	            {
	                data: 'no_of_acts',
	                targets: [2]
	            },
	        ],
	        searching: true,
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/activities_team/'+from+'/'+to+'/'
		});
		jQuery('#startup').DataTable({
			language: lang,
	        order: [[ 0, "desc" ]],
	        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
	        columnDefs: [
	        	{
	        		orderable: false,
		            searchable: false,
		            targets: [2]
	        	},
	            {
	                data: 'startup_name',
	                targets: [0]
	            },
	            {
	                data: 'company_name',
	                targets: [1]
	            },
	            {
	                data: 'no_of_acts',
	                targets: [2]
	            },
	        ],
	        searching: true,
	        processing: true,
	        serverSide: true,
	        stateSave: true,
			ajax: 'ajax/activities_startup/'+from+'/'+to+'/'
		});
	}
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

function err_mesg(inp, err) {
	if ($(inp).next(".validation").length == 0) { // only add if not added
		$(inp).css("background-color", "#FFBABA");
        $(inp).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
    }
}