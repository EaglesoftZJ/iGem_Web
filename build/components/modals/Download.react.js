'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _DownloadStore = require('../../stores/DownloadStore');

var _DownloadStore2 = _interopRequireDefault(_DownloadStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Download = function (_Component) {
  _inherits(Download, _Component);

  Download.getStores = function getStores() {
    return [_DownloadStore2.default];
  };

  Download.calculateState = function calculateState() {
    return {
      list: _DownloadStore2.default.getList()
    };
  };

  function Download(props, context) {
    _classCallCheck(this, Download);

    return _possibleConstructorReturn(this, _Component.call(this, props, context));
  }

  Download.prototype.render = function render() {
    var list = this.state.list;

    var arr = list.map(function (item, index) {
      return _react2.default.createElement(
        'div',
        { className: 'test-item' },
        index
      );
    });
    return _react2.default.createElement(
      _reactModal2.default,
      {
        overlayClassName: 'modal-overlay',
        className: 'modal',
        onRequestClose: this.handleClose,
        isOpen: true },
      _react2.default.createElement(
        'div',
        { className: 'document-list' },
        arr
      )
    );
  };

  return Download;
}(_react.Component);

exports.default = _utils.Container.create(Download);
//# sourceMappingURL=Download.react.js.map