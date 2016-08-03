function pageHeight() {
	if ($.browser.msie) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight/2 : document.body.clientHeight/2;
	} else {
		return self.innerHeight/2;
	}
};

//返回当前页面宽度
function pageWidth() {
	if ($.browser.msie) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
	} else {
		return self.innerWidth;
	}
};

$(function(){
	var reportTable=$("#reportTable,#reportTable1").freezeTable({
        freezeRowNum: 2,
        freezeColumnNum: 2,
        width: pageWidth(),
        height: pageHeight()
	})

	console.log(reportTable);

	var flag = false;
	$(window).resize(function(){
		if (flag) 
			return ;
				
		setTimeout(function() { 
			$("#reportTable1").data("resizeTable").call($("#reportTable1"),pageWidth(),pageHeight());
			$("#reportTable").data("resizeTable").call($("#reportTable"),pageWidth(),pageHeight());
			flag = false; 
		}, 100);
				
		lag = true;

	})

	var td31clone=$("#reportTable_tableColumnClone tr:eq(2) td:eq(0)");
	$("#reportTable tr:gt(1)").hover(function(){
		$(this).find("td").css("backgroundColor","#eeeeee");
		var index=$(this).index();
		if(!!$("#reportTable_tableColumnClone")){
			!$("#reportTable_tableColumnClone tr:eq(" + index + ")").find("td").not(td31clone).css("backgroundColor","#eeeeee");
		}
	},function(){
		$(this).find("td").css("backgroundColor","#eaf4fd");
		var index=$(this).index();
		if(!!$("#reportTable_tableColumnClone")){
			$("#reportTable_tableColumnClone tr:eq("+index+")").find("td").not(td31clone).css("backgroundColor","#eaf4fd");
		}
	})

	$("#reportTable_tableColumnClone tr:eq(2) td:eq(1),#reportTable_tableColumnClone tr:gt(2)").hover(function(){
		var thisTr=$(this).closest("tr");
		thisTr.find("td").not(td31clone).css("backgroundColor","#eeeeee");
		var index=thisTr.index();
		$("#reportTable tr:eq(" + index + ")").find("td").css("backgroundColor","#eeeeee");
	},function(){
		var thisTr=$(this).closest("tr");
		thisTr.find("td").not(td31clone).css("backgroundColor","#eaf4fd");
		var index=thisTr.index();
		$("#reportTable tr:eq(" + index + ")").find("td").css("backgroundColor","#eaf4fd");
	})

	$("#aa").click(function () {
		var html='<tr><td style="width:100px;text-align:center;">炼胶三期</td><td style="width:210px;text-align:left;">&nbsp;&nbsp;炼胶三期</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td><td></td><td></td><td></td><td></td><td></td> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
		$("#reportTable").append(html);
		$("#reportTable").freezeTable("reloadTable");
	})
})