/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ComposeActionCreators from '../actions/ComposeActionCreators';
import PingyinSearchActionCreators from './PingyinSearchActionCreators';
import linq from 'Linq';

export default {
  show() {
    dispatch(ActionTypes.QUICK_SEARCH_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.QUICK_SEARCH_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },

  setQuickSearchList(list) {
    list = linq.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1 && $.peerInfo.title.indexOf("账号已删除") == -1').toArray();
    dispatch(ActionTypes.QUICK_SEARCH_CHANGED, { list });
    PingyinSearchActionCreators.setPingyinSearchList(list);
  }
};
