/*$(function () {
    'use strict';
    var countriesArray = $.map(countries, function (value, key) { return { value: value, data: key }; });

    $('#id_mentor-0-mentorId').autocomplete({
            serviceUrl: "http://localhost:8000/techno/allMentors",
            minChars: 3,
            onSelect: function(suggestion) {
                 $('#selection-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
     });
});
*/
/*function initAutoComplete(){
   $('#id_mentor-0-mentorId').autocomplete({
            serviceUrl: "http://localhost:8000/techno/allMentors",
            minChars: 3,
            onSelect: function(suggestion) {
                 $('#selection-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
     });

     $('#id_mentor-1-mentorId').autocomplete({
            serviceUrl: "http://localhost:8000/techno/allMentors",
            minChars: 3,
            //lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            //    var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            //    return re.test(suggestion.value);
            //},
            onSelect: function(suggestion) {
                 $('#selection-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
     });

     $('#id_mentor-2-mentorId').autocomplete({
            serviceUrl: "http://localhost:8000/techno/allMentors",
            minChars: 3,
            onSelect: function(suggestion) {$('#selction-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
                 $('#selection-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
     });

     $('#id_mentor-3-mentorId').autocomplete({
            serviceUrl: "http://localhost:8000/techno/allMentors",
            minChars: 3,
            onSelect: function(suggestion) {
                $('#selection-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
                //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
     });
}
*/

function updateElementIndexMentor(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

function cloneMoreMentor(selector, prefix) {
    var newElement = $(selector).clone(true);
    var total = $('#id_' + prefix + '-TOTAL_FORMS').val();

    newElement.find(':input:not([type=button]):not([type=submit]):not([type=reset])').each(function() {
    //newElement.find('select').each(function() {
    	var name = $(this).attr('name').replace('-' + (total-1) + '-', '-' + total + '-');
    	var id = 'id_' + name;
    	$(this).attr({'name': name, 'id': id}).val('').removeAttr('checked');
    });
    newElement.find('label').each(function() {
    	var forValue = $(this).attr('for');
    	if (forValue) {
    	  forValue = forValue.replace('-' + (total-1) + '-', '-' + total + '-');
    	  $(this).attr({'for': forValue});
    	}
    });
    total++;
    $('#id_' + prefix + '-TOTAL_FORMS').val(total);
    $(selector).after(newElement);
    var conditionRow = $('.form-row-mentor:not(:last)');
    conditionRow.find('.btn.add-form-row-mentor')
    .removeClass('btn-success').addClass('btn-danger')
    .removeClass('add-form-row-mentor').addClass('remove-form-row-mentor')
    .html('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');

    return false;
}
function deleteFormMentor(prefix, btn) {
    var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (total > 1){
        btn.closest('.form-row-mentor').remove();
        var forms = $('.form-row-mentor');
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        for (var i=0, formCount=forms.length; i<formCount; i++) {
            $(forms.get(i)).find(':input').each(function() {
                updateElementIndexMentor(this, prefix, i);
            });
        }
    }
    return false;
}
$(document).on('click', '.add-form-row-mentor', function(e){
    e.preventDefault();

    if($('#id_technoType').prop('checked')){
        return false;
    }

    cloneMoreMentor('.form-row-mentor:last', 'mentor');
    return false;
});
$(document).on('click', '.remove-form-row-mentor', function(e){
    e.preventDefault();
    deleteFormMentor('mentor', $(this));
    return false;
});




