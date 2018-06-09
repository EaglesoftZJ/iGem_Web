
/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';

export default {
  show() {
    dispatch(ActionTypes.DONWLOAD_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.DONWLOAD_HIDE);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  change(list) {
    dispatch(ActionTypes.DONWLOAD_CHANGE, {list});
  }
}
