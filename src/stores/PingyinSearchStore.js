/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import linq from 'Linq';

class PingyinSearchStore extends ReduceStore {
  getInitialState() {
    return {}
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.PINGYIN_SEARCH_CHANGED:
        return action.obj;
      default:
        return state;
    }
  }
}

export default new PingyinSearchStore(Dispatcher);
