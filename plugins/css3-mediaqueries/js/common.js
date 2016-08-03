/**
 * Created by Administrator on 16-5-3.
 */
function processLowerIENavigate()
{
    var isIE = document.all ? 1 : 0;
    if (isIE == 1)
    {
        if(navigator.userAgent.indexOf("MSIE7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0)
        {
            //  var doc=document;
            var link=document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("id", "size-stylesheet");
            link.setAttribute("href", "");

            var heads = document.getElementsByTagName("head");
            if(heads.length)
                heads[0].appendChild(link);
            else
                document.documentElement.appendChild(link);

            document.write("<script type='text/JavaScript' src='jquery.min.js'></script>");
            document.write("<script type='text/javascript' src='media_screen.js'></script>");

        }
    }
}
var lowerIE8 = processLowerIENavigate();

function adjustStyle(width) {
    width = parseInt(width);
    if (width < 902) {
        $("#size-stylesheet").attr("href", "navigateLowerIE8.css");
    } else {
        $("#size-stylesheet").attr("href", "");
    }
}

$(function() {
    adjustStyle($(this).width());
    $(window).resize(function() {
        adjustStyle($(this).width());
    });
});