"use strict";
$(function () {
  function createQrcode(url) {
    var qr = qrcode(4, 'M');
    qr.addData(url);
    qr.make();
    
    return qr.createImgTag($('#width').val(), 0);
  }
  function refreshPreview() {
    var url = $('#url').val(),
        url = url === '' ? location.href : url.replace(/^[\s\u3000]+|[\s\u3000]+$/g, ''),
        img = createQrcode(url);
    $('#preview')
      .empty()
      .append(img);
    $('#qrcode')
      .find('img').replaceWith(img)
      .end().find('p').text($('#label').val());
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

  $('form')
    .on('click', '.preview-button', function (event) {
      refreshPreview();
      refreshCode();
    })
    .on('click', '.target-button', function (event) {
      $('form')
        .removeClass('dom float')
        .addClass(this.value);
      if (this.value === 'dom') {
        $('#preview').show();
        $('#qrcode').remove();
        $('#preview-pos').addClass('hide');
      } else {
        var qrcode = $('<div id="qrcode" class="qrcode"></div>');
        qrcode
          .append($('#preview').children().clone())
          .append('<p align="center">' + $('#label').val() + '</p>')
          .appendTo('body');
        $('#preview').hide();
        $('#preview-pos').removeClass('hide');
      }
      setTimeout(refreshCode, 10);
    })
    .on('change', '#width', function (event) {
      var width = this.value * 33;
      $(this).closest('.controls').find('.help-block span').text(width + '×' + width);
    })
    .on('change', 'input', function (event) {
      refreshPreview();
      refreshCode();
    });
  
  // 处理剪切板
  ZeroClipboard.setMoviePath("./swf/ZeroClipboard.swf");
  var clip = new ZeroClipboard.Client("#copy-button");
  clip.on('mouseup', function (event) {
    clip.setText($('#output').val());
  });
  clip.on('complete', function (event) {
    alert('复制成功');
  });

  // 生成默认二维码
  refreshPreview();
  
  // 加载输出模版
  var template;
  $.ajax({
    url: './templates/output.html',
    dataType: 'html',
    success: function (response) {
      template = Handlebars.compile(response);
      refreshCode();
    }
  });
});


