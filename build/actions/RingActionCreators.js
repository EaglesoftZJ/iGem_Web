'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  setRingDomId: function setRingDomId(ringDomId) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.RING_DOM_ID_CHANGE, { ringDomId: ringDomId });
  },
  setNew: function setNew(isNewMessage) {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.RING_NEW_CHANGE, { isNewMessage: isNewMessage });
  }
}; /*
    * Copyright (C) 2015 Actor LLC. <https://actor.im>
    */
//# sourceMappingURL=RingActionCreators.js.map