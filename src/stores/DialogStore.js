/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { find, some } from 'lodash';
import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import linq from 'Linq';

class DialogStore extends ReduceStore {
  getInitialState() {
    return {
      peer: null,
      storePeer: null,
      dialogs: []
    };
  }

  getDialogs() {
    const { dialogs } = this.getState();
    return dialogs;
  }

  getCurrentPeer() {
    const { peer } = this.getState();
    return peer;
  }

  getStorePeer() {
    const { storePeer } = this.getState();
    return storePeer;
  }

  isMember() {
    const peer = this.getCurrentPeer();
    if (peer && peer.type === PeerTypes.GROUP) {
      const group = ActorClient.getGroup(peer.id);
      return group && group.members.length !== 0;
    }

    return true;
  }

  isFavorite(id) {
    const favoriteDialogs = find(this.getDialogs(), { key: 'favourites' });
    if (!favoriteDialogs) return false;

    return some(favoriteDialogs.shorts, (dialog) => dialog.peer.peer.id === id);
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.DIALOGS_CHANGED:
        return {
          ...state,
          dialogs: action.dialogs
        };

      case ActionTypes.BIND_DIALOG_PEER:
        return {
          ...state,
          peer: action.peer,
          storePeer: action.peer
        };

      case ActionTypes.UNBIND_DIALOG_PEER:
        return {
          ...state,
          peer: null
        };

      default:
        return state;
    }
  }
  isAdmin() {
    if (this.getState().peer.type === PeerTypes.GROUP) {
      const myID = ActorClient.getUid();
      const members = ActorClient.getGroup(this.getState().peer.id).members;
      var adminId = linq.from(members).where('$.isAdmin == true').select('$.peerInfo.peer.id').toArray()[0];
      return adminId === myID;
    }
    return true;
  }
}

export default new DialogStore(Dispatcher);
