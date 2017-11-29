/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';

class MessageAlertStore extends ReduceStore {
  getInitialState() {
    return {
        msg: []
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.MESSAGE_ALERT_ADD:
          var arr = state.msg;
          arr.push(action.msgObj);
          console.log(123, arr);
        return {
           ...state,
           msg: arr
        }
      case ActionTypes.MESSAGE_ALERT_REMOVE:
        var arr = state.msg;
        arr.splice(0, 1);
        return {
            ...state,
            msg: arr
         }
      default:
        return state;
    }
  }
}

export default new MessageAlertStore(Dispatcher);
