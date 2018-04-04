'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ImageUtils = require('../../../utils/ImageUtils');

var _ActorClient = require('../../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _DialogStore = require('../../../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _MessageAlertActionCreators = require('../../../actions/MessageAlertActionCreators');

var _MessageAlertActionCreators2 = _interopRequireDefault(_MessageAlertActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Photo = function (_Component) {
  _inherits(Photo, _Component);

  function Photo() {
    _classCallCheck(this, Photo);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.state = {
      peer: _DialogStore2.default.getCurrentPeer()
    };
    return _this;
  }

  Photo.prototype.onClick = function onClick(event) {
    event.preventDefault();
    _ImageUtils.lightbox.open(event.target.src, 'message');
  };

  Photo.prototype.getDimentions = function getDimentions() {
    var _props = this.props,
        width = _props.w,
        height = _props.h;

    return (0, _ImageUtils.getDimentions)(width, height);
  };

  Photo.prototype.handleCopy = function handleCopy() {
    var _props2 = this.props,
        fileUrl = _props2.fileUrl,
        preview = _props2.preview;

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
    img.src = fileUrl || preview;
  };

  Photo.prototype.downloadClick = function downloadClick() {
    // 点击下载
    var peer = this.state.peer;

    if (_ActorClient2.default.isElectron()) {
      window.messenger.sendToElectron('will-download-peer', peer);
    }
  };

  Photo.prototype.render = function render() {
    var _props3 = this.props,
        fileUrl = _props3.fileUrl,
        preview = _props3.preview;

    var _getDimentions2 = this.getDimentions(),
        width = _getDimentions2.width,
        height = _getDimentions2.height;

    console.log(fileUrl, preview);

    return _react2.default.createElement(
      'div',
      { className: 'message__photo__box' },
      _react2.default.createElement('img', {
        className: 'message__photo',
        src: fileUrl || preview,
        width: width,
        height: height,
        onClick: this.onClick
      }),
      _ActorClient2.default.isElectron() ? _react2.default.createElement(
        'div',
        { className: 'btn-box' },
        _react2.default.createElement(
          'a',
          { className: 'download img-icon', href: fileUrl || preview, onClick: this.downloadClick.bind(this), download: fileUrl || preview, target: '_self' },
          '\u4E0B\u8F7D'
        ),
        _react2.default.createElement(
          'a',
          { className: 'copy img-icon', href: 'javascript:;', target: '_self', onClick: this.handleCopy.bind(this) },
          '\u590D\u5236'
        )
      ) : null
    );
  };

  return Photo;
}(_react.Component);

Photo.propTypes = {
  fileUrl: _react.PropTypes.string,
  w: _react.PropTypes.number.isRequired,
  h: _react.PropTypes.number.isRequired,
  preview: _react.PropTypes.string.isRequired,
  isUploading: _react.PropTypes.bool.isRequired
};
exports.default = Photo;
//# sourceMappingURL=Photo.react.js.map