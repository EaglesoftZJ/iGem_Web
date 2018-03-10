'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _PingyinSearchActionCreators = require('./PingyinSearchActionCreators');

var _PingyinSearchActionCreators2 = _interopRequireDefault(_PingyinSearchActionCreators);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_SHOW);
    _ComposeActionCreators2.default.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_HIDE);
    _ComposeActionCreators2.default.toggleAutoFocus(true);
  },
  setQuickSearchList: function setQuickSearchList(list) {
    list = _Linq2.default.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1 && $.peerInfo.title.indexOf("账号已删除") == -1').toArray();
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_CHANGED, { list: list });
    _PingyinSearchActionCreators2.default.setPingyinSearchList(list);
  }
}; /*
    * Copyright (C) 2015 Actor LLC. <https://actor.im>
    */
//# sourceMappingURL=QuickSearchActionCreators.js.map