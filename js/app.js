"use strict";
$(function () {
  function createQrcode(url) {
    var qr = qrcode(4, 'M');
    qr.addData(url);
    qr.make();
    
    return qr.createImgTag($('#width').val(), 0);
  }
  function refreshPreview() {
    var url = $('#url').val();
    url = url === '' ? location.href : url.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
    var data = {
      img: createQrcode(url),
      title: $('#label').val()
    };
    $('#preview').html(inline(data));
    $('#qrcode').html(fixed(data));
  }
  function refreshCode() {
    if (template === null) {
      return;
    }
    var context = {
      url: $('#url').val(),
      width: $('#width').val(),
      target: $('button[value=dom]').hasClass('active') ? $('#target').val() : null,
      label: $('#label').val()
    };
    $('#output').val(template(context));
  }

  var inline = Handlebars.compile($('#preview').find('script').html())
    , fixed = Handlebars.compile($('#qrcode').find('script').html());

  $('form')
    .on('submit', function (event) {
      refreshPreview();
      refreshCode();
      event.preventDefault();
    })
    .on('change', '[name=position]', function () {
      $('body')
        .removeClass('inline fixed')
        .addClass(this.value);
      setTimeout(refreshCode, 10);
    })
    .on('change', '#width', function (event) {
      var width = this.value * 33;
      $('#canvas-size').text(width + '×' + width);
    })
    .on('change', '[name=url], [name=width]', function () {
      refreshPreview();
      refreshCode();
    });
  
  // 处理剪切板
  var clip = new ZeroClipboard(document.getElementById('copy-button'));
  clip.on('aftercopy', function () {
    $('#copy-button')
      .tooltip({
        placement: 'right',
        trigger: 'manual'
      })
      .tooltip('show');
    setTimeout(function () {
      $('#copy-button').tooltip('hide');
    }, 3000);
  });

  // 生成默认二维码
  refreshPreview();
  
  // 加载输出模版
  var template;
  $.get('./template/output.hbs', function (response) {
    template = Handlebars.compile(response);
    refreshCode();
  },  'html');
});


