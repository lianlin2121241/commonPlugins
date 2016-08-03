
/*
 * #%L
 * 扁平化 收费管理平台
 * %%
 * Copyright (C) 2013 - 2015 安徽皖通科技股份有限公司
 * %%
 * All rights reserved
 * #L%
 */
/**
 * 在一个容器中安插一个分页条.
 *
 * @author hua
 */
(function( $, undefined ) {

    $.widget( "ui.inputPager", {
        
                defaultElement : "<div></div>",
                options : {
                    pageNumber : 1,//在第几页
                    msgCount : 33, //共10条信息
                    maxPageLimit : '10,15,20',//可选择每页显示的信息条数：10、15、20
                    showPageLimit: false,//是否显示每页显示信息条数选项
                    showToFirst:true,//是否显示回到首页按钮
                    showToLast:true,//是否显示尾页按钮
                    showToPrev:true,//是否显示上一页按钮
                    showToNext:true,//是否显示写一页按钮
                    showCurrPage:true,//是否显示当前页信息
                    showCountMsg:true,//是否显示页数信息
                    limit : 10,
                    buttonIconStart : 'ui-icon-seek-start',
                    buttonIconEnd : 'ui-icon-seek-end',
                    buttonIconPrev : 'ui-icon-seek-prev',
                    buttonIconNext : 'ui-icon-seek-next',
                    pageClick : $.noop
                },

                /**
                 * 生成分页条并返回.
                 */
                _renderPager : function(limit) {
                    var self = this;
                    self.widget().empty();
                    
                    var select = $("<select></select>"),
                        array=self.options.maxPageLimit.split(','),
                        limit = parseInt(!limit?array[0]:limit);
                    
                    self._pageMsg(limit);
                    
                    for(var i in array) {
                        if(array[i]==limit){
                            $("<option selected='selected' value='"+array[i]+"'>"+ array[i] +"</option>").appendTo(select); 
                            self.limitPage = array[i];
                        }else{
                            $("<option value='"+array[i]+"'>"+ array[i] +"</option>").appendTo(select);
                        }
                    }
                    
                    var combo = $('<div class="jwui-pager-combo"></div>').append(select);
                    var input = $('<li class="jwui-pager-input-li">'
                            +'<input type="text" value="'+self.options.pageNumber
                            +'" class="ui-widget ui-corner-all ui-widget-content jwui-pager-input">/'
                            +self.pageCount+'</li>');
                    var msg = $("<div class='jwui-pager-msg'></div>");
                    
                    var countMsg = self.options.showCountMsg ? $("<span class='jwui-pager-msg-span'>共"+self.options.msgCount+"条,当前"
                            +self.pageFrom+"-"+self.pageTo+"条</span>"):"";
                    
                    var ul = $("<ul class='jwui-pager-ul'></ul>")
                                    .append( self.options.showToFirst && self._renderButton( 'first' ) )
                                    .append( self.options.showToPrev && self._renderButton( 'prev' ) )
                                    .append( self.options.showCurrPage && input )
                                    .append( self.options.showToNext && self._renderButton( 'next' ) )
                                    .append( self.options.showToLast && self._renderButton( 'end' ) );
                    //判断是否显示每页显示信息条数选项
                    self.options.showPageLimit && msg.append(combo);
                    msg.append(countMsg);
                    msg.append( ul );
                        
                    self.pager.append(msg);
                    
                    //总条数等于0时分页条的状态样式
                    if(self.msgCount<=0){
                        input.addClass('ui-state-disabled');
                        input.find('input').prop('readonly',true);  
                    }
                    //绑定事件
                    input.find('input').on("keydown",_doInputCallback)
                    self._btnState(self.options.pageNumber);
                },
                _pageMsg : function(limit){
                    var self=this,
                        array=self.options.maxPageLimit.split(','),
                        limit = parseInt(!limit?array[0]:limit);
                    
                    var pageCount = self.options.msgCount/limit;
                    pageCount > parseInt(pageCount) ? pageCount = parseInt(pageCount)+1 : pageCount;
                    self.pageCount = pageCount;
                    
                    self.options.pageNumber>pageCount ? self.options.pageNumber=pageCount : pageCount;
                    var pageFrom = (self.options.pageNumber-1)*limit+1;
                    var pageTo = pageFrom + limit -1;
                    self.options.msgCount < pageTo ? pageTo = self.options.msgCount : pageTo;
                    
                    this.pageFrom = pageFrom<0 ? 0 : pageFrom;
                    this.pageTo = pageTo;
                    
                    $(".jwui-pager-msg-span",this.widget()).html("共"+self.options.msgCount+"条,当前"
                            +pageFrom+"-"+pageTo+"条");
                },
                /**
                 * 生成指定类型的按钮并返回
                 */
                _renderButton : function( buttonType ) {
                    var buttonIcon = '',
                        self = this;

                    switch ( buttonType ) {
                        case "first":
                            buttonIcon = self.options.buttonIconStart;
                            break;
                        case "prev":
                            buttonIcon = self.options.buttonIconPrev;
                            break;
                        case "next":
                            buttonIcon = self.options.buttonIconNext;
                            break;
                        case "end":
                            buttonIcon = self.options.buttonIconEnd;
                            break;
                    }

                    // 生成类名 pgFirst, pgPrev, pgNext, pgEnd
                    var className = 'jwui-pager-pg' + buttonType.charAt( 0 ).toUpperCase() + buttonType.slice( 1 );

                    var $button = $( '<li class="jwui-pager-button ui-state-default ui-corner-all ' + className 
                                    +'"><span class="jwui-input-pager-icon ui-icon '+buttonIcon+'"></span></li>' );


                    // 注册事件监听
                    self._on( $button, {
                        click : "_doButtonCallback"
                    } );
                    self._hoverable( $button );

                    return $button;
                },
                /**
                 * 按钮点击事件触发,获取点选页号以及原页号后触发pageClick事件.
                 */
                _doButtonCallback : function( event ) {

                    var button = $( event.currentTarget ),
                        pageInput = $(".jwui-pager-input", this.widget()),
                        self=this;
                    
                    if ( button.hasClass( 'ui-state-active' )|| button.hasClass( 'ui-state-disabled' )) {
                        return false;
                    }
                    
                    // 根据页号设置起止页按钮的可点击性和显示的页数
                    var pageNum,
                        pgFirst = $(".jwui-pager-pgFirst", self.widget()),
                        pgPrev = $(".jwui-pager-pgPrev", self.widget()),
                        pgEnd = $(".jwui-pager-pgEnd", self.widget()),
                        pgNext = $(".jwui-pager-pgNext", self.widget());
                  
                    if(isNaN(pageInput.val())){
                        pageNum = 1;//非法字符置为1
                    }else  if ( button.hasClass( 'jwui-pager-pgFirst' ) ) {
                        pageNum = 1;
                    } else if ( button.hasClass( 'jwui-pager-pgPrev' ) ) {
                        pageNum = parseInt(pageInput.val()) - 1;
                        pageNum < 1 ? pageNum = 1: pageNum;
                        pageNum > self.pageCount ? pageNum = self.pageCount : pageNum;
                    } else if ( button.hasClass( 'jwui-pager-pgNext' ) ) {
                        pageNum = parseInt(pageInput.val()) + 1;
                        pageNum > self.pageCount ? pageNum = self.pageCount : pageNum;
                        pageNum < 1 ? pageNum = 1 : pageNum;
                    } else if ( button.hasClass( 'jwui-pager-pgEnd' ) ) {
                        pageNum = self.pageCount;
                    } else {
                        pageNum = 1;
                    }
                    
                    var prevPageNum = self.options.pageNumber;
                    pageInput.val(pageNum);
                    self.pageNumber=pageNum;
                    self.options.pageNumber = parseInt(pageNum);
                    
                    self._btnState(pageNum);
                    
                    self._pageMsg(self.limitPage);
                    // 触发pageClick 事件
                    return self._trigger( "pageClick", event,pageNum);
                },
                
                _doInputCallback: function( event ){
                    if( event.type == 'click' || event.which ==13){
                        var pageInput = $(".jwui-pager-input", this.widget());
                        var pageNum = pageInput.val();
                        if ( isNaN(pageNum) || parseInt(pageNum) <= 1 ) {
                            pageNum = 1;
                        }else if(parseInt(pageNum) >= this.pageCount){
                            pageNum = this.pageCount;
                        }
                        pageInput.val(pageNum);
                        self.pageNumber=pageNum;
                        this._btnState(pageNum);
                        this.options.pageNumber = pageNum;
                        this._pageMsg(this.limitPage);
                        // 触发pageClick 事件
                        return this._trigger( "pageClick", event,pageNum);
                    }
                },
                _btnState : function(pageNum){
                    var pgFirst = $(".jwui-pager-pgFirst", this.widget()),
                        pgPrev = $(".jwui-pager-pgPrev", this.widget()),
                        pgEnd = $(".jwui-pager-pgEnd", this.widget()),
                        pgNext = $(".jwui-pager-pgNext", this.widget());
                    var limit = this.options.limit;
                    if ( parseInt(pageNum) <= 1 ) {
                        pgFirst.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgPrev.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgNext.removeClass( "ui-state-disabled" );
                        pgEnd.removeClass( "ui-state-disabled" );
                    }else if(parseInt(pageNum) >= this.pageCount){
                        pgNext.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgEnd.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgFirst.removeClass( "ui-state-disabled" );
                        pgPrev.removeClass( "ui-state-disabled" );
                    }else{
                        pgFirst.hasClass("ui-state-disabled")&&pgFirst.removeClass( "ui-state-disabled" );
                        pgPrev.hasClass("ui-state-disabled")&&pgPrev.removeClass( "ui-state-disabled" );
                        pgNext.hasClass("ui-state-disabled")&&pgNext.removeClass( "ui-state-disabled" );
                        pgEnd.hasClass("ui-state-disabled")&&pgEnd.removeClass( "ui-state-disabled" );
                    }
                    if(limit>=this.msgCount){
                        pgFirst.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgPrev.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgNext.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                        pgEnd.removeClass( "ui-state-hover ui-state-focus ui-state-active" ).addClass( "ui-state-disabled" );
                    }
                },

                /**
                 * 获取当前页号.
                 */
                getCurrentPage : function() {
                    return this.pageNumber;
                },

                /**
                 * 设置当前页号
                 */
                setCurrentPage : function( pageNum ) {
                    this.pageNumber = pageNum;
                },

                /*刷新*/
                refresh : function() {
                    this._init();
                    return this;
                },

                widget : function() {
                    return $( "." + this.widgetFullName, this.element );
                },

                _destroy : function() {
                    this.widget().remove();
                },

                _create : function() {
                    var self = this;
                    this._destroy();
                    self.pager = $(this.defaultElement).addClass(this.widgetFullName);
                    self.element.append( self.pager );
                },

                _init : function() {
                    var self=this,
                        array=this.options.maxPageLimit.split(','),
                        flag=false;
                    
                    //接收从grid列表传来的limit
                    for(var i in array) {
                        if(array[i]==self.limitPage){
                            flag = array[i];
                            break;
                        }
                    }
                    self.pageNumber = self.options.pageNumber;
                    self.msgCount = self.options.msgCount;
                    
                    if(!!flag){
                        //显示每页limit值，接收从grid列表传来的limit
                        self.limitPage=parseInt(flag);
                    }else if(!self.options.showPageLimit){
                        //不显示每页limit值，直接取出option的limit值
                        self.limitPage=self.options.limit;
                    }else{
                        //显示每页limit值，默认读取第一个option
                        self.limitPage=array[0];
                    }
                    self._renderPager(self.limitPage);
                }

            } );

})( jQuery );

