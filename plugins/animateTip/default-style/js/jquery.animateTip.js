/*!
 * animateTip
 * 依赖于 jquery.js
 * 		  jquery.ui.position.js
 *注释：如果直接显示tip直接配置show=true
 */
(function ($) {
	$.fn.animateTip = function (options) {
		var defaults = {
			text:"",				//显示文本
			defultText:"无数据",	//显示默认文本
			my:"center top+20",	//tip位置
			at:"center bottom",	//相对dom位置
			width: "auto",			//宽度
			height: "auto",		//高度
			delay:300,				//动画时长
			outDelay:100,			//移出动画时长
			timeoutDelay:0,		//显示延迟时间
			eventType:"hover",	//触发显示体魄类型
			//show:false,			//是否直接显示
			multiple:false,		//是否允许显示多行
			arrowStyle:{},			//箭头自定义样式
			appendPanel:$("body")	//tip插入对象
		};
		setOptions(options);

		var that=$(this);

		//实际定位回调
		function positionUsing(position, feedback){
			var panelScrollTop=defaults.appendPanel.scrollTop();
			position.top=panelScrollTop+position.top;
			$( this ).css( position );
			$( "<div>" )
				.addClass( "animate-tip-arrow" )
				.addClass( feedback.horizontal )
				.addClass( feedback.vertical )
				.css(defaults.arrowStyle)
				.appendTo( this );
		}

		//创建tip结构
		function createTip(panel){
			var $tipPanel=$("<div class='animate-tip-panel'></div>");
			var $tipContent=$("<div class='animate-tip-content'>"+(defaults.text||panel.attr("data-tip")||defaults.defultText)+"</div>");
			!!defaults.multiple&&$tipContent.css({"whiteSpace":"normal","wordWrap":"break-word","wordBreak":"break-word"});
			return $tipPanel.append($tipContent);
		}

		//动画效果
		function animateFun(panel){
			panel.stop(true,true);
			panel.hide();
			var panelHeight=!!defaults.height&&defaults.height!="auto"?defaults.height:panel.height();
			var panelWidth=!!defaults.width&&defaults.width!="auto"?defaults.width:panel.width();
			var ww=$(window).width(),
				wh=$(window).height();
			if(panel.find(".animate-tip-arrow").hasClass("top")){
				panel.show().height(0).animate({"height":panelHeight},defaults.delay);
			}else if(panel.find(".animate-tip-arrow").hasClass("bottom")){
				var bottom=wh-parseInt(panel.css("top").substr(0,panel.css("top").length-2))-panel.outerHeight();
				panel.css({"bottom":bottom+"px","top":"auto"});
				panel.show().height(0).animate({"height":panelHeight},defaults.delay);
			}else if(panel.find(".animate-tip-arrow").hasClass("left")){
				panel.show().width(0).animate({"width":panelWidth},defaults.delay);
			}else if(panel.find(".animate-tip-arrow").hasClass("right")){
				var right=ww-parseInt(panel.css("left").substr(0,panel.css("left").length-2))-panel.outerWidth();
				panel.css({"right":right+"px","left":"auto"});
				panel.show().width(0).animate({"width":panelWidth},defaults.delay);
			}
		}
		//动画删除效果
		function animateClearFun(panel){
			panel.stop();
			if(panel.find(".animate-tip-arrow").hasClass("top")||panel.find(".animate-tip-arrow").hasClass("bottom")){
				panel.animate({"height":0+"px"},defaults.outDelay,function(){
					panel.remove();
				});
			}else if(panel.find(".animate-tip-arrow").hasClass("left")||panel.find(".animate-tip-arrow").hasClass("right")) {
				panel.animate({"width": 0 + "px"}, defaults.outDelay, function () {
					panel.remove();
				});
			}
		}

		//显示tip
		function show(elem){
			var $panel=createTip(elem).width(defaults.width).height(defaults.height);
			var positionObj={
				my:defaults.my,
				at:defaults.at,
				of:elem,
				using:positionUsing
			}
			$panel.appendTo(defaults.appendPanel).show().position(positionObj);
			animateFun($panel);
			return $panel;
		}

		//为document绑定点击事件
		$(document).on("click",function(){
			$(".animate-tip-panel").remove();
		})

		//如果配置show为true时直接显示消息
		/*if(defaults.show){
			this.each(function () {
				var $self = $(this);
				show($self);
			});
			return false;
		}*/

		that.each(function () {
			var $self = $(this);
			var $panel=null;
			var timeout=null;
			//根据配置的类型触发显示
			switch (defaults.eventType) {
				case "hover"://鼠标移入
					$self.hover(function(){
						if(!!defaults.timeoutDelay){
							timeout=setTimeout(function(){
								$panel=show($self);
							},defaults.timeoutDelay);
						}else{
							$panel=show($self);
						}
					},function(){
						!!timeout&&clearTimeout(timeout);
						!!$panel&&animateClearFun($panel);
					})
					$self.on("click",function(e) {
						e.stopPropagation();
					})
					break;
				case "click"://点击
					$self.on("click",function(e){
						e.stopPropagation();
						$(".animate-tip-panel").remove();
						$panel=show($self);
						$panel.off("click");
						$panel.on("click",function(e){
							e.stopPropagation();
						})
					})
					break;
			}
		});


		function setOptions(options) {
			defaults = $.extend(defaults, options);
			return defaults;
		}


		function getOptions() {
			return defaults;
		}

		return that;
	};

})(jQuery);