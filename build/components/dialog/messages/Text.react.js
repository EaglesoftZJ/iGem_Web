'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _ActorClient = require('../../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _EmojiUtils = require('../../../utils/EmojiUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function processText(text) {
  var processedText = text;
  var md = new _markdownIt2.default({
    linkify: true
  });
  processedText = md.render(processedText);

  processedText = processedText.replace(/<a[\w\s]*href=/g, function (str) {
    str = str.slice(0, 2) + ' target="_blank" onClick="window.messenger.handleLinkClick(event)"' + str.slice(2);
    return str;
  });

  // processedText = ActorClient.renderMarkdown(processedText);
  // 链接匹配
  //   var exp = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g
  //   processedText = processedText.replace(exp, (str) => {
  //     var url = /^http/.test(str) ? str : 'http://' + str;
  //     return `<a target="_blank" href="${url}" onClick="window.messenger.handleLinkClick(event)">${str}</a>`;
  //   });


  processedText = (0, _EmojiUtils.processEmojiText)(processedText);
  processedText = processedText.replace(/(@[0-9a-zA-Z_]{5,32})/ig, '<span class="message__mention">$1</span>');

  return processedText;
}

var Text = function (_Component) {
  _inherits(Text, _Component);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Text.prototype.render = function render() {
    var _props = this.props,
        text = _props.text,
        className = _props.className;


    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement('div', { className: 'text', dangerouslySetInnerHTML: { __html: processText(text) } })
    );
  };

  return Text;
}(_react.Component);

Text.propTypes = {
  text: _react.PropTypes.string.isRequired,
  className: _react.PropTypes.string
};
exports.default = Text;
//# sourceMappingURL=Text.react.js.map