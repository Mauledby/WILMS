$(document).ready( function () {
        var table1 = $('#reportTbl1').DataTable({
            "responsive": true,
            "scrollX": true,
            "dom": '<"reportTblWrapper"<"row"<"col-12"<"tableHeader"<"row"<"col-12 col-xl-6"<"#filterWrapperLeft1.d-flex justify-content-start"<"row"<"col-12 col-lg-6"<"filter-col1">><"col-12 col-lg-6"<"filter-col2">f>>>><"col-12 col-xl-6"<"#filterWrapperRight1.filterWrapperRight d-flex justify-content-center align-items-center">>>>>>t<"d-flex justify-content-center"i>p>',
        });

        var table2 = $('#reportTbl2').DataTable({
            "language": {
                "search": "",
                "searchPlaceholder": "Search",
             },
            "responsive": true,
            "scrollX": true,
            "dom": '<"reportTblWrapper"<"row"<"col-12"<"tableHeader"<"row"<"col-12 col-xl-6"<"#filterWrapperLeft2.d-flex justify-content-start"<"row" <"col-12 col-lg-3"<"filter-col1">><"col-12 col-lg-3"<"filter-col2">> <"col-12 col-lg-6"f>>>><"col-12 col-xl-6"<"#filterWrapperRight2.filterWrapperRight d-flex justify-content-center align-items-center">>>>>>t<"d-flex justify-content-center"i>p>',
        });

        var table3 = $('#reportTbl3').DataTable({
            "language": {
                "search": "",
                "searchPlaceholder": "Search",
             },
            "responsive": true,
            "scrollX": true,
            "dom": '<"reportTblWrapper"<"row"<"col-12"<"tableHeader"<"row"<"col-12 col-xl-6"<"#filterWrapperLeft3.d-flex justify-content-start"<"row" <"col-12 col-lg-3"<"filter-col1">><"col-12 col-lg-3"<"filter-col2">> <"col-12 col-lg-6"f>>>><"col-12 col-xl-6"<"#filterWrapperRight3.filterWrapperRight d-flex justify-content-center align-items-center">>>>>>t<"d-flex justify-content-center"i>p>',
        });

        var table4 = $('#reportTbl4').DataTable({
            "language": {
                "search": "",
                "searchPlaceholder": "Search",
             },
            "responsive": true,
            "scrollX": true,
            "dom": '<"reportTblWrapper"<"row"<"col-12"<"tableHeader"<"row"<"col-12 col-xl-6"<"#filterWrapperLeft4.d-flex justify-content-start"<"row" <"col-12 col-lg-3"<"filter-col1">><"col-12 col-lg-3"<"filter-col2">> <"col-12 col-lg-6"f>>>><"col-12 col-xl-6"<"#filterWrapperRight4.filterWrapperRight d-flex justify-content-center align-items-center">>>>>>t<"d-flex justify-content-center"i>p>',
        });

        $("#filterWrapperLeft1 > div > div > .filter-col1").html(' <table><tr><td><b>From:</b></td><td><input class="form-control form-control-sm" type="date"></td></tr> <tr><td><b>To:</b></td><td><input class="form-control form-control-sm" type="date"></td></tr></table> ');
        $("#filterWrapperLeft1 > div > div > .filter-col2").html(' <table><tr><td><b>Venue:</b></td><td><select style="margin-left:7px; width:187px" id="venue-select" class="browser-default custom-select-sm form-control"><option value="1">All</option><option value="2">Venue 1</option></select></td> ');
        $("#filterWrapperLeft2 > div > div > .filter-col1").html(' <label>From:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft2 > div > div > .filter-col2").html(' <label>To:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft2 > div").children().attr('style', 'padding-right:0px');
        $("#filterWrapperLeft3 > div > div > .filter-col1").html(' <label>From:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft3 > div > div > .filter-col2").html(' <label>To:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft3 > div").children().attr('style', 'padding-right:0px');
        $("#filterWrapperLeft4 > div > div > .filter-col1").html(' <label>From:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft4 > div > div > .filter-col2").html(' <label>To:</label><input type="date" class="form-control form-control-sm">' );
        $("#filterWrapperLeft4 > div").children().attr('style', 'padding-right:0px');
        $("#reportTbl2_filter > label").attr("style", "display:block !important;");
        $("#reportTbl2_filter > label > input").attr("style", "display:block !important; margin-left:0px !important;");
        //$("#reportTbl2_filter").prepend('<label class="d-flex justify-content-start" style="font-weight:normal !important;">Search:</label>');
        $("#reportTbl3_filter > label").attr("style", "display:block !important;");
        $("#reportTbl3_filter > label > input").attr("style", "display:block !important; margin-left:0px !important;");
        //$("#reportTbl3_filter").prepend('<label class="d-flex justify-content-start" style="font-weight:normal !important;">Search:</label>');
        $("#reportTbl4_filter > label").attr("style", "display:block !important;");
        $("#reportTbl4_filter > label > input").attr("style", "display:block !important; margin-left:0px !important;");
        //$("#reportTbl4_filter").prepend('<label class="d-flex justify-content-start" style="font-weight:normal !important;">Search:</label>');


        $("#filterWrapperRight1").html('<div class="header-links"><a href="#">ON-GOING</a> | <a href="#">UPCOMING</a> | <a href="#">ALL</a></div> <button id="exportBtn1" type="button" class="btn-export">EXPORT NOW</button');
        $("#filterWrapperRight2").html('<div class="header-links"><a href="#">ON-GOING</a> | <a href="#">UPCOMING</a> | <a href="#">ALL</a></div> <button id="exportBtn2" type="button" class="btn-export">EXPORT NOW</button');
        $("#filterWrapperRight3").html('<button id="exportBtn3" type="button" class="btn-export">EXPORT NOW</button');
        $("#filterWrapperRight4").html('<div class="header-links"><a href="#">ON-GOING</a> | <a href="#">UPCOMING</a> | <a href="#">ALL</a></div> <button id="exportBtn4" type="button" class="btn-export">EXPORT NOW</button');

        $("#fieldset2").hide();
        $("#fieldset3").hide();
        $("#fieldset4").hide();

    } );

    $("#nav-btn1").on("click",function(){
        $("#fieldset2").hide();
        $("#fieldset3").hide();
        $("#fieldset4").hide();
        $("#fieldset1").show();
        $("#nav-btn1 div").addClass("active");
        $("#nav-btn2 div").removeClass("active");
        $("#nav-btn3 div").removeClass("active");
        $("#nav-btn4 div").removeClass("active");
    });
    $("#nav-btn2").on("click",function(){
        $("#fieldset1").hide();
        $("#fieldset3").hide();
        $("#fieldset4").hide();
        $("#fieldset2").show();
        $("#nav-btn2 div").addClass("active");
        $("#nav-btn1 div").removeClass("active");
        $("#nav-btn3 div").removeClass("active");
        $("#nav-btn4 div").removeClass("active");
    });
    $("#nav-btn3").on("click",function(){
        $("#fieldset1").hide();
        $("#fieldset2").hide();
        $("#fieldset4").hide();
        $("#fieldset3").show();
        $("#nav-btn3 div").addClass("active");
        $("#nav-btn1 div").removeClass("active");
        $("#nav-btn2 div").removeClass("active");
        $("#nav-btn4 div").removeClass("active");
    });
    $("#nav-btn4").on("click",function(){
        $("#fieldset1").hide();
        $("#fieldset2").hide();
        $("#fieldset3").hide();
        $("#fieldset4").show();
        $("#nav-btn4 div").addClass("active");
        $("#nav-btn1 div").removeClass("active");
        $("#nav-btn2 div").removeClass("active");
        $("#nav-btn3 div").removeClass("active");
    });