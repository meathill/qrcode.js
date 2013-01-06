/**
 * @overview 插入二维码
 * @author Meathill
 * @since 0.1
 */
'use strict';
var MH = {};
MH.insertQrcode = (function () {
  /**
   * 侦听load事件，不考虑“onload=”以免误伤
   */
  function addHandler() {
    if (window.addEventListener) {
      window.addEventListener('load', insertQrcode, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', insertQrcode);
    }
  }
  /**
   * 移除对load的侦听
   */
  function removeHandler() {
    if (window.removeEventListener) {
      window.removeEventListener('load', insertQrcode, false);
    } else if (window.detachEvent) {
      window.detachEvent('onload', insertQrcode);
    }
  }
  /**
   * 向页面中插入二维码
   */
  function insertQrcode() {
    var qr = qrcode(4, 'M');
    qr.addData(param.url);
    qr.make();

    if (param.target) {
      document.getElementById(param.target).innerHTML = qr.createImgTag(param.width, 0);
      removeHandler();
      return;
    }

    var div = document.createElement('div'),
        img = qr.createImgTag(param.width, 0),
        p = document.createElement('p');
    div.id = 'qrcode';
    div.className = 'qrcode';
    p.innerHTML = param.label;
    p.align = 'center';
    div.innerHTML = img;
    div.appendChild(p);
    document.body.appendChild(div);

    removeHandler();
  }
  
  var param;
  /**
   * 入口函数
   * @param {type} url 转换成二维码的地址，为空则使用当前页面地址
   * @param {type} width 二维码点大小
   * @param {type} target 要插入页面元素的id，若为空则会新建一个浮动的容器
   * @param {type} label 浮动容器中的说明文字
   */
  return function (url, width, target, label) {
    param = {
      url: url || location.href,
      width: width,
      target: target,
      label: label
    };
    addHandler();
  };
})();