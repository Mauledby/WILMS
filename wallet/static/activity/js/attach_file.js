
function updateElementIndexFile(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

function deleteFileActivity(prefix, btn) {
    var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (total > 1){
        btn.closest('.form-row-file-activity').remove();
        var forms = $('.form-row-file-activity');
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        for (var i=0, formCount=forms.length; i<formCount; i++) {
            $(forms.get(i)).find(':input').each(function() {
                updateElementIndexFile(this, prefix, i);
            });
        }
    }
    return false;
}

function deleteFileAssignment(prefix, btn) {
    var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (total > 1){
        btn.closest('.form-row-file-assignment').remove();
        var forms = $('.form-row-file-assignment');
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        for (var i=0, formCount=forms.length; i<formCount; i++) {
            $(forms.get(i)).find(':input').each(function() {
                updateElementIndexFile(this, prefix, i);
            });
        }
    }
    return false;
}

$(document).on('click', '.remove-form-row-file-activity', function(e){
    e.preventDefault();
    deleteFileActivity('activity_attachment', $(this));
    return false;
});

$(document).on('click', '.remove-form-row-file-assignment', function(e){
    e.preventDefault();
    deleteFileAssignment('assignment_attachment', $(this));
    return false;
});





