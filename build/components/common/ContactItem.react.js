'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _AvatarItem = require('./AvatarItem.react');

var _AvatarItem2 = _interopRequireDefault(_AvatarItem);

var _EmojiUtils = require('../../utils/EmojiUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ContactItem = function (_Component) {
  _inherits(ContactItem, _Component);

  function ContactItem(props) {
    _classCallCheck(this, ContactItem);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleMouseMove = function (event) {
      event.nativeEvent.stopImmediatePropagation();
    };

    _this.handleMouseEnter = function (id, event) {
      var instance = _this.props.instance;

      event.stopPropagation();
      instance.setState({ 'isShow': true, 'node': event.currentTarget, 'selectedUserId': id });
      instance.setListeners();
    };

    _this.popoverHide = function (event) {
      var isShow = _this.state.isShow;

      if (isShow) {
        _this.setState({ 'isShow': false });
      }
    };

    _this.shouldComponentUpdate = _reactAddonsPureRenderMixin.shouldComponentUpdate.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  ContactItem.prototype.componentDidMount = function componentDidMount() {
    console.log('instance', this.props.instance);
  };

  ContactItem.prototype.handleClick = function handleClick() {
    var onClick = this.props.onClick;

    onClick && onClick();
  };

  ContactItem.prototype.render = function render() {
    var _props = this.props,
        uid = _props.uid,
        name = _props.name,
        placeholder = _props.placeholder,
        avatar = _props.avatar,
        type = _props.type,
        children = _props.children,
        className = _props.className,
        showDetial = _props.showDetial;

    var contactClassName = (0, _classnames2.default)('contact row middle-xs', className);
    return _react2.default.createElement(
      'div',
      { className: contactClassName, onClick: this.handleClick },
      _react2.default.createElement(
        'div',
        { className: 'contact__avatar' },
        _react2.default.createElement(_AvatarItem2.default, {
          image: avatar,
          placeholder: placeholder,
          size: 'small',
          title: name
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'contact__body col-xs' },
        _react2.default.createElement('span', { className: 'title', dangerouslySetInnerHTML: { __html: (0, _EmojiUtils.escapeWithEmoji)(name) } }),
        showDetial && type !== 'group' ? _react2.default.createElement(
          'span',
          { className: 'account-icon', onMouseMove: this.handleMouseMove, onMouseEnter: this.handleMouseEnter.bind(this, uid) },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'account_circle'
          ),
          _react2.default.createElement(
            'i',
            { style: { fontStyle: 'normal', fontSize: '12px' } },
            '\u67E5\u770B\u8BE6\u60C5'
          )
        ) : null
      ),
      _react2.default.createElement(
        'div',
        { className: 'contact__controls' },
        children
      )
    );
  };

  return ContactItem;
}(_react.Component);

ContactItem.propTypes = {
  uid: _react.PropTypes.number.isRequired,
  name: _react.PropTypes.string.isRequired,
  placeholder: _react.PropTypes.string.isRequired,
  avatar: _react.PropTypes.string,
  type: _react.PropTypes.string,

  className: _react.PropTypes.string,

  onClick: _react.PropTypes.func,

  children: _react.PropTypes.node,
  showDetial: _react.PropTypes.bool,
  instance: _react.PropTypes.object
};
exports.default = ContactItem;
//# sourceMappingURL=ContactItem.react.js.map