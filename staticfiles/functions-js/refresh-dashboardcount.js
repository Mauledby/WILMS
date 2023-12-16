const walkins = document.getElementById('walkins');
const reserves = document.getElementById('reserves');
const guests = document.getElementById('guests');
const available = document.getElementById('available');

setInterval(() => {
    $.ajax({
        type: 'GET',
        url:'updatedashboard',
        success: function(response){
            console.log('success', response);
            walkins.innerText = JSON.stringify(response.dashboard_count.walkins);
            reserves.innerText = JSON.stringify(response.dashboard_count.reserves);
            guests.innerText = JSON.stringify(response.dashboard_count.guests);
            available.innerText = JSON.stringify(response.dashboard_count.available);
        },
        error: function(error){
            console.log('error', error);
        }
    })

}, 2000);