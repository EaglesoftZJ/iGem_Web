'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

exports.default = {
  // show() {
  //   dispatch(ActionTypes.DEPARTMENT_SHOW);
  //   ComposeActionCreators.toggleAutoFocus(false);
  // },

  // hide() {
  //   dispatch(ActionTypes.DEPARTMENT_HIDE);
  //   ComposeActionCreators.toggleAutoFocus(true);
  // },

  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_SHOW);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_HIDE);
  },
  setRes: function setRes(res) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_CHANGED, res);
  },
  search: function search(query) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_SEARCH, { query: query });
  }
};
//# sourceMappingURL=DepartmentActionCreators.js.map