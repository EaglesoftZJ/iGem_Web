/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import PingyinSearchActionCreators from '../actions/PingyinSearchActionCreators';
import linq from 'Linq';

class QuickSearchStore extends ReduceStore {
  getInitialState() {
    return {
      user: [], // 用户列表
      group: [], // 群组列表
      list: [] // 合集
    }
  }

  getSearchList() {
    return this.getState().list;
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.QUICK_SEARCH_CHANGED_USER:
        var user = linq.from(action.list).orderBy('$.peerInfo.userName').toArray();
        var list = state.group.concat(user);
        setTimeout(() => {
          PingyinSearchActionCreators.setPingyinSearchList(list);
        }, 1); 
        return {
          ...state,
          user,
          list
        };
      case ActionTypes.QUICK_SEARCH_CHANGED_GROUP:
        var group = linq.from(action.list).orderBy('$.peerInfo.userName').toArray();
        var list = state.user.concat(group);
        setTimeout(() => {
          PingyinSearchActionCreators.setPingyinSearchList(list);
        }, 1);
        return {
          ...state,
          group,
          list
        };
      default:
        return state;
    }
  }
}

export default new QuickSearchStore(Dispatcher);
