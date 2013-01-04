$(function () {
  function createQrcode(url) {
    var qr = qrcode(4, 'M');
    qr.addData(url);
    qr.make();
    
    return qr.createImgTag(6, 0);
  }
  function refreshPreview() {
    var url = $('#url').val().replace(/^[\s\u3000]+|[\s\u3000]+$/g, ''),
        img = createQrcode(url);
    $('#preview')
      .empty()
      .append(img);
  }

  $('form')
    .on('click', '.preview-button', function (event) {
      refreshPreview();
    })
    .on('click', '.target-button', function (event) {
      $('form')
        .removeClass('dom float')
        .addClass(this.value);
    });
  
  $('#url').val(location.href);
  refreshPreview();
});


