(function($) {
  'use strict';
  $.dataURLtoBlob = function(data) {
    var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
    var byteString = atob(data.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
    if (bb) {
      //    console.log('BlobBuilder');
      bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
      bb.append(ab);
      return bb.getBlob(mimeString);
    } else {
      //    console.log('Blob');
      bb = new Blob([ab], {
        'type': (mimeString)
      });
      return bb;
    }
  };

  $.convertImgToBase64 = function(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
      // Clean up
      canvas = null;
    };
    img.src = url;
  };
  $.fn.serializeObject = function () {

    var result = {};
    var extend = function (i, element) {
      var node = result[element.name];

      // If node with same name exists already, need to convert it to an array as it
      // is a multi-value field (i.e., checkboxes)

      if ('undefined' !== typeof node && node !== null) {
        if ($.isArray(node)) {
          node.push(element.value);
        } else {
          result[element.name] = [node, element.value];
        }
      } else {
        result[element.name] = element.value;
      }
    };

    $.each(this.serializeArray(), extend);
    return result;
  };

  $.convertHex = function(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
  };

  $.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  $.humanFileSize = function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    var units = si        ?
                ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  };
})(jQuery);
