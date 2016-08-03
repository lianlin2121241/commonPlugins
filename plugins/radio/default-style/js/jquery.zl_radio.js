/*!
 * zl_radio
 * 依赖于 jquery.js
 */
(function ($) {
    var zl_radio=function(element, option){
        this.element=element;
        this.option=option;
    }
    zl_radio.prototype.setState=function(ele){
        if($(":radio",ele).is(":disabled")){
            $(ele).removeClass("zl_radio_normal zl_radio_down").addClass("zl_radio_disabled");
        }else if($(":radio",ele).is(":checked")){
            $(ele).removeClass("zl_radio_normal zl_radio_disabled").addClass("zl_radio_down");
        }else{
            $(ele).removeClass("zl_radio_down zl_radio_disabled").addClass("zl_radio_normal");
        }
    }
    zl_radio.prototype.init=function(ele){
        var eleObj,
            eleName;
        eleObj = $(ele);
        eleName = eleObj.attr("name");
        eleObj.bind("hover", function () {
        }, function () {
        });
        eleObj.bind("click", function () {
            if($(this).find(":radio").is(":disabled")){
                return;
            }
            $("div.zl_radio[name=" + eleName + "]").removeClass("zl_radio_down");
            $("div.zl_radio[name=" + eleName + "]").addClass("zl_radio_normal");
            eleObj.addClass("zl_radio_down");
        })
        //监听事件
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
            //定义事件
            /*var changeDisabled = jQuery.Event( "changeDisabled.zl_radio",{
                ele:ele
            });
            //将事件绑定到元素属性
            $(ele).data("data-eventChangeDisabled",changeDisabled);*/

        })
        return radio_array;
    };
    var methods = {}
})(jQuery);