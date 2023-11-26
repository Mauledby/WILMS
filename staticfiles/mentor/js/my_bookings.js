function view_book(id, update) {
	$.ajax({
		url: '../ajax/view_book_details',
		data: {
			'id': id,
		},
		success: function(data) {
			$("#f-name").val(data.first_name);
			$("#l-name").val(data.last_name);
			$("#mobile").val(data.mobile);
			$("#email").val(data.email);
			$("#team").val(data.team);
			$("#day").val(data.day);
			$("#from").val(data.from);
			$("#to").val(data.to);
			$("#venue").val(data.venue);
			$("#techno").val(data.techno);
			$("#desc").val(data.desc);
			$("#btn-submit").attr("onclick", "submit_book_det(" + data.id + ")");
			$(".update").each(function() {
				$(this).prop('hidden', !data.update);
			});
			$("#book-details").modal("show");
		}
	});
}

function accept_book(comment, id) {
	$.ajax({
		url: '../ajax/accept_book',
		data: {
			'comment': comment,
			'id': id
		},
		success: function() {
			$("#new").DataTable().ajax.reload();
			$("#approved").DataTable().ajax.reload();
		}
	});
}

function reject_book(comment, id) {
	$.ajax({
		url: '../ajax/reject_book',
		data: {
			'comment': comment,
			'id': id
		},
		success: function() {
			$("#new").DataTable().ajax.reload();
			$("#approved").DataTable().ajax.reload();
		}
	});
}

function submit_book_det(id) {
	if ($("#sel-resolve option:selected").text() == "Approve") {
		accept_book($("#comment").val(), id);
	} else {
		reject_book($("#comment").val(), id);
	}
	$("#comment").val("");
	$("#book-details").modal("hide");
}