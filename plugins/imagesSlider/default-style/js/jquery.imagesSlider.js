// JavaScript Document
/*
* 依赖于jquery库  jqueryUI库
* jquery.ui.core.min.js
* jquery.ui.widget.min.js
* jquery.ui.position.min.js
* jquery.ui.mouse.min.js
* jquery.ui.draggable.min.js
* */
(function ($) {
    $.imagesSlider = function (options) {
        var defaults = {
            data: [],  //数据[{url: "", text: ""}]
            numb:1     //默认显示索引
        };
        setOptions(options);

        var ww=$(window).width(),
            wh=$(window).height();
         if(defaults.data.length==0){
            return;
        }

        var that={};

        create();
        init();

        //创建标签
        function create(){
            that.$divImagesSliderShade=$("<div class='images-slider-shade'></div>");
            that.$divImagesSliderPanel=$("<div class='images-slider-panel'></div>");
            that.$divImagesSliderContent=$("<div class='images-slider-content'></div>");
            that.$divImagesSliderClose=$("<div class='images-slider-close'></div>");
            that.$divImagesSliderFooter=$("<div class='images-slider-footer'></div>");
            that.$divImagesSliderFooterText=$("<div class='images-slider-footer-text'></div>");
            that.$divImagesSliderFooterLarge=$("<div class='images-slider-footer-btn images-slider-footer-large'></div>");
            that.$divImagesSliderFooterSmall=$("<div class='images-slider-footer-btn images-slider-footer-small'></div>");
            that.$divImagesSliderHandleLeft=$("<div class='images-slider-handle images-slider-handle-left' onselectstart='return false'>&lt;</div>");
            that.$divImagesSliderHandleRight=$("<div class='images-slider-handle images-slider-handle-right' onselectstart='return false'>&gt;</div>");
            that.$divImagesSliderFooterText.add(that.$divImagesSliderFooterSmall).add(that.$divImagesSliderFooterLarge).appendTo(that.$divImagesSliderFooter);
            that.$divImagesSliderContent.add(that.$divImagesSliderFooter).add(that.$divImagesSliderHandleLeft).add(that.$divImagesSliderHandleRight).add(that.$divImagesSliderClose).appendTo(that.$divImagesSliderPanel);
            that.$divImagesSliderShade.add(that.$divImagesSliderPanel).appendTo("body");

            that.$divImagesSliderPanel.height(wh-120).width(ww-360)
                .position({
                    my: "center center",
                    at: "center center",
                    of: $(window)
                });

            that.$divImagesSliderHandleLeft
                .position({
                    my: "left+35 center-40",
                    at: "left center",
                    of: that.$divImagesSliderPanel
                });

            that.$divImagesSliderHandleRight
                .position({
                    my: "right-35 center-40",
                    at: "right center",
                    of: that.$divImagesSliderPanel
                });

            that.$divImagesSliderContent.height(wh-200);
        }

        //初始化标签事件
        function init(){
            var sliderContentW=that.$divImagesSliderContent.width(),
                sliderContentH=that.$divImagesSliderContent.height()
            that.$ulImagesList=$("<ul class='images-slider-images-list'></ul>");
            that.$liImagesItemTemp=$("<li class='images-slider-images-item'><img class='images-slider-images-item-img'/></li>")
                .height(sliderContentH).width(sliderContentW);
            $.each(defaults.data,function(index,obj){
                var $liImagesItem=that.$liImagesItemTemp.clone();
                var imgInitialW= 0,
                    imgInitialH=0;
                $liImagesItem.find("img").attr("src",obj.url+ "?" + new Date().getTime())
                    .one('load',function(){
                            imgInitialW=$liImagesItem.find("img").width();
                            imgInitialH=$liImagesItem.find("img").height();
                            $liImagesItem.find("img").attr({"data-initialW":imgInitialW,"data-initialH":imgInitialH});//为图片添加初始宽高属性
                            reSizePicSize($(this))
                                .position({
                                    my: "center center",
                                    at: "center center",
                                    of: $(this).parent()
                                });
                            $liImagesItem.find("img").attr("data-scale",($liImagesItem.find("img").width()/imgInitialW)*100);//为图片赋值比例

                        })
                    /*.load(function(){
                        imgInitialW=$liImagesItem.find("img").width();
                        imgInitialH=$liImagesItem.find("img").height();
                        $liImagesItem.find("img").attr({"data-initialW":imgInitialW,"data-initialH":imgInitialH});//为图片添加初始宽高属性
                        reSizePicSize($(this))
                            .position({
                                my: "center center",
                                at: "center center",
                                of: $(this).parent()
                            });
                        $liImagesItem.find("img").attr("data-scale",($liImagesItem.find("img").width()/imgInitialW)*100);//为图片赋值比例
                    })*/
                    .end().appendTo(that.$ulImagesList);
                $liImagesItem.find("img").draggable({cursor: "move" });
            })
            that.$ulImagesList.width(defaults.data.length*sliderContentW).css("left",-(defaults.numb-1)*sliderContentW).appendTo(that.$divImagesSliderContent);

            setBtnState(-(defaults.numb-1)*sliderContentW,sliderContentW);//设置左右切换按钮状态
            that.$divImagesSliderFooterText.text(defaults.data[defaults.numb-1].text);

            that.animateObj=null;

            //关闭按钮点击
            that.$divImagesSliderClose.on("click",function(){
                that.$divImagesSliderShade.add(that.$divImagesSliderPanel).remove();
            })

            //向左滑动
            that.$divImagesSliderHandleLeft.on("click",function(){
                !!that.animateObj&&that.$ulImagesList.stop(that.animateObj,true,true);
                var str =that.$ulImagesList.css("left");
                var ms = str.substring(0,str.length-2);
                var toLeft=parseInt(ms)+sliderContentW;
                setBtnState(toLeft,sliderContentW);
                var targetLiIndex=getTargetLiIndex()-1;//获取显示的li索引
                that.$divImagesSliderFooterText.text(defaults.data[targetLiIndex].text);//显示图片信息
                that.animateObj=that.$ulImagesList.animate({"left":toLeft},500);
            })
            //向右滑动
            that.$divImagesSliderHandleRight.on("click",function(){
                !!that.animateObj&&that.$ulImagesList.stop(that.animateObj,true,true);
                var str =that.$ulImagesList.css("left");
                var ms = str.substring(0,str.length-2);
                var toLeft=parseInt(ms)-sliderContentW;
                setBtnState(toLeft,sliderContentW);
                var targetLiIndex=getTargetLiIndex()+1;//获取显示的li索引
                that.$divImagesSliderFooterText.text(defaults.data[targetLiIndex].text);//显示图片信息
                that.animateObj=that.$ulImagesList.animate({"left":toLeft},500);
            })


            //放大按钮鼠标按下事件
            that.$divImagesSliderFooterLarge.on("mousedown",function(){
                var targetImage=getTargetImage();
                var scale=parseFloat(targetImage.attr("data-scale"));
                startScale(scale,"add")
            })
            //放大按钮鼠标抬起事件
            that.$divImagesSliderFooterLarge.on("mouseup",function(){
                stopScale();
            })
            that.$divImagesSliderFooterLarge.on("mouseout",function(){
                stopScale();
            })
            //缩小按钮鼠标按下事件
            that.$divImagesSliderFooterSmall.on("mousedown",function(){
                var targetImage=getTargetImage();
                var scale=parseFloat(targetImage.attr("data-scale"));
                startScale(scale,"subtract")
            })
            //缩小按钮鼠标抬起事件
            that.$divImagesSliderFooterSmall.on("mouseup",function(){
                stopScale();
            })
            //缩小按钮鼠标抬起事件
            that.$divImagesSliderFooterSmall.on("mouseout",function(){
                stopScale();
            })
        }


        //计算图片适应屏幕大小
        //pram 图片jquery对象
        //return 图片
        function reSizePicSize(elem){
            var picPanelW=that.$liImagesItemTemp.innerWidth(),
                picPanelH=that.$liImagesItemTemp.innerHeight();
            if(elem.height()>picPanelH){
                elem.height(picPanelH);
                elem.width("auto");
            }
            if(elem.width()>picPanelW){
                elem.width(picPanelW);
                elem.height("auto");
            }
            return elem;
        }


        //设置左右按钮状态
        function setBtnState(toLeft,baseContentW){
            if(defaults.data.length==1){
                that.$divImagesSliderHandleRight.hide();
                that.$divImagesSliderHandleLeft.hide();
                return
            }

            if(toLeft>=0){
                that.$divImagesSliderHandleLeft.hide();
                that.$divImagesSliderHandleRight.show();
            }else if(toLeft<=-(defaults.data.length-1)*baseContentW){
                that.$divImagesSliderHandleRight.hide();
                that.$divImagesSliderHandleLeft.show();
            }else{
                that.$divImagesSliderHandleRight.show();
                that.$divImagesSliderHandleLeft.show();
            }
        }

        //开启时钟计算
        //pram startScale 起始比例
        //pram type 类型  add  增加   subtract  减少
        function startScale(startScale,type){
            that.imageScale=startScale;
            that.timeout=setInterval(function(){
                /*if(that.imageScale>1000||that.imageScale<10){
                    return;
                }*/
                if(type=="add"&&that.imageScale<1000){
                    that.imageScale++;
                }else if(type=="subtract"&&that.imageScale>10){
                    that.imageScale--;
                }else{
                    return
                }

                resizeImage(that.imageScale);
            },5)
        }

        //停止时钟
        function stopScale(){
            clearInterval(that.timeout);
            //return that.imageScale;
        }


        //更改图片大小
        //pram scale 图片比例
        function resizeImage(scale){
            var targetImage=getTargetImage();
            var imageInitialW=parseFloat(targetImage.attr("data-initialW")),
                imageInitialH=parseFloat(targetImage.attr("data-initialH")),
                imageScale=parseFloat(targetImage.attr("data-scale")),
                imageTop=parseFloat(targetImage.css("top").substring(0,targetImage.css("top").length-2)),
                imageLeft=parseFloat(targetImage.css("left").substring(0,targetImage.css("left").length-2));

            var resizeScale=Math.abs(imageScale-scale);
            var resizeW=imageInitialW*resizeScale/100;
            var resizeH=imageInitialH*resizeScale/100;
            targetImage.width(imageInitialW*scale/100).height(imageInitialH*scale/100);
            if(imageScale>scale){
                targetImage.css({"left":imageLeft+resizeW/2,"top":imageTop+resizeH/2});
            }else{
                targetImage.css({"left":imageLeft-resizeW/2,"top":imageTop-resizeH/2});
            }
            targetImage.attr("data-scale",scale);//为图片赋值新比例
        }

        //获取要更改的图片
        function getTargetImage(){
            var ulImagesListLeft=that.$ulImagesList.css("left"),
                picPanelW=that.$liImagesItemTemp.innerWidth();
            var ms = ulImagesListLeft.substring(0,ulImagesListLeft.length-2);
            var imageIndex=Math.abs(parseInt(ms)/picPanelW);
            return that.$ulImagesList.find(".images-slider-images-item").eq(imageIndex).find("img");
        }

        //获取显示的图片索引
        function getTargetLiIndex(){
            var ulImagesListLeft=that.$ulImagesList.css("left"),
                picPanelW=that.$liImagesItemTemp.innerWidth();
            var ms = ulImagesListLeft.substring(0,ulImagesListLeft.length-2);
            return Math.abs(parseInt(ms)/picPanelW);
        }




        function setOptions(options) {
            defaults = $.extend(defaults, options);
            return defaults;
        }


        function getOptions() {
            return defaults;
        }
    };

})(jQuery);