'use strict';

exports.__esModule = true;
exports.dataURItoBlob = exports.lightbox = undefined;
exports.loadImage = loadImage;
exports.renderImageToCanvas = renderImageToCanvas;
exports.getDimentions = getDimentions;
exports.handleCopy = handleCopy;
exports.downloadClick = downloadClick;

require('../vendor/canvasBlurRect');

var _lightbox = require('../../assets/scripts/lightbox.js');

var _lightbox2 = _interopRequireDefault(_lightbox);

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _MessageAlertActionCreators = require('../actions/MessageAlertActionCreators');

var _MessageAlertActionCreators2 = _interopRequireDefault(_MessageAlertActionCreators);

var _DialogStore = require('../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Lightbox from 'jsonlylightbox';
var lightbox = new _lightbox2.default(); /*
                                          * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                          */


var dataURItoBlob = function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var buffer = new ArrayBuffer(byteString.length);

  var view = new Uint8Array(buffer);
  for (var i in byteString) {
    view[i] = byteString.charCodeAt(i);
  }

  return new Blob([view], { type: mimeString });
};

exports.lightbox = lightbox;
exports.dataURItoBlob = dataURItoBlob;
function loadImage(source) {
  return new Promise(function (resolve, reject) {
    var image = document.createElement('img');
    image.onerror = reject;
    image.onload = function () {
      image.onerror = null;
      image.onload = null;
      resolve(image);
    };

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = source;
  });
}

function renderImageToCanvas(source, canvas) {
  return loadImage(source).then(function (image) {
    var width = canvas.width = image.width;
    var height = canvas.height = image.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    ctx._blurRect(0, 0, width, height, 4, 1);
  });
}

function getDimentions(width, height) {
  var maxWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  var maxHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 400;

  if (width > height) {
    if (width > maxWidth) {
      return {
        width: maxWidth,
        height: height * (maxWidth / width)
      };
    }
  } else if (height > maxHeight) {
    return {
      width: width * (maxHeight / height),
      height: maxHeight
    };
  }

  return { width: width, height: height };
}

function handleCopy(url) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = function () {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    document.body.appendChild(canvas);
    var dataUrl = canvas.toDataURL();
    _ActorClient2.default.sendToElectron('copy-image', { dataUrl: dataUrl });
    _MessageAlertActionCreators2.default.show({ title: '图片复制成功', type: 'success', key: new Date().getTime() });
  };
  img.src = url;
}

function downloadClick(url) {
  // 点击下载
  location.href = url;
  // window.open(url, 'self');
  // var peer = DialogStore.getCurrentPeer();
  // if (ActorClient.isElectron()) {
  //     window.messenger.sendToElectron('will-download-info', {rid: message.rid, ...peer});
  // }
}
//# sourceMappingURL=ImageUtils.js.map