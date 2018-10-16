/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { find, some } from 'lodash';
import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import ProfileStore from '../stores/ProfileStore';
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
      case ActionTypes.FILTER_DIALOGS_GROUP:
        // 过滤删除的群组
        // function isTheSameToPre() {
        //   return linq.from(group).except(preGroup, '$.peerInfo.peer.id').toArray().length === 0;
        // }
        // var group = PingyinSearchStore.getState()['群组'];
        // if (group && state.dialogs.length > 0 && (!preGroup || !isTheSameToPre())) {
        //   time++;
        //   if (time > 1 && preGroup && preGroup.length === 0)  state.dialogs = preDialogs; 
        //   preGroup = group;
        //   preDialogs = JSON.parse(JSON.stringify(state.dialogs));
        //   for (var i = 0; i < state.dialogs.length; i++) {
        //     if (state.dialogs[i].key !== 'privates') {
        //       // 非用户组
        //       var arr = linq.from(state.dialogs[i].shorts).where('$.peer.peer.type === "group"').toArray(); // 群组部分
        //       var arr1 = linq.from(state.dialogs[i].shorts).where('$.peer.peer.type !== "group"').toArray(); // 非群组部分
        //       var activeGroup = linq.from(arr).join(group, 'outer => outer.peer.peer.id', 'inner => inner.peerInfo.peer.id', 'outer => outer').toArray(); // 未删除群组
        //       state.dialogs[i].shorts.splice(0, state.dialogs[i].shorts.length, ...arr1, ...activeGroup); // 重新组合
        //     }
        //   }
        // }
        return {
          ...state,
        };
        
      case ActionTypes.DIALOGS_CHANGED:
        // web端左侧对话框列表排序处理，客户端消息推送处理
        var arr = [];
        if (!action.dialogs[0] || !action.dialogs[0].sort) {
          for (var i = 0; i < action.dialogs.length; i++) {
            var oldData = linq.from(state.dialogs).where(`$.key == '${action.dialogs[i].key}'`).toArray()[0];
            var oldArr = [];
            // 数据过滤
            action.dialogs[i]['shorts'] = linq.from(action.dialogs[i]['shorts']).where('$.peer.title !== "系统管理员" && $.peer.title !== "账号已删除"').toArray();
            if (oldData) {
              oldArr = oldData.shorts;
            }
            for (var j = 0; j < action.dialogs[i].shorts.length; j++) {
              var dialog = action.dialogs[i].shorts[j];
              var key = dialog.peer.peer.key;
              var oldDialog = linq.from(oldArr).where(`$.peer.peer.key == '${key}'`).toArray()[0];
              /* 取合集添加 */
              var index = oldArr.indexOf(oldDialog);
              index >= 0 && oldArr.splice(index, 1);
              /* 取合集添加 */
              if (oldDialog && oldDialog.counter < dialog.counter || !oldDialog) {
                dialog.updateTime = new Date().getTime();
              } else {
                dialog.updateTime = oldDialog.updateTime;
              }
            }
            /* 取合集添加 */
            action.dialogs[i].shorts.push(...oldArr);
            /* 取合集添加 */
            action.dialogs[i].shorts.sort((a, b) => {
              return b.updateTime - a.updateTime;
            });
            action.dialogs[i].sort = true;
            arr = arr.concat(action.dialogs[i].shorts);
          }
        }

        arr = linq.from(arr).where('$.counter > 0').toArray().sort((a, b) => {
          return b.updateTime - a.updateTime;
        });

        console.log('arr', arr);
        
        if (ActorClient.isElectron()) {
          ActorClient.sendToElectron('setDialogStore', {key: 'dialogs_' + ProfileStore.getProfile().id, value: action.dialogs});
          ActorClient.sendToElectron('new-messages', {minimizeMsg: arr});
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
