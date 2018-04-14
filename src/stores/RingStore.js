
/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import linq from 'Linq';
    

class RingStore extends ReduceStore {
  getInitialState() {
    return {
        ringDomId: '',
        isNewMessage: false
    };
  }

  getRingDomId() {
    const { ringDomId } = this.getState();
    return ringDomId;
  }

  isNewMessage() {
    const { isNewMessage } = this.getState();
    return isNewMessage;
  }

  reduce(state, action) {
    switch (action.type) {
        case ActionTypes.RING_DOM_ID_CHANGE:
        console.log('RING_DOM_ID_CHANGE', action.ringDomId, action.ringDomId);
            return {
                ...state,
                ringDomId: action.ringDomId
            };
            break;
        case ActionTypes.RING_NEW_CHANGE:
            return {
                ...state,
                isNewMessage: action.isNewMessage
            };
            break;
      default:
        return state;
    }
  }
}

export default new RingStore(Dispatcher);
