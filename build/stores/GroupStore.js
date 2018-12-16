'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _history = require('../utils/history');

var _history2 = _interopRequireDefault(_history);

var _DialogStore = require('../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _QuickSearchActionCreators = require('../actions/QuickSearchActionCreators');

var _QuickSearchActionCreators2 = _interopRequireDefault(_QuickSearchActionCreators);

var _DialogActionCreators = require('../actions/DialogActionCreators');

var _DialogActionCreators2 = _interopRequireDefault(_DialogActionCreators);

var _linq = require('linq');

var _linq2 = _interopRequireDefault(_linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var GroupStore = function (_ReduceStore) {
  _inherits(GroupStore, _ReduceStore);

  function GroupStore() {
    _classCallCheck(this, GroupStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  GroupStore.prototype.getInitialState = function getInitialState() {
    return {
      token: null
    };
  };

  GroupStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {

      case _ActorAppConstants.ActionTypes.GROUP_GET_TOKEN:
        return state;
      case _ActorAppConstants.ActionTypes.GROUP_GET_TOKEN_SUCCESS:
        return _extends({}, state, {
          token: action.response
        });
      case _ActorAppConstants.ActionTypes.GROUP_GET_TOKEN_ERROR:
        return this.getInitialState();
      case _ActorAppConstants.ActionTypes.GROUP_LEAVE_SUCCESS:
      // 离开群组
      case _ActorAppConstants.ActionTypes.GROUP_DELETE_SUCCESS:
        // 删除群组
        // 更新快速查找数据
        setTimeout(function () {
          _QuickSearchActionCreators2.default.setGroupList();
        }, 1);
      case _ActorAppConstants.ActionTypes.CHAT_DELETE_SUCCESS:
        // 在对话框中移除
        var id = action.peer ? action.peer.id : action.gid;
        if (action.peer) {
          // 对话框移除成功，手动删除
          setTimeout(function () {
            _DialogActionCreators2.default.deleteDialog(id);
          }, 1);
          // DialogActionCreators.DialogActionCreators();
          // var dialogs = DialogStore.getDialogs();
          // for (var i = 0; i < dialogs.length; i++) {
          //   var arr = linq.from(dialogs[i].shorts).except([{peer: {peer: {id: action.peer.id}}}], '$.peer.peer.id').toArray();
          //   dialogs[i].shorts = arr;
          // }
        }
        var currentPeer = _DialogStore2.default.getCurrentPeer();
        if (currentPeer && currentPeer.id && currentPeer.id === id) {
          // 当前对话框为以上对话框跳转空白
          setTimeout(function () {
            _history2.default.replace('/im');
          }, 1);
        }
      case _ActorAppConstants.ActionTypes.GROUP_CLEAR:
      case _ActorAppConstants.ActionTypes.GROUP_CLEAR_SUCCESS:
      case _ActorAppConstants.ActionTypes.GROUP_CLEAR_ERROR:
      case _ActorAppConstants.ActionTypes.GROUP_LEAVE:
      case _ActorAppConstants.ActionTypes.GROUP_LEAVE_ERROR:
      case _ActorAppConstants.ActionTypes.GROUP_DELETE:
      case _ActorAppConstants.ActionTypes.GROUP_DELETE_ERROR:
      case _ActorAppConstants.ActionTypes.CHAT_DELETE:
      case _ActorAppConstants.ActionTypes.CHAT_DELETE_ERROR:
      default:
        return state;
    }
  };

  /**
   * Get group information
   *
   * @param gid {number} Group id
   * @returns {object} Group information
   */


  GroupStore.prototype.getGroup = function getGroup(gid) {
    return _ActorClient2.default.getGroup(gid);
  };

  /**
   * Get group integration token
   *
   * @returns {string|null}
   */


  GroupStore.prototype.getToken = function getToken() {
    return this.getState().token;
  };

  return GroupStore;
}(_utils.ReduceStore);

exports.default = new GroupStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=GroupStore.js.map