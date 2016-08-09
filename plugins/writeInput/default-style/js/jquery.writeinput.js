/*!
 * writeinput Javascript Library
 * troila.com - v1.0.0 (2016-07-28T10:07:24+0800)
 * http://troila.com/ | Released under MIT license
 *
 * Include jQuery (http://jQuery.com/)
 */
(function ($) {
    var writeinputFun=(function(){
        function writeinput(elem,options){
            this.elem=elem;
            this.settings=$.extend(true, {},$.fn.writeinput.defults,options||{});
            this.init();
        }
        writeinput.prototype={
            init:function(){
                var self=this;
                self.createContainer();
                self.event();
            },
            createContainer:function(){
                var self=this;
                self.elem.addClass("writeinput_panel");
                self.inputPanel=$('<div class="itemWraper"></div>');
                self.inputEle=$('<input type="text" class="inputEle" maxlength="'+self.settings.maxlength+'"/>');
                self.inputSpan=$('<span class="inputSpan"></span>')
                    .css("fontSize",self.inputEle.css("fontSize"))
                    .css("fontFamily",self.inputEle.css("fontFamily"));
                this.initInputEle();
                self.inputEle.add(self.inputSpan).appendTo(self.inputPanel);
                self.elem.append(self.inputPanel);
            },
            initInputEle:function(){
                var self=this;
                self.inputEle.width(this.settings.inputWidth);
            },
            inputPropertyHandle:function(e){
                var self=this;
                self.setInputWidth();
            },
            inputKeyUpHandle:function(e){
                var self=this;
                var textVal=self.getInputVal();
                if(textVal.indexOf(";")<0&& e.keyCode!=13){
                    return;
                }
                var strArray=textVal.split(";");
                if(!strArray[0]){
                    self.clearWritePlugins();
                    return;
                }
                self.clearWritePlugins();
                self.inputEle.focus();
                self.createItem(strArray[0]);
            },
            eleKeyUpHandle:function(e){
                var self=this;
                if((e.keyCode!=8&&e.keyCode!=46)||self.inputEle.is(":focus")){
                    return;
                }
                var $activeItem=$(".enterBlock.active",self.elem);
                if ($activeItem.length==0){
                    return;
                }
                $activeItem.remove();
            },
            clickItemHandle:function(e){
                e.stopPropagation();
                var panel=$(this).parent()
                $(".enterBlock",panel).removeClass("active");
                $(this).addClass("active");
            },
            clickEleHandle:function(e){
                e.stopPropagation();
                var self=this;
                self.inputEle.focus();
            },
            clickDocumentHandle:function(e){
                var self=this;
                $(".enterBlock",self.elem).removeClass("active");
            },
            createItem:function(str){
                var self=this;
                var itemStr='<div class="enterBlock" data-val="'+str+'">'
                                +'<b>'+str+'</b>'
                                +'<span class="semicolon">;</span>'
                            +'</div>'
                var showItem=$(itemStr);
                showItem.insertBefore(self.inputPanel);
                if(!self.validate(str)){
                    showItem.addClass("item-error")
                }
            },
            clearWritePlugins:function(){
                var self=this;
                self.initInputEle();
                self.inputEle.val("")
                self.inputSpan.text("");
            },
            getInputVal:function(){
                var self=this;
                return self.convertEnd(self.inputEle.val());
            },
            setInputWidth:function(){
                var self=this;
                var eleVal=self.getInputVal();
                self.inputSpan.text(eleVal);
                var spanWidth=self.inputSpan.width();
                self.inputEle.width(spanWidth+16);
            },
            convertEnd:function(str){
                str=str.replace(/；/ig,';');
                return str;
            },
            validate:function(str){
                var self=this;
                if(!self.settings.filter){
                    return true
                }
                return self.settings.filter.test(str);
            },
            addData:function(data){
                var self=this;
                var datalen=data.length;
                for(var i=0;i<datalen;i++){
                    self.createItem(data[i]);
                }
            },
            distory:function(){
                var self=this;
                self.elem.off(".writeinputevent");
                $(document).off(".writeinputevent");
                self.elem.empty();
            },
            clear:function(){
                var self=this;
                $(".enterBlock",self.elem).remove();
                self.clearWritePlugins();
            },
            event:function(){
                var self=this;
                self.elem
                    .on("input.writeinputevent property.writeinputevent",self.inputEle,self.inputPropertyHandle.bind(self))
                    .on("keyup.writeinputevent",self.inputEle,self.inputKeyUpHandle.bind(self))
                    .on("click.writeinputevent",".enterBlock",self.clickItemHandle)
                    .on("click.writeinputevent",self.clickEleHandle.bind(self))

                $(document)
                    .on("keyup.writeinputevent",self.elem,self.eleKeyUpHandle.bind(self))
                    .on("click.writeinputevent",self.clickDocumentHandle.bind(self))
            },
        }
        return writeinput;
    })()
    $.fn.writeinput=function(options,data){
        return $(this).each(function(index, el) {
            var elem=$(this),
                writeinput=elem.data("data-writeinput");
            if(!writeinput){
                writeinput=new writeinputFun(elem,options);
                elem.data("data-writeinput",writeinput);
            }
            if(typeof options=="string"){
                return writeinput[options](data);
            }
        });
    }
    $.fn.writeinput.defults={
        inputWidth: 10,
        filter:null,
        maxlength:40
    }
})(jQuery);