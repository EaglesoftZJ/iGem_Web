'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _DataLoading = require('../utils/DataLoading');

var _DataLoading2 = _interopRequireDefault(_DataLoading);

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  show: function show(group) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.INVITE_USER_MODAL_SHOW, { group: group });
    _ComposeActionCreators2.default.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.INVITE_USER_MODAL_HIDE);
    _ComposeActionCreators2.default.toggleAutoFocus(true);
  },
  setGroupSearch: function setGroupSearch(search) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.NVITE_USER_SET_SEARCH, { search: search });
  },
  setSelectedUserIds: function setSelectedUserIds(selectedUserIds) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.NVITE_USER_SET_MEMBERS, { selectedUserIds: selectedUserIds });
  },
  inviteUser: function inviteUser(gid, idList) {
    var _this = this;

    (0, _DataLoading2.default)('show');
    var invite = function invite(index) {
      (0, _ActorAppDispatcher.dispatchAsync)(_ActorClient2.default.inviteMember(gid, parseFloat(idList[index])), {
        request: _ActorAppConstants.ActionTypes.INVITE_USER,
        success: _ActorAppConstants.ActionTypes.INVITE_USER_SUCCESS,
        failure: _ActorAppConstants.ActionTypes.INVITE_USER_ERROR
      }, { gid: gid, uid: idList[index] }).then(function (state) {
        index++;
        // loading('info', index, idList.length);
        if (index >= idList.length) {
          _this.hide();
          (0, _DataLoading2.default)('hide');
          return;
        }
        invite(index);
      });
      return;
    };
    invite(0);
  }
}; /*
    * Copyright (C) 2015 Actor LLC. <https://actor.im>
    */
//# sourceMappingURL=InviteUserActions.js.map