/*!
 * animateTip
 * 依赖于 jquery.js
 * 		  jquery.ui.position.js
 */
(function ($) {
    $.fn.zl_select = function (options) {
        var defaults = {
            w: 200,                                 //控件宽度
            h: 26,                                  //控件高度
            items_w: null,                        //显示列表宽度
            items_h: null,                        //显示列表高度
            selectDropPanel:"",                  //下拉显示列表显示位置
            disabledClickCallback: $.noop(),    //禁用时点击事件回调
            completeCallback:$.noop()            //加载完成时回调
        };
        setOptions(options);
        var opts = [];
        var objArray = $(this);
        objArray.each(function (index, ele) {
            //避免重复应用组件样式
            if ($(this).hasClass("zl_select_ele")) {
                return true;
            }
            var obj = $(this).addClass("zl_select_ele");
            var drop, items, container;
            container = $("<a class='select-container' onclick='return false;' href='#' tabindex='-1' />");
            var content = $("<span />");
            var icon = $("<div />");
            content.appendTo(container);
            icon.appendTo(container);
            container.width((getOptions().w||obj.width())-14-2)
                .height(getOptions().h||obj.height())
                .css("line-height", (getOptions().h||obj.height()) + "px");
            if(obj.prop("disabled")){
                container.addClass("disabled");
            }
            obj.wrap($("<div class='zl_select'></div>").css("display", "inline-block"));
            var selectPanel = obj.closest(".zl_select");
            container.appendTo(selectPanel)
            var iconw = icon.outerWidth();
            //内容区宽度
            //10是container的内边距和边框宽度之和。
            content.width(container.width() - iconw);
            obj.hide();

            drop = $("<div class='select-drop' />");
            items = $("<ul class='items' />");
            items.appendTo(drop);
            drop.appendTo(!!defaults.selectDropPanel?defaults.selectDropPanel:selectPanel)
                .width(!!getOptions().items_w ? getOptions().items_w : container.innerWidth());
            if (getOptions().items_h) {
                drop.height(getOptions().items_h)
            }
            //修改样式回调
            !!defaults.completeCallback&&defaults.completeCallback(obj);
            var selectEle = obj;
            _init_item({
                selectEle: selectEle,
                container: container,
                items: items,
                drop: drop
            })

            //当select元素触发change时，select组件自动变更值。
            $(obj).delegate(selectEle, "change", function (e) {
                var cv = $(selectEle).val();
                /*var items = $(this).closest(".zl_select").find(".item"),
                 container = $(this).closest(".zl_select").find(".select-container"),
                 items = $(this).closest(".zl_select").find(".items");*/
                $("li", items).each(function (i, ele) {
                    var v = $(ele).attr("v");
                    if (cv == v) {
                        $(">span", container).text($(ele).text());
                        $("li", items).removeClass("down");
                        $(ele).addClass("down");
                        return false;
                    }
                })
            })

            var positionUsing=function(position, feedback){
                $( this ).css( position );
                container.css({
                    "borderColor":"#00c9c7"
                })
                if(feedback.vertical=="bottom"){
                    $(this).css({
                        "borderTopLeftRadius":"12px",
                        "borderTopRightRadius":"12px",
                        "borderBottom":"none",
                        "borderBottomLeftRadius":"0px",
                        "borderBottomRightRadius":"0px",
                        "borderTop":"1px solid #00c9c7"
                    })

                    container.css({
                        "borderTopLeftRadius":"0px",
                        "borderTopRightRadius":"0px",
                        "borderBottom":"1px solid #00c9c7",
                        "borderBottomLeftRadius":"12px",
                        "borderBottomRightRadius":"12px",
                        "borderTop":"none"
                    })
                }else if(feedback.vertical=="top"){
                    $(this).css({
                        "borderTopLeftRadius":"0px",
                        "borderTopRightRadius":"0px",
                        "borderBottom":"1px solid #00c9c7",
                        "borderBottomLeftRadius":"12px",
                        "borderBottomRightRadius":"12px",
                        "borderTop":"none"
                    })

                    container.css({
                        "borderTopLeftRadius":"12px",
                        "borderTopRightRadius":"12px",
                        "borderBottom":"none",
                        "borderBottomLeftRadius":"0px",
                        "borderBottomRightRadius":"0px",
                        "borderTop":"1px solid #00c9c7"
                    })
                }
            }
            //select组件内容框绑定事件。
            container.on("click", function (e) {
                //var drop=$(this).siblings(".select-drop");
                e.stopPropagation();
                if($(this).hasClass("disabled")){
                    !!defaults.disabledClickCallback&&defaults.disabledClickCallback.call($(this));
                    return false;
                }
                if (drop.is(":hidden")) {
                    $(".select-drop").hide();
                    $(".select-container").css({
                        "borderTopLeftRadius":"12px",
                        "borderTopRightRadius":"12px",
                        "borderBottom":"1px solid #999999",
                        "borderBottomLeftRadius":"12px",
                        "borderBottomRightRadius":"12px",
                        "borderTop":"1px solid #999999",
                        "borderColor":"#999999"
                    })
                    drop.show()
                        .position({
                            my: "left top-1",
                            at: "left bottom",
                            of: $(this),
                            using:positionUsing
                        });
                    //内容区宽度
                    //content.width(getOptions().w - 10 - iconw);
                    //触发body,隐藏select组件下拉项。
                    $("body").on("click", function (e) {
                        var evt = e.target;
                        //点击事件触发元素是select组件内容框时，不隐藏select组件下拉项。
                        if ($(evt).closest("a.select-container").length == 0) {
                            drop.hide();
                            container.css({
                                "borderColor":"#999999"
                            })
                            container.css({
                                "borderTopLeftRadius":"12px",
                                "borderTopRightRadius":"12px",
                                "borderBottom":"1px solid #999999",
                                "borderBottomLeftRadius":"12px",
                                "borderBottomRightRadius":"12px",
                                "borderTop":"1px solid #999999"
                            })
                            $(document).undelegate("body", "click");
                        }
                    })
                } else {
                    drop.hide();
                    container.css({
                        "borderColor":"#999999"
                    })
                    container.css({
                        "borderTopLeftRadius":"12px",
                        "borderTopRightRadius":"12px",
                        "borderBottom":"1px solid #999999",
                        "borderBottomLeftRadius":"12px",
                        "borderBottomRightRadius":"12px",
                        "borderTop":"1px solid #999999"
                    })
                }
            })
        })
        //当select下拉选项集合有改变时，组件下拉需要重新获取新的集合。
        objArray.reloadData = function (obj) {
            var eleObjs = !!obj ? obj : objArray;
            $.each(eleObjs, function (index, ele) {
                var that = $(this),
                    selectPanel = $(this).closest(".zl_select"),
                    items = selectPanel.find(".items"),
                    container = selectPanel.find(".select-container"),
                    selectEle = selectPanel.find("select"),
                    drop = selectPanel.find(".select-drop");
                _init_item({
                    selectEle: selectEle,
                    container: container,
                    items: items,
                    drop: drop
                })
            })
        }

        function _item_click(o, selectEle, container, txt, items, drop) {
            o.bind("click", function () {
                var v = o.attr("v");
                selectEle.val(v);
                $(">span", container).text(txt);
                $("li", items).removeClass("down");
                o.addClass("down");
                drop.hide();
                //触发select的change事件
                selectEle.trigger("change");
            })

        }

        function _item_hover(o) {
            o.hover(function () {
                    $(this).addClass("over");
                },
                function () {
                    $(this).removeClass("over");
                })
        }

        function _init_item(o) {
            var prams = $.extend({
                selectEle: null,
                container: null,
                items: null,
                drop: null
            }, o)
            var selectEle, opts, copt, cv;
            prams.items.empty();
            selectEle = prams.selectEle;
            opts = selectEle.find("option");
            //初始化时，select元素的当前值。
            copt = selectEle.find("option:selected");
            cv = copt.attr("value");
            //分解select元素项，构建select组件结构。
            opts.each(function (i, d) {
                var o = $("<li />");
                o.appendTo(prams.items);
                var txt = $(d).text();
                var val = $(d).attr("value");
                o.text(txt);
                o.attr("v", val);

                if (cv == val) {
                    //设置默认当前值
                    $(">span", prams.container).text(txt);
                    $("li", prams.items).removeClass("down");
                    o.addClass("down");
                }

                //select组件item项绑定事件。
                _item_click(o, prams.selectEle, prams.container, txt, prams.items, prams.drop);
                _item_hover(o);
            })
        }

        //合并参数
        function setOptions(options) {
            defaults = $.extend(defaults, options);
            return defaults;
        }

        //得到参数集合
        function getOptions() {
            return defaults;
        }

        return objArray;
    };
})(jQuery);