// JavaScript Document
(function ($) {
    var defaults = {
        afterEvent: $.noop()    //$(this).find(":checkbox"):插件对应的checkbox属性 this：插件对应的选择器单独对象
    };
    $.fn.zl_checkbox = function (options) {
        setOptions(options);
        var opts = getOptions();
        var checkbox_array = $(this);
        checkbox_array.each(function (index, ele) {
            var eleObj,
                eleObj = $(ele);
            eleObj.bind("hover", function () {
            });
            eleObj.unbind("click", methods.obj_click(eleObj)).bind("click", function () {
                methods.obj_click(eleObj);
                !!opts.afterEvent&&opts.afterEvent.call(this,$(this).find(":checkbox"),this);
            })
            //将checkbox组件样式恢复默认
            checkbox_array
                .removeClass("zl_ck_down")
                .addClass("zl_ck_normal");
            //根据checkbox button的选中状态，设置checkbox组件的选中样式。
            $(":checkbox:checked", checkbox_array)
                .parent("div.zl_ck")
                .removeClass("zl_ck_normal")
                .addClass("zl_ck_down");

        })
        return checkbox_array;
    };
    var methods = {
        obj_click: function (eleObj) {
            if (eleObj.hasClass("zl_ck_normal")) {
                eleObj.removeClass("zl_ck_normal");
                eleObj.addClass("zl_ck_down");
            } else if (eleObj.hasClass("zl_ck_down")) {
                eleObj.removeClass("zl_ck_down");
                eleObj.addClass("zl_ck_normal");
            }
        }

    }
    //合并参数
    function setOptions(options) {
        defaults = $.extend({
            afterEvent: $.noop()
        }, options);
        return defaults;
    }

    //得到参数集合
    function getOptions() {
        return defaults;
    }
})(jQuery);