angular.module("serviceApp").service("uiService", uiService);

uiService.$inject = ["$q", "$rootScope"];

function uiService($q, $rootScope) {
    $rootScope.uiInitialized = false;
    $rootScope.admin_leftbar_collapse = "";

    var initializeUi = function() {
        console.log('initializeUi() called!');

        var deferred = $q.defer();

        if ($rootScope.uiInitialized) {
            console.log("UI already Initialized!");
            deferred.resolve();
            return deferred.promise;
        }

        console.log("Initializing UI");

        //Helper functions
        //---------------

        //Fixing the show of scroll rails even when sidebar is hidden
        $rootScope.leftbarScrollShow = function() {
            if ($("body").hasClass("show-leftbar")) {
                $("#sidebar").getNiceScroll().show();
            } else {
                $("#sidebar").getNiceScroll().hide();
            }
            $("#sidebar").getNiceScroll().resize();
        }; //set Top positions for changing between static and fixed header
        $rootScope.leftbarTopPos = function() {
            var scr = $("body.static-header").scrollTop();
            if (scr < 41) {
                $("ul#sidebar").css("top", 40 - scr + "px");
            } else {
                $("ul#sidebar").css("top", 0);
            }
        };
        $rootScope.rightbarTopPos = function() {
            var scr = $("body.static-header").scrollTop();
            if (scr < 41) {
                $("#page-rightbar").css("top", 40 - scr + "px");
            } else {
                $("#page-rightbar").css("top", 0);
            }
        }; //Set Right position for fixed layouts
        $rootScope.rightbarRightPos = function() {
            if ($("body").hasClass("fixed-layout")) {
                var $pc = $("#page-content");
                var endingRight = ($(window).width() - ($pc.offset().left + $pc.outerWidth()));
                if (endingRight < 0) endingRight = 0;
                $("#page-rightbar").css("right", endingRight);
            }
        }; // Match page height with Sidebar Height
        $rootScope.checkpageheight = function() {
            var sh = $("#page-leftbar").height();
            var ch = $("#page-content").height();
            if (sh > ch) $("#page-content").css("min-height", sh + "px");
        }; // Recalculate widget area to area visible
        $rootScope.widgetheight = function() {
            $("#widgetarea").css({ "max-height": $("body").height() });
            $("#widgetarea").getNiceScroll().resize();
        }; //..............................................................................................................................................
        // Left Menu
        if ($rootScope.admin_leftbar_collapse === "collapse-leftbar") {
            $("body").addClass("collapse-leftbar");
        } else {
            $("body").removeClass("collapse-leftbar");
        }

        $("body").on("click", "ul.acc-menu a", function() {
            var lIs = $(this).closest("ul.acc-menu").children("li");
            $(this).closest("li").addClass("clicked");
            $.each(lIs, function(i) {
                if ($(lIs[i]).hasClass("clicked")) {
                    $(lIs[i]).removeClass("clicked");
                    return true;
                }
                if ($rootScope.admin_leftbar_collapse !== "collapse-leftbar" || $(this).parents(".acc-menu").length > 1) $(lIs[i]).find("ul.acc-menu:visible").slideToggle();
                $(lIs[i]).removeClass("open");
                return true;
            });
            if ($(this).siblings("ul.acc-menu:visible").length > 0)
                $(this).closest("li").removeClass("open");
            else
                $(this).closest("li").addClass("open");
            if ($rootScope.admin_leftbar_collapse !== "collapse-leftbar" || $(this).parents(".acc-menu").length > 1)
                $(this).siblings("ul.acc-menu").slideToggle({
                    duration: 200,
                    progress: function() {
                        $rootScope.checkpageheight();
                        if ($(this).closest("li").is(":last-child")) { //only scroll down if last-child
                            $("#sidebar").animate({ scrollTop: $("#sidebar").height() }, 0);
                        }
                    },
                    complete: function() {
                        $("#sidebar").getNiceScroll().resize();
                    }
                });
        });

        // Left Menu Config Wuz Here

        // Reads Cookie for Collapsible Leftbar
        // if($rootScope.admin_leftbar_collapse === 'collapse-leftbar')
        //     $("body").addClass("collapse-leftbar");

        //Make only visible area scrollable
        $("#widgetarea").css({ "max-height": $("body").height() });
        //Bind widgetarea to nicescroll
        $("#widgetarea").niceScroll({ horizrailenabled: false });

        // Toggle Buttons
        // ------------------------------

        //On click of left menu
        $rootScope.leftMenuTrigger = function() {
            //$("a#leftmenu-trigger").click(function () {
            if ((window.innerWidth) < 768) {
                $("body").toggleClass("show-leftbar");
            } else {
                $("body").toggleClass("collapse-leftbar");

                //Sets Cookie for Toggle
                if ($rootScope.admin_leftbar_collapse === "collapse-leftbar") {
                    $rootScope.admin_leftbar_collapse = "";
                    $("ul.acc-menu").css("visibility", "");
                } else {
                    $.each($(".acc-menu"), function() {
                        if ($(this).css("display") === "none")
                            $(this).css("display", "");
                    });

                    $("ul.acc-menu:first ul.acc-menu").css("visibility", "hidden");
                    $rootScope.admin_leftbar_collapse = "collapse-leftbar";
                }
            }
            $rootScope.checkpageheight();
            $rootScope.leftbarScrollShow();
        };
        //});

        // On click of right menu
        $("a#rightmenu-trigger").click(function() {
            $("body").toggleClass("show-rightbar");
            $rootScope.widgetheight();

            if ($rootScope.admin_rightbar_show === "show-rightbar")
                $rootScope.admin_rightbar_show = "";
            else
                $rootScope.admin_rightbar_show = "show-rightbar";
        });

        // Recalculate widget area on a widget being shown
        $(".widget-body").on("shown.bs.collapse", function() {
            $rootScope.widgetheight();
        });

        // -------------------------------
        // Sidebars Positionings
        // -------------------------------

        $(window).scroll(function() {
            $("#widgetarea").getNiceScroll().resize();
            $(".chathistory").getNiceScroll().resize();
            $rootScope.rightbarTopPos();
            $rootScope.leftbarTopPos();
        });

        $(window).resize(function() {
            $rootScope.widgetheight();

            $rootScope.rightbarRightPos();
            $("#sidebar").getNiceScroll().resize();
        });
        $rootScope.rightbarRightPos();

        // -------------------------------
        // Mobile Only - set sidebar as fixed position, slide
        // -------------------------------

        enquire.register("screen and (max-width: 767px)", {
            match: function() {
                // For less than 768px
                $(function() {
                    //Bind sidebar to nicescroll
                    $("#sidebar").niceScroll({ horizrailenabled: false });
                    $rootScope.leftbarScrollShow();

                    //Click on body and hide leftbar
                    $("#wrap").click(function() {
                        if ($("body").hasClass("show-leftbar")) {
                            $("body").removeClass("show-leftbar");
                            $rootScope.leftbarScrollShow();
                        }
                    });

                    //Fix a bug
                    $("#sidebar ul.acc-menu").css("visibility", "");

                    //open up leftbar
                    $("body").removeClass("show-leftbar");
                    $rootScope.admin_leftbar_collapse = "";

                    $("body").removeClass("collapse-leftbar");
                });

                console.log("match");
            },
            unmatch: function() {
                //Remove nicescroll to clear up some memory
                $("#sidebar").niceScroll().remove();
                $("#sidebar").css("overflow", "visible");

                console.log("unmatch");

                //hide leftbar
                $("body").removeClass("show-leftbar");
            }
        });

        // -------------------------------
        // Back to Top button
        // -------------------------------

        $("#back-to-top").click(function() {
            $("body, html").animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        // -------------------------------
        // Panel Collapses
        // -------------------------------
        $("a.panel-collapse").click(function() {
            $(this).children().toggleClass("fa-chevron-down fa-chevron-up");
            $(this).closest(".panel-heading").next().slideToggle({ duration: 200 });
            $(this).closest(".panel-heading").toggleClass("rounded-bottom");
            return false;
        });

        // -------------------------------
        // Quick Start
        // -------------------------------
        $("#headerbardropdown").click(function() {
            $("#headerbar").css("top", 0);
            return false;
        });

        $("#headerbardropdown").click(function(event) {
            $("html").one("click", function() {
                $("#headerbar").css("top", "-1000px");
            });

            event.stopPropagation();
        });

        // -------------------------------
        // Keep search open on click
        // -------------------------------
        $("#search > a").click(function() {
            $("#search").toggleClass("keep-open");
            $("#search > a i").toggleClass("opacity-control");
        });

        $("#search").click(function(event) {
            $("html").one("click", function() {
                $("#search").removeClass("keep-open");
                $("#search > a i").addClass("opacity-control");
            });

            event.stopPropagation();
        });

        //Presentational: set all panel-body with br0 if it has panel-footer
        $(".panel-footer").prev().css("border-radius", "0");

        // Cool Pulsate Effect!!!
        $(".demodrop").pulsate({
            color: "#2bbce0",
            repeat: 10
        });

        $rootScope.uiInitialized = true;

        // Remove Cloak (If Page Refresh)
        $(".ng-cloak").removeClass("ng-cloak");

        deferred.resolve();
        return deferred.promise;
    };

    var initializeData = function(colIndex, sortOrder) {
        var deferred = $q.defer();

        if (!colIndex) {
            colIndex = 0;
        }

        if (!sortOrder) {
            sortOrder = "desc";
        }

        $(".datatables").dataTable({
            "bDestroy": true,
            "order": [[colIndex, sortOrder]],
            "sDom": "<'row'<'col-xs-6'l><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                "sSearch": ""
            }
        });
        $(".dataTables_filter input").addClass("form-control").attr("placeholder", "Search...");
        $(".dataTables_length select").addClass("form-control");

        deferred.resolve();
        return deferred.promise;
    };

    var initializeDataById = function(tableId, colIndex, sortOrder) {
        var deferred = $q.defer();

        if (!colIndex) {
            colIndex = 0;
        }

        if (!sortOrder) {
            sortOrder = "desc";
        }

        $("#" + tableId).dataTable({
            "bDestroy": true,
            "order": [[colIndex, sortOrder]],
            "sDom": "<'row'<'col-xs-6'l><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                "sSearch": ""
            }
        });
        $(".dataTables_filter input").addClass("form-control").attr("placeholder", "Search...");
        $(".dataTables_length select").addClass("form-control");

        deferred.resolve();
        return deferred.promise;
    };

    var clearData = function() {
        // Datatables
        var dtable = $(".datatables").dataTable();

        if (dtable != undefined) {
            dtable.fnDestroy();
        };
    };

    var clearDataById = function(tableId) {
        // Datatables
        var dtable = $("#" + tableId).dataTable();

        if (dtable != undefined) {
            dtable.fnDestroy();
        };
    };

    var initializeForm = function() {
        //console.log('initializeForm() called!');

        $rootScope.renderCalendar = function(headertype) {
            // Demo for FullCalendar with Drag/Drop internal

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var calendar = $("#calendar-drag").fullCalendar({
                header: headertype,
                selectable: true,
                selectHelper: true,
                select: function(start, end, allDay) {
                    var title = prompt("Event Title:");
                    if (title) {
                        calendar.fullCalendar("renderEvent",
                            {
                                title: title,
                                start: start,
                                end: end,
                                allDay: allDay
                            },
                            true // make the event "stick"
                        );
                    }
                    calendar.fullCalendar("unselect");
                },
                editable: true,
                events: [
                    {
                        title: "Shipped Dock #9",
                        start: new Date(y, m, 8),
                        allDay: true,
                        backgroundColor: "#efa131"
                    },
                    {
                        title: "Shipped Dock #3",
                        start: new Date(y, m, 1),
                        allDay: true,
                        backgroundColor: "#efa131"
                    },
                    {
                        title: "Shipped Dock #9",
                        start: new Date(y, m, 7),
                        allDay: true,
                        backgroundColor: "#efa131"
                    },
                    {
                        id: 999,
                        title: "UPS-LTL Dock #8",
                        start: new Date(y, m, 28),
                        allDay: true,
                        backgroundColor: "#e74c3c"
                    },
                    {
                        id: 999,
                        title: "UPS-LTL Dock #7",
                        start: new Date(y, m, 16),
                        allDay: true,
                        backgroundColor: "#e74c3c"
                    },
                    {
                        id: 999,
                        title: "Con-Way Dock #2",
                        start: new Date(y, m, 30),
                        allDay: true,
                        backgroundColor: "#e74c3c"
                    },
                    {
                        id: 999,
                        title: "Con-Way Dock #7",
                        start: new Date(y, m, 26),
                        allDay: true,
                        backgroundColor: "#e74c3c"
                    },
                    {
                        title: "Ready Dock #6",
                        start: new Date(y, m, 19),
                        allDay: true,
                        backgroundColor: "#76c4ed"
                    },
                    {
                        title: "Ready Dock #6",
                        start: new Date(y, m, 22),
                        allDay: true,
                        backgroundColor: "#76c4ed"
                    },
                    {
                        title: "Ready Dock #4",
                        start: new Date(y, m, 22),
                        allDay: true,
                        backgroundColor: "#76c4ed"
                    }
                ],
                buttonText: {
                    prev: "<i class=\"fa fa-angle-left\"></i>",
                    next: "<i class=\"fa fa-angle-right\"></i>",
                    prevYear: "<i class=\"fa fa-angle-double-left\"></i>", // <<
                    nextYear: "<i class=\"fa fa-angle-double-right\"></i>", // >>
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day"
                }
            });

            // Listen for click on toggle checkbox
            $("#select-all").click(function(event) {
                if (this.checked) {
                    $(".selects :checkbox").each(function() {
                        this.checked = true;
                    });
                } else {
                    $(".selects :checkbox").each(function() {
                        this.checked = false;
                    });
                }
            });

            $(".panel-tasks").sortable({ placeholder: "item-placeholder" });
            $(".panel-tasks input[type=\"checkbox\"]").click(function(event) {
                if (this.checked) {
                    $(this).next(".task-description").addClass("done");
                } else {
                    $(this).next(".task-description").removeClass("done");
                }
            });
        };
        var deferred = $q.defer();

        $("ul.acc-menu li").removeClass("active open hasChild");

        // Config Left Menu Nav
        var targetAnchor;
        //console.log('length=' + $('ul.acc-menu a').length);
        $.each($("ul.acc-menu a"), function() {
            if (this.href === window.location) {
                targetAnchor = this;
                return false;
            }
        });

        //$('#datepicker,#datepicker2,#datepicker3').datepicker();

        $("#threads, #comments, #users").niceScroll({ horizrailenabled: false, railoffset: { left: 0 } });

        $("#nextConnect a").click(function(e) {
            e.preventDefault();
            $(this).tab("show");
        });

        $("#nextConnect a:first").tab("show");

        // Re-Initialize Bootstrap Components
        $(".dropdown-toggle").dropdown();

        $(".demodrop").pulsate({
            color: "#2bbce0",
            repeat: 10
        });

        $rootScope.renderCalendar({ left: "title", right: "prev,next" });

        enquire.register("screen and (min-width: 1200px)", {
            match: function() {
                $("#calendar-drag").removeData("fullCalendar").empty();
                $rootScope.renderCalendar({ left: "prev,next", center: "title", right: "month,basicWeek,basicDay" });
            },
            unmatch: function() {
                $("#calendar-drag").removeData("fullCalendar").empty();
                $rootScope.renderCalendar({ left: "title", right: "prev,next" });
            }
        });

        var parent = $(targetAnchor).closest("li");
        while (true) {
            parent.addClass("active");
            parent.closest("ul.acc-menu").show().closest("li").addClass("open");
            parent = $(parent).parents("li").eq(0);
            if ($(parent).parents("ul.acc-menu").length <= 0) break;
        }

        var liHasUlChild = $("li").filter(function() {
            return $(this).find("ul.acc-menu").length;
        });
        $(liHasUlChild).addClass("hasChild");

        if ($rootScope.admin_leftbar_collapse === "collapse-leftbar") {
            $("ul.acc-menu:first ul.acc-menu").css("visibility", "hidden");
        }
        $("ul.acc-menu:first > li").hover(function() {
            if ($rootScope.admin_leftbar_collapse === "collapse-leftbar")
                $(this).find("ul.acc-menu").css("visibility", "");
        }, function() {
            if ($rootScope.admin_leftbar_collapse === "collapse-leftbar")
                $(this).find("ul.acc-menu").css("visibility", "hidden");
        });

        //set minimum height of page
        var dh = ($(document).height() - 40);
        $("#page-content").css("min-height", dh + "px");
        //$rootScope.checkpageheight();

        //console.log('initializeForm() completed!');

        //Color Picker
        $(".cpicker").colorpicker();

        // Code Prettyfy
        prettyPrint();

        // Initialize Form Components
        $(".datepicker-pastdisabled").datepicker({
            autoclose: true,
            startDate: "today",
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yyyy"
        });
        //$('.datepicker-pastdisabled').on('change', function () {
        //    $(this).datepicker("hide");
        //});

        $(".datepicker").datepicker({
            autoclose: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yyyy"
        });
        //$('.datepicker').on('change', function () {
        //    $(this).datepicker("hide");
        //});

        //$(".datepicker input").each(function (index) {
        //    var datepickerDefaultVal = $(this).val();
        //    $(this).datepicker({ numberOfMonths: 3, showButtonPanel: true });
        //    $(this).datepicker("option", "dateFormat", 'mm/dd/yyyy');
        //    $(this).datepicker("setDate", datepickerDefaultVal);
        //});

        //$(".datepicker-pastdisabled input").each(function (index) {
        //    var datepickerDefaultVal = $(this).val();
        //    $(this).datepicker({ numberOfMonths: 3, showButtonPanel: true });
        //    $(this).datepicker("option", "dateFormat", 'mm/dd/yyyy');
        //    $(this).datepicker("setDate", datepickerDefaultVal);
        //});

        // Initialize Masks
        $(".mask").inputmask();

        $(".popovers").popover({ container: "body", trigger: "hover", placement: "top" }); //bootstrap's popover
        $(".tooltips").tooltip(); //bootstrap's tooltip

        $(".chathistory").niceScroll({ horizrailenabled: false }); //chathistory scroll

        try {
            //Set nicescroll on notifications
            $(".scrollthis").niceScroll({ horizrailenabled: false });
            $(".dropdown").on("shown.bs.dropdown", function() {
                $(".scrollthis").getNiceScroll().resize();
                $(".scrollthis").getNiceScroll().show();
            });
            $(".dropdown").on("hide.bs.dropdown", function() {
                $(".scrollthis").getNiceScroll().hide();
            });

            $(window).scroll(function() {
                $(".scrollthis").getNiceScroll().resize();
            });
        } catch (e) {
        }

        deferred.resolve();
        return deferred.promise;
    };

    var initializeDash = function() {
        $("#daterangepicker2").daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract("days", 1), moment().subtract("days", 1)],
                    'Last 7 Days': [moment().subtract("days", 6), moment()],
                    'Last 30 Days': [moment().subtract("days", 29), moment()],
                    'This Month': [moment().startOf("month"), moment().endOf("month")],
                    'Last Month': [moment().subtract("month", 1).startOf("month"), moment().subtract("month", 1).endOf("month")]
                },
                opens: "left",
                startDate: moment().subtract("days", 29),
                endDate: moment()
            },
            function(start, end) {
                $("#daterangepicker2 span").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));
            });

        // Define Functions...

        var container = $("#server-load");

        // Determine how many data points to keep based on the placeholder's initial size;
        // this gives us a nice high-res plot while avoiding more than one point per pixel.

        var maximum = container.outerWidth() / 2 || 300;
        var data = [];

        // Flot...
        $rootScope.randValue = function() {
            return (Math.floor(Math.random() * (2)));
        };
        $rootScope.showTooltip = function(x, y, contents) {
            $("<div id=\"tooltip\" class=\"tooltip top in\"><div class=\"tooltip-inner\">" + contents + "<\/div><\/div>").css({
                display: "none",
                top: y - 40,
                left: x - 55
            }).appendTo("body").fadeIn(200);
        };
        $rootScope.getRandomData = function() {
            if (data.length) {
                data = data.slice(1);
            }

            while (data.length < maximum) {
                var previous = data.length ? data[data.length - 1] : 50;
                var y = previous + Math.random() * 10 - 5;
                data.push(y < 0 ? 0 : y > 100 ? 100 : y);
            }

            // zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]]);
            }
            return res;
        };
        try {
            //Easy Pie Chart
            $(".easypiechart#returningvisits").easyPieChart({
                barColor: "#85c744",
                trackColor: "#edeef0",
                scaleColor: "#d2d3d6",
                scaleLength: 5,
                lineCap: "square",
                lineWidth: 2,
                size: 90,
                onStep: function(from, to, percent) {
                    $(this.el).find(".percent").text(Math.round(percent));
                }
            });

            $(".easypiechart#newvisitor").easyPieChart({
                barColor: "#f39c12",
                trackColor: "#edeef0",
                scaleColor: "#d2d3d6",
                scaleLength: 5,
                lineCap: "square",
                lineWidth: 2,
                size: 90,
                onStep: function(from, to, percent) {
                    $(this.el).find(".percent").text(Math.round(percent));
                }
            });

            $(".easypiechart#clickrate").easyPieChart({
                barColor: "#e73c3c",
                trackColor: "#edeef0",
                scaleColor: "#d2d3d6",
                scaleLength: 5,
                lineCap: "square",
                lineWidth: 2,
                size: 90,
                onStep: function(from, to, percent) {
                    $(this.el).find(".percent").text(Math.round(percent));
                }
            });

            $("#updatePieCharts").on("click", function() {
                $(".easypiechart#returningvisits").data("easyPieChart").update(Math.random() * 100);
                $(".easypiechart#newvisitor").data("easyPieChart").update(Math.random() * 100);
                $(".easypiechart#clickrate").data("easyPieChart").update(Math.random() * 100);
                return false;
            });
        } catch (e) {
        }

        //Date Range Picker
        $("#daterangepicker2").daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract("days", 1), moment().subtract("days", 1)],
                    'Last 7 Days': [moment().subtract("days", 6), moment()],
                    'Last 30 Days': [moment().subtract("days", 29), moment()],
                    'This Month': [moment().startOf("month"), moment().endOf("month")],
                    'Last Month': [moment().subtract("month", 1).startOf("month"), moment().subtract("month", 1).endOf("month")]
                },
                opens: "left",
                startDate: moment().subtract("days", 29),
                endDate: moment()
            },
            function(start, end) {
                $("#daterangepicker2 span").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));
            }
        );

        //Sparklines

        $("#indexinfocomments").sparkline([12 + $rootScope.randValue(), 8 + $rootScope.randValue(), 10 + $rootScope.randValue(), 21 + $rootScope.randValue(), 16 + $rootScope.randValue(), 9 + $rootScope.randValue(), 15 + $rootScope.randValue(), 8 + $rootScope.randValue(), 10 + $rootScope.randValue(), 19 + $rootScope.randValue()], {
            type: "bar",
            barColor: "#f1948a",
            height: "45",
            barWidth: 7
        });

        $("#indexinfolikes").sparkline([120 + $rootScope.randValue(), 87 + $rootScope.randValue(), 108 + $rootScope.randValue(), 121 + $rootScope.randValue(), 85 + $rootScope.randValue(), 95 + $rootScope.randValue(), 185 + $rootScope.randValue(), 125 + $rootScope.randValue(), 154 + $rootScope.randValue(), 109 + $rootScope.randValue()], {
            type: "bar",
            barColor: "#f5c783",
            height: "45",
            barWidth: 7
        });

        $("#indexvisits").sparkline([7914 + $rootScope.randValue(), 2795 + $rootScope.randValue(), 3256 + $rootScope.randValue(), 3018 + $rootScope.randValue(), 2832 + $rootScope.randValue(), 5261 + $rootScope.randValue(), 6573 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#556b8d",
            fillColor: "rgba(85,107,141,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#556b8d",
            spotRadius: 3,
            maxSpotColor: false
        });

        $("#indexpageviews").sparkline([8263 + $rootScope.randValue(), 6314 + $rootScope.randValue(), 10467 + $rootScope.randValue(), 12123 + $rootScope.randValue(), 11125 + $rootScope.randValue(), 13414 + $rootScope.randValue(), 15519 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#4f8edc",
            fillColor: "rgba(79,142,220,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#4f8edc",
            spotRadius: 3,
            maxSpotColor: false
        });

        $("#indexpagesvisit").sparkline([7.41 + $rootScope.randValue(), 6.12 + $rootScope.randValue(), 6.8 + $rootScope.randValue(), 5.21 + $rootScope.randValue(), 6.15 + $rootScope.randValue(), 7.14 + $rootScope.randValue(), 6.19 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#a6b0c2",
            fillColor: "rgba(166,176,194,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#a6b0c2",
            spotRadius: 3,
            maxSpotColor: false
        });

        $("#indexavgvisit").sparkline([5.31 + $rootScope.randValue(), 2.18 + $rootScope.randValue(), 1.06 + $rootScope.randValue(), 3.42 + $rootScope.randValue(), 2.51 + $rootScope.randValue(), 1.45 + $rootScope.randValue(), 4.01 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#85c744",
            fillColor: "rgba(133,199,68,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#85c744",
            spotRadius: 3,
            maxSpotColor: false
        });

        $("#indexnewvisits").sparkline([70.14 + $rootScope.randValue(), 72.95 + $rootScope.randValue(), 77.56 + $rootScope.randValue(), 78.18 + $rootScope.randValue(), 76.32 + $rootScope.randValue(), 73.61 + $rootScope.randValue(), 74.73 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#efa131",
            fillColor: "rgba(239,161,49,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#efa131",
            spotRadius: 3,
            maxSpotColor: false
        });

        $("#indexbouncerate").sparkline([29.14 + $rootScope.randValue(), 27.95 + $rootScope.randValue(), 32.56 + $rootScope.randValue(), 30.18 + $rootScope.randValue(), 28.32 + $rootScope.randValue(), 32.61 + $rootScope.randValue(), 35.73 + $rootScope.randValue()], {
            lineWidth: 1.5,
            type: "line",
            width: "90px",
            height: "45px",
            lineColor: "#e74c3c",
            fillColor: "rgba(231,76,60,0.1)",
            spotColor: false,
            minSpotColor: false,
            highlightLineColor: "#d2d3d6",
            highlightSpotColor: "#e74c3c",
            spotRadius: 3,
            maxSpotColor: false
        });

        //Flot

        var viewcount = [
            [1, 787 + $rootScope.randValue()],
            [2, 740 + $rootScope.randValue()],
            [3, 560 + $rootScope.randValue()],
            [4, 860 + $rootScope.randValue()],
            [5, 750 + $rootScope.randValue()],
            [6, 910 + $rootScope.randValue()],
            [7, 730 + $rootScope.randValue()]
        ];

        var uniqueviews = [
            [1, 179 + $rootScope.randValue()],
            [2, 320 + $rootScope.randValue()],
            [3, 120 + $rootScope.randValue()],
            [4, 400 + $rootScope.randValue()],
            [5, 573 + $rootScope.randValue()],
            [6, 255 + $rootScope.randValue()],
            [7, 366 + $rootScope.randValue()]
        ];

        var usercount = [
            [1, 70 + $rootScope.randValue()],
            [2, 260 + $rootScope.randValue()],
            [3, 30 + $rootScope.randValue()],
            [4, 147 + $rootScope.randValue()],
            [5, 333 + $rootScope.randValue()],
            [6, 155 + $rootScope.randValue()],
            [7, 166 + $rootScope.randValue()]
        ];

        var plotStatistics = $.plot($("#site-statistics"), [
            {
                data: viewcount,
                label: "Chip Extraction"
            }, {
                data: uniqueviews,
                label: "LCD Panel Testing"
            }, {
                data: usercount,
                label: "Laptop Testing"
            }
        ], {
            series: {
                lines: {
                    show: true,
                    lineWidth: 1.5,
                    fill: 0.05
                },
                points: {
                    show: true
                },
                shadowSize: 0
            },
            grid: {
                labelMargin: 10,
                hoverable: true,
                clickable: true,
                borderWidth: 0
            },
            colors: ["#a6b0c2", "#71a5e7", "#aa73c2"],
            xaxis: {
                tickColor: "transparent",
                ticks: [[1, "S"], [2, "M"], [3, "T"], [4, "W"], [5, "T"], [6, "F"], [7, "S"]],
                tickDecimals: 0,
                autoscaleMargin: 0,
                font: {
                    color: "#8c8c8c",
                    size: 12
                }
            },
            yaxis: {
                ticks: 4,
                tickDecimals: 0,
                tickColor: "#e3e4e6",
                font: {
                    color: "#8c8c8c",
                    size: 12
                },
                tickFormatter: function(val, axis) {
                    if (val > 999) {
                        return (val / 1000) + "K";
                    } else {
                        return val;
                    }
                }
            },
            legend: {
                labelBoxBorderColor: "transparent"
            }
        });

        var d1 = [
            [1, 29 + $rootScope.randValue()],
            [2, 62 + $rootScope.randValue()],
            [3, 52 + $rootScope.randValue()],
            [4, 41 + $rootScope.randValue()]
        ];
        var d2 = [
            [1, 36 + $rootScope.randValue()],
            [2, 79 + $rootScope.randValue()],
            [3, 66 + $rootScope.randValue()],
            [4, 24 + $rootScope.randValue()]
        ];

        for (var i = 1; i < 5; i++) {
            d1.push([i, parseInt(Math.random() * 1)]);
            d2.push([i, parseInt(Math.random() * 1)]);
        }

        var ds = new Array();

        ds.push({
            data: d1,
            label: "Budget",
            bars: {
                show: true,
                barWidth: 0.2,
                order: 1
            }
        });
        ds.push({
            data: d2,
            label: "Actual",
            bars: {
                show: true,
                barWidth: 0.2,
                order: 2
            }
        });

        var variance = $.plot($("#budget-variance"), ds, {
            series: {
                bars: {
                    show: true,
                    fill: 0.75,
                    lineWidth: 0
                }
            },
            grid: {
                labelMargin: 10,
                hoverable: true,
                clickable: true,
                tickColor: "#e6e7e8",
                borderWidth: 0
            },
            colors: ["#8D96AF", "#556b8d"],
            xaxis: {
                autoscaleMargin: 0.05,
                tickColor: "transparent",
                ticks: [[1, "Q1"], [2, "Q2"], [3, "Q3"], [4, "Q4"]],
                tickDecimals: 0,
                font: {
                    color: "#8c8c8c",
                    size: 12
                }
            },
            yaxis: {
                ticks: [0, 25, 50, 75, 100],
                font: {
                    color: "#8c8c8c",
                    size: 12
                },
                tickFormatter: function(val, axis) {
                    return "$" + val + "K";
                }
            },
            legend: {
                labelBoxBorderColor: "transparent"
            }
        });

        var previousPoint = null;
        $("#site-statistics").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            if (item) {
                if (previousPoint !== item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    $rootScope.showTooltip(item.pageX, item.pageY - 7, item.series.label + ": " + Math.round(y));
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });

        var previousPointBar = null;
        $("#budget-variance").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            if (item) {
                if (previousPointBar !== item.dataIndex) {
                    previousPointBar = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    $rootScope.showTooltip(item.pageX + 20, item.pageY, item.series.label + ": $" + Math.round(y) + "K");
                }
            } else {
                $("#tooltip").remove();
                previousPointBar = null;
            }
        });

        //

        var series = [
            {
                data: $rootScope.getRandomData()
            }
        ];

        //

        var plot = $.plot(container, series, {
            series: {
                lines: {
                    show: true,
                    lineWidth: 1.5,
                    fill: 0.15
                },
                shadowSize: 0
            },
            grid: {
                labelMargin: 10,
                tickColor: "#e6e7e8",
                borderWidth: 0
            },
            colors: ["#f1c40f"],
            xaxis: {
                tickFormatter: function() {
                    return "";
                },
                tickColor: "transparent"
            },
            yaxis: {
                ticks: 2,
                min: 0,
                max: 100,
                tickFormatter: function(val, axis) {
                    return val + "%";
                },
                font: {
                    color: "#8c8c8c",
                    size: 12
                }
            },
            legend: {
                show: true
            }
        });

        // Update the random dataset at 25FPS for a smoothly-animating chart

        setInterval(function updateRandom() {
            series[0].data = $rootScope.getRandomData();
            plot.setData(series);
            plot.draw();
        }, 40);
    };

    var initializeCalendar = function() {
        var deferred = $q.defer();
        $("#external-events div.external-event").each(function() {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data("eventObject", eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });
        });

        /* initialize the calendar
        -----------------------------------------------------------------*/

        $("#calendar-external").fullCalendar({
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay"
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function(date, allDay) { // this function is called when something is dropped
                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data("eventObject");

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $("#calendar-external").fullCalendar("renderEvent", copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($("#drop-remove").is(":checked")) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            },
            buttonText: {
                prev: "<i class=\"fa fa-angle-left\"></i>",
                next: "<i class=\"fa fa-angle-right\"></i>",
                prevYear: "<i class=\"fa fa-angle-double-left\"></i>", // <<
                nextYear: "<i class=\"fa fa-angle-double-right\"></i>", // >>
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day"
            }
        });

        deferred.resolve();
        return deferred.promise;
    };

    var initializeTags = function(id, tags, callback) {
        //Populate all select boxes with from select#source
        var opts = $("#source").html(), opts2 = "<option></option>" + opts;
        $("select.populate").each(function() {
            var e = $(this);
            e.html(e.hasClass("placeholder") ? opts2 : opts);
        });

        $("#" + id).select2({ width: "resolve", tags: tags }).on("change", function(e) {
            // mostly used event, fired to the original element when the value changes
            console.log(id);
            console.log(callback);
            if (callback) callback(e.val);
        });
    };

    return {
        initializeUi: initializeUi,
        initializeForm: initializeForm,
        clearData: clearData,
        clearDataById: clearDataById,
        initializeData: initializeData,
        initializeDataById: initializeDataById,
        initializeDash: initializeDash,
        initializeCalendar: initializeCalendar,
        initializeTags: initializeTags
    };
};