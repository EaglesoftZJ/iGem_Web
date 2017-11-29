/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import { setTimeout } from 'timers';

export default {
  show(msgObj, time) {
    dispatch(ActionTypes.MESSAGE_ALERT_ADD, {msgObj});
    setTimeout(() => {
      this.remove();
    }, time || 1500);
  },

  remove() {
    dispatch(ActionTypes.MESSAGE_ALERT_REMOVE);
  }
};
