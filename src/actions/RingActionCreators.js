/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';

export default {

  setRingDomId(ringDomId) {
    dispatch(ActionTypes.RING_DOM_ID_CHANGE, {ringDomId});
  },
  setNew(isNewMessage) {
    dispatch(ActionTypes.RING_NEW_CHANGE, {isNewMessage});
  }
};
