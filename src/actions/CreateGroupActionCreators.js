/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import ActorClient from '../utils/ActorClient';
import history from '../utils/history';
import PeerUtils from '../utils/PeerUtils';

import { ActionTypes } from '../constants/ActorAppConstants';
import ComposeActionCreators from '../actions/ComposeActionCreators';

import loading from '../utils/DataLoading';



const CreateGroupActionCreators = {
  open() {
    dispatch(ActionTypes.GROUP_CREATE_MODAL_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  close() {
    dispatch(ActionTypes.GROUP_CREATE_MODAL_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },

  openInDialog() {
    dispatch(ActionTypes.GROUP_CREATE_MODAL_SHOW);
    dispatch(ActionTypes.GROUP_CREATE_OPEN_IN_DIALOG);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  setGroupName(name) {
    dispatch(ActionTypes.GROUP_CREATE_SET_NAME, { name });
  },

  setGroupSearch(search) {
    dispatch(ActionTypes.GROUP_CREATE_SET_SEARCH, { search });
  },

  setSelectedUserIds(selectedUserIds) {
    dispatch(ActionTypes.GROUP_CREATE_SET_MEMBERS, { selectedUserIds });
  },

  createGroup(title, avatar, memberIds) {
    loading('show');
    const createGroup = () => dispatchAsync(ActorClient.createGroup(title, avatar, memberIds), {
      request: ActionTypes.GROUP_CREATE,
      success: ActionTypes.GROUP_CREATE_SUCCESS,
      failure: ActionTypes.GROUP_CREATE_ERROR
    }, { title, avatar, memberIds });

    const openCreatedGroup = (peer) => history.push(`/im/${PeerUtils.peerToString(peer)}`);

    createGroup()
      .then(openCreatedGroup)
      .then(() => {this.close(); loading('hide');})
  }
};

export default CreateGroupActionCreators;
