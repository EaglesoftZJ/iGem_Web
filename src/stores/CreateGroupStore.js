/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import Immutable from 'immutable';

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, CreateGroupSteps } from '../constants/ActorAppConstants';

import DialogStore from '../stores/DialogStore';

class CreateGroupStore extends ReduceStore {
  getInitialState() {
    return {
      step: CreateGroupSteps.NAME_INPUT,
      name: '',
      search: '',
      // selectedUserIds: new Set()
      selectedUserIds: new Immutable.OrderedSet()
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.GROUP_CREATE_OPEN_IN_DIALOG:
      var peer = DialogStore.getCurrentPeer();
      return {
        ...state,
        selectedUserIds: state.selectedUserIds.add(peer.id)
      }
      case ActionTypes.GROUP_CREATE_SET_NAME:
        return {
          ...state,
          step: CreateGroupSteps.CONTACTS_SELECTION,
          name: action.name
        }
      
      case ActionTypes.GROUP_CREATE_SET_SEARCH:
        return {
          ...state,
          step: CreateGroupSteps.CONTACTS_SELECTION,
          search: action.search
        }
      case ActionTypes.GROUP_CREATE_SET_MEMBERS:
        return {
          ...state,
          selectedUserIds: action.selectedUserIds
        }

      case ActionTypes.GROUP_CREATE:
        return {
          ...state,
          step: CreateGroupSteps.CREATION_STARTED
        }

      // TODO: Show create group error success messages in modal
      case ActionTypes.GROUP_CREATE_SUCCESS:
        return this.getInitialState();

      case ActionTypes.GROUP_CREATE_ERROR:
        console.error('Failed to create group', action.error);
        return {
          ...state,
          step: CreateGroupSteps.GROUP_CREATE_ERROR
        }

      case ActionTypes.GROUP_CREATE_MODAL_HIDE:
        return this.getInitialState();


      default:
        return state;
    }
  }


    getCurrentStep() {
      return this.getState().step;
    }

    getGroupName() {
      return this.getState().name;
    }
    getGroupSearch() {
      return this.getState().search;
    }

    getSelectedUserIds() {
      return this.getState().selectedUserIds;
    }
}

export default new CreateGroupStore(Dispatcher);
