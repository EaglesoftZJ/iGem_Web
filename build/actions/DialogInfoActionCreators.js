'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _DialogStore = require('../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

var DialogInfoActionCreators = {
  setDialogInfo: function setDialogInfo(info) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DIALOG_INFO_CHANGED, { info: info });

    var peer = _DialogStore2.default.getCurrentPeer();
    if (peer && peer.type === _ActorAppConstants.PeerTypes.GROUP) {
      _ActorClient2.default.loadMembers(info.id, 10000, null).then(function (data) {
        if (info.members && info.members.length > 0) {
          info.members = data.members;
          (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DIALOG_INFO_CHANGED, { info: info });
        }
      });
    }

    // function loadMembers(gid, size, next, members) {
    //   if (next && next.length === 0) {
    //     info.members = members;
    //     dispatch(ActionTypes.DIALOG_INFO_CHANGED, { info });
    //     return;
    //   } else {
    //     ActorClient.loadMembers(gid, size, next).then((data) => {
    //       if (data.next.length >= 2 && data.next[1] < 0) {
    //         data.next[1] = 256 + data.next[1];
    //         data.next = data.next.splice(0, 2);
    //       }
    //       loadMembers(gid, size, data.next, members.concat(data.members));
    //     })
    //   }
    //   return;    
    // }
  }
};

exports.default = DialogInfoActionCreators;
//# sourceMappingURL=DialogInfoActionCreators.js.map