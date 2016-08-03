/*!
 * zl_checkbox
 * ÒÀÀµÓÚ jquery.js
 */
(function ($) {
    var zl_checkbox=function(element, option){
        this.element=element;
        this.option=option;
    }
    zl_checkbox.prototype.setState=function(ele){
        var $elePanel=$(ele).closest(".check_label");
        $elePanel.removeClass("checkbox_normal checkbox_checked checkbox_normal_disabled checkbox_checked_disabled")
        if($(ele).is(":checked")&&$(ele).is(":disabled")){
            $elePanel.addClass("checkbox_checked_disabled");
        }else if($(ele).is(":checked")&&!$(ele).is(":disabled")){
            $elePanel.addClass("checkbox_checked");
        }else if(!$(ele).is(":checked")&&$(ele).is(":disabled")){
            $elePanel.addClass("checkbox_normal_disabled");
        }else{
            $elePanel.addClass("checkbox_normal");
        }
    }
    zl_checkbox.prototype.init=function(ele){
        var eleObj = $(ele),
            eleParent=eleObj.parent(),
            panel=null,
            icon_i=null;
        if(!$.nodeName(eleParent[0],"LABEL")){
            eleObj.wrap("<label></label>");
            panel=eleObj.closest("label");
        }else{
            panel=eleParent;
        }
        icon_i=$("<i class='icon_checkbox'></i>").prependTo(panel);
        eleObj.addClass("check_ele");
        panel.addClass("check_label");
        zl_checkbox.prototype.setState(eleObj);
        eleObj.bind("click", function () {
            zl_checkbox.prototype.setState(eleObj);
        })
        //¼àÌýÊÂ¼þ
        eleObj.bind("changeState.zl_checkbox", function (e) {
            zl_checkbox.prototype.setState(this)
        })
    }
    $.fn.zl_checkbox = function (options) {
        var checkbox_array = $(this);
        checkbox_array.each(function (index, ele) {
            var temp_checkbox=new zl_checkbox(ele);
            temp_checkbox.init(ele);
        })
        return checkbox_array;
    };
})(jQuery);
