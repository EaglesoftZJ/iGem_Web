/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ComposeActionCreators from '../actions/ComposeActionCreators';
import ProfileStore from '../stores/ProfileStore';
import ActorClient from '../utils/ActorClient';
import makepy from 'makepy';
import linq from 'Linq';




export default {
  show() {
    dispatch(ActionTypes.DEPARTMENT_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.DEPARTMENT_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },
  
  setPingyinSearchList(list) {
    let obj = {'群组': []};
    // 过滤系统管理员
    list = linq.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1').toArray();
    for (let item of list) {
      if (!item.peerInfo.title) continue;
      if (item.peerInfo.peer.type === 'group') {
        obj['群组'].push(item);
        continue;
      }
      let letterStore = [];
      for (let pingyin of makepy.make.pingYing(item.peerInfo.title)) {
        let letter = pingyin.substring(0, 1).toLowerCase();
        if (letterStore.indexOf(letter) !== -1) {
          continue;
        } else {
          letterStore.push(letter);
        }
        let key = '';
        key = /[a-z]/.test(letter) ? letter : '#';
        if (!obj[key]) {
          obj[key] = [];
        } 
        obj[key].push(item);
      }
    }
    for (let key in obj) {
      obj[key].sort((a, b) => {
        if (a.peerInfo.title > b.peerInfo.title) {
          return 1;
        } else if (a.peerInfo.title > b.peerInfo.title) {
          return 0;
        } else {
          return -1;
        }
      })
    }
    dispatch(ActionTypes.PINGYIN_SEARCH_CHANGED, { obj });
  }
};
