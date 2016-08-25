var weather = function (rootpath) {
    var route = "weatherImg";
    var dateArr=[];
    window.getWeatherList=[];
    this.getWeather = function (city) {
        //$("#cityid")[0].innerHTML = city;
        var url = encodeURI("http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=4&city=" + city + "&dfc=1");
        fetch_js(url, show);
    }

    function fetch_js(url, dispose) {
        var Snode = document.createElement("script");
        Snode.setAttribute("type", "text/javascript");
        Snode[Snode.onreadystatechange === null ? "onreadystatechange" : "onload"] = function () {
            if (this.onreadystatechange) {
                if (this.readyState != "loaded") {
                    return false;
                }
            }
            if (dispose) {
                dispose()
            }
            ; //完成js加载后，这里调用显示查询结果显示在页面上
            this[this.onreadystatechange ? "onreadystatechange" : "onload"] = null;
        }
        Snode.setAttribute("charset", "gb2312"); //注意乱码问题
        Snode.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(Snode);
    }

    function dis_img(weather) {//显示不同天气对应的图片
        //var route = "/Content/weatherImg"; //文件夹路径项目设置 var route = "@Url.Content("~/Content/weatherImg")";
        var style_img = route + "/hr_1.png";
        if (weather.indexOf("多云") !== -1 && weather.indexOf("晴") !== -1) {//多云转晴，以下类同 indexOf:包含字串
            style_img = route + "/hr_1.png";
        }
        else if (weather.indexOf("多云") !== -1 && weather.indexOf("阴") !== -1) {
            style_img = route + "/hr_2.png";
        }
        else if (weather.indexOf("阴") !== -1 && weather.indexOf("雨") !== -1) {
            style_img = route + "/hr_3.png";
        }
        else if (weather.indexOf("晴") !== -1 && weather.indexOf("雨") !== -1) {
            style_img = route + "/hr_14.png";
        }
        else if (weather.indexOf("晴") !== -1 && weather.indexOf("雾") !== -1) {
            style_img = route + "/hr_12.png";
        }
        else if (weather.indexOf("晴") !== -1) {
            style_img = route + "/hr_13.png";
        }
        else if (weather.indexOf("多云") !== -1) {
            style_img = route + "/hr_1.png";
        }
        else if (weather.indexOf("阵雨") !== -1) {
            style_img = route + "/hr_14.png";
        }
        else if (weather.indexOf("小雨") !== -1) {
            style_img = route + "/hr_3.png";
        }
        else if (weather.indexOf("中雨") !== -1) {
            style_img = route + "/hr_4.png";
        }
        else if (weather.indexOf("大雨") !== -1) {
            style_img = route + "/hr_5.png";
        }
        else if (weather.indexOf("暴雨") !== -1) {
            style_img = route + "/hr_16.png";
        }
        else if (weather.indexOf("冰雹") !== -1) {
            style_img = route + "/hr_6.png";
        }
        else if (weather.indexOf("雷阵雨") !== -1) {
            style_img = route + "/hr_7.png";
        }
        else if (weather.indexOf("小雪") !== -1) {
            style_img = route + "/hr_8.png";
        }
        else if (weather.indexOf("中雪") !== -1) {
            style_img = route + "/hr_9.png";
        }
        else if (weather.indexOf("大雪") !== -1) {
            style_img = route + "/hr_10.png";
        }
        else if (weather.indexOf("暴雪") !== -1) {
            style_img = route + "/hr_17.png";
        }
        else if (weather.indexOf("扬沙") !== -1) {
            style_img = route + "/hr_11.png";
        }
        else if (weather.indexOf("沙尘") !== -1) {
            style_img = route + "/hr_15.png";
        }
        else if (weather.indexOf("雾") !== -1) {
            style_img = route + "/hr_12.png";
        }
        else if (weather.indexOf("霾") !== -1) {
            style_img = route + "/hr_18.png";
        }
        else {
            style_img = route + "/hr_2.png";
        }

        return style_img;
    }

    function show() {
        for (i in SWther.w) {
            var tianqi = SWther.w[i][0].s1;
            var tianqiImg = dis_img(tianqi);
            //alert(s1);
            var t1 = SWther.w[i][0].t1;
            var t2 = SWther.w[i][0].t2;
            var fl = SWther.w[i][0].d1;
            var fs = SWther.w[i][0].p1;
            var st1 = " 最高气温：" + t1 + "&deg;";
            var st2 = " 最低气温：" + t2 + "&deg; ";
            var s = fl + " " + fs + "级";
            $("#cityTQ")[0].innerHTML = tianqi;
            $('#cityTQIMG')[0].innerHTML = "<img class='weather_img' src='" + tianqiImg + "' title='" + tianqi + "' alt='" + tianqi + "' />";
            $("#cityTQInfo2")[0].innerHTML = st1;
            $("#cityTQInfo1")[0].innerHTML = st2;
            $("#cityTQInfo")[0].innerHTML = s;
        }
        var nowDate=new Date();
        var nowDateStr=nowDate.pattern("yyyy-MM-dd");
        infoIsFull(dateArr[0])&&(getWeatherList[nowDateStr]=dateArr[0]);
        infoIsFull(dateArr[1])&&(getWeatherList[GetDateStr(1)]=dateArr[1]);
        infoIsFull(dateArr[2])&&(getWeatherList[GetDateStr(2)]=dateArr[2]);
        infoIsFull(dateArr[3])&&(getWeatherList[GetDateStr(3)]=dateArr[3]);
        infoIsFull(dateArr[4])&&(getWeatherList[GetDateStr(4)]=dateArr[4]);
        //console.log(dateObj);
    }

    //判断天气信息是否完整
    function infoIsFull(data){
        if(!data.s1){
           return false;
        }
        if(!data.t2){
            return false;
        }
        if(!data.t1){
            return false;
        }
        return true;
    }

    this.showWeather=function(obj){
        var tianqi = obj.s1;
        var tianqiImg = dis_img(tianqi);
        $("#weatherName").html(obj.s1);
        $("#temperature").html(obj.t2 + "~" + obj.t1 + " &#8451;");
        $("#imgWeather").attr({"src": tianqiImg, "alt": tianqi});
    }
}
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
//获取当前日期之后的日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return dd.pattern("yyyy-MM-dd");
}