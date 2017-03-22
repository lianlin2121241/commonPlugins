(function ($) {
	var syn_paginationFun=(function(){
		function pagination(elem,options){
			this.elem=elem;
            this.settings=$.extend(true, {},$.fn.syn_pagination.defults,options||{});
            this.init();
		}
        //插件原型
        pagination.prototype={
            /**
             * 初始化方法
             */
            init:function(){
				this.settings.items_per_page = (!this.settings.items_per_page || this.settings.items_per_page < 0) ? 1 : this.settings.items_per_page;
				this.drawLinks();
            },
            numPages:function(){
            	return Math.ceil(this.settings.items_total_count / this.settings.items_per_page);
            },
            getInterval:function(){
            	var ne_half = Math.ceil(this.settings.num_display_entries / 2);
				var np = this.numPages();
				var upper_limit = np - this.settings.num_display_entries;
				var start = this.settings.current_page > ne_half ? Math.max(Math.min(this.settings.current_page - ne_half, upper_limit), 0) : 0;
				var end = this.settings.current_page > ne_half ? Math.min(this.settings.current_page + ne_half, np) : Math.min(this.settings.num_display_entries, np);
				return [start, end];
            },
            pageSelected:function(page_id, evt){
            	this.settings.current_page = page_id;
				this.drawLinks();
				var continuePropagation = this.settings.callback(page_id, this.elem);
				if (!continuePropagation) {
					if (evt.stopPropagation) {
						evt.stopPropagation();
					} else {
						evt.cancelBubble = true;
					}
				}
				return continuePropagation;
            },
            drawLinks:function(){
            	var self=this;
            	this.elem.empty();
				var interval = this.getInterval();
				var np = this.numPages();
				// This helper function returns a handler function that calls pageSelected with the right page_id
				var getClickHandler = function(page_id) {
						return function(evt) {
							return self.pageSelected(page_id, evt);
						}
					}
				// Helper function for generating a single link (or a span tag if it's the current page)
				var appendItem = function(page_id, appendopts) {
					page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
					appendopts = jQuery.extend({
						text: page_id + 1,
						classes: ""
					}, appendopts || {});
					if (page_id == self.settings.current_page) {
						var lnk = jQuery("<span class='current'>" + (appendopts.text) + "</span>");
					} else {
						var lnk = jQuery("<a>" + (appendopts.text) + "</a>")
							.bind("click", getClickHandler(page_id))
							.attr('href', self.settings.link_to.replace(/__id__/, page_id));
					}
					//alert(page_id);
					if (appendopts.classes) {
						lnk.addClass(appendopts.classes);
					}
					self.elem.append(lnk);
				}
				// sum total
				if (this.settings.isSum) {
					this.elem.append("<a>共&nbsp;" + this.settings.items_total_count + "&nbsp;条记录</a>");
				}
				// Generate "First"-Link
				if (this.settings.first_text && (this.settings.current_page > 0 || this.settings.first_show_always)) {

					appendItem(0, {
						text: this.settings.first_text,
						classes: "first"
					});
				}
				// Generate "Previous"-Link
				if (this.settings.prev_text && (this.settings.current_page > 0 || this.settings.prev_show_always)) {
					appendItem(this.settings.current_page - 1, {
						text: this.settings.prev_text,
						classes: "prev"
					});
				}
				// Generate starting points
				if (interval[0] > 0 && this.settings.num_edge_entries > 0) {
					var end = Math.min(this.settings.num_edge_entries, interval[0]);
					for (var i = 0; i < end; i++) {
						appendItem(i);
					}
					if (this.settings.num_edge_entries < interval[0] && this.settings.ellipse_text) {
						jQuery("<span>" + this.settings.ellipse_text + "</span>").appendTo(this.elem);
					}
				}
				// Generate interval links
				for (var i = interval[0]; i < interval[1]; i++) {
					appendItem(i);
				}
				// Generate ending points
				if (interval[1] < np && this.settings.num_edge_entries > 0) {
					if (np - this.settings.num_edge_entries > interval[1] && this.settings.ellipse_text) {
						jQuery("<span>" + this.settings.ellipse_text + "</span>").appendTo(this.elem);
					}
					var begin = Math.max(np - this.settings.num_edge_entries, interval[1]);
					for (var i = begin; i < np; i++) {
						appendItem(i);
					}
				}


				// Generate "Next"-Link
				if (this.settings.next_text && (this.settings.current_page < np - 1 || this.settings.next_show_always)) {
					appendItem(this.settings.current_page + 1, {
						text: this.settings.next_text,
						classes: "next"
					});
				}
				// Generate "Last"-Link
				if (this.settings.last_text && (this.settings.current_page < np - 1 || this.settings.last_show_always)) {
					appendItem(np, {
						text: this.settings.last_text,
						classes: "last"
					});
				}

				//跳转
				if (this.settings.isJump) {
					// Generate Jump Input
					this.elem.append(jQuery("<span class='jump_text' style='margin-left:15px'>跳至</span>"));
					this.elem.append(jQuery("<input type='text'  style='text-align:center;color:#222' id='jump-index' title='请输入正整数' size='1' />"));
					this.elem.append(jQuery("<span class='jump_text' style='width:38px'>/"+this.settings.items_total_count+"页</span>"));
					// Generate Jump Handler
					var index = null;
					var jump = jQuery("<a class='gogogo'>" +  + "</a>").bind("click", function(evt) {
						var jumpinput = jQuery("#jump-index");
						index = jumpinput.val();
						if (index == null || index == "") {
							//alert(this.settings.jump_null_text);
							return;
						}
						if (/^\d+$/.test(index)) {
							if (index > this.numPages() || index < 1) {
								//alert(this.settings.jump_outofrange_text);
								jumpinput.val("");
								return;
							}
							index -= 1;
							return this.pageSelected(index, evt);
						} else {
							//alert(this.settings.jump_format_text);
							jumpinput.val("");
							return;
						}
					}).attr("href", this.settings.link_to.replace(/__id__/, index));
					this.elem.append(jump);
					$('#jump-index').bind('keyup', function(event) {
						if (event.keyCode == "13") {
							var jumpinput = jQuery("#jump-index");
							index = jumpinput.val();
							if (index == null || index == "") {
								alert(this.settings.jump_null_text);
								return;
							}
							if (/^\d+$/.test(index)) {
								if (index > this.numPages() || index < 1) {
									alert(this.settings.jump_outofrange_text);
									jumpinput.val("");
									return;
								}
								index -= 1;

								return this.pageSelected(index, event);
							} else {

								alert(this.settings.jump_format_text);
								jumpinput.val("");
								return;
							}
							// appendItem(index);

						}

					});
				}
            }
        }
        return pagination;
	})()
    /**
     * Syn_pagination
     * @param {Object} options 插件参数
     * @returns {*} 选择器元素
     */
    $.fn.syn_pagination=function(options){
        return $(this).each(function(index, el) {
            var elem=$(this),
                syn_pagination=elem.data("data-pagination");
            if(!syn_pagination){
                syn_pagination=new syn_paginationFun(elem,options);
                elem.data("data-pagination",syn_pagination);
            }
            if(typeof options=="string"){
                return syn_pagination[options]();
            }
        });
    }
    //zl_select默认参数
    $.fn.syn_pagination.defults={
    	items_total_count:100,		//数据总条数
		items_per_page: 10,			//每页显示条数
		num_display_entries: 5,		//中间显示分页数控制，一般为奇数
		current_page: 0,			//当前选中页数
		num_edge_entries: 0,		//边缘保留页码个数
		link_to: "#",				//跳转按钮链接属性
		first_text: "First",		//首页按钮文本
		prev_text: "Prev",			//上一页按钮文本
		next_text: "Next",			//下一页按钮文本
		last_text: "Last",			//尾页按钮文本
		jump_text: "Jump",			//跳转按钮文本
		isSum: true,				//是否显示当前条数
		isJump: true,				//是否显示跳转部分
		jump_format_text: "页码格式错误",
		jump_outofrange_text: "页码超出范围",
		jump_null_text: "页码不能为空",
		ellipse_text: "...",
		first_show_always: true,	//是否显示首页按钮
		prev_show_always: true,		//是否显示上一页按钮
		next_show_always: true,		//是否显示下一页按钮
		last_show_always: true,		//是否显示尾页按钮
		callback: function() {		//页面跳转回调	
			return true;
		}
    }
})(jQuery);