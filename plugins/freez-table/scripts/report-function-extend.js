(function () {
    $.freezeTable = $.freezeTable || {};
    $.extend($.freezeTable, {
        version: "0.0.2",
        getMethod: function (name) {
            return this.getAccessor($.fn.freezeTable, name);
        },
        getAccessor: function (obj, expr) {
            var ret, p, prm = [], i;
            if (typeof expr === 'function') {
                return expr(obj);
            }
            ret = obj[expr];
            if (ret === undefined) {
                try {
                    if (typeof expr === 'string') {
                        prm = expr.split('.');
                    }
                    i = prm.length;
                    if (i) {
                        ret = obj;
                        while (ret && i--) {
                            p = prm.shift();
                            ret = ret[p];
                        }
                    }
                } catch (e) {
                }
            }
            return ret;
        },
        extend : function(methods) {
            $.extend($.fn.freezeTable,methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    })


    $.fn.freezeTable = function (options) {
        if (typeof options === 'string') {
            var fn = $.freezeTable.getMethod(options);
            if (!fn) {
                throw ("freezeTable - No such method: " + options);
            }
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args);
        }

        var defaults = {
            freezeRowNum: 0,
            freezeColumnNum: 0,
            width: 0,
            height: 0
        };
        setOptions(options);

        var that = $(this);

        $.each(that, function () {
            if (defaults.freezeRowNum != 0 || defaults.freezeColumnNum != 0) {
                freezeTable($(this), defaults.freezeRowNum, defaults.freezeColumnNum, defaults.width, defaults.height);
            }


            /*
             * 调整锁定表的宽度和高度，这个函数在resize事件中调用
             *
             * 参数定义
             * 	table - 要锁定的表格元素或者表格ID
             * 	width - 表格的滚动区域宽度
             * 	height - 表格的滚动区域高度
             */
            $(this).data("resizeTable", function (width, height) {
                var tableId = $(this).attr('id');
                /*var tableId;
                 if (typeof(table) == 'string')
                 tableId = table;
                 else
                 tableId = table.attr('id');*/

                $("#" + tableId + "_tableLayout").width(width).height(height);
                $("#" + tableId + "_tableHead").width(width - 17);
                $("#" + tableId + "_tableColumn").height(height - 17);
                $("#" + tableId + "_tableData").width(width).height(height);
            })
        })

        /*
         * 锁定表头和列
         *
         * 参数定义
         * 	table - 要锁定的表格元素或者表格ID
         * 	freezeRowNum - 要锁定的前几行行数，如果行不锁定，则设置为0
         * 	freezeColumnNum - 要锁定的前几列列数，如果列不锁定，则设置为0
         * 	width - 表格的滚动区域宽度
         * 	height - 表格的滚动区域高度
         */
        function freezeTable(table, freezeRowNum, freezeColumnNum, width, height) {
            if (typeof(freezeRowNum) == 'string')
                freezeRowNum = parseInt(freezeRowNum)

            if (typeof(freezeColumnNum) == 'string')
                freezeColumnNum = parseInt(freezeColumnNum)

            var tableId;
            if (typeof(table) == 'string') {
                tableId = table;
                table = $('#' + tableId);
            } else {
                tableId = table.attr('id');
            }

            var divTableLayout = $("#" + tableId + "_tableLayout");

            if (divTableLayout.length != 0) {
                divTableLayout.before(table);
                divTableLayout.empty();
            } else {
                table.after("<div id='" + tableId + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");

                divTableLayout = $("#" + tableId + "_tableLayout");
            }

            var html = '';
            if (freezeRowNum > 0 && freezeColumnNum > 0)
                html += '<div id="' + tableId + '_tableFix" style="padding: 0px;"></div>';

            if (freezeRowNum > 0)
                html += '<div id="' + tableId + '_tableHead" style="padding: 0px;"></div>';

            if (freezeColumnNum > 0)
                html += '<div id="' + tableId + '_tableColumn" style="padding: 0px;"></div>';

            html += '<div id="' + tableId + '_tableData" style="padding: 0px;"></div>';


            $(html).appendTo("#" + tableId + "_tableLayout");

            var divTableFix = freezeRowNum > 0 && freezeColumnNum > 0 ? $("#" + tableId + "_tableFix") : null;
            var divTableHead = freezeRowNum > 0 ? $("#" + tableId + "_tableHead") : null;
            var divTableColumn = freezeColumnNum > 0 ? $("#" + tableId + "_tableColumn") : null;
            var divTableData = $("#" + tableId + "_tableData");

            divTableData.append(table);

            if (divTableFix != null) {
                var tableFixClone = table.clone(true);
                tableFixClone.attr("id", tableId + "_tableFixClone");
                divTableFix.append(tableFixClone);
            }

            if (divTableHead != null) {
                var tableHeadClone = table.clone(true);
                tableHeadClone.attr("id", tableId + "_tableHeadClone");
                divTableHead.append(tableHeadClone);
            }

            if (divTableColumn != null) {
                var tableColumnClone = table.clone(true);
                tableColumnClone.attr("id", tableId + "_tableColumnClone");
                divTableColumn.append(tableColumnClone);
            }

            $("#" + tableId + "_tableLayout table").css("margin", "0");

            if (freezeRowNum > 0) {
                var HeadHeight = 0;
                var ignoreRowNum = 0;
                $("#" + tableId + "_tableHead tr:lt(" + freezeRowNum + ")").each(function () {
                    if (ignoreRowNum > 0)
                        ignoreRowNum--;
                    else {
                        var td = $(this).find('td:first, th:first');
                        HeadHeight += td.outerHeight(true);

                        ignoreRowNum = td.attr('rowSpan');
                        if (typeof(ignoreRowNum) == 'undefined')
                            ignoreRowNum = 0;
                        else
                            ignoreRowNum = parseInt(ignoreRowNum) - 1;
                    }
                });
                HeadHeight += 2;

                divTableHead.css("height", HeadHeight);
                divTableFix != null && divTableFix.css("height", HeadHeight);
            }

            if (freezeColumnNum > 0) {
                var ColumnsWidth = 0;
                var ColumnsNumber = 0;
                $("#" + tableId + "_tableColumn tr:eq(" + freezeRowNum + ")").find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")").each(function () {
                    if (ColumnsNumber >= freezeColumnNum)
                        return;

                    ColumnsWidth += $(this).outerWidth(true);

                    ColumnsNumber += $(this).attr('colSpan') ? parseInt($(this).attr('colSpan')) : 1;
                });
                ColumnsWidth += 2;

                divTableColumn.css("width", ColumnsWidth);
                divTableFix != null && divTableFix.css("width", ColumnsWidth);
            }

            divTableData.scroll(function () {
                divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());

                divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
            });

            divTableData.css({"overflow": "auto", "width": width, "height": height, "position": "absolute"});
            divTableFix != null && divTableFix.css({"overflow": "hidden", "position": "absolute", "z-index": "50"});
            divTableHead != null && divTableHead.css({
                "overflow": "hidden",
                "width": divTableData[0].offsetHeight < divTableData[0].scrollHeight?width - 16:width,
                "position": "absolute",
                "z-index": "45"
            });
            divTableColumn != null && divTableColumn.css({
                "overflow": "hidden",
                "height":divTableData[0].offsetWidth < divTableData[0].scrollWidth?height - 16:height,
                "position": "absolute",
                "z-index": "40"
            });

            /*divTableFix != null && divTableFix.offset(divTableLayout.offset());
             divTableHead != null && divTableHead.offset(divTableLayout.offset());
             divTableColumn != null && divTableColumn.offset(divTableLayout.offset());
             divTableData.offset(divTableLayout.offset());*/
        }


        function setOptions(options) {
            defaults = $.extend(defaults, options);
            return defaults;
        }


        function getOptions() {
            return defaults;
        }

        return that;
    };


    $.freezeTable.extend({
        reloadTable:function () {
            var tableId;
            var table=$(this);
            if (typeof(table) == 'string') {
                tableId = table;
                table = $('#' + tableId);
            } else {
                tableId = table.attr('id');
            }



            var divTableFix =!!$("#" + tableId + "_tableFix")&&$("#" + tableId + "_tableFix").length>0?$("#" + tableId + "_tableFix"):null;
            var divTableHead = !!$("#" + tableId + "_tableHead")&&$("#" + tableId + "_tableHead").length>0?$("#" + tableId + "_tableHead") : null;
            var divTableColumn =!!$("#" + tableId + "_tableColumn")&&$("#" + tableId + "_tableColumn").length?$("#" + tableId + "_tableColumn"): null;
            var divTableData = $("#" + tableId + "_tableData");


            if (divTableFix != null) {
                var tableFixClone = table.clone(true);
                tableFixClone.attr("id", tableId + "_tableFixClone");
                divTableFix.empty().append(tableFixClone);
            }

            if (divTableHead != null) {
                var tableHeadClone = table.clone(true);
                tableHeadClone.attr("id", tableId + "_tableHeadClone");
                divTableHead.empty().append(tableHeadClone);
            }

            if (divTableColumn != null) {
                var tableColumnClone = table.clone(true);
                tableColumnClone.attr("id", tableId + "_tableColumnClone");
                divTableColumn.empty().append(tableColumnClone);
            }


            divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());
            divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
        }
    })
})(jQuery)