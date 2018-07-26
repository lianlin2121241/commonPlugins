(function ($) {
    function timeSelect(options, dom) {
        this.settings = $.extend(true, {}, $.fn.timeSelect.defults, options || {});
        this.data = this.settings.data;
        this.html = dom;
        this.dataLength = this.data.length;
        this.isMousedown=false;
        if (!this.validateData(this.data)) {
            return;
        }
        
        this.currentIndex = 0;  //当前轴所在索引
        this.currentValue = this.data[this.currentIndex]; //当前轴所在的值

        this.init();
        this.bindEvent();
    }
    timeSelect.prototype = {
        //初始化
        init:function(){
            this.pointList = [];  //轴节点比例
            this.middlePointList = [];    //轴节点中点比例
            this.setPointList();
            this.setMiddlePointList();
            this.render();
            this.timeSelectLineDom = $(".time-select-line", this.html); //事件轴dom
            this.lineWidth = this.timeSelectLineDom.width();    //事件轴长度
            this.lineBox = this.timeSelectLineDom[0].getBoundingClientRect();   //获取时间轴的位置信息
            this.initSite();
    
            //如果能够播放
            if(this.settings.canPlay){
                //如果能够自动播放
                if(this.settings.isAutoPlay){
                    this.play();
                }
                this.appendPlayButton();
            }
        },
        //设置轴节点比例
        setPointList: function () {
            var step = 100 / (this.dataLength-1);
            this.pointList.push(0);
            for (var i = 1, len = this.dataLength - 1; i < len; i++) {
                this.pointList.push(step * i);
            }
            this.pointList.push(100);
        },
        //设置轴节点中点比例
        setMiddlePointList: function () {
            this.middlePointList.push(0);
            for (var i = 0, len = this.pointList.length - 1; i < len; i++) {
                this.middlePointList.push((this.pointList[i] + this.pointList[i + 1]) / 2);
            }
            this.middlePointList.push(100);
        },
        //根据所在比例获取当前索引和值
        getIndexValueBySite: function (site) {
            for (var i = 0, len = this.middlePointList.length - 1; i < len; i++) {
                if ((site >= this.middlePointList[i] && site < this.middlePointList[i + 1]) || (i === (len - 1) && site === 100)) {
                    return {
                        index: i,
                        value: this.data[i]
                    }
                }
            }
        },
        //渲染时间轴
        render: function () {
            var htmlArr = [];
            htmlArr.push('<div class="time-select-warp">');
            htmlArr.push('    <div class="time-select-line">');
            htmlArr.push('        <div class="time-select-line-plan">');
            htmlArr.push('            <span class="time-select-line-plan-point">');
            htmlArr.push('                <span class="time-select-line-plan-tip">');
            htmlArr.push('                    <span class="time-select-line-plan-tip-text">'+this.data[0]+'</span>');
            htmlArr.push('                    <span class="time-select-line-plan-tip-arraw"></span>');
            htmlArr.push('                </span>');
            htmlArr.push('            </span>');
            htmlArr.push('        </div>');
            htmlArr.push('    </div>');
            htmlArr.push('    <div class="time-select-mark">');
            htmlArr.push('        <span class="time-select-mark-end">' + this.data[this.dataLength - 1] + '</span>');
            htmlArr.push('        <span class="time-select-mark-begin">' + this.data[0] + '</span>');
            htmlArr.push('    </div>');
            htmlArr.push('</div>');
            this.html.html(htmlArr.join(""));
        },
        //获取鼠标移上时标记
        getMouseMarkHtml:function(){
            var htmlArr = [];
            htmlArr.push('<span class="time-select-line-mousemark">');
            htmlArr.push('    <span class="time-select-line-mousemark-text"></span>');
            htmlArr.push('</span>');
            return htmlArr.join("");
        },
        //事件绑定
        bindEvent: function () {
            var self = this;
            this.html
                //播放按钮点击
                .on("click", ".tubiaobtn", function (e) {
                    if($(this).hasClass("fa-pause-circle")){
                        self.stop();
                    }else{
                        var linePlanWidth=$(".time-select-line-plan",self.html).width();
                        if(linePlanWidth>=self.lineWidth){
                            $(".time-select-line-plan",self.html).width(0);
                        }
                        $(this).removeClass("fa-play-circle").addClass("fa-pause-circle");
                        self.play();
                    }
                })
                //时间轴点击
                .on("click", ".time-select-line", function (e) {
                    self.stop();
                    var mouseSite = self.correction0100((e.clientX - self.lineBox.left) / self.lineWidth * 100);
                    self.setIndexValue(mouseSite,true);
                })
                //时间点鼠标点击事件
                .on("mousedown", ".time-select-line-plan-point", function (e) {
                    e.stopPropagation();
                    self.stop();
                    self.isMousedown=true;
                    $(".time-select-line-mousemark",self.html).remove();
                    $(document).on("mousemove.timeSelect", function (e) {
                        var mouseSite = self.correction0100((e.clientX - self.lineBox.left) / self.lineWidth * 100);
                        self.setIndexValue(mouseSite,true);
                    })
                    $(document).on("mouseup.timeSelect", function (e) {
                        e.stopPropagation();
                        self.isMousedown=false;
                        $(document).off(".timeSelect");
                    })
                })
                //鼠标移动
                .on("mousemove",".time-select-line",function(e){
                    if(self.isMousedown){
                        return;
                    }
                    var mousemarkDom=$(".time-select-line-mousemark",self.html);
                    if(mousemarkDom.length==0){
                        $(".time-select-line",self.html).append(self.getMouseMarkHtml());
                    }
                    var mouseSite = self.correction0100((e.clientX - self.lineBox.left) / self.lineWidth * 100);
                    var indexValueObj = self.getIndexValueBySite(mouseSite);
                    $(".time-select-line-mousemark-text",self.html).html(indexValueObj.value);
                    $(".time-select-line-mousemark",self.html).css({left:mouseSite+"%"});
                })
                //鼠标移出
                .on("mouseleave",".time-select-line",function(){
                    $(".time-select-line-mousemark",self.html).remove();
                })
        },
        //矫正超出100的值
        correction0100: function (value) {
            return value > 100 ? 100 : value < 0 ? 0 : value;
        },
        //播放
        play:function(){
            var self=this;
            var linePlanWidth=$(".time-select-line-plan",this.html).width();
            this.intervalHandle=setInterval(function(){
                linePlanWidth+=1;
                if(linePlanWidth>=self.lineWidth){
                    if(self.settings.isLoop){
                        linePlanWidth=0;
                    }else{
                        linePlanWidth=self.lineWidth;
                        self.stop();
                    }
                }
                $(".time-select-line-plan",self.html).width(linePlanWidth);
                self.setIndexValue(self.correction0100(linePlanWidth/self.lineWidth*100));
            },1000/this.settings.playStep)
        },
        //停止
        stop:function(){
            if(this.intervalHandle){
                clearInterval(this.intervalHandle);
                this.intervalHandle=null;
                $(".tubiaobtn",self.html).removeClass("fa-pause-circle").addClass("fa-play-circle");
            }
        },
        //设置移动到的位置数据
        setIndexValue:function(value,isManual){
            var indexValueObj = this.getIndexValueBySite(value);
            if(indexValueObj.index!=this.currentIndex){
                this.currentIndex = indexValueObj.index;
                this.currentValue = indexValueObj.value;
                $(".time-select-line-plan-tip-text",this.html).html(this.currentValue);
                this.settings.timeChange.call(this,this.currentValue);
                if(isManual){
                    $(".time-select-line-plan",this.html).width(this.pointList[this.currentIndex]+"%");
                }
            }
        },
        //添加播放按钮
        appendPlayButton:function(){
            var isPlay=!!this.intervalHandle;
            var btnDom=$('<i class="tubiaobtn fa" aria-hidden="true"></i>');
            if(isPlay){
                btnDom.addClass("fa-pause-circle");
            }else{
                btnDom.addClass("fa-play-circle");
            }
            $(".time-select-warp",this.html).prepend(btnDom);
        },
        //初始化位置
        initSite:function(){
            $(".time-select-line-plan",this.html).width(0);
            this.currentIndex=0;
            this.currentValue = this.data[this.currentIndex];
            //先触发一个事件轴改变事件
            this.settings.timeChange.call(this,this.currentValue);
        },
        //销毁
        destroy:function(){
            this.stop();
            this.html.empty();
            this.html.off("click mousedown mousemove mouseleave");
        },
        //重置数据
        setData:function(data){
            if(!this.validateData(data)){
                return;
            }
            this.data = data;
            this.dataLength = this.data.length;
            this.stop();
        
            this.init();
        },
        //验证数据
        validateData:function(data){
            //数据为大于等于2个的数组
            return Object.prototype.toString.call(this.data) === '[object Array]' && this.dataLength >1
        }
    }
    timeSelect.util = {

    }

    /**
     * timeSelect插件
     * @param {Object} options 插件参数
     * @returns {*} 选择器元素
     */
    $.fn.timeSelect = function (options) {
        var arg=Array.prototype.slice.apply(arguments);
        return $(this).each(function (index, el) {
            var elem = $(this),
                timeSelectInstance = elem.data("data-timeSelect");
            if (!timeSelectInstance) {
                timeSelectInstance = new timeSelect(options, elem);
                elem.data("data-timeSelect", timeSelectInstance);
            }
            if (typeof options == "string") {
                return timeSelectInstance[options].apply(timeSelectInstance,arg.splice(1,arg.length-1));
            }
        });
    }
    //插件默认参数
    $.fn.timeSelect.defults = {
        timeChange:function(value){
            console.log(value);
        },//日期改变回调
        playStep:50, //播放步频，每秒多少像素
        isLoop:false,    //是否循环
        isAutoPlay:true, //是否播放
        canPlay:true    //允许播放
    }
})(jQuery);