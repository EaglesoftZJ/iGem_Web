/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import ComposeActionCreators from '../actions/ComposeActionCreators';
import ProfileStore from '../stores/ProfileStore';
import linq from 'Linq';

var interval = null;

function getGroup(uid, callback) {
  console.log('getRroup uid', uid);
  var spapdata = `<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                    <v:Header />
                    <v:Body>
                        <n0:queryGroup id="o0" c:root="1" xmlns:n0="http://eaglesoft">
                            <id i:type="d:string">${ uid }</id>
                        </n0:queryGroup>
                    </v:Body>
                </v:Envelope>`;
  var method = 'queryGroup';  
  $.ajax({
      url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
      type: 'post',
      data: spapdata,
      beforeSend(request) {
          console.log('beforeSend', request);
          request.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
          request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
      },
      success: (res) => {
        if (res && res.nodeName) {
          callback(JSON.parse($(res).find('return').html()))
        }
      }
  });
}

var QuickSearchActionCreators = {
  show() {
    dispatch(ActionTypes.QUICK_SEARCH_SHOW);
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.QUICK_SEARCH_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },

  setQuickSearchList(list) {
    // 过滤系统管理员，过滤群组
    list = linq.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1 && $.peerInfo.title.indexOf("账号已删除") == -1 && $.peerInfo.peer.type !== "group"').toArray();
    dispatch(ActionTypes.QUICK_SEARCH_CHANGED_USER, { list });
    // 从另外的接口获取群组数据更新
    clearInterval(interval);
    var time = 0;
    interval = setInterval(group, 100);
    function group() {
      time++;
      if (ProfileStore.getProfile()) {
        QuickSearchActionCreators.setGroupList();
        clearInterval(interval);
      } else if (time === 100) {
        clearInterval(interval);
      }
    }
    group();
  },
  setGroupList() {
    getGroup(ProfileStore.getProfile().id, (groups) => {
      var arr = [];
      for (var i = 0; i < groups.length; i++ ) {
        var group = ActorClient.getGroup(groups[i].id);
        if(group) {
          arr.push({
            peerInfo: {
              avatar: group.avatar,
              placeholder: group.placeholder,
              title: group.name,
              peer: {
                id: group.id,
                type: 'group',
                key: 'g' + group.id
              }
            }
          });
        }
      }
      dispatch(ActionTypes.QUICK_SEARCH_CHANGED_GROUP, { list: arr });
    });
  }
};
export default QuickSearchActionCreators;