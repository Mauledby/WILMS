function view_act(id) {
	$.ajax({
		url: '../../activity/ajax/view_activity',
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
			$("#modUpdate").modal("show");
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
			url: '../../activity/ajax/save_activity',
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

function clk_remove(id) {
	$("#delete_submit").attr("onclick", "remove_activity(" + id + ")");
}

function remove_activity(id) {
	$.ajax({
		url: '../../activity/remove_assignment',
		method: 'POST',
		data: {
			'id': id,
     		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		}, 
		success: function() {
			location.reload();
		}
	});
}

function update_att_tables(act) {
      $("#indi_att").DataTable().destroy();
      $("#indi_att").DataTable({
        columnDefs:[
          { 
            data: 'first_name',
            targets: [0]
          },
          { 
            data: 'last_name',
            targets: [1]
          },
          { 
            data: 'status',
            targets: [2]
          },
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: '../../activity/ajax/indi_attendees/' + act,
      });
      $("#startup_att").DataTable().destroy();
      $("#startup_att").DataTable({
        columnDefs:[
          { 
            data: 'startup_name',
            targets: [0]
          },
          { 
            data: 'company_name',
            targets: [1]
          },
          { 
            data: 'status',
            targets: [2]
          },
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: '../../activity/ajax/stup_attendees/' + act,
      });
      $("#techno_att").DataTable().destroy();
      $("#techno_att").DataTable({
        columnDefs:[
          { 
            data: 'project_name',
            targets: [0]
          },
          { 
            data: 'group_name',
            targets: [1]
          },
          { 
            data: 'status',
            targets: [2]
          },
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: '../../activity/ajax/tech_attendees/' + act,
    });
    $("#table-attendees").DataTable();
    $("#modAtt").modal("show");
}