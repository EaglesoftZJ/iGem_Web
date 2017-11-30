'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actorReactScroll = require('actor-react-scroll');

var _EmojiTab = require('./EmojiTab.react');

var _EmojiTab2 = _interopRequireDefault(_EmojiTab);

var _EmojiItem = require('./EmojiItem.react');

var _EmojiItem2 = _interopRequireDefault(_EmojiItem);

var _emojiData = require('./emojiData');

var _emojiData2 = _interopRequireDefault(_emojiData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Emojis = function (_Component) {
  _inherits(Emojis, _Component);

  function Emojis(props) {
    _classCallCheck(this, Emojis);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      title: 'Emoji'
    };

    _this.onSetActive = _this.onSetActive.bind(_this);
    return _this;
  }

  Emojis.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextState.title !== this.state.title;
  };

  Emojis.prototype.onSetActive = function onSetActive(title) {
    this.setState({ title: title });
  };

  Emojis.prototype.render = function render() {
    var _this2 = this;

    var title = this.state.title;


    var emojis = [];
    var emojiTabs = [];

    _emojiData2.default.forEach(function (category, cKey) {
      emojiTabs.push(_react2.default.createElement(_EmojiTab2.default, { key: cKey, category: category, onSelect: _this2.onSetActive }));

      var items = category.items.map(function (emoji, iKey) {
        return _react2.default.createElement(_EmojiItem2.default, { key: iKey, emoji: emoji, onSelect: _this2.props.onSelect });
      });

      emojis.push(_react2.default.createElement(
        _actorReactScroll.Element,
        { name: category.title, key: cKey },
        _react2.default.createElement(
          'p',
          null,
          category.title
        ),
        items
      ));
    });

    return _react2.default.createElement(
      'div',
      { className: 'emojis' },
      _react2.default.createElement(
        'header',
        { className: 'emojis__header' },
        _react2.default.createElement(
          'p',
          { className: 'emojis__header__title' },
          title
        ),
        _react2.default.createElement(
          'div',
          { className: 'emojis__header__tabs' },
          emojiTabs
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'emojis__body', id: 'emojiContainer' },
        emojis
      )
    );
  };

  return Emojis;
}(_react.Component);

Emojis.propTypes = {
  onSelect: _react.PropTypes.func.isRequired
};
exports.default = Emojis;
//# sourceMappingURL=Emojis.react.js.map