/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import $ from 'jquery';
import ActionCreators from './ActionCreators';
import ConnectionStateActionCreators from '../actions/ConnectionStateActionCreators';
import DraftActionCreators from '../actions/DraftActionCreators';
import ActorClient from '../utils/ActorClient';
import DialogStore from '../stores/DialogStore';
import ProfileStore from '../stores/ProfileStore';

class VisibilityActionCreators extends ActionCreators {
  // isNotTj 是否不统计
  createAppVisible(isNotTj) {
    dispatch(ActionTypes.APP_VISIBLE);
    ActorClient.onAppVisible();
    // 活跃度统计 20191205
    if (ProfileStore.getProfile() && (isNotTj === false || isNotTj === undefined || typeof isNotTj === 'object')) {
      $.ajax({
        url: 'http://61.175.100.12:8801/zsgwuias/rest/out/subsystemClickFlyChat',
        type: 'POST',
        data: JSON.stringify({
          userId: ProfileStore.getProfile().id,
          zxt: '1196629848201199617'
        }),
        beforeSend(request) {
            console.log('beforeSend', request);
            request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            // request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
        },
        success: (res) => {
          console.log('统计结果=======================', res);
        }
      });
    }
    this.setBindings('connect', [
      ActorClient.bindConnectState(ConnectionStateActionCreators.setState)
    ]);
  }

  createAppHidden() {
    dispatch(ActionTypes.APP_HIDDEN);

    const currentPeer = DialogStore.getCurrentPeer();
    DraftActionCreators.saveDraft(currentPeer);

    ActorClient.onAppHidden();
    this.removeBindings('connect');
  }
}

export default new VisibilityActionCreators();
