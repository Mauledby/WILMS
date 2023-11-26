$(document).ready(function() {
    reloadTable('now', 'now');
});

$(".datetime-filter").change(function() {
    var from = $("#id_fromDate").val();
    var to = $("#id_toDate").val();
    if (from == "") {
        from = "now";
    }
    if (to == "") {
        to = "now";
    }
    reloadTable(from, to);
})

function reloadTable(from, to) {
$('#reportTbl1').DataTable().destroy();
$('#reportTbl1').DataTable({
            order: [[ 3, "desc" ]],
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
            columnDefs: [
                {orderable: false,
                 searchable: true,
                 targets: [6,7,8]
                },
                {
                    data: 'client__username',
                    targets: [0]
                },
                {
                    data: 'client__first_name',
                    targets: [1]
                },
                {
                    data: 'client__last_name',
                    targets: [2]
                },
                {
                    data: 'created_at__date',
                    targets: [3]
                },
                {
                    data: 'created_at__time',
                    targets: [4]
                },
                {
                    data: 'ended_at__time',
                    targets: [5]
                },
                {
                    data: 'duration',
                    targets: [6]
                },
                // {
                //     data: 'year',
                //     targets: [7]
                // },
                // {
                //     data: 'program',
                //     targets: [8]
                // },
                {
                    data: 'facility',
                    targets: [7]
                },
                {
                    data: 'client__groups',
                    targets: [8]
                },
                {
                    data: 'affiliation',
                    targets: [9]
                }
            ],
            searching: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            ajax: '../../ajax/table_facility_access/' + from + '/' + to,
            "responsive": true,
            "scrollX": true,
            "dom": '<"row"<"col-12"<"tbl1-header"<"row"<"col-12 col-xl-6 tbl1-header-left"><"col-12 col-xl-6 tbl1-header-right">>>>><"filter-container d-flex justify-content-between"lBf>tip',
            buttons: [
                {extend: 'excel', action: newExportAction, text: 'Export Now', filename: "Report Access", className: 'btn btn-sm btn-block col-md-20 btnExp'},
            ],
        });
}