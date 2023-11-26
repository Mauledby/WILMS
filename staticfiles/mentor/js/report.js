var curr_view = 'ongoing';
var curr_ment = 'new';
$("#book-from").change(function() {
	date_filter();
});
$("#book-to").change(function() {
	date_filter();
});
function b_ongoing() {
    curr_view = 'ongoing';
	reset_book('now', 'now');
}
function b_upcoming() {
    curr_view = 'upcoming';
	reset_book('now', ' ');
}
function b_all() {
    curr_view = 'all';
	reset_book(' ', ' ');
}
function b_done() {
    curr_view = 'done';
	reset_book(' ', 'now');
}
function date_filter() {
	var from = $("#book-from").val();
	var to = $("#book-to").val();
	reset_book(from, to);
}
function load_appr() {
    $('#approved').DataTable().destroy();
    $('#approved').DataTable({
            order: [[ 0, "desc" ]],
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
            columnDefs: [
                {orderable: false,
                 searchable: true,
                 className: "center",
                 targets: [4, 5, 7, 8]
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
                    data: 'last_name',
                    targets: [2]
                },
                {
                    data: 'expertise',
                    targets: [3]
                },
                {
                    data: 'schedule',
                    targets: [4]
                },
                {
                    data: 'rating',
                    targets: [5]
                },
                {
                    data: 'academe',
                    targets: [6]
                },
                {
                    data: 'total_hrs',
                    targets: [7]
                },
                {
                    data: 'mentees',
                    targets: [8]
                }
            ],
            searching: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: 'ajax/all_mentors/Approved',
            "responsive": true,
            "scrollX": true,
            "dom": '<"row"<"col-12"<"tbl2-header"<"row"<"col-12 col-xl-10 tbl2-header-left"lf><"col-12 col-xl-2 tbl2-header-right"B>>>>>tip',
            buttons: [
                {extend: 'excel', action: newExportAction, text: 'EXPORT TO EXCEL', filename: "Mentors", className: 'btn btn-sm btn-block col-md-10 btnExp'},
            ],
        });
}
function ment_change() {
	var from = $("#ment-from").val();
	var to = $("#ment-to").val();
	if (from == "") {
		err_mesg($("#ment-from"), "This field is required");
	} else if (to == "") {
		err_mesg($("#ment-to"), "This field is required");
	} else if (from > to) {
		err_mesg($("ment-to"), "Date to must be after Date from");
	} else {
		$("#reportTbl2").DataTable().destroy();
		$('#reportTbl2').DataTable({
            order: [[ 0, "desc" ]],
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
            columnDefs: [
                {orderable: false,
                 searchable: true,
                 className: "center",
                 targets: [4, 5, 7, 8]
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
                    data: 'last_name',
                    targets: [2]
                },
                {
                    data: 'expertise',
                    targets: [3]
                },
                {
                    data: 'schedule',
                    targets: [4]
                },
                {
                    data: 'rating',
                    targets: [5]
                },
                {
                    data: 'academe',
                    targets: [6]
                },
                {
                    data: 'total_hrs',
                    targets: [7]
                },
                {
                    data: 'mentees',
                    targets: [8]
                }
            ],
            searching: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: 'ajax/all_mentors/'+from+'/'+to+'/',
            "responsive": true,
            "scrollX": true,
            "dom": '<"row"<"col-12"<"tbl2-header"<"row"<"col-12 col-xl-10 tbl2-header-left"><"col-12 col-xl-2 tbl2-header-right"B>>>>>tip',
            buttons: [
                {extend: 'excel', text: 'EXPORT TO EXCEL', filename: "Mentors", className: 'btn btn-sm btn-block col-md-5 btnExp'},
            ],
		});
		$("div.dataTables_info").addClass('d-flex justify-content-center');
        $("div.tbl2-header-left").addClass("d-flex justify-content-start");
        $("div.tbl2-header-right").addClass("d-flex justify-content-start align-items-center");
        $("div.tbl2-header-left").append('<div class="form-group form-inline" style="padding-left:5px;"><label>From: <input class="form-control form-control-sm" type="date" style="width:120px" id="ment-from" onchange="ment_change()"></label></div>');
        $("div.tbl2-header-left").append('<div class="form-group form-inline" style="padding-left:15px;"><label>To: <input class="form-control form-control-sm" type="date" style="width:120px" id="ment-to" onchange="ment_change()"></label></div>');
	}
}

function reset_book(from, to) {
    reset_book(from, to, true);
}
function reset_book(from, to, repeat) {
    if (from == ""){
        from = " ";
    }
    if (to == "") {
        to = " ";
    }
	$("#" + curr_view).DataTable().destroy();
    $("#" + curr_view).DataTable({
            order: [[ 0, "desc" ]],
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
            columnDefs: [
                {orderable: false,
                 searchable: true,
                 targets: [7, 10]
                },
                {
                    data: 'id',
                    targets: [0]
                },
                {
                    data: 'mentor',
                    targets: [1]
                },
                {
                    data: 'individual',
                    targets: [2]
                },
                {
                    data: 'schedule',
                    targets: [3]
                },
                {
                    data: 'duration',
                    targets: [4]
                },
                {
                    data: 'venue',
                    targets: [5]
                },
                {
                    data: 'description',
                    targets: [6]
                },
                {
                    data: 'team',
                    targets: [7]
                },
                {
                    data: 'cost',
                    targets: [8]
                },
                {
                    data: 'status',
                    targets: [9]
                },
                {
                    data: 'action',
                    targets: [10]
                }
            ],
            searching: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: 'ajax/all_bookings/' + from + '/' + to + '/',
            "responsive": true,
            "scrollX": true,
            "dom": '<"row"<"col-12"<"tbl1-header"<"row"<"col-12 col-xl-6 tbl1-header-left"lf><"col-12 col-xl-6 tbl1-header-right"B>>>>>tip',
            buttons: [
                {extend: 'excel', action: newExportAction, text: 'EXPORT TO EXCEL', filename: "Mentor Bookings", className: 'btn btn-sm btn-block col-md-5 btnExp',
                exportOptions: {columns: 'th:not(:last-child)'}}
            ],
        });
}

function override(id) {
    $.ajax({
        url: 'ajax/override_lp',
        data: {
            'id': id,
        },
        dataType: 'json',
        success: function() {
            alert("Override successful");
            reload();
        }
    });
}

function reject(id) {
    $.ajax({
        url: 'ajax/cancel_booking',
        data: {
            'id': id,
        },
        dataType: 'json',
        success: function() {
            alert("Booking cancelled successfully");
            reload();
        }
    });
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

function reload() {
    $("#" + curr_view).DataTable().ajax.reload();
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $("#" + curr_view).DataTable().ajax.reload();
})