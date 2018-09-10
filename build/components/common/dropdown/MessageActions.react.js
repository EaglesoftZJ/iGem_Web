'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EventListener = require('fbjs/lib/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

var _reactDom = require('react-dom');

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _isInside = require('../../../utils/isInside');

var _isInside2 = _interopRequireDefault(_isInside);

var _MessageUtils = require('../../../utils/MessageUtils');

var _ActorClient = require('../../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _ActorAppConstants = require('../../../constants/ActorAppConstants');

var _ProfileStore = require('../../../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _MessageActionCreators = require('../../../actions/MessageActionCreators');

var _MessageActionCreators2 = _interopRequireDefault(_MessageActionCreators);

var _ComposeActionCreators = require('../../../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _DropdownActionCreators = require('../../../actions/DropdownActionCreators');

var _DropdownActionCreators2 = _interopRequireDefault(_DropdownActionCreators);

var _UserStore = require('../../../stores/UserStore');

var _UserStore2 = _interopRequireDefault(_UserStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var MessageActions = function (_Component) {
  _inherits(MessageActions, _Component);

  function MessageActions(props) {
    _classCallCheck(this, MessageActions);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleDocumentClick = function (event) {
      var dropdown = (0, _reactDom.findDOMNode)(_this.refs.dropdown);
      var dropdownRect = dropdown.getBoundingClientRect();
      var coords = {
        x: event.pageX || event.clientX,
        y: event.pageY || event.clientY
      };

      if (!(0, _isInside2.default)(coords, dropdownRect)) {
        event.preventDefault();
        _this.handleDropdownClose();
      }
    };

    _this.handleDropdownClose = function () {
      return _DropdownActionCreators2.default.hideMessageDropdown();
    };

    _this.handleDelete = function () {
      var _this$props = _this.props,
          peer = _this$props.peer,
          message = _this$props.message;

      _MessageActionCreators2.default.deleteMessage(peer, message.rid);
      _this.handleDropdownClose();
    };

    _this.handleRepeat = function () {
      // 消息转发
      var message = _this.props.message;

      var sendType = {
        'text': { type: 'sendTextMessage', key: 'text' },
        'photo': { type: 'sendPhotoMessage', key: 'preview' }
      };
      var type = sendType[message.content.content].type;
      var key = sendType[message.content.content].key;
      var peer1 = {
        id: 130508843,
        key: 'g130508843',
        type: 'group'
      };
      var peer2 = {
        id: 182777372,
        key: 'u182777372',
        type: 'user'
      };
      console.log('preview', message.content[key]);
      // ActorClient[type](peer1, message.content[key]);
      _ActorClient2.default[type](peer2, _this.dataURItoBlob(message.content[key]));
      // ActorClient.sendPhotoMessage
    };

    _this.handleReply = function () {
      var message = _this.props.message;

      var info = _UserStore2.default.getUser(message.sender.peer.id);
      var replyText = info.nick ? '@' + info.nick + ': ' : info.name + ': ';
      _ComposeActionCreators2.default.pasteText(replyText);
      _this.handleDropdownClose();
    };

    _this.handleQuote = function () {
      var message = _this.props.message;

      _ComposeActionCreators2.default.pasteText((0, _MessageUtils.quoteMessage)(message.content.text) + '\n');
      _this.handleDropdownClose();
    };

    _this.handleRevert = function () {
      var _this$props2 = _this.props,
          message = _this$props2.message,
          peer = _this$props2.peer,
          profile = _this$props2.profile;

      _ActorClient2.default.sendJson(peer, JSON.stringify({
        data: {
          text: '"' + profile.name + '"\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F',
          rid: message.rid,
          uid: message.sender.peer.id
        },
        dataType: 'revert',
        operation: 'revert'
      }));
    };

    _this.shouldComponentUpdate = _reactAddonsPureRenderMixin.shouldComponentUpdate.bind(_this);
    return _this;
  }

  MessageActions.prototype.componentDidMount = function componentDidMount() {
    this.listeners = [_EventListener2.default.capture(document, 'click', this.handleDocumentClick), _EventListener2.default.capture(document, 'scroll', this.handleDropdownClose)];
  };

  MessageActions.prototype.componentWillUnmount = function componentWillUnmount() {
    this.listeners.forEach(function (listener) {
      listener.remove();
    });

    this.listeners = null;
  };

  MessageActions.prototype.dataURItoBlob = function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  MessageActions.prototype.render = function render() {
    var _props = this.props,
        message = _props.message,
        targetRect = _props.targetRect,
        profile = _props.profile;

    console.log('profile12312312313123', profile, message.sender);
    var intl = this.context.intl;


    var isThisMyMessage = _UserStore2.default.getMyId() === message.sender.peer.id;

    var dropdownStyles = {
      top: targetRect.top,
      left: targetRect.left
    };

    var dropdownMenuStyles = {
      minWidth: 120,
      right: 2,
      top: -4
    };

    return _react2.default.createElement(
      'div',
      { className: 'dropdown dropdown--opened dropdown--small', style: dropdownStyles },
      _react2.default.createElement(
        'ul',
        { className: 'dropdown__menu dropdown__menu--right', ref: 'dropdown', style: dropdownMenuStyles },
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item hide' },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'star_rate'
          ),
          ' ',
          intl.messages['message.pin']
        ),
        message.content.content !== 'customJson' && message.content.operation !== 'revert' && message.sender.peer.id === profile.id && new Date().getTime() - parseFloat(message.sortKey) < 15 * 60 * 1000 ? _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.handleRevert },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'redo'
          ),
          ' ',
          intl.messages['message.redo']
        ) : null,
        !isThisMyMessage ? _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.handleReply },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'reply'
          ),
          ' ',
          intl.messages['message.reply']
        ) : null,
        message.content.content === _ActorAppConstants.MessageContentTypes.TEXT ? _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.handleQuote },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'format_quote'
          ),
          ' ',
          intl.messages['message.quote']
        ) : null,
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item hide' },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'forward'
          ),
          ' ',
          intl.messages['message.forward']
        ),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.handleDelete },
          _react2.default.createElement(
            'i',
            { className: 'icon material-icons' },
            'delete'
          ),
          ' ',
          intl.messages['message.delete']
        )
      )
    );
  };

  return MessageActions;
}(_react.Component);

MessageActions.propTypes = {
  peer: _react.PropTypes.object.isRequired,
  message: _react.PropTypes.object.isRequired,
  targetRect: _react.PropTypes.object.isRequired,
  profile: _react.PropTypes.object.isRequired
};
MessageActions.contextTypes = {
  intl: _react.PropTypes.object
};
exports.default = MessageActions;
//# sourceMappingURL=MessageActions.react.js.map