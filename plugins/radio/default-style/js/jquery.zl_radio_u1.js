/*!
 * zl_radio
 * ÒÀÀµÓÚ jquery.js
 */
(function ($) {
    var zl_radio=function(element, option){
        this.element=element;
        this.option=option;
    }
    zl_radio.prototype.setState=function(ele){
        var $elePanel=$(ele).closest(".radio_label");
        $elePanel.removeClass("radio_normal radio_down radio_disabled")
        if($(ele).is(":disabled")){
            $elePanel.addClass("radio_disabled");
        }else if($(ele).is(":checked")){
            $elePanel.addClass("radio_down");
        }else{
            $elePanel.addClass("radio_normal");
        }
    }
    zl_radio.prototype.init=function(ele){
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
        icon_i=$("<i class='icon_radio'></i>").prependTo(panel);
        eleObj.addClass("radio_ele");
        panel.addClass("radio_label");
        zl_radio.prototype.setState(eleObj);
        eleObj.bind("click", function () {
            var eleName = eleObj.attr("name");
            $.each($("[name="+eleName+"]"),function(index,eleObj){
                zl_radio.prototype.setState(eleObj);
            })
        })
        //¼àÌýÊÂ¼þ
        eleObj.bind("changeState.zl_radio", function (e) {
            zl_radio.prototype.setState(this)
        })
    }
    $.fn.zl_radio = function () {
        var radio_array = $(this);
        radio_array.each(function (index, ele) {
            var temp_radio=new zl_radio(ele);
            temp_radio.init(ele);
            temp_radio.setState(ele);
        })
        return radio_array;
    };
    var methods = {}
})(jQuery);