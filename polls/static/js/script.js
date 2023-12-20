
function showMessage(message, button) {
    var areaId = button ? button.getAttribute('data-areaid') : null;
    selectedAreaId = areaId;
    var popupMessage = document.getElementById('popupMessage');
    var popupText = document.getElementById('popupText');
    var buttonContainer = document.getElementById('buttonContainer');
    var referenceContainer = document.getElementById('referenceContainer');
    popupText.innerHTML = message;
    buttonContainer.style.display = 'block';
    referenceContainer.style.display = 'none';
    popupMessage.style.display = 'block';
}

function hideMessage() {
    var popupMessage = document.getElementById('popupMessage');
    popupMessage.style.display = 'none';
}

function areaButtonClick(areaId) {
    fetch('/polls/area_button_click/?area_id=' + areaId)
        .then(response => response.json())
        .then(data => {
            if (data.reference_number) {
                showReferenceNumber(areaId, data.reference_number);
                insertIntoDatabase(areaId, data.reference_number);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function insertIntoDatabase(areaId, referenceNumber) {
    fetch('/polls/insert_into_database/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            area_id: areaId,
            reference_number: referenceNumber,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data inserted into the database:', data);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function showReferenceNumber(areaId, referenceNumber) {
    var referenceContainer = document.getElementById('referenceContainer');
    var referenceText = areaId + referenceNumber.substring(2);
    referenceContainer.textContent = referenceText;
    referenceContainer.style.display = 'block';
    showMessage('WALK-IN REFERENCE #: ' + referenceText);
}


function generateReferenceNumber(areaId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/polls/area_button_click/?area_id=' + areaId, false);
    xhr.send();

    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        return response.reference_number;
    } else {
        console.error('Error:', xhr.status);
        return '';
    }
} 
