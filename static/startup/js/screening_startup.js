
 $("#fieldset2").hide();
    $("#fieldset3").hide();
    $("#fieldset4").hide();

    $("#next-btn1").on("click",function(){
        $("#fieldset1").hide();
        $("#fieldset2").show();
    });
    $("#next-btn2").on("click",function(){
        $("#fieldset2").hide();
        $("#fieldset3").show();
    });
    $("#next-btn3").on("click",function(){
        $("#fieldset3").hide();
        $("#fieldset4").show();
    });
    $("#next-btn4").on("click",function(){
        var status = $("#startup-status").val();
        if (status == "")
            alert('Select Startup Status')
    });
    $("#prev-btn1").on("click",function(){
        $("#fieldset2").hide();
        $("#fieldset1").show();
    });
    $("#prev-btn2").on("click",function(){
        $("#fieldset3").hide();
        $("#fieldset2").show();
    });
    $("#prev-btn3").on("click",function(){
        $("#fieldset4").hide();
        $("#fieldset3").show();
    });

    

$(function(){
    var $select = $(".1-10");
    for (i=1;i<=10;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});