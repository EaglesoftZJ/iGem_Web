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
import $ from 'jquery';


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
    clearInterval(interval);
    interval = setInterval(() => {
      if (ProfileStore.getProfile()) {
        getGroup(ProfileStore.getProfile().id, getSearch);
        clearInterval(interval);
      }
    }, 100);

    function getSearch(groups) {
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
      if (groups && groups.length > obj['群组'].length ) {
        obj['群组'] = [];
        for (var i = 0; i < groups.length; i++ ) {
          var group = ActorClient.getGroup(groups[i].id);
          console.log('getGroup123', group);
          if(group) {
            obj['群组'].push({
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
            })
          }
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
  }
};
