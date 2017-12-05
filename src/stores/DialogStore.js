/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { find, some } from 'lodash';
import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import linq from 'Linq';

var newDailogObj = {},
    oldDailogObj = {};
    

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
        // 客户端消息排序处理 
        var arr = [];
        var dailogs = JSON.parse(JSON.stringify(action.dialogs));
        newDailogObj = {};
        for (var i = 0; i < dailogs.length; i++) {
          for (var j = 0; j < dailogs[i].shorts.length; j++) {
            if (dailogs[i].shorts[j].counter > 0) {
              var key = dailogs[i].shorts[j].peer.peer.key;
              newDailogObj[key] = dailogs[i].shorts[j];
              if (oldDailogObj[key] && oldDailogObj[key].counter < dailogs[i].shorts[j].counter || !oldDailogObj[key]) {
                dailogs[i].shorts[j].updateTime = new Date().getTime();
              } else {
                dailogs[i].shorts[j].updateTime = oldDailogObj[key].updateTime;
              }
              arr.push(dailogs[i].shorts[j]);
            } 
          }
        }
        oldDailogObj = newDailogObj;
        arr.sort((a, b) => {
          return b.updateTime - a.updateTime;
        });
        if (ActorClient.isElectron()) {
          ActorClient.sendToElectron('new-messages', {minimizeMsg: arr});
        }
        // web端左侧对话框列表排序处理
        if (action.dialogs[0] && action.dialogs[0].sort) {

        } else {
          for (var i = 0; i < action.dialogs.length; i++) {
            var oldData = linq.from(state.dialogs).where(`$.key == '${action.dialogs[i].key}'`).toArray()[0];
            var oldArr = [];
            if (oldData) {
              oldArr = oldData.shorts;
            }
            for (var j = 0; j < action.dialogs[i].shorts.length; j++) {
              var dialog = action.dialogs[i].shorts[j];
              var key = dialog.peer.peer.key;
              var oldDialog = linq.from(oldArr).where(`$.peer.peer.key == '${key}'`).toArray()[0];
              if (oldDialog && oldDialog.counter < dialog.counter || !oldDialog) {
                dialog.updateTime = new Date().getTime();
              } else {
                dialog.updateTime = oldDialog.updateTime;
              }
            }
            action.dialogs[i].shorts.sort((a, b) => {
              return b.updateTime - a.updateTime;
            });
            action.dialogs[i].sort = true;
          }
        }
        if (ActorClient.isElectron()) {
          ActorClient.sendToElectron('setDialogStore', {key: 'dialogs', value: action.dialogs});
        }
        return {
          ...state,
          dialogs: action.dialogs
        };
      case ActionTypes.DIALOGS_STORE_CHANGED:
        console.log('DIALOGS_STORE_CHANGED');
        return {
          ...state
        }
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
