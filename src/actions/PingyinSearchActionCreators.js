/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ComposeActionCreators from '../actions/ComposeActionCreators';
import makepy from 'makepy';

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
    let obj = {};
    for (let item of list) {
      if (!item.peerInfo.title) continue;
      let letterStore = [];
      for (let pingyin of makepy.make.pingYing(item.peerInfo.title)) {
        let letter = pingyin.substring(0, 1).toLowerCase();
        // console.log(letterStore, 111);
        if (letterStore.indexOf(letter) !== -1) {
          continue;
        } else {
          letterStore.push(letter);
        }
        let key = '';
        key = /[a-z]/.test(letter) ? letter : '其他';
        if (!obj[key]) {
          obj[key] = [];
        }
        // console.log(obj[key], 111111111);
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
