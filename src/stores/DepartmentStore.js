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
      yh_data: [],
      yh_pinyin: {},
      department_show: false
    }
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.DEPARTMENT_CHANGED:
        return {
          ...state,
          ...action.res
        }
      case ActionTypes.DEPARTMENT_SHOW:
        return {
          ...state,
          department_show: true
        }
      case ActionTypes.DEPARTMENT_HIDE:
        return {
          ...state,
          department_show: false
        }
      default:
        return state;
    }
  }
}

export default new DepartmentStore(Dispatcher);
