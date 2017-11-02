/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import loading from '../utils/DataLoading';
import ComposeActionCreators from '../actions/ComposeActionCreators';

export default {
  show(group) {
    dispatch(ActionTypes.INVITE_USER_MODAL_SHOW, { group });
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.INVITE_USER_MODAL_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },

  setGroupSearch(search) {
    dispatch(ActionTypes.NVITE_USER_SET_SEARCH, { search });
  },

  setSelectedUserIds(selectedUserIds) {
    dispatch(ActionTypes.NVITE_USER_SET_MEMBERS, { selectedUserIds });
  },


  inviteUser(gid, idList) {
    loading('show', 0, idList.length);
    var invite = (index) => {
      dispatchAsync(ActorClient.inviteMember(gid, parseFloat(idList[index])), {
        request: ActionTypes.INVITE_USER,
        success: ActionTypes.INVITE_USER_SUCCESS,
        failure: ActionTypes.INVITE_USER_ERROR
      }, { gid, uid: idList[index] }).then((state) => {
        index++;
        // loading('info', index, idList.length);
        if (index >= idList.length) {
          this.hide();
          loading('hide');
          return;
        } 
        invite(index);
      });
      return;
    }
    invite(0);
  }
};
