
/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import linq from 'Linq';
    

class DownloadStore extends ReduceStore {
  getInitialState() {
    return {
      list: [1, 2, 3]
    };
  }

  getList() {
    const { list } = this.getState();
    return list;
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.DOWNLOAD_CHANGE:
        return {
          ...state,
          list: action.list
        };
        break;
      default:
        return state;
    }
  }
}

export default new DownloadStore(Dispatcher);
