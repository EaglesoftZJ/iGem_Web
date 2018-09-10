'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _utils = require('flux/utils');

var _EventListener = require('fbjs/lib/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

var _ActorAppConstants = require('../../constants/ActorAppConstants');

var _PeerUtils = require('../../utils/PeerUtils');

var _PeerUtils2 = _interopRequireDefault(_PeerUtils);

var _MessageUtils = require('../../utils/MessageUtils');

var _Scroller = require('../common/Scroller.react');

var _Scroller2 = _interopRequireDefault(_Scroller);

var _DocumentRecordStore = require('../../stores/DocumentRecordStore.js');

var _DocumentRecordStore2 = _interopRequireDefault(_DocumentRecordStore);

var _RingStore = require('../../stores/RingStore.js');

var _RingStore2 = _interopRequireDefault(_RingStore);

var _DocumentRecordCreators = require('../../actions/DocumentRecordCreators');

var _DocumentRecordCreators2 = _interopRequireDefault(_DocumentRecordCreators);

var _RingActionCreators = require('../../actions/RingActionCreators');

var _RingActionCreators2 = _interopRequireDefault(_RingActionCreators);

var _MessageItem = require('./messages/MessageItem.react');

var _MessageItem2 = _interopRequireDefault(_MessageItem);

var _Welcome = require('./messages/Welcome.react');

var _Welcome2 = _interopRequireDefault(_Welcome);

var _Loading = require('./messages/Loading.react');

var _Loading2 = _interopRequireDefault(_Loading);

var _Popover = require('../common/Popover.react');

var _Popover2 = _interopRequireDefault(_Popover);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _ImageUtils = require('../../utils/ImageUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var MessagesList = function (_Component) {
  _inherits(MessagesList, _Component);

  MessagesList.getStores = function getStores() {
    return [_DocumentRecordStore2.default, _RingStore2.default];
  };

  MessagesList.calculateState = function calculateState() {
    return {
      isShow: _DocumentRecordStore2.default.getShowState(),
      record: _DocumentRecordStore2.default.getCurrentRecord(),
      node: _DocumentRecordStore2.default.getCurrentNode(),
      ringDomId: _RingStore2.default.getRingDomId()
    };
  };

  function MessagesList(props, context) {
    _classCallCheck(this, MessagesList);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    console.log('messageList', props, context);

    _this.state = {
      showScrollToBottom: false,
      updateRecord: false
    };

    _this.dimensions = null;
    _this.isLoading = false;

    _this.onResize = _this.onResize.bind(_this);
    _this.onScroll = (0, _lodash.throttle)(_this.onScroll.bind(_this), 300);
    _this.handleScrollToBottom = _this.handleScrollToBottom.bind(_this);
    return _this;
  }

  MessagesList.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextProps.peer !== this.props.peer || nextProps.messages !== this.props.messages || nextProps.isMember !== this.props.isMember || nextState.showScrollToBottom !== this.state.showScrollToBottom;
  };

  MessagesList.prototype.componentWillMount = function componentWillMount() {
    // 渲染前
    var dialog = this.context.delegate.components.dialog;

    console.log('delegate components', this.context.delegate.components);
    if (dialog && dialog.messages) {
      this.components = {
        MessageItem: (0, _lodash.isFunction)(dialog.messages.message) ? dialog.messages.message : _MessageItem2.default,
        Welcome: (0, _lodash.isFunction)(dialog.messages.welcome) ? dialog.messages.welcome : _Welcome2.default
      };
    } else {
      this.components = {
        MessageItem: _MessageItem2.default,
        Welcome: _Welcome2.default
      };
    }
  };

  MessagesList.prototype.componentDidMount = function componentDidMount() {
    this.restoreScroll();
    // this.setListeners();
  };

  MessagesList.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanListeners();
  };

  MessagesList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var messages = this.props.messages.messages;
    // console.log('message change', messages.length , nextProps.messages.messages.length, messages.slice(-1)[0] && messages.slice(-1)[0].rid, nextProps.messages.messages.slice(-2)[0] && nextProps.messages.messages.slice(-2)[0].rid)
    //   if (messages.length +  1 === nextProps.messages.messages.length && 
    //     messages.slice(-1)[0].rid === nextProps.messages.messages.slice(-2)[0].rid &&
    //     nextProps.messages.messages.slice(-1)[0].content.content === 'text') {
    //         // 新的消息
    //         console.log('新消息新消息');
    //         setTimeout(function() {
    //             RingActionCreators.setNew(true);
    //         }, 1);
    //   }

    if (!_PeerUtils2.default.equals(nextProps.peer, this.props.peer)) {
      this.dimensions = null;
      this.isLoading = false;
    } else {
      this.updateDimensions(this.refs.scroller.getDimensions());
    }
  };

  // componentWillUpdate(nextProps, nextState) {
  //     const { message } = this.state;
  //     if (nextState.message != message) {
  //         this.setState({updateRecord: true});
  //     }
  // }

  MessagesList.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _state = this.state,
        isShow = _state.isShow,
        record = _state.record;

    console.log('更新更新', prevState.isShow, isShow, prevState, this.state, prevProps, this.props);
    if (!prevState.isShow && isShow) {
      this.setListeners();
    }
    if (prevState.showScrollToBottom !== this.state.showScrollToBottom || prevState.record !== record || prevState.isShow !== isShow) {
      return;
    }
    var dimensions = this.dimensions,
        scroller = this.refs.scroller,
        _props = this.props,
        uid = _props.uid,
        messages = _props.messages;

    if (prevProps.messages.messages !== messages.messages) {
      console.log('message发生改变了！！！');
      // lightbox.load({
      //     boxId: false,
      //     dimensions: true,
      //     captions: true,
      //     prevImg: false,
      //     nextImg: false,
      //     hideCloseBtn: false,
      //     closeOnClick: true,
      //     animElCount: 4,
      //     preload: true,
      //     carousel: false,
      //     animation: false,
      //     nextOnClick: true,
      //     responsive: true,
      //     maxImgSize: 0.8,
      //     // callbacks
      //     onopen: function (image) {
      //         // your code goes here
      //         console.log('onopen', image)
      //     },
      //     onclose: function (image) {
      //         // your code goes here
      //         console.log('onclose', image)
      //     },
      //     onload: function (event) {
      //         // your code goes here
      //         console.log('onload', event)
      //     },
      //     onresize: function (image) {
      //         // your code goes here
      //         console.log('onresize', image)
      //     },
      //     onloaderror: function (event) {
      //         // your code goes here
      //         console.log('onloaderror', event)
      //         // just display next or prev picture on error
      //         // if (event._happenedWhile === 'prev')
      //         //     lightbox.prev()
      //         // else
      //         //     lightbox.next()
      //     },
      //     onimageclick: function (image) {
      //         // your code goes here
      //         console.log('Image clicked!', image)
      //     }
      // });
    }
    if (messages.unreadId && messages.unreadId !== prevProps.messages.unreadId) {
      if (this.refs.unread) {
        this.refs.scroller.scrollToNode(this.refs.unread);
      }
    } else if (messages.changeReason === _ActorAppConstants.MessageChangeReason.PUSH) {
      var _isLastMessageMine = (0, _MessageUtils.isLastMessageMine)(uid, messages);
      if (!dimensions || _isLastMessageMine) {
        this.scrollToBottom();
      }
    } else if (messages.changeReason === _ActorAppConstants.MessageChangeReason.UNSHIFT) {
      this.isLoading = false;
      if (dimensions) {
        var nextDimensions = scroller.getDimensions();
        // Restore scroll
        scroller.scrollTo(nextDimensions.scrollHeight - dimensions.scrollHeight);
      } else {
        this.scrollToBottom();
      }
    } else {
      this.restoreScroll();
    }
  };

  MessagesList.prototype.setListeners = function setListeners() {
    this.cleanListeners();
    this.listeners = [
    // EventListener.listen(document, 'keydown', this.handleKeyDown),
    _EventListener2.default.listen(document, 'click', this.popoverHide.bind(this))];
  };

  MessagesList.prototype.cleanListeners = function cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        return listener.remove();
      });
      this.listeners = null;
    }
  };

  MessagesList.prototype.popoverHide = function popoverHide() {
    _DocumentRecordCreators2.default.hide();
    _DocumentRecordCreators2.default.setRecord([]);
    this.cleanListeners();
  };

  MessagesList.prototype.onScroll = function onScroll() {
    var isShow = this.state.isShow;

    var dimensions = this.refs.scroller.getDimensions();
    this.updateDimensions(dimensions);
    isShow && this.popoverHide();
    if (!this.isLoading && dimensions.scrollTop < 100) {
      this.isLoading = true;
      this.props.onLoadMore();
    }

    var showScrollToBottom = dimensions.scrollTop < dimensions.scrollHeight - 2 * dimensions.offsetHeight;

    if (showScrollToBottom !== this.state.showScrollToBottom) {
      this.setState({ showScrollToBottom: showScrollToBottom });
    }
  };

  MessagesList.prototype.onResize = function onResize() {
    var dimensions = this.dimensions,
        scroller = this.refs.scroller;

    if (dimensions) {
      // Fix scroll
      var ratio = dimensions.scrollTop / dimensions.scrollHeight;
      var nextDimensions = scroller.getDimensions();
      scroller.scrollTo(ratio * nextDimensions.scrollHeight);
      this.dimensions = nextDimensions;
    } else {
      scroller.scrollToBottom();
    }
  };

  MessagesList.prototype.handleScrollToBottom = function handleScrollToBottom() {
    this.refs.scroller.scrollToBottom();
  };

  MessagesList.prototype.handleScrollToMessage = function handleScrollToMessage() {
    var _this2 = this;

    var ringDomId = this.state.ringDomId;

    var span = document.getElementById(ringDomId);
    if (ringDomId && span) {
      console.log('new text', (0, _jquery2.default)(span).parents('.message').get(0));
      setTimeout(function () {
        _this2.refs.scroller.scrollToNode((0, _jquery2.default)(span).parents('.message').get(0));
      }, 100);
    }
    _RingActionCreators2.default.setRingDomId('');
  };

  MessagesList.prototype.handleTableClick = function handleTableClick(event) {
    event.nativeEvent.stopImmediatePropagation();
  };

  MessagesList.prototype.renderHeader = function renderHeader() {
    var _props2 = this.props,
        peer = _props2.peer,
        isMember = _props2.isMember,
        messages = _props2.messages;


    if (!isMember) {
      return null;
    }

    if (messages.isLoaded) {
      var Welcome = this.components.Welcome;

      return _react2.default.createElement(Welcome, { peer: peer, key: 'header' });
    }

    if (!messages.messages.length) {
      return null;
    }

    return _react2.default.createElement(_Loading2.default, { key: 'header' });
  };

  MessagesList.prototype.renderMessages = function renderMessages() {
    var _props3 = this.props,
        uid = _props3.uid,
        peer = _props3.peer,
        _props3$messages = _props3.messages,
        messages = _props3$messages.messages,
        overlay = _props3$messages.overlay,
        count = _props3$messages.count,
        selected = _props3$messages.selected,
        receiveDate = _props3$messages.receiveDate,
        readDate = _props3$messages.readDate,
        editId = _props3$messages.editId,
        unreadId = _props3$messages.unreadId;
    var MessageItem = this.components.MessageItem;


    var result = [];
    for (var index = messages.length - count; index < messages.length; index++) {
      var message = messages[index];
      if (message.rid === unreadId) {
        result.push(_react2.default.createElement(
          'div',
          { className: 'unread-divider', ref: 'unread', key: 'unread' },
          _react2.default.createElement(
            'div',
            { className: 'text' },
            _react2.default.createElement(
              'i',
              { className: 'material-icons' },
              'expand_more'
            ),
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'message.unread' }),
            _react2.default.createElement(
              'i',
              { className: 'material-icons' },
              'expand_more'
            )
          )
        ));
      }

      var overlayItem = overlay[index];
      if (overlayItem && overlayItem.dateDivider) {
        result.push(_react2.default.createElement(
          'div',
          { className: 'date-divider', key: overlayItem.dateDivider },
          overlayItem.dateDivider
        ));
      }

      result.push(_react2.default.createElement(MessageItem, {
        peer: peer,
        message: message,
        state: (0, _MessageUtils.getMessageState)(message, uid, receiveDate, readDate),
        isShort: overlayItem.useShort,
        isSelected: selected.has(message.rid),
        isEditing: editId === message.rid,
        onEdit: this.props.onEdit,
        onSelect: this.props.onSelect,
        key: message.sortKey
      }));
    }

    return result;
  };

  MessagesList.prototype.renderScrollToBottomButton = function renderScrollToBottomButton() {
    var showScrollToBottom = this.state.showScrollToBottom;

    if (!showScrollToBottom) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: 'chat__scroll-to-bottom', onClick: this.handleScrollToBottom },
      _react2.default.createElement(
        'i',
        { className: 'material-icons' },
        'keyboard_arrow_down'
      )
    );
  };

  MessagesList.prototype.renderScrollToMessage = function renderScrollToMessage() {
    console.log('renderScrollToMessage==================');
    var ringDomId = this.state.ringDomId;

    console.log('重新渲染数据', ringDomId);
    if (!ringDomId) {
      return null;
    }
    return _react2.default.createElement(
      'div',
      { className: 'chat__scroll-to-bottom chat__scroll-to-message', onClick: this.handleScrollToMessage.bind(this) },
      _react2.default.createElement(
        'i',
        null,
        '@'
      )
    );
  };

  MessagesList.prototype.renderInfo = function renderInfo() {
    // 渲染下载详情
    var record = this.state.record;

    if (!record || record.length === 0) {
      return null;
    }
    var tr = record.map(function (item, index) {
      return _react2.default.createElement(
        'tr',
        { key: index },
        _react2.default.createElement(
          'td',
          null,
          item.userName
        ),
        _react2.default.createElement(
          'td',
          null,
          '\u4E8E',
          item.time,
          '\u4E0B\u8F7D'
        )
      );
    });
    return _react2.default.createElement(
      'table',
      { className: 'message_record_table', onClick: this.handleTableClick },
      _react2.default.createElement(
        'tbody',
        null,
        tr
      )
    );
  };

  MessagesList.prototype.render = function render() {
    var _state2 = this.state,
        node = _state2.node,
        isShow = _state2.isShow;

    var addLeft = this.refs.outer ? 305 - this.refs.outer.clientWidth : 0;
    var addTop = ((0, _jquery2.default)(node).height() - 22) / 2;
    console.log('偏移量', addLeft, addTop);
    console.log('node isShow', node, isShow);
    return _react2.default.createElement(
      'div',
      { className: 'chat__container', ref: 'outer' },
      _react2.default.createElement(
        _Popover2.default,
        { node: node, isShow: isShow, container: this.refs.outer, addLeft: addLeft, addTop: addTop, maxHeight: 300, emptyMsg: 'message.documentRecord' },
        this.renderInfo()
      ),
      _react2.default.createElement(
        _Scroller2.default,
        {
          className: 'chat__messages',
          ref: 'scroller',
          onScroll: this.onScroll,
          onResize: this.onResize
        },
        this.renderHeader(),
        this.renderMessages()
      ),
      _react2.default.createElement(
        'div',
        { className: 'chat__scroll-to-box' },
        this.renderScrollToMessage(),
        this.renderScrollToBottomButton()
      )
    );
  };

  MessagesList.prototype.scrollToBottom = function scrollToBottom() {
    this.dimensions = null;
    this.refs.scroller.scrollToBottom();
  };

  MessagesList.prototype.updateDimensions = function updateDimensions(dimensions) {
    if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
      // Lock scroll to bottom
      this.dimensions = null;
    } else {
      this.dimensions = dimensions;
    }
  };

  MessagesList.prototype.restoreScroll = function restoreScroll() {
    var dimensions = this.dimensions,
        scroller = this.refs.scroller;


    if (dimensions) {
      scroller.scrollTo(dimensions.scrollTop);
    } else {
      scroller.scrollToBottom();
    }
  };

  return MessagesList;
}(_react.Component);

