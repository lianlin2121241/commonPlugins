/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function(maxentries, opts) {
	opts = jQuery.extend({
		items_per_page: 10,			//每页显示条数
		num_display_entries: 5,		//中间显示分页数控制，一般为奇数
		current_page: 1,			//当前选中页数
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
	}, opts || {});

	return this.each(function() {
		/**
		 * 计算分页个数（总条数/每页显示条数）
		 */
		function numPages() {
			return Math.ceil(maxentries / opts.items_per_page);
		}

		/**
		 * 获取中间分页起止位置
		 * @return {Array} [开始位置，结束位置]
		 */
		function getInterval() {
			var ne_half = Math.floor(opts.num_display_entries / 2);
			var np = numPages();
			var upper_limit = np - opts.num_display_entries;
			var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
			var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
			return [start, end];
		}

		/**
		 * 点击分页链接执行选择 
		 * @param {int} page_id 页码
		 */
		function pageSelected(page_id, evt) {
			current_page = page_id;
			drawLinks();
			var continuePropagation = opts.callback(page_id, panel);
			if (!continuePropagation) {
				//如果为false阻止冒泡
				if (evt.stopPropagation) {
					evt.stopPropagation();
				} else {
					evt.cancelBubble = true;
				}
			}
			return continuePropagation;
		}

		/**
		 * This function inserts the pagination links into the container element
		 */
		function drawLinks() {
			panel.empty();
			var interval = getInterval();
			var np = numPages();
			// This helper function returns a handler function that calls pageSelected with the right page_id
			var getClickHandler = function(page_id) {
					return function(evt) {
						return pageSelected(page_id, evt);
					}
				}
				// Helper function for generating a single link (or a span tag if it's the current page)
			var appendItem = function(page_id, appendopts) {
					page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
					appendopts = jQuery.extend({
						text: page_id,
						classes: ""
					}, appendopts || {});
					if (page_id == current_page) {
						var lnk = jQuery("<span class='current'>" + (appendopts.text) + "</span>");
					} else {
						var lnk = jQuery("<a>" + (appendopts.text) + "</a>")
							.bind("click", getClickHandler(page_id))
							.attr('href', opts.link_to.replace(/__id__/, page_id));
					}
					//alert(page_id);
					if (appendopts.classes) {
						lnk.addClass(appendopts.classes);
					}
					panel.append(lnk);
				}
				// sum total
			if (opts.isSum) {
				panel.append("<a>共&nbsp;" + maxentries + "&nbsp;条记录</a>");
			}
			// Generate "First"-Link
			if (opts.first_text && (current_page > 0 || opts.first_show_always)) {

				appendItem(1, {
					text: opts.first_text,
					classes: "first"
				});
			}
			// Generate "Previous"-Link
			if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
				appendItem(current_page - 1, {
					text: opts.prev_text,
					classes: "prev"
				});
			}
			// Generate starting points
			if (interval[0] >1 && opts.num_edge_entries > 0) {
				var end = Math.min(opts.num_edge_entries, interval[0]);
				for (var i = 0; i < end; i++) {
					appendItem(i+1);
				}
				if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
					jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
				}
			}
			// Generate interval links
			for (var i = interval[0]; i <= interval[1]; i++) {
				appendItem(i+1);
			}
			// Generate ending points
			if (interval[1] < np && opts.num_edge_entries > 0) {
				if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
					jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
				}
				var begin = Math.max(np - opts.num_edge_entries, interval[1]);
				for (var i = begin; i < np; i++) {
					appendItem(i+1);
				}
			}


			// Generate "Next"-Link
			if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
				appendItem(current_page, {
					text: opts.next_text,
					classes: "next"
				});
			}
			// Generate "Last"-Link
			if (opts.last_text && (current_page < np - 1 || opts.last_show_always)) {
				appendItem(np, {
					text: opts.last_text,
					classes: "last"
				});
			}

			//跳转
			if (opts.isJump) {
				// Generate Jump Input
				panel.append(jQuery("<span class='jump_text' style='margin-left:15px'>跳至</span>"));
				panel.append(jQuery("<input type='text'  style='text-align:center;color:#222' id='jump-index' title='请输入正整数' size='1' />"));
				panel.append(jQuery("<span class='jump_text' style='width:38px'>/"+maxentries+"页</span>"));
				// Generate Jump Handler
				var index = null;
				var jump = jQuery("<a class='gogogo'>" +  + "</a>").bind("click", function(evt) {
					var jumpinput = jQuery("#jump-index");
					index = jumpinput.val();
					if (index == null || index == "") {
						//alert(opts.jump_null_text);
						return;
					}
					if (/^\d+$/.test(index)) {
						if (index > numPages() || index < 1) {
							//alert(opts.jump_outofrange_text);
							jumpinput.val("");
							return;
						}
						index -= 1;
						return pageSelected(index, evt);
					} else {
						//alert(opts.jump_format_text);
						jumpinput.val("");
						return;
					}
				}).attr("href", opts.link_to.replace(/__id__/, index));
				panel.append(jump);
				$('#jump-index').bind('keyup', function(event) {
					if (event.keyCode == "13") {
						var jumpinput = jQuery("#jump-index");
						index = jumpinput.val();
						if (index == null || index == "") {
							alert(opts.jump_null_text);
							return;
						}
						if (/^\d+$/.test(index)) {
							if (index > numPages() || index < 1) {
								alert(opts.jump_outofrange_text);
								jumpinput.val("");
								return;
							}
							index -= 1;

							return pageSelected(index, event);
						} else {

							alert(opts.jump_format_text);
							jumpinput.val("");
							return;
						}
						// appendItem(index);

					}

				});
			}

		}

		// Extract current_page from options
		var current_page = opts.current_page;
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
		// Store DOM element for easy access from all inner functions
		var panel = jQuery(this);
		// Attach control functions to the DOM element 
		this.selectPage = function(page_id) {
			pageSelected(page_id);
		}
		this.prevPage = function() {
			if (current_page > 0) {
				pageSelected(current_page - 1);
				return true;
			} else {
				return false;
			}
		}
		this.nextPage = function() {
				if (current_page < numPages() - 1) {
					pageSelected(current_page + 1);
					return true;
				} else {
					return false;
				}
			}
			// When all initialisation is done, draw the links
		drawLinks();
		// call callback function
		//opts.callback(current_page, this);
	});
}