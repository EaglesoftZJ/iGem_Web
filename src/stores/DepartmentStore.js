/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */
import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';


class DepartmentStore extends ReduceStore {
  getInitialState() {
    return {
      dw_data: [],
      bm_data: [],
      yh_data: []
    }
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.DEPARTMENT_CHANGED:
        return action.res;
      default:
        return state;
    }
  }
}

export default new DepartmentStore(Dispatcher);
