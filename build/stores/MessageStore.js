'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _MessageUtils = require('../utils/MessageUtils');

var _UserStore = require('./UserStore');

var _UserStore2 = _interopRequireDefault(_UserStore);

var _DialogStore = require('./DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _MessageActionCreators = require('../actions/MessageActionCreators');

var _MessageActionCreators2 = _interopRequireDefault(_MessageActionCreators);

var _DialogActionCreators = require('../actions/DialogActionCreators');

var _DialogActionCreators2 = _interopRequireDefault(_DialogActionCreators);

var _linq = require('linq');

var _linq2 = _interopRequireDefault(_linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var MESSAGE_COUNT_STEP = 20;

var getMessageId = function getMessageId(message) {
  return message ? message.rid : null;
};

var MessageStore = function (_ReduceStore) {
  _inherits(MessageStore, _ReduceStore);

  function MessageStore() {
    _classCallCheck(this, MessageStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  MessageStore.prototype.getInitialState = function getInitialState() {
    return {
      messages: [], // 所有的聊天记录存在这里
      chatMessages: [], // 展示在聊天框中的聊天记录
      historyMessages: [], // 聊天记录查找结果数据
      historyQueryData: {
        dateRange: [new Date().getTime(), new Date().getTime()],
        filter: ''
      }, // 聊天记录查询条件
      historyLoaded: true, // 查询的历史数据是否加载完
      overlay: [],
      isLoaded: false,
      receiveDate: 0,
      readDate: 0,
      readByMeDate: 0,
      count: 0,
      firstId: null,
      lastId: null,
      unreadId: null,
      editId: null,
      changeReason: _ActorAppConstants.MessageChangeReason.UNKNOWN,
      selected: new _immutable2.default.Set()
    };
  };

  MessageStore.prototype.isAllRendered = function isAllRendered() {
    var _getState = this.getState(),
        messages = _getState.messages,
        count = _getState.count;

    return messages.length === count;
  };

  MessageStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.BIND_DIALOG_PEER:
        return this.getInitialState();

      case _ActorAppConstants.ActionTypes.HISTROY_MESSAGES_CHANGED:
        return _extends({}, state, {
          historyMessages: action.historyMessages
        });
      case _ActorAppConstants.ActionTypes.MESSAGES_CHANGED:
        // 撤回消息删除处理
        var message = null;
        var revertMessage = _linq2.default.from(action.messages).where('$.content.content === "customJson" && $.content.operation === "revert"').toArray();
        // var renderMessage = linq.from(action.messages).except(revertMessage, '$.rid').toArray();
        for (var i = 0; i < revertMessage.length; i++) {
          message = _linq2.default.from(action.messages).where(function (item) {
            return item.rid === JSON.parse(revertMessage[i].content.text).rid;
          }).toArray()[0];
          if (message) {
            (function (msg) {
              setTimeout(function () {
                _MessageActionCreators2.default.deleteMessage(_DialogStore2.default.getCurrentPeer(), msg.rid);
              }, 1);
            })(message);
          }
        }

        var message1 = state.messages.slice(-1)[0];
        var message2 = action.messages.slice(-2)[0];
        var message3 = action.messages.slice(-1)[0];
        if (message1 && message2 && message2.rid === message1.rid && message3.content.content !== 'service') {
          // 判断是否为手动发送数据
          setTimeout(function () {
            var peer = _DialogStore2.default.getCurrentPeer();
            var dialogs = _DialogStore2.default.getDialogs();
            for (var i = 0; i < dialogs.length; i++) {
              var dialog = _linq2.default.from(dialogs[i].shorts).where('$.peer.peer.id ===' + peer.id).toArray()[0];
              if (dialog) {
                dialog.updateTime = new Date().getTime();
                dialogs[i].shorts.sort(function (a, b) {
                  return b.updateTime - a.updateTime;
                });
                dialogs[i].shorts = [].concat(dialogs[i].shorts);
                break;
              }
            }
            _DialogActionCreators2.default.setDialogs(dialogs);
          }, 1);
        }

        if (_ActorClient2.default.isElectron()) {
          _ActorClient2.default.sendToElectron('message-change', { currentMsg: action.messages });
        }
        var firstId = getMessageId(action.messages[0]);
        var lastId = getMessageId(action.messages[action.messages.length - 1]);

        var nextState = _extends({}, state, {
          firstId: firstId,
          lastId: lastId,
          messages: action.messages,
          overlay: action.overlay,
          receiveDate: action.receiveDate,
          readDate: action.readDate,
          readByMeDate: action.readByMeDate,
          isLoaded: action.isLoaded
        });

        if (firstId !== state.firstId) {
          nextState.count = Math.min(action.messages.length, state.count + MESSAGE_COUNT_STEP);
          nextState.changeReason = _ActorAppConstants.MessageChangeReason.UNSHIFT; // 顶部插入（向上找聊天记录）
        } else if (lastId !== state.lastId) {
          // TODO: possible incorrect
          var lengthDiff = action.messages.length - state.messages.length;

          nextState.count = Math.min(action.messages.length, state.count + lengthDiff);
          nextState.changeReason = _ActorAppConstants.MessageChangeReason.PUSH; // 底部插入（聊天的过程）
        } else {
          nextState.count = Math.min(action.messages.length, state.count);
          nextState.changeReason = _ActorAppConstants.MessageChangeReason.UPDATE; // 中间更新（删除记录等）
        }

        if (state.readByMeDate === 0 && action.readByMeDate > 0) {
          var unreadIndex = (0, _MessageUtils.getFirstUnreadMessageIndex)(action.messages, action.readByMeDate, _UserStore2.default.getMyId());
          if (unreadIndex === -1) {
            nextState.unreadId = null;
          } else {
            nextState.unreadId = action.messages[unreadIndex].rid;
            if (unreadIndex > nextState.count) {
              nextState.count = Math.min(action.messages.length - unreadIndex + MESSAGE_COUNT_STEP, action.messages.length);
            }
          }
        }

        return nextState;

      case _ActorAppConstants.ActionTypes.MESSAGES_LOAD_MORE:
        return _extends({}, state, {
          count: Math.min(state.messages.length, state.count + MESSAGE_COUNT_STEP),
          changeReason: _ActorAppConstants.MessageChangeReason.UNSHIFT
        });

      case _ActorAppConstants.ActionTypes.MESSAGES_TOGGLE_SELECTED:
        return _extends({}, state, {
          selected: state.selected.has(action.id) ? state.selected.remove(action.id) : state.selected.add(action.id)
        });

      case _ActorAppConstants.ActionTypes.MESSAGES_EDIT_START:
        return _extends({}, state, {
          editId: action.message.rid
        });

      case _ActorAppConstants.ActionTypes.MESSAGES_EDIT_END:
        return _extends({}, state, {
          editId: null
        });

      default:
        return state;
    }
  };

  return MessageStore;
}(_utils.ReduceStore);

exports.default = new MessageStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=MessageStore.js.map