MessagesList.contextTypes = {
  delegate: _react.PropTypes.object.isRequired
};
MessagesList.propTypes = {
  uid: _react.PropTypes.number.isRequired,
  peer: _react.PropTypes.object.isRequired,
  messages: _react.PropTypes.shape({
    messages: _react.PropTypes.array.isRequired,
    overlay: _react.PropTypes.array.isRequired,
    count: _react.PropTypes.number.isRequired,
    isLoaded: _react.PropTypes.bool.isRequired,
    receiveDate: _react.PropTypes.number.isRequired,
    readDate: _react.PropTypes.number.isRequired,
    editId: _react.PropTypes.string,
    unreadId: _react.PropTypes.string,
    selected: _react.PropTypes.object.isRequired,
    changeReason: _react.PropTypes.oneOf([_ActorAppConstants.MessageChangeReason.UNKNOWN, _ActorAppConstants.MessageChangeReason.PUSH, _ActorAppConstants.MessageChangeReason.UNSHIFT, _ActorAppConstants.MessageChangeReason.UPDATE]).isRequired
  }).isRequired,
  isMember: _react.PropTypes.bool.isRequired,
  onSelect: _react.PropTypes.func.isRequired,
  onLoadMore: _react.PropTypes.func.isRequired,
  onEdit: _react.PropTypes.func.isRequired
};
exports.default = _utils.Container.create(MessagesList, { withProps: true, withContext: true });

;
//# sourceMappingURL=MessagesList.react.js.map