/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */
import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, AsyncActionStates } from '../constants/ActorAppConstants';

class InviteUserStore extends ReduceStore {
  getInitialState() {
    return {
      name: '',
      search: '',
      step: '',
      members: '',
      step: '',
      selectedUserIds: new Immutable.OrderedSet(),
      group: null,
      users: {},
      inviteUrl: null
    };
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.DIALOG_INFO_CHANGED:
        return {
          ...state,
          members: action.info.members,
          name: action.info.name,
          group: action.info
        };

      case ActionTypes.INVITE_USER_MODAL_SHOW:
        return {
          ...state,
          members: action.group.members,
          name: action.group.name,
          group: action.group
        };
      case ActionTypes.INVITE_USER_MODAL_HIDE:
        return this.getInitialState();

      case ActionTypes.NVITE_USER_SET_SEARCH:
        return {
          ...state,
          search: action.search
      }
      case ActionTypes.NVITE_USER_SET_MEMBERS:
      return {
        ...state,
        selectedUserIds: action.selectedUserIds
      }

      case ActionTypes.INVITE_USER_BY_LINK_MODAL_SHOW:
        return {
          ...state,
          inviteUrl: action.url
        };

      // Invite user
      case ActionTypes.INVITE_USER:
        state.users[action.uid] = AsyncActionStates.PROCESSING;
        return {
          ...state,
          step: ActionTypes.INVITE_USER
        };
      case ActionTypes.INVITE_USER_SUCCESS:
        state.users[action.uid] = AsyncActionStates.SUCCESS;
        return {
          ...state,
          step: ActionTypes.INVITE_USER_SUCCESS
        };
      case ActionTypes.INVITE_USER_ERROR:
        state.users[action.uid] = AsyncActionStates.FAILURE;
        return {
          ...state,
          step: ActionTypes.INVITE_USER_ERROR
        };
      case ActionTypes.INVITE_USER_RESET:
        delete state.users[action.uid];
        return {
          ...state,
          step: ActionTypes.INVITE_USER_RESET
        };
      default:
        return state;
    }
  }

  getGroup() {
    return this.getState().group;
  }

  getInviteUrl() {
    return this.getState().inviteUrl;
  }

  getInviteUserState() {
    return this.getState().users;
  }
}

export default new InviteUserStore(Dispatcher);
