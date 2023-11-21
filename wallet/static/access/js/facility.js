$(document).ready(function() {
  get_expected();
  get_loggedin();
  get_overstaying();
  get_arriving();
  get_nobook();
  // get_nobook();
  $('#tb1').DataTable({
    order: [[ 2, "desc" ]],
    lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
    columnDefs: [
        { orderable: false,
          searchable: false,
            className: "center",
            // targets: [5, 6, 7, 9]
            targets: [1, 2, 3, 4]
        },
      {
        data: 'booking_id',
        targets: [0]
      },
      // {
      //   data: 'client__username',
      //   targets: [0]
      // },
      {
        data: 'client__first_name',
        targets: [1]
      },
      {
        data: 'client__last_name',
        targets: [2]
      },
      {
        data: 'client__groups',
        targets: [3]
      },
      // {
      //   targets: [4],
      //   data: null,
      //   render: function ( data, type, row ) {
      //       return '<!-- Button trigger modal --><button type="button" class="btn btn-sm btnView w-100" data-toggle="modal" data-target="#view">View</button>';
      //     }
      // },
      // {
      //   data: 'duration',
      //   targets: [5]
      // },
      // {
      //   data: 'program',
      //   targets: [6]
      // },
      // {
      //   data: 'year',
      //   targets: [7]
      // },
      {
        data: 'facility',
        targets: [4]
      },
      // {
      //   data: 'techno',
      //   targets: [9]
      // },
    ],
    searching: true,
    processing: true,
    serverSide: true,
    stateSave: true,
    ajax: 'ajax/facility_access_table',
    "responsive": true,
    "scrollX": true,
    dom: 'lf<"test" <"toolbar">>rtip',
  });
    $('div.toolbar').html('<b>Filter By:<b> '+'<select><option value="all">All</option><option value="bookingid">Booking ID</option><option value="firstname">First Name</option><option value="lastname">Last Name</option><option value="usertype">User Type</option><option value="facility">Facility</option>');
});

$("#ex_duration").change(function() {
  get_expected();
})

// $("#ex_duration").change(function() {
//   get_expected();
// })

function get_expected() {
  // var venue = $("#ex_spaces option:selected").text().trim();
  var duration = $("#ex_duration option:selected").text().trim();
  $.ajax({
      url: 'ajax/get_expected',
      data: {
        // 'venue': venue,
        'duration': duration,
      },
      success: function(data) {
        $("#ex_coworking").text(data.coworking);
        $("#ex_conference_a").text(data.conference_a);
        $("#ex_conference_b").text(data.conference_b);
        $("#ex_joined").text(data.joined)
      },
  });
}

$("#lo_spaces").change(function() {
  get_loggedin();
})

function get_loggedin() {
  var venue = $("#lo_spaces option:selected").text().trim();
  $.ajax({
      url: 'ajax/get_loggedin',
      data: {
        'venue': venue,
      },
      success: function(data) {
        $("#lo_coworking").text(data.coworking);
        $("#lo_conference_a").text(data.conference_a);
        $("#lo_conference_b").text(data.conference_b);
        $("#lo_joined").text(data.joined)
      },
  });
}


$("#ov_spaces").change(function() {
  get_overstaying();
})

function get_overstaying() {
  var venue = $("#ov_spaces option:selected").text().trim();
  $.ajax({
      url: 'ajax/get_overstaying',
      data: {
        'venue': venue,
      },
      success: function(data) {
        $("#ov_coworking").text(data.coworking);
        $("#ov_conference_a").text(data.conference_a);
        $("#ov_conference_b").text(data.conference_b);
        $("#ov_joined").text(data.joined)
      },
  });
}

$("#ar_spaces").change(function() {
  get_arriving();
})


function get_nobook() {
  $.ajax({
    url: 'ajax/get_nobook',
    success: function(data) {
      $("#overtime").text(data.over2 + " hrs");
      $("#nobook").text(data.nobook)
    }
  })
}

function get_arriving() {
  var venue = $("#ar_spaces option:selected").text().trim();
  $.ajax({
      url: 'ajax/get_arriving',
      data: {
        'venue': venue,
      },
      success: function(data) {
        $("#ar_coworking").text(data.coworking);
        $("#ar_conference_a").text(data.conference_a);
        $("#ar_conference_b").text(data.conference_b);
        $("#ar_joined").text(data.joined)
      },
  });
}

// $("#nb_spaces").change(function() {
//   get_nobook();
// })

// function get_nobook() {
//   var venue = $("#nb_spaces option:selected").text().trim();
//   $.ajax({
//       url: 'ajax/get_arriving',
//       data: {
//         'venue': venue,
//       },
//       success: function(data) {
//         $("#nb_nobook").text(data.nobook);
//   });
// }
