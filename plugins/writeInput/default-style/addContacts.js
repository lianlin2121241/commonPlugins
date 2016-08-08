function editWraper(){
	//阻止容器内其它元素触发容器的click事件。
	/*$(".email-panel").delegate("*:not(div.viewport,div.overview,div.editContainer)","click",function(event){
	 var e = e||event;
	 e.stopPropagation();
	 })*/
	//点击容器，使输入框获得焦点。
	$(".email-panel").bind("click",function(){
		$(this).find(".selItem").focus();
	})
}
//输入框键盘keyup触发事件
function oku(e,obj){
	var e = window.event || e;
	var code;
	//不同浏览器获取”分号“keycode.
	// $(obj).width(textWidth($(obj).val()));
	var str = changeStr($(obj).val());
	var strArray = str.split(";");
	if(((e.keyCode && e.keyCode == 186)  || (e.which && e.which == 59)) && strArray[0] != ""){
		//输入完成，清空循环使用的输入框。
		creatItem(obj);
		$(obj).val("");
		$(obj).css({"width":"10px"});
		return true;
	}else if(strArray[0] == ""){$(obj).val("");$(obj).css({"width":"10px"});return true;}
}
//输入框鼠标blur触发事件
function ob(e,obj){
	var str = changeStr($(obj).val());
	var strArray = str.split(";");
	if(strArray[0] == ""){return}
	creatItem(obj);
	$(obj).css({"width":"10px"});
}
//创建内容块。
function creatItem(obj,value,id){
	//内容块容器
	var enterBlock = $("<div class='enterBlock' unselectable='on'/>");
	//内容
	var b = $("<b/>");
	//分号
	var span = $("<span class='semicolon'/>");
	b.appendTo(enterBlock);
	span.appendTo(enterBlock);

	var str = changeStr($(obj).val());
	//如果id存在，则将id赋予属性data-id，否则判断输入的是否邮箱，如果不是邮箱，报错提示
	if(!!value&&!!id){
		str=value;
		enterBlock.attr({"data-id":id,"data-text":id})
	}else{
		if(obj.value.indexOf("@") <= -1){
			console.log("您输入的邮箱格式不正确，请重新输入");
			return;
		}
		var pId=obj.value.split("@")[0];
		enterBlock.attr({"data-id":pId,"data-text":obj.value})
	}
	var strArray = str.split(";");
	b.text(strArray[0]);
	span.text(";");
	enterBlock.insertBefore($(obj).parent());
	$(enterBlock).delegate("input","click",function(event){
		var e = e||event;
		e.stopPropagation();
	})
	$(enterBlock).delegate("input","mouseover",function(event){
		var e = e||event;
		e.stopPropagation();
	})
	//内容块over和click事件
	contentBlockEvent(enterBlock);
	//内容块双击事件
	enterBlock.bind("dblclick",function(){
		enterBlock.removeClass("enterBlock_over");
		enterBlock.removeClass("enterBlock_select");
		//创建可编辑内容框替换b
		var text = $("b",enterBlock).text();
		var input = $("<input class='selItem_new' type='text' size='2' maxlength='100'/>");
		input.css("width",$("b",enterBlock).width());
		input.prependTo(enterBlock);
		//输入检查字符长度，input元素宽度自适应。
		input.bind("keypress",function(){
			checkLength(this);
		})
		//input编辑框失去焦点时，b替换input
		input.bind("blur",function(){
			var text = $("input",enterBlock).val();
			if(text == ""){enterBlock.remove();return}
			var b = $("<b/>");
			b.prependTo(enterBlock);
			b.text(text);
			$("input",enterBlock).remove();

			if (window.updateItem_callback) {
				updateItem_callback(enterBlock);
			}
		})
		input.val(text);
		input.focus();
		$("b",enterBlock).remove();
	})
	enterBlock.bind("blur",function(){
		$(this).removeClass("enterBlock_select");
	})
	$(obj).val("");
	//$(".ec").tinyscrollbar();
	//$.scr_bot($(obj).parents(".ec"));

	if (window.creatItem_callback) {
		creatItem_callback(enterBlock);
	}
}
//input框输入字符长度
function checkLength(which) {
	var nowWidth=textWidth($(which).val());
	// console.log(nowWidth);
	$(which).width(nowWidth);
}
//内容块over和click事件
function contentBlockEvent(enterBlock){
	enterBlock.hover(function(){
			if(enterBlock.hasClass("enterBlock_select") || $("input",enterBlock).length != 0){return;}
			enterBlock.addClass("enterBlock_over");
		},
		function(){
			enterBlock.removeClass("enterBlock_over");
		})
	enterBlock.bind("click",function(){
		$("body").unbind("keydown",contentBlock_bodykeydown);
		$("body").unbind("click",contentBlock_bodyclick);
		$(".editContainer .enterBlock").removeClass("enterBlock_select");
		enterBlock.removeClass("enterBlock_over");
		enterBlock.addClass("enterBlock_select");
		//body注册事件，点击时内容块样式恢复。
		$("body").bind("click",{enterBlock: enterBlock},contentBlock_bodyclick);
		//监控body的键盘事件，backspace和delete
		$("body").bind("keydown",{enterBlock: enterBlock},contentBlock_bodykeydown);
	})
}
var contentBlock_bodykeydown = function(e) {
	var enterBlock = e.data.enterBlock;
	//var e = window.event || e;
	var code = e.keyCode || e.which;
	var personId = enterBlock.attr("data-id");
	//焦点没有在内容块的输入框中。
	if((code == 46 || code == 8) && !$(":focus").hasClass("selItem_new")){
		if (personId == "first") {
			alert("创建会议人员,不可删除!");
			$("body").unbind("keydown", contentBlock_bodykeydown);
			return false;
		}
		if (window.deleteItem_before) {
			var bChk = deleteItem_before(enterBlock);
			if (!bChk) {
				$(this).unbind("keydown", contentBlock_bodykeydown);
				return;
			}
		}

		//删除内容块
		if (window.deleteItem_callback) {
			deleteItem_callback(enterBlock);
		}
		enterBlock.remove();

		$(this).unbind("keydown", contentBlock_bodykeydown);
		//$(".ec").tinyscrollbar();
		//$.scr_bot(enterBlock.parents(".ec"));
		//backspace取消默认浏览器回退事件
		if (e.returnValue) {
			e.returnValue = false;
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
	}
}
var contentBlock_bodyclick = function(e){
	var enterBlock = e.data.enterBlock;
	enterBlock.removeClass("enterBlock_select");
	//解除body绑定事件。
	$(this).unbind("click",contentBlock_bodyclick);
}
//替换中文；为英文;
function changeStr(str){
	str=str.replace(/；/ig,';');
	return str;
}

//获取文本宽度
function textWidth(text){
	var sensor = $('<div>'+ text +'</div>').css({display: 'none'});
	$('body').append(sensor);
	var width = sensor.width() + 12;
	sensor.remove();
	console.log(width);
	return width;
};