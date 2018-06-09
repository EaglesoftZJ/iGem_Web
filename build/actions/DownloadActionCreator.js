'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

exports.default = {
  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DONWLOAD_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DONWLOAD_HIDE);
    ComposeActionCreators.toggleAutoFocus(false);
  },
  change: function change(list) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DONWLOAD_CHANGE, { list: list });
  }
};
//# sourceMappingURL=DownloadActionCreator.js.map