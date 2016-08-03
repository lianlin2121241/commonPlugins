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
            var eleObj = $(ele),
                eleId=$(ele).attr("id"),//checkbox的ID
                forEle=eleObj.siblings("[for="+eleId+"]").addClass("chb_label"),
                //将checkbox上的class和style移植到外层包围元素上
                wrapEle=$("<span class='zl_ck zl_ck_normal'></span>")
                    .addClass(eleObj.attr("class"))
                    .attr("style",eleObj.attr("style"));
            //为空间去掉class和style属性，并添加外层的span标签
            eleObj
                .removeAttr("class style")
                .add(forEle)
                .wrapAll(wrapEle);
            //根据checkbox button的选中状态，设置checkbox组件的选中样式。
            if($(eleObj).is(":checked")){
                $(eleObj).closest(".zl_ck")
                    .removeClass("zl_ck_normal")
                    .addClass("zl_ck_down");
            }
            eleObj.bind("click", function () {
                methods.obj_click(eleObj);
                !!opts.afterEvent&&opts.afterEvent.call(this,$(this),$(this).closest(".zl_ck"));
            })

        })
        function updateState(){
            checkbox_array.each(function (index, ele) {
                methods.obj_click(eleObj);
            })
        }
        return checkbox_array;
    };
    var methods = {
        obj_click: function (eleObj) {
            var chbPanel=eleObj.closest(".zl_ck");
            if (eleObj.is(":checked")) {
                chbPanel.removeClass("zl_ck_normal");
                chbPanel.addClass("zl_ck_down");
            } else{
                chbPanel.removeClass("zl_ck_down");
                chbPanel.addClass("zl_ck_normal");
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