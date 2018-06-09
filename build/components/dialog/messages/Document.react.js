'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactIntl = require('react-intl');

var _rcTooltip = require('rc-tooltip');

var _rcTooltip2 = _interopRequireDefault(_rcTooltip);

var _DialogStore = require('../../../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _ActorClient = require('../../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Class that represents a component for display document message content
 */
var Document = function (_Component) {
  _inherits(Document, _Component);

  function Document(props, context) {
    _classCallCheck(this, Document);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      peer: _DialogStore2.default.getCurrentPeer()
    };
    return _this;
  }

  Document.prototype.renderIcon = function renderIcon() {
    var _props = this.props,
        fileUrl = _props.fileUrl,
        isUploading = _props.isUploading;


    if (isUploading) {
      return _react2.default.createElement(
        'div',
        { className: 'document__icon' },
        _react2.default.createElement(
          'i',
          { className: 'material-icons' },
          'attach_file'
        )
      );
    } else {
      return _react2.default.createElement(
        'a',
        { className: 'document__icon', href: fileUrl },
        _react2.default.createElement(
          'i',
          { className: 'material-icons' },
          'attach_file'
        )
      );
    }
  };

  Document.prototype.renderPrview = function renderPrview() {
    // 渲染预览按钮
    if (!this.checkOfficeFile()) {
      return null;
    }
    return _react2.default.createElement(
      'a',
      { href: 'javascript:;', onClick: this.handlePreviewClick.bind(this) },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'message.preview' })
    );
  };

  Document.prototype.renderActions = function renderActions() {
    var _props2 = this.props,
        fileUrl = _props2.fileUrl,
        isUploading = _props2.isUploading;


    if (isUploading) {
      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'message.uploading' })
      );
    } else {
      decodeURIComponent;
      return _react2.default.createElement(
        'div',
        { className: 'btn-group' },
        this.renderPrview(),
        _react2.default.createElement(
          'a',
          { href: fileUrl, onClick: this.handleDownloadClick.bind(this) },
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'message.download' })
        ),
        _react2.default.createElement(
          _rcTooltip2.default,
          {
            placement: 'top',
            mouseEnterDelay: 0.15,
            mouseLeaveDelay: 0,
            overlay: _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'tooltip.documentRecord' }) },
          _react2.default.createElement(
            'button',
            { onMouseMove: this.handleMouseMove, onClick: this.handleOpenRecord.bind(this), className: 'button button--icon', style: { padding: 0, height: 24, marginTop: -2, marginLeft: 5, color: '#468ee5' } },
            _react2.default.createElement(
              'i',
              { style: { fontSize: 20 }, className: 'material-icons' },
              'history'
            )
          )
        )
      );
    }
  };

  Document.prototype.handleDownloadClick = function handleDownloadClick() {
    var peer = this.state.peer;
    var message = this.context.message;

    if (_ActorClient2.default.isElectron()) {
      window.messenger.sendToElectron('will-download-info', _extends({ rid: message.rid }, peer));
    }
  };

  Document.prototype.handlePreviewClick = function handlePreviewClick() {
    var _props3 = this.props,
        fileUrl = _props3.fileUrl,
        fileName = _props3.fileName;

    var type = this.checkOfficeFile();
    if (type) {
      var arr = fileUrl.split('?');
      var arr1 = arr[0].split('/');
      var name = encodeURIComponent(encodeURIComponent(arr1.slice(-1)[0]));
      var filePath = '';
      switch (type) {
        case 'doc':
        case 'docx':
          filePath = '/wv/wordviewerframe.aspx?';
          break;
        case 'xls':
        case 'xlsx':
          filePath = '/x/_layouts/xlviewerinternal.aspx?';
          break;
        case 'ppt':
        case 'pptx':
          filePath = '/p/PowerPointFrame.aspx?';
          break;
        case 'pdf':
          filePath = '/wv/wordviewerframe.aspx?PdfMode=1&';
          break;
      }
      var url = 'http://220.189.207.21' + filePath + 'WOPISrc=http://61.175.100.14:8090/FlyChatWebService/wopi/files/' + arr1.slice(-2, -1)[0] + '/' + name;
      _ActorClient2.default.isElectron() ? _ActorClient2.default.sendToElectron('openLink', { url: url }) : window.open(url);
    }
  };

  Document.prototype.handleOpenRecord = function handleOpenRecord(event) {
    var showDocumentRecord = this.context.showDocumentRecord;

    showDocumentRecord();
    event.nativeEvent.stopImmediatePropagation();
  };

  Document.prototype.handleMouseMove = function handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  };

  Document.prototype.checkOfficeFile = function checkOfficeFile() {
    var fileName = this.props.fileName;

    if (/\.(doc|xls|ppt|docx|xlsx|pptx|pdf)$/.test(fileName)) {
      return RegExp.$1;
    }
    return false;
  };

  Document.prototype.render = function render() {
    var _props4 = this.props,
        fileName = _props4.fileName,
        fileSize = _props4.fileSize,
        fileExtension = _props4.fileExtension,
        className = _props4.className;


    var documentClassName = (0, _classnames2.default)(className, 'row');

    return _react2.default.createElement(
      'div',
      { className: documentClassName, ref: true },
      _react2.default.createElement(
        'div',
        { className: 'document row' },
        this.renderIcon(),
        _react2.default.createElement(
          'div',
          { className: 'col-xs' },
          _react2.default.createElement(
            'span',
            { className: 'document__filename' },
            fileName
          ),
          _react2.default.createElement(
            'div',
            { className: 'document__meta' },
            _react2.default.createElement(
              'span',
              { className: 'document__meta__size' },
              fileSize
            ),
            _react2.default.createElement(
              'span',
              { className: 'document__meta__ext' },
              fileExtension
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'document__actions' },
            this.renderActions()
          )
        )
      ),
      _react2.default.createElement('div', { className: 'col-xs' })
    );
  };

  return Document;
}(_react.Component);

Document.propTypes = {
  fileUrl: _react.PropTypes.string,
  fileName: _react.PropTypes.string.isRequired,
  fileSize: _react.PropTypes.string.isRequired,
  fileExtension: _react.PropTypes.string.isRequired,
  isUploading: _react.PropTypes.bool.isRequired,
  className: _react.PropTypes.string,
  sortKey: _react.PropTypes.string,
  container: _react.PropTypes.object
};
Document.contextTypes = {
  showDocumentRecord: _react.PropTypes.func,
  message: _react.PropTypes.object
};
exports.default = Document;
//# sourceMappingURL=Document.react.js.map