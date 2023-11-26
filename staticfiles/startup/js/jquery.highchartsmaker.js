/*
 * HighchartsMaker Plugin
 * Render highcharts charts by reading table data
 * Usage:
 * $(target selector).highchartsMaker($(data table selector), {options});
 */

(function($){
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    function isValidDate(date){
        if(new Date(date) == 'Invalid Date') {
            var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
            if (matches == null) return false;
            var y = matches[1];
            var m = matches[2] - 1;
            var d = matches[3];
            var composedDate = new Date.UTC(y, m, d);
            return composedDate.getDate() == d &&
                    composedDate.getMonth() == m &&
                    composedDate.getFullYear() == y;
        }
        return true;
    };

    function getValidDate(date) {
        if(isValidDate(date)) {
            var composedDate = new Date(date);
            if(composedDate == 'Invalid Date') {
                var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
                if (matches == null) return false;
                var y = matches[1];
                var m = matches[2] - 1;
                var d = matches[3];
                var composedDate = new Date.UTC(y, m, d);
            } else {
                return Date.UTC(composedDate.getFullYear(), composedDate.getMonth(), composedDate.getDate());
            }
            return composedDate;
        }
        return false;
    };

    function columnSelector(columns, data, chart, group_by) {
        var randomnumber = Math.floor(Math.random()*100000);
        var sel = $('<select id="' + randomnumber + '" class="columnSelector">');
        $('#columnSelector').replaceWith(sel);
        $(columns).each(function(index) {
            if(index != 0 && index != group_by)
                sel.append($("<option>").attr('value',index).text(this));
        });

        $('#' + randomnumber + '').change(function() {
            changeData(columns, data, chart, $(this).attr('value'));
        });
    }

    function changeData(columns, data, chart, value) {
        $(chart.series).each(function(index) {
            chart.series[index].setData(data[index][value]);
        });
        chart.yAxis[0].setTitle({text: columns[value]});
    }

    $.highchartsMaker = function(el, datatable, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("highchartsMaker", base);

        base.init = function(){
            if( typeof( datatable ) === "undefined" || datatable === null ) {
                console.error('source table undefined');
                return false;
            }
            base.datatable = datatable;
            base.options = $.extend({},$.highchartsMaker.defaultOptions, options);
            // initialization code
        };

        // Run initializer
        base.init();
    };

    $.fn.highchartsMaker = function(datatable, options){
        var defaultOptions = {
            title: "Untitled",
            subtitle: "",
            yAxis: {
                min: 0
            },
            date_only: false,
            group_by: false,
            reverse: false,
            date_interval: 0,
            iterator: 'none'
        };
        var options = $.extend({}, defaultOptions, options);

        return this.each(function(){
            (new $.highchartsMaker(this, datatable, options));

            var iterator = options.iterator;
            var columns = [];
            var data = [];
            var series = [];
            var start_date = 0; // day*hour(24)*min(60)*sec(60)*ms(1000)
            var date_interval = options.date_interval;
            var group_by = options.group_by;
            var reverse = options.reverse;
            var groups = [];
            var table = datatable.clone();
            var labels = [];

            if(reverse) {
                var tbody = $('tbody', table);
                tbody.html($('tr',tbody).get().reverse());
            }

            // Set up the series names
            if(group_by) {
                $('tr td:nth-child(' + (group_by + 1) + ')', table).each(function(i) {
                    if($.inArray($(this).html(), groups) == -1) {
                        groups.push($(this).html());
                        data.push(new Array());
                    }
                });
            }

            table.children('thead').children('tr').children('th').each(function(index) {
                columns.push($(this).html());
                if(group_by)
                    $.each( data , function( key, value ) {
                        data[key].push(new Array());
                    });
                else
                    data.push(new Array());
            });

            // Set up the series data
            var last_date;
            var visited_groups = [];

            var r0c0 = table.children('tbody').children('tr').eq(0).children('td').eq(0).html();

            // Check the first column for date type?
            if(isValidDate(r0c0)) {
                iterator = 'date';
                start_date = getValidDate(r0c0).valueOf();
            }
            // If table is date-based, figure out interval between first and second row.
            // We will assume this is the regular interval per table row.
            if(iterator == 'date' && date_interval == 0) {
                var i = 0;
                do {
                    var point_next = getValidDate(table.children('tbody').children('tr').eq(i).children('td').eq(0).html());
                    date_interval = Math.abs(point_next - start_date);
                    i++;
                }while(date_interval == 0);
            }

            var group_by_col;
            var colcount;
            var point_next;
            var gap;
            var value;
            table.children('tbody').children('tr').each(function(row) {
                if(row > 1 || date_interval > 0) {
                    /* Starting on row 3 (unless manually specified, then row 2) for date-iterated tables,
                     * Fill in gaps in dates with nulls, so chart will insert blank spaces
                     */
                    if(iterator == 'date') {
                        colcount = group_by ? groups.length : columns.length-1; // Don't count date as column
                        point_next = getValidDate($(this).children('td').eq(0).html());
                        gap = Math.floor(point_next - last_date)-1;
                        if(gap > date_interval) {
                            // Missing rows, find out how many
                           var missing_rows = Math.floor(gap/date_interval);
                            // Fill in each column with null * missing row count
                            for(var c = 1; c <= colcount; c++) { // Col count starts @ 1
                                for(var r = 0; r < missing_rows; r++) {
                                    if(group_by) {
                                        columns.forEach(function(el, col) {
                                            data[c][col].push(null);
                                        });
                                    } else {
                                        data[c].push(null);
                                    }
                                }
                            }
                        }
                    }
               }

                if(group_by) {
                    point_next = getValidDate($(this).children('td').eq(0).html());
                    group_by_col = $.inArray($(this).children().eq(group_by).html(), groups);

                    if(last_date != undefined && point_next.valueOf() != last_date.valueOf()) {
                          data.forEach(function(el, index) {
                               if($.inArray(index, visited_groups) == -1) {
                                    columns.forEach(function(el, col) {
                                        data[index][col].push(null);
                                    });
                                }
                            });
                            visited_groups = [];
                    }
                        visited_groups.push(group_by_col);
                }


                $(this).children('td').each(function(col) {
                    if(iterator == 'date' && col == 0) {
                        // Keep track of last date processed so we know how big gaps are
                        last_date = getValidDate($(this).html());
                    }
                    if(iterator == 'label' && col == 0) {
                        // Save this value as label
                        labels.push($(this).html());
                    }

                    // For missing fields, use null to skip the point in chart rendering
                    value = parseFloat($(this).html().replace(/\$|,/g,''));
                    if(isNaN(value)) {
                        group_by ? data[group_by_col][col].push(null) : data[col].push(null);
                    } else {
                        group_by ? data[group_by_col][col].push(value) : data[col].push(value);
                    }
                });
            });


            // Set up the series array
            if(group_by) {
                groups.forEach(function(el, index) {
                    var series_object = new Object();
                    series_object.name = groups[index];
                    series_object.data = data[index][2];
                    if(iterator == 'date') {
                        series_object.pointStart = start_date;
                        series_object.pointInterval = date_interval;
                    }
                    series.push(series_object);
                });
            } else {
                columns.forEach(function(el, index) {
                    var series_object = new Object();
                    if(index == 0 && (iterator == 'date' || iterator == 'numeric' || iterator == 'label')) {
                        // nothing special, just skip first
                    } else {
                        series_object.name = columns[index];
                        series_object.data = data[index];
                        if(iterator == 'date') {
                            series_object.pointStart = start_date;
                            series_object.pointInterval = date_interval;
                        }
                        series.push(series_object);
                    }
                });
            }

            // Build skeleton of highcharts data object
            var now = new Date();
            var chart_options = new Object();
            chart_options.chart = new Object();
            chart_options.credits = new Object();
            chart_options.title = new Object();
            chart_options.subtitle = new Object();
            chart_options.xAxis = new Object();
            chart_options.yAxis = new Object();
            chart_options.yAxis.title = new Object();
            chart_options.plotOptions = new Object();
            chart_options.tooltip = new Object();
            // Set up the basic chart options
            chart_options.chart.renderTo = $(this).attr('id');
            chart_options.chart.type = 'line';
            chart_options.chart.zoomType = 'x';
            chart_options.credits.href='http://www.danielsmallwood.com/';
            chart_options.credits.text='Data Generated: ' + now.toString("dddd, mmmm dS, yyyy, h:MM:ss TT");
            chart_options.title.text = options.title;
            chart_options.subtitle.text = options.subtitle;
            chart_options.yAxis.min = options.yAxis.min;
            chart_options.yAxis.title.text = group_by ? columns[2] : 'Amount';

            // Do not render labels for times when we are only dealing with dates or higher
            if(options.date_only == true) {
                chart_options.xAxis.dateTimeLabelFormats = {
                    millisecond: ' ',
                    second: ' ',
                    minute: ' ',
                    hour: ' ',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                }
            } else {
                chart_options.xAxis.dateTimeLabelFormats = { day: '%b %d<!-- %H:%M:%S-->' };
            }

            // Set up date formatting options
            if(iterator == 'date') {
                chart_options.xAxis.type = 'datetime';
            }
            if(iterator == 'label') {
                chart_options.tooltip = {
                    formatter: function () {
                        return '<b>'+labels[this.x]+'</b><br /><b style="color:'+this.series.color+';">'+this.series.name+'</b>: '+numberWithCommas(this.y);
                    }
                };
            } else {
                chart_options.tooltip = {
                    formatter: function () {
                        return '<b>'+Highcharts.dateFormat('%B %d %Y', this.x)+'</b><br /><b style="color:'+this.series.color+';">'+this.series.name+'</b>: '+numberWithCommas(this.y);
                    }
                };
            }

            // Chart Type Options
            chart_options.plotOptions.line = new Object();
            chart_options.plotOptions.line.shadow = false;

            // Magic
            chart_options.series = series;

            // ERROR HANDLING
            if(chart_options.series[0] === undefined || chart_options.series[0].data.length == 0) {
                console.error('highchartsMaker: zero-length data, cannot render chart. Using fallback.');
                chart_options.chart.backgroundColor = '#FCC';
                chart_options.title.text = 'CHART ERROR :-(';
                chart_options.subtitle.text = 'No data to display!<br /><img src="http://images.chitika.net/logos/banner-logo.png" />';
                chart_options.credits.enabled = false;
                chart_options.series = new Array();
            }

            // DEBUGZ0R
            /*
            console.log('chart_options', JSON.stringify(chart_options));
            console.log('datatable', datatable);
            console.log('columns', columns);
            console.log('data', data);
            console.log('DATA LENGTH:' + data.length);
            console.log('iterator', iterator);
            console.log('series', JSON.stringify(series));
            console.log('start_date', start_date);
            console.log('date_interval', date_interval);
            console.log('labels', labels);
            */

            var chart_created = new Highcharts.Chart(chart_options);

            if(group_by)
                columnSelector(columns, data, chart_created, group_by);
            // END DOING STUFF
        });
    };
})(jQuery);
