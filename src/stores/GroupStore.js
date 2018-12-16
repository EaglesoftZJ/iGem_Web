/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import history from '../utils/history';
import DialogStore from '../stores/DialogStore';
import QuickSearchActionCreators from '../actions/QuickSearchActionCreators'
import DialogActionCreators from '../actions/DialogActionCreators'
import linq from 'linq';

class GroupStore extends ReduceStore {
  getInitialState() {
    return {
      token: null,
    };
  }

  reduce(state, action) {
    switch (action.type) {

      case ActionTypes.GROUP_GET_TOKEN:
        return state;
      case ActionTypes.GROUP_GET_TOKEN_SUCCESS:
        return {
          ...state,
          token: action.response
        }
      case ActionTypes.GROUP_GET_TOKEN_ERROR:
        return this.getInitialState()
      case ActionTypes.GROUP_LEAVE_SUCCESS:
        // 离开群组
      case ActionTypes.GROUP_DELETE_SUCCESS:
        // 删除群组
        // 更新快速查找数据
        setTimeout(() => {
          QuickSearchActionCreators.setGroupList();
        }, 1);
      case ActionTypes.CHAT_DELETE_SUCCESS:
        // 在对话框中移除
        var id = action.peer ? action.peer.id : action.gid;
        if (action.peer) {
          // 对话框移除成功，手动删除
          setTimeout(() => {
            DialogActionCreators.deleteDialog(id);
          }, 1);
          // DialogActionCreators.DialogActionCreators();
          // var dialogs = DialogStore.getDialogs();
          // for (var i = 0; i < dialogs.length; i++) {
          //   var arr = linq.from(dialogs[i].shorts).except([{peer: {peer: {id: action.peer.id}}}], '$.peer.peer.id').toArray();
          //   dialogs[i].shorts = arr;
          // }
        }
        var currentPeer = DialogStore.getCurrentPeer();
        if (currentPeer && currentPeer.id && currentPeer.id === id) {
          // 当前对话框为以上对话框跳转空白
          setTimeout(() => {
            history.replace('/im');
          }, 1);
        }
      case ActionTypes.GROUP_CLEAR:
      case ActionTypes.GROUP_CLEAR_SUCCESS:
      case ActionTypes.GROUP_CLEAR_ERROR:
      case ActionTypes.GROUP_LEAVE:
      case ActionTypes.GROUP_LEAVE_ERROR:
      case ActionTypes.GROUP_DELETE:
      case ActionTypes.GROUP_DELETE_ERROR:
      case ActionTypes.CHAT_DELETE:
      case ActionTypes.CHAT_DELETE_ERROR:
      default:
        return state;
    }
  }

  /**
   * Get group information
   *
   * @param gid {number} Group id
   * @returns {object} Group information
   */
  getGroup(gid) {
    return ActorClient.getGroup(gid);
  }

  /**
   * Get group integration token
   *
   * @returns {string|null}
   */
  getToken() {
    return this.getState().token;
  }
}

export default new GroupStore(Dispatcher);
