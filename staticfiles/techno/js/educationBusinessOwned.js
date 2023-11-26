function updateElementIndexBusinessOwned(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

function cloneMoreBusinessOwned(selector, prefix) {
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
    var conditionRow = $('.form-rowBusinessOwned:not(:last)');
    conditionRow.find('.add-form-rowBusinessOwned')
    //.removeClass('btn-success').addClass('btn-danger')
    .removeClass('add-form-rowBusinessOwned').addClass('remove-form-rowBusinessOwned')
    //.html('<i class="fa fa-minus-circle fa-2x" style="color:yellow" aria-hidden="true"></i>');
    .html('<i style="margin-left:5px; color:gray" class="fa fa-minus-circle fa-2x" aria-hidden="true"></i>');
    return false;
}
function deleteFormBusinessOwned(prefix, btn) {
    var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (total > 1){
        btn.closest('.form-rowBusinessOwned').remove();
        var forms = $('.form-rowBusinessOwned');
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        for (var i=0, formCount=forms.length; i<formCount; i++) {
            $(forms.get(i)).find(':input').each(function() {
                updateElementIndexBusinessOwned(this, prefix, i);
            });
        }
    }
    return false;
}
$(document).on('click', '.add-form-rowBusinessOwned', function(e){
    e.preventDefault();
    cloneMoreBusinessOwned('.form-rowBusinessOwned:last', 'BusinessOwned');

    return false;
});
$(document).on('click', '.remove-form-rowBusinessOwned', function(e){
    e.preventDefault();
    deleteFormBusinessOwned('BusinessOwned', $(this));

    return false;
});





