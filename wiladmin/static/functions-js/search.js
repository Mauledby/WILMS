function searchFunction() {
    // Declare variables
    $.ajax({
        type: 'GET',
        url:'/wiladmin/getAllWalkin',
        success: function(response){
            console.log('success', response);
            bookings = response.bookings;
        },
        error: function(error){
            console.log('error', error);
        }
    })
  }