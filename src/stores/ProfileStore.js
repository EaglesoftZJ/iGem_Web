/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';

class ProfileStore extends ReduceStore {
  getInitialState() {
    return {
      profile: null,
      name: null,
      nick: null,
      about: null
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.PROFILE_CHANGED:
        // 发送登陆成功消息给主进程
        if (ActorClient.isElectron()) {
          ActorClient.sendToElectron('logged-in', action.profile);
        }
        return {
          ...state,
          profile: action.profile
        }
      default:
        return state;
    }
  }

  getProfile() {
    return this.getState().profile;
  }
}

export default new ProfileStore(Dispatcher);
