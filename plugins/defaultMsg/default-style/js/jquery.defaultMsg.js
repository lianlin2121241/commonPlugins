/*!
 * formsStyle
 * 依赖于 jquery.js
 * 		  jquery.ui.position.js
 */
(function ($) {
    $.fn.formsStyle = function (options) {
        var defaults = {
            hasClose: false,                //是否显示关闭按钮
            hasEnter: false,                //是否显示确定按钮
            btnW: 18,                         //按钮宽度
            mg_l:"0px",                      //文字距离左边边距
            enterCallback: $.noop()          //确认回调函数
        };
        setOptions(options);
        this.each(function () {
            var obj = $(this);
            var h = obj.outerHeight();
            var w = obj.outerWidth();
            var p_obj = obj.parent();
            var texts = obj.attr("msg");
            var div_forms = $("<div class='div_forms'/>");
            var i = 0;//按钮个数
            if (defaults.hasClose){
                i++;
            }
            if (defaults.hasEnter){
                i++;
            }
            div_forms.width(w+defaults.btnW*i);
            div_forms.height(h);

            div_forms.prependTo(p_obj);
            var div_text = $("<div class='div_text'/>");
            div_text.attr("msg", texts);
            div_text.text(texts);
            div_text.appendTo(div_forms);
            //根据dom类型来确定提示信息位置
            if ($.nodeName(obj[0], "INPUT")) {
                div_text.css({"top": (h - div_text.outerHeight()) / 2, "left": "2px","marginLeft":defaults.mg_l});
            } else {
                div_text.css({"top": "2px", "left": "2px","marginLeft":defaults.mg_l});
            }
            obj.appendTo(div_forms);

            var btn_empty = $("<span class='btn_empty'></span>");
            var btn_enter = $("<span class='btn_enter'></span>");
            if(defaults.hasClose){
                btn_empty.appendTo(div_forms)
                    .bind("click",function(){
                        $(this).hide();
                        obj.val("").focus();
                    });
                btn_empty.css({"top": (h - div_text.outerHeight()) / 2, "right": defaults.hasEnter?defaults.btnW:"0px"}).hide();
            }
            if(defaults.hasEnter){
                btn_enter.appendTo(div_forms)
                    .bind("click",function(){
                        !!defaults.enterCallback&&defaults.enterCallback.call(obj,obj.val());
                    });
                btn_enter.css({"top": (h - div_text.outerHeight()) / 2, "right": "0px"});
            }



            var currentE = $(".div_text", p_obj);
            //文本框焦点获取
            obj.bind("focus", function (e) {
                currentE.hide();
            });
            //文本框焦点移出
            obj.bind("blur", function (e) {
                if (obj.val() == "") {
                    currentE.show();
                }

            });
            //为搜索联系人绑定删除事件
            obj.bind("input propertychange", function(){
                if($(this).val().length>0){
                    $(this).siblings(".btn_empty").show().css("display","inline-block");
                }else{
                    $(this).siblings(".btn_empty").hide();
                }
            })
            //点击提示文字
            div_text.bind("click", function () {
                obj.focus();
            })

        });

        //合并参数
        function setOptions(options) {
            defaults = $.extend(defaults, options);
            return defaults;
        }

        //得到参数集合
        function getOptions() {
            return defaults;
        }
    };

})(jQuery);