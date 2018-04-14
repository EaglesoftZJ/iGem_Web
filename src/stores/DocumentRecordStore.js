
/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import linq from 'Linq';
    

class DocumentRecordStore extends ReduceStore {
  getInitialState() {
    return {
        isShow: false,
        record: null,
        node: null,
    };
  }

  getShowState() {
    const { isShow } = this.getState();
    return isShow;
  }

  getCurrentRecord() {
    const { record } = this.getState();
    return record;
  }

  getCurrentNode() {
    const { node } = this.getState();
    return node;
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.DOCUMENT_RECORD_SHOW:
        return {
          ...state,
          isShow: true,
          node: action.node
        };
        break;
      case ActionTypes.DOCUMENT_RECORD_HIDE:
        return {
          ...state,
          isShow: false
        }
        break;
        case ActionTypes.DOCUMENT_RECORD_CHANGE: 
        return {
            ...state,
            record: action.record,
        }
      default:
        return state;
    }
  }
}

export default new DocumentRecordStore(Dispatcher);
