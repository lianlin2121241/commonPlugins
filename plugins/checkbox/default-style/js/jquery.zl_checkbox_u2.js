/*!
 * zl_checkbox
 * 依赖于 jquery.js
 */
(function ($) {
    var zl_checkbox=function(element, option){
        this.element=element;
        this.option=option;
    }
    zl_checkbox.prototype.setState=function(ele){
        var $elePanel=$(ele).closest(".zl_ck");
        $elePanel.removeClass("zl_checkbox_normal zl_checkbox_checked zl_checkbox_normal_disabled zl_checkbox_checked_disabled")
        if($(ele).is(":checked")&&$(ele).is(":disabled")){
            $elePanel.addClass("zl_checkbox_checked_disabled");
        }else if($(ele).is(":checked")&&!$(ele).is(":disabled")){
            $elePanel.addClass("zl_checkbox_checked");
        }else if(!$(ele).is(":checked")&&$(ele).is(":disabled")){
            $elePanel.addClass("zl_checkbox_normal_disabled");
        }else{
            $elePanel.addClass("zl_checkbox_normal");
        }
    }
    zl_checkbox.prototype.init=function(ele){
        var eleObj = $(ele),
            eleId=$(ele).attr("id"),//checkbox的ID
            forEle=eleObj.siblings("label[for="+eleId+"]").addClass("chb_label"),
            //将checkbox上的class和style移植到外层包围元素上
            wrapEle=$("<span class='zl_ck zl_checkbox_normal'></span>")
                .addClass(eleObj.attr("class"))
                .attr("style",eleObj.attr("style"));
        //为空间去掉class和style属性，并添加外层的span标签
        eleObj
            .removeAttr("class style")
            .add(forEle)
            .wrapAll(wrapEle);
        //根据checkbox button的选中状态，设置checkbox组件的选中样式。
        zl_checkbox.prototype.setState(eleObj);
        eleObj.bind("click", function () {
            zl_checkbox.prototype.setState(eleObj);
            //!!opts.afterEvent&&opts.afterEvent.call(this,$(this),$(this).closest(".zl_ck"));
        })
        //监听事件
        eleObj.bind("changeState.zl_checkbox", function (e) {
            zl_checkbox.prototype.setState(this)
        })
    }
    $.fn.zl_checkbox = function (options) {
        var checkbox_array = $(this);
        checkbox_array.each(function (index, ele) {
            var temp_checkbox=new zl_checkbox(ele);
            temp_checkbox.init(ele);
            temp_checkbox.setState(ele);
            //定义事件
            /*var changeDisabled = jQuery.Event( "changeDisabled.zl_checkbox",{
                ele:ele
            });
            //将事件绑定到元素属性
            $(ele).data("data-eventChangeDisabled",changeDisabled);
            temp_checkbox=null;*/
        })
        return checkbox_array;
    };
})(jQuery);
