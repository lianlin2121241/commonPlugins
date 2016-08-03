var cv = document.getElementById('cv');
var c = cv.getContext('2d');
var txtDiv = document.getElementById('txt');
var fileBtn = document.getElementById("up-button");
var Sw=window.innerWidth;//屏幕宽度
var Sh=window.innerHeight;//屏幕高度
var img = new Image();
img.src = 'img1.png';
img.onload = init; // 图片加载完开始转换
fileBtn.onchange = getImg;

// 根据灰度生成相应字符
function toText(g) {
    if (g <= 30) {
        return '#';
    } else if (g > 30 && g <= 60) {
        return '&';
    } else if (g > 60 && g <= 120) {
        return '$';
    }  else if (g > 120 && g <= 150) {
        return '*';
    } else if (g > 150 && g <= 180) {
        return 'o';
    } else if (g > 180 && g <= 210) {
        return '!';
    } else if (g > 210 && g <= 240) {
        return ';';
    }  else {
        return '&nbsp;';
    }
}


// 根据rgb值计算灰度
function getGray(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
}

// 转换
function init() {
    var canvasLayout=getCanvasLayout(img);
    txtDiv.style.width = canvasLayout.canvasW + 'px';
    cv.width = canvasLayout.canvasW;
    cv.height = canvasLayout.canvasH;
    alert(canvasLayout.canvasW+"__"+canvasLayout.canvasH);
    c.drawImage(img, 0, 0,canvasLayout.canvasW, canvasLayout.canvasH);
    var imgData = c.getImageData(0, 0, canvasLayout.canvasW, canvasLayout.canvasH);
    var imgDataArr = imgData.data;
    var imgDataWidth = imgData.width;
    var imgDataHeight = imgData.height;
    var html = '';
    for (h = 0; h < imgDataHeight; h += 12) {
        var p = '<p>';
        for (w = 0; w < imgDataWidth; w += 7.1) {
            var index = Math.floor((w + imgDataWidth * h) * 4);
            var r = imgDataArr[index + 0];
            var g = imgDataArr[index + 1];
            var b = imgDataArr[index + 2];
            var gray = getGray(r, g, b);
            p += toText(gray);
        }
        p += '</p>';
        html += p;
    }
    txtDiv.innerHTML = html;
}

//获取canvas的宽高
function getCanvasLayout(img){
    var imgW=img.width;
    var imgH=img.height;
    if(img.width>Sw&&img.height>Sh) {
        if (imgW / Sw > imgH / Sh) {
            return {
                canvasW: Sw,
                canvasH: imgH * Sw /imgW
            }
        } else {
            return {
                canvasW: imgW * Sh /imgH ,
                canvasH: Sh
            }
        }
    }else if(img.width>Sw){
        return {
            canvasW: Sw,
            canvasH: imgH* Sw /imgW
        }
    }else if(img.height>Sh){
        return {
            canvasW: imgW*Sh/imgH,
            canvasH: Sh
        }
    }
}

// 获取图片
function getImg(file) {
    var reader = new FileReader();
    reader.readAsDataURL(fileBtn.files[0]);
    reader.onload = function () {
        img.src = reader.result;
    }
}

//给图片加点击事件
var canvas = document.getElementById("cv");

canvas.addEventListener("click", touchStart, false);

function touchStart(event) {
    event.preventDefault();
    document.getElementById("up-button").click();
}