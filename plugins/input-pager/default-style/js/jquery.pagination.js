/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * This plugin needs at least jQuery 1.4.2
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
(function ($, undefined) {

    $.fn.inputPager = function (opts) {

        var self=this;//获取dom元素
        var defaultElement = "<div></div>",
            options = $.extend({
                pageNumber: 1,//在第几页
                msgCount: 33, //共33条信息
                maxPageLimit: '10,15,20',//可选择每页显示的信息条数：10、15、20
                showPageLimit: false,//是否显示每页显示信息条数选项
                showToFirst: true,//是否显示回到首页按钮
                showToLast: true,//是否显示尾页按钮
                showToPrev: true,//是否显示上一页按钮
                showToNext: true,//是否显示写一页按钮
                showCurrPage: true,//是否显示当前页信息
                showCountMsg: true,//是否显示页数信息
                limit: 10,
                buttonIconStart: 'icon-pager-first',
                buttonIconEnd: 'icon-pager-end',
                buttonIconPrev: 'icon-pager-prev',
                buttonIconNext: 'icon-pager-next',
                pageClick: $.noop
            }, opts || {}),

            /**
             * 生成分页条并返回.
             */
            _renderPager = function (limit) {
                self.empty();

                var select = $("<select></select>"),
                    array = options.maxPageLimit.split(','),
                    limit = parseInt(!limit ? array[0] : limit);

                _pageMsg(limit);

                for (var i in array) {
                    if (array[i] == limit) {
                        $("<option selected='selected' value='" + array[i] + "'>" + array[i] + "</option>").appendTo(select);
                        self.limitPage = array[i];
                    } else {
                        $("<option value='" + array[i] + "'>" + array[i] + "</option>").appendTo(select);
                    }
                }

                var combo = $('<div class="input-pager-combo"></div>').append(select);
                var input = $('<li class="input-pager-input-li">'
                    + '<input type="text" value="' + options.pageNumber
                    + '" class="input-pager-input">/'
                    + self.pageCount + '</li>');
                var msg = $("<div class='input-pager-msg'></div>");

                var countMsg = options.showCountMsg ? $("<span class='input-pager-msg-span'>共" + options.msgCount + "条,当前"
                    + self.pageFrom + "-" + self.pageTo + "条</span>") : "";

                var ul = $("<ul class='input-pager-ul'></ul>")
                    .append(options.showToFirst && _renderButton('first'))
                    .append(options.showToPrev && _renderButton('prev'))
                    .append(options.showCurrPage && input)
                    .append(options.showToNext && _renderButton('next'))
                    .append(options.showToLast && _renderButton('end'));
                //判断是否显示每页显示信息条数选项
                options.showPageLimit && msg.append(combo);
                msg.append(countMsg);
                msg.append(ul);

                self.append(msg);

                //总条数等于0时分页条的状态样式
                if (self.msgCount <= 0) {
                    input.addClass('input-pager-state-disabled');
                    input.find('input').prop('readonly', true);
                }
                //绑定事件
                self.on("keydown",input.find('input'),_doInputCallback);
                _btnState(options.pageNumber);
            },
            _pageMsg = function (limit) {
                var array = options.maxPageLimit.split(','),
                    limit = parseInt(!limit ? array[0] : limit);

                var pageCount = options.msgCount / limit;
                pageCount > parseInt(pageCount) ? pageCount = parseInt(pageCount) + 1 : pageCount;
                self.pageCount = pageCount;

                options.pageNumber > pageCount ? options.pageNumber = pageCount : pageCount;
                var pageFrom = (options.pageNumber - 1) * limit + 1;
                var pageTo = pageFrom + limit - 1;
                options.msgCount < pageTo ? pageTo = options.msgCount : pageTo;

                self.pageFrom = pageFrom < 0 ? 0 : pageFrom;
                self.pageTo = pageTo;

                $(".input-pager-msg-span", self).html("共" + options.msgCount + "条,当前"
                    + pageFrom + "-" + pageTo + "条");
            },
            /**
             * 生成指定类型的按钮并返回
             */
            _renderButton = function (buttonType) {
                var buttonIcon = '';

                switch (buttonType) {
                    case "first":
                        buttonIcon = options.buttonIconStart;
                        break;
                    case "prev":
                        buttonIcon = options.buttonIconPrev;
                        break;
                    case "next":
                        buttonIcon = options.buttonIconNext;
                        break;
                    case "end":
                        buttonIcon = options.buttonIconEnd;
                        break;
                }

                // 生成类名 pgFirst, pgPrev, pgNext, pgEnd
                var className = 'input-pager-pg' + buttonType.charAt(0).toUpperCase() + buttonType.slice(1);

                var $button = $('<li class="input-pager-button ' + className
                    + '"><span class="input-pager-icon ' + buttonIcon + '"></span></li>');


                // 注册事件监听
                $button.on("click",_doButtonCallback);

                return $button;
            },
            /**
             * 按钮点击事件触发,获取点选页号以及原页号后触发pageClick事件.
             */
            _doButtonCallback = function (event) {

                var button = $(event.target).closest(".input-pager-button"),
                    pageInput = $(".input-pager-input", self);

                if (button.hasClass('input-pager-state-active') || button.hasClass('input-pager-state-disabled')) {
                    return false;
                }

                // 根据页号设置起止页按钮的可点击性和显示的页数
                var pageNum,
                    pgFirst = $(".input-pager-pgFirst", self),
                    pgPrev = $(".input-pager-pgPrev", self),
                    pgEnd = $(".input-pager-pgEnd", self),
                    pgNext = $(".input-pager-pgNext", self);

                if (isNaN(pageInput.val())) {
                    pageNum = 1;//非法字符置为1
                } else if (button.hasClass('input-pager-pgFirst')) {
                    pageNum = 1;
                } else if (button.hasClass('input-pager-pgPrev')) {
                    pageNum = parseInt(pageInput.val()) - 1;
                    pageNum < 1 ? pageNum = 1 : pageNum;
                    pageNum > self.pageCount ? pageNum = self.pageCount : pageNum;
                } else if (button.hasClass('input-pager-pgNext')) {
                    pageNum = parseInt(pageInput.val()) + 1;
                    pageNum > self.pageCount ? pageNum = self.pageCount : pageNum;
                    pageNum < 1 ? pageNum = 1 : pageNum;
                } else if (button.hasClass('input-pager-pgEnd')) {
                    pageNum = self.pageCount;
                } else {
                    pageNum = 1;
                }

                var prevPageNum = options.pageNumber;
                pageInput.val(pageNum);
                self.pageNumber = pageNum;
                options.pageNumber = parseInt(pageNum);

                _btnState(pageNum);

                _pageMsg(self.limitPage);
                // 触发pageClick 事件
                return options.pageClick.call(self, event, pageNum);
            },

            _doInputCallback = function (event) {
                if (event.type == 'click' || event.which == 13) {
                    var pageInput = $(".input-pager-input", self.widget());
                    var pageNum = pageInput.val();
                    if (isNaN(pageNum) || parseInt(pageNum) <= 1) {
                        pageNum = 1;
                    } else if (parseInt(pageNum) >= self.pageCount) {
                        pageNum = self.pageCount;
                    }
                    pageInput.val(pageNum);
                    self.pageNumber = pageNum;
                    _btnState(pageNum);
                    options.pageNumber = pageNum;
                    _pageMsg(self.limitPage);
                    // 触发pageClick 事件
                    return self.trigger(options.pageClick, event, pageNum);
                }
            },
            _btnState = function (pageNum) {
                var pgFirst = $(".input-pager-pgFirst", self),
                    pgPrev = $(".input-pager-pgPrev", self),
                    pgEnd = $(".input-pager-pgEnd", self),
                    pgNext = $(".input-pager-pgNext", self);
                var limit = options.limit;
                if (parseInt(pageNum) <= 1) {
                    pgFirst.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgPrev.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgNext.removeClass("input-pager-state-disabled");
                    pgEnd.removeClass("input-pager-state-disabled");
                } else if (parseInt(pageNum) >= self.pageCount) {
                    pgNext.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgEnd.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgFirst.removeClass("input-pager-state-disabled");
                    pgPrev.removeClass("input-pager-state-disabled");
                } else {
                    pgFirst.hasClass("input-pager-state-disabled") && pgFirst.removeClass("input-pager-state-disabled");
                    pgPrev.hasClass("input-pager-state-disabled") && pgPrev.removeClass("input-pager-state-disabled");
                    pgNext.hasClass("input-pager-state-disabled") && pgNext.removeClass("input-pager-state-disabled");
                    pgEnd.hasClass("input-pager-state-disabled") && pgEnd.removeClass("input-pager-state-disabled");
                }
                if (limit >= self.msgCount) {
                    pgFirst.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgPrev.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgNext.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                    pgEnd.removeClass("input-pager-state-hover input-pager-state-focus input-pager-state-active").addClass("input-pager-state-disabled");
                }
            };

        var self=this,
            array=options.maxPageLimit.split(','),
            flag=false;

        //接收从grid列表传来的limit
        for(var i in array) {
            if(array[i]==self.limitPage){
                flag = array[i];
                break;
            }
        }
        self.pageNumber = options.pageNumber;
        self.msgCount = options.msgCount;

        if(!!flag){
            //显示每页limit值，接收从grid列表传来的limit
            self.limitPage=parseInt(flag);
        }else if(!options.showPageLimit){
            //不显示每页limit值，直接取出option的limit值
            self.limitPage=options.limit;
        }else{
            //显示每页limit值，默认读取第一个option
            self.limitPage=array[0];
        }
        _renderPager(self.limitPage);

    }

})(jQuery);
