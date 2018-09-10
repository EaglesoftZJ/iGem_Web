'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _linq = require('linq');

var _linq2 = _interopRequireDefault(_linq);

var _ActorClient = require('../../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _EmojiUtils = require('../../../utils/EmojiUtils');

var _QuickSearchStore = require('../../../stores/QuickSearchStore');

var _QuickSearchStore2 = _interopRequireDefault(_QuickSearchStore);

var _RingStore = require('../../../stores/RingStore');

var _RingStore2 = _interopRequireDefault(_RingStore);

var _ProfileStore = require('../../../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _RingActionCreators = require('../../../actions/RingActionCreators');

var _RingActionCreators2 = _interopRequireDefault(_RingActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Text = function (_Component) {
  _inherits(Text, _Component);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Text.prototype.renderMessage = function renderMessage() {
    var _props = this.props,
        text = _props.text,
        className = _props.className;

    var _JSON$parse = JSON.parse(text),
        rid = _JSON$parse.rid,
        uid = _JSON$parse.uid;

    var msg = JSON.parse(text).text;
    if (_ProfileStore2.default.getProfile().id === uid) {
      msg = '您撤回了一条消息';
    }
    return msg;
  };

  Text.prototype.render = function render() {
    var _props2 = this.props,
        text = _props2.text,
        className = _props2.className,
        id = _props2.id;


    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement(
        'div',
        { className: 'text systext' },
        this.renderMessage()
      )
    );
  };

  return Text;
}(_react.Component);

Text.propTypes = {
  text: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.number.isRequired,
  className: _react.PropTypes.string
};
exports.default = Text;
//# sourceMappingURL=SysText.react.js.map