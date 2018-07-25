(function ($) {
    function timeSelect(options, dom) {
        this.settings = $.extend(true, {}, $.fn.timeSelect.defults, options || {});
        this.data = this.settings.data;
        this.html = dom;
        this.dataLength = this.data.length;
        if (Object.prototype.toString.call(this.data) !== '[object Array]' || this.dataLength < 2) {
            return;
        }
        this.pointList = [];  //轴节点比例
        this.setPointList();
        this.middlePointList = [];    //轴节点中点比例
        this.setMiddlePointList();
        this.currentIndex = 0;  //当前轴所在索引
        this.currentValue = this.data[this.currentIndex]; //当前轴所在的值

        this.render();
        this.timeSelectLineDom = $(".time-select-line", this.html);
        this.lineWidth = this.timeSelectLineDom.width();
        this.lineBox = this.timeSelectLineDom[0].getBoundingClientRect();
        this.bindEvent();

        if(this.settings.canPlay){
            if(this.settings.isAutoPlay){
                this.play();
            }
            this.appendPlayButton();
        }
        this.settings.timeChange.call(this,this.currentValue);
    }
    timeSelect.prototype = {
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
        //事件绑定
        bindEvent: function () {
            var self = this;
            this.html
                .on("click", ".tubiaobtn", function (e) {
                    if($(this).hasClass("fa-pause-circle")){
                        $(this).removeClass("fa-pause-circle").addClass("fa-play-circle");
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
                .on("click", ".time-select-line", function (e) {
                    $(".tubiaobtn",self.html).removeClass("fa-pause-circle").addClass("fa-play-circle");
                    self.stop();
                    var mouseSite = self.correction0100((e.clientX - self.lineBox.left) / self.lineWidth * 100);
                    self.setIndexValue(mouseSite,true);
                })
                .on("mousedown", ".time-select-line-plan-point", function (e) {
                    e.stopPropagation();
                    $(".tubiaobtn",self.html).removeClass("fa-pause-circle").addClass("fa-play-circle");
                    self.stop();
                    $(document).on("mousemove.timeSelect", function (e) {
                        var mouseSite = self.correction0100((e.clientX - self.lineBox.left) / self.lineWidth * 100);
                        self.setIndexValue(mouseSite,true);
                    })
                    $(document).on("mouseup.timeSelect", function (e) {
                        e.stopPropagation();
                        $(document).off(".timeSelect");
                    })
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
                        $(".tubiaobtn",self.html).removeClass("fa-pause-circle").addClass("fa-play-circle");
                        self.stop();
                    }
                }
                $(".time-select-line-plan",self.html).width(linePlanWidth);
                self.setIndexValue(self.correction0100(linePlanWidth/self.lineWidth*100));
            },1000/this.settings.playStep)
        },
        //停止
        stop:function(){
            this.intervalHandle&&clearInterval(this.intervalHandle)&&(this.intervalHandle=null);
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
        return $(this).each(function (index, el) {
            var elem = $(this),
                timeSelectInstance = elem.data("data-timeSelect");
            if (!timeSelectInstance) {
                timeSelectInstance = new timeSelect(options, elem);
                elem.data("data-timeSelect", timeSelectInstance);
            }
            if (typeof options == "string") {
                return timeSelectInstance[options]();
            }
        });
    }
    //插件默认参数
    $.fn.timeSelect.defults = {
        timeChange:function(value){
            console.log(value);
        },//日期改变回调
        playStep:50, //播放步频，每秒多少像素
        isLoop:true,    //是否循环
        isAutoPlay:false, //是否播放
        canPlay:true    //允许播放
    }
})(jQuery);