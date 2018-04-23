/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */
import '../vendor/canvasBlurRect';
// import Lightbox from 'jsonlylightbox';
import Lightbox from '../../assets/scripts/lightbox.js';
import ActorClient from '../utils/ActorClient';
import MessageAlertActionCreators from '../actions/MessageAlertActionCreators';
import DialogStore from '../stores/DialogStore';

const lightbox = new Lightbox();

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const buffer = new ArrayBuffer(byteString.length);

  let view = new Uint8Array(buffer);
  for (let i in byteString) {
    view[i] = byteString.charCodeAt(i);
  }

  return new Blob([view], { type: mimeString });
};

export {
  lightbox,
  dataURItoBlob
};

export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img')
    image.onerror = reject;
    image.onload = () => {
      image.onerror = null;
      image.onload = null;
      resolve(image);
    };

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = source;
  });
}

export function renderImageToCanvas(source, canvas) {
  return loadImage(source).then((image) => {
    const width = canvas.width = image.width;
    const height = canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    ctx._blurRect(0, 0, width, height, 4, 1);
  });
}

export function getDimentions(width, height, maxWidth = 300, maxHeight = 400) {
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

  return { width, height };
}

export function handleCopy(url) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      document.body.appendChild(canvas);
      var dataUrl = canvas.toDataURL();
      ActorClient.sendToElectron('copy-image', {dataUrl});
      MessageAlertActionCreators.show({title: '图片复制成功', type: 'success', key: new Date().getTime()})

    }
    img.src = url;
}

export function downloadClick(url) {
    // 点击下载
    location.href = url;
    // window.open(url, 'self');
    // var peer = DialogStore.getCurrentPeer();
    // if (ActorClient.isElectron()) {
    //     window.messenger.sendToElectron('will-download-info', {rid: message.rid, ...peer});
    // }
}
