'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _PingyinSearchActionCreators = require('./PingyinSearchActionCreators');

var _PingyinSearchActionCreators2 = _interopRequireDefault(_PingyinSearchActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

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
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_CHANGED, { list: list });
    _PingyinSearchActionCreators2.default.setPingyinSearchList(list);
  }
};
//# sourceMappingURL=QuickSearchActionCreators.js.map