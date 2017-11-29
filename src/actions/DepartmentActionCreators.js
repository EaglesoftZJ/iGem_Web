/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import ComposeActionCreators from '../actions/ComposeActionCreators';

export default {
  // show() {
  //   dispatch(ActionTypes.DEPARTMENT_SHOW);
  //   ComposeActionCreators.toggleAutoFocus(false);
  // },

  // hide() {
  //   dispatch(ActionTypes.DEPARTMENT_HIDE);
  //   ComposeActionCreators.toggleAutoFocus(true);
  // },

  show() {
    dispatch(ActionTypes.DEPARTMENT_SHOW);
  },

  hide() {
    dispatch(ActionTypes.DEPARTMENT_HIDE);
  },

  setRes(res) {
    dispatch(ActionTypes.DEPARTMENT_CHANGED, res );
  },

  search(query) {
    dispatch(ActionTypes.DEPARTMENT_SEARCH, { query });
  }
};
