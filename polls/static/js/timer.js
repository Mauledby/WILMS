// Fetch CSRF token from cookies
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        .split('=')[1];
    return cookieValue;
}

// On page load
$(document).ready(function() {
    // Fetch initial timer data from the server
    $.ajax({
        url: '/polls/timer_data/',
        method: 'GET',
        success: function(data) {
            startTimer(data.minutes, data.seconds, data.session_ended);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Failed to fetch timer data:', errorThrown);
        }
    });
});

let minutes, seconds, intervalId;

function updateTimerDisplay() {
    const formattedTime = padNumber(minutes) + ':' + padNumber(seconds);
    $('#timer').text(formattedTime);
    updateServerTimer(minutes, seconds); // Update server-side timer on each change
}

function updateServerTimer(minutes, seconds) {
    $.ajax({
        url: '/polls/update_timer_data/',
        method: 'POST',
        data: {
            'minutes': minutes,
            'seconds': seconds
        },
        headers: {
            'X-CSRFToken': getCSRFToken() // Include CSRF token in the request headers
        },
        success: function(response) {
            console.log('Timer updated on the server');
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Failed to update timer:', errorThrown);
        }
    });
}

function startTimer(initialMinutes, initialSeconds, sessionEnded) {
    let startTime = performance.now(); // Record the start time
    minutes = initialMinutes;
    seconds = initialSeconds;
    

    updateTimerDisplay();

    if (!sessionEnded) {
        intervalId = setInterval(() => {
            let currentTime = performance.now();
            let elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds

            if (elapsed % 60 === 0) {
                // Update the timer display every minute
                updateTimerDisplay();
            }

            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                clearInterval(intervalId);
                showNotification("WILDSPACE", "Your time has ended!");
            }
            updateTimerDisplay();
        }, 1000);
    }
}

// Helper function to pad numbers with leading zeros
function padNumber(number) {
    return number.toString().padStart(2, '0');
}

    if ("Notification" in window) {
        if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function (permission) {
            
        });
        }
    }

    function showNotification(title, body) {
        if (Notification.permission === "granted") {
          var options = {
            body: body,
          };
      
          var notification = new Notification(title, options);
      
        
          notification.onclick = function () {
            
            notification.close();
          };
        }
      }

 function showConfirmationDialog() {
    var confirmationDialog = document.getElementById('confirmation-dialog');
    var overlay = document.getElementById('overlay');
    confirmationDialog.style.display = 'block';
    overlay.style.display = 'block';
  }
  
  
  document.getElementById('confirm-button').addEventListener('click', confirmEndSession);
  document.getElementById('cancel-button').addEventListener('click', cancelEndSession);
  
  
  function confirmEndSession() {
    var csrfToken = getCookie('csrftoken');

    $.ajax({
        url: '/polls/end_session/',
        method: 'POST',
        data: { session_ended: true },
        headers: {
            "X-CSRFToken": csrfToken
        },
        success: function(data) {
            if (data.success) {
                var referenceNumber = '{{ booking_reference_number }}';
                var messageOverlay = document.createElement('div');
                messageOverlay.classList.add('message-overlay');

                var messageBox = document.createElement('div');
                messageBox.classList.add('message-box');

                var messageHeader = document.createElement('h2');
                messageHeader.textContent = 'Session Ended';

                var messageContent = document.createElement('p');
                messageContent.innerHTML = 'Reference Number: ' + referenceNumber;

                var additionalText = document.createElement('p');
                additionalText.textContent = 'To avoid overstaying charges, please go to the front desk and present your reference number to confirm that your allotted time has ended.';

                messageBox.appendChild(messageHeader);
                messageBox.appendChild(messageContent);
                messageBox.appendChild(additionalText);

                messageOverlay.appendChild(messageBox);

                document.body.appendChild(messageOverlay);

                $('#timer').text('00:00');

                hideConfirmationDialog();

                // Stop the timer by clearing the interval
                clearInterval(intervalId);
            } else {
                alert('Failed to end the session. Please try again.');
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
            alert('Failed to end the session. Please try again.');
        }
    });
}


function cancelEndSession() {
    
    hideConfirmationDialog();
  }
  
  
  function hideConfirmationDialog() {
    var confirmationDialog = document.getElementById('confirmation-dialog');
    var overlay = document.getElementById('overlay');
    confirmationDialog.style.display = 'none';
    overlay.style.display = 'none';
  }

  document.querySelector('.end-button').addEventListener('click', function() {
    showConfirmationDialog();
  });

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}