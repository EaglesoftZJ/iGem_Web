/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import $ from 'jquery';

import ActorClient from '../utils/ActorClient';
import history from '../utils/history';
import DelegateContainer from '../utils/DelegateContainer';
import LocationContainer from '../utils/LocationContainer';

import ActionCreators from './ActionCreators';
import JoinGroupActions from './JoinGroupActions';
import ProfileActionCreators from './ProfileActionCreators';
import DialogActionCreators from './DialogActionCreators';
import ContactActionCreators from './ContactActionCreators';
import QuickSearchActionCreators from './QuickSearchActionCreators';
import FaviconActionCreators from './FaviconActionCreators';
import EventBusActionCreators from './EventBusActionCreators';
import StickersActionCreators from './StickersActionCreators';
import DepartmentActionCreators from './DepartmentActionCreators';
import ProfileStore from '../stores/ProfileStore';

class LoginActionCreators extends ActionCreators {
  start() {
    dispatch(ActionTypes.AUTH_START);
  }

  changeLogin(login) {
    dispatch(ActionTypes.AUTH_CHANGE_LOGIN, { login });
  }

  changeCode(code) {
    dispatch(ActionTypes.AUTH_CHANGE_CODE, { code });
  }

  changeName(name) {
    dispatch(ActionTypes.AUTH_CHANGE_NAME, { name });
  }

  changeRemember(remember) {
    dispatch(ActionTypes.AUTH_CHANGE_REMEMBER, { remember });
  }

  changeAuto(auto) {
    dispatch(ActionTypes.AUTH_CHANGE_AUTO, { auto });
  }

  changeNameList(list) {
    dispatch(ActionTypes.AUTH_CHANGE_NAME_LIST, { list });
  }

  startSignup() {
    dispatch(ActionTypes.AUTH_SIGNUP_START);
  }

  restartAuth() {
    dispatch(ActionTypes.AUTH_RESTART);
  }

  requestCode(phone) {
    let promise;
    if (/@/.test(phone)) {
      promise = ActorClient.requestCodeEmail(phone);
    } else {
      promise = ActorClient.requestSms(phone);
    }

    dispatchAsync(promise, {
      request: ActionTypes.AUTH_CODE_REQUEST,
      success: ActionTypes.AUTH_CODE_REQUEST_SUCCESS,
      failure: ActionTypes.AUTH_CODE_REQUEST_FAILURE
    }, { phone });
  }

  requestSms(phone) {
    dispatchAsync(ActorClient.requestSms(phone), {
      request: ActionTypes.AUTH_CODE_REQUEST,
      success: ActionTypes.AUTH_CODE_REQUEST_SUCCESS,
      failure: ActionTypes.AUTH_CODE_REQUEST_FAILURE
    }, { phone });
  }

  requestNickName(nickname, reslove, reject) {
   dispatchAsync(ActorClient.requestNickName(nickname), {
      request: ActionTypes.AUTH_USER_REQUEST,
      success: ActionTypes.AUTH_USER_REQUEST_SUCCESS,
      failure: ActionTypes.AUTH_USER_REQUEST_FAILURE
    }, {
      nickname
    }).then((state) => {
     switch (state) {
       case 'start':
         reslove();
       break;
       default:
         reject();
     }
    })
  }

  sendCode(code) {
    dispatchAsync(ActorClient.sendCode(code), {
      request: ActionTypes.AUTH_CODE_SEND,
      success: ActionTypes.AUTH_CODE_SEND_SUCCESS,
      failure: ActionTypes.AUTH_CODE_SEND_FAILURE
    }, {
      code
    }).then((state) => {
      switch (state) {
        case 'signup':
          this.startSignup();
          break;
        case 'logged_in':
          this.setLoggedIn({ redirect: true });
          break;
        default:
          console.error('Unsupported state', state);
      }
    });
  }

  sendPassword(password, reslove, reject) {
    dispatchAsync(ActorClient.sendPassword(password), {
      request: ActionTypes.AUTH_PASSWORD_SEND,
      success: ActionTypes.AUTH_PASSWORD_SEND_SUCCESS,
      failure: ActionTypes.AUTH_PASSWORD_SEND_FAILURE
    }, {
      password
    }).then((state) => {
      switch (state) {
        case 'signup':
          this.startSignup();
          break;
        case 'logged_in':
          this.setLoggedIn({ redirect: true });
          break;
        default:
          reject();
          console.error('Unsupported state', state);
      }
    });
  }

  sendSignup(name) {
    const signUpPromise = () => dispatchAsync(ActorClient.signUp(name), {
      request: ActionTypes.AUTH_SIGNUP,
      success: ActionTypes.AUTH_SIGNUP_SUCCESS,
      failure: ActionTypes.AUTH_SIGNUP_FAILURE
    }, { name });

    const setLoggedIn = () => this.setLoggedIn({ redirect: true });

    signUpPromise()
      .then(setLoggedIn)
  }



  setLoggedIn(opts = {}) {
    const delegate = DelegateContainer.get();

    if (delegate.actions.setLoggedIn) {
      return delegate.actions.setLoggedIn(opts);
    }

    if (opts.redirect) {
      dispatch(ActionTypes.AUTH_SET_LOGGED_SET_STORE);
      const location = LocationContainer.get();
      const nextPathname = location.state ? location.state.nextPathname : '/im';

      history.push(nextPathname);
    }

    this.setBindings('main', [
      ActorClient.bindUser(ActorClient.getUid(), ProfileActionCreators.setProfile),
      ActorClient.bindGroupDialogs(DialogActionCreators.setDialogs),
      ActorClient.bindContacts(ContactActionCreators.setContacts),
      ActorClient.bindSearch(QuickSearchActionCreators.setQuickSearchList),
      ActorClient.bindTempGlobalCounter(FaviconActionCreators.setFavicon),
      ActorClient.bindEventBus(EventBusActionCreators.broadcastEvent),
      ActorClient.bindStickers(StickersActionCreators.setStickers)
    ]);



    dispatch(ActionTypes.AUTH_SET_LOGGED_IN);

    // 登录后活跃度统计
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

    function getDepartment() {
        ActorClient.postOAWebservice({
            //url: 'http://g.portzhoushan.com/MoaService/MoaService.asmx/GetAllUserFullData',
            url: 'http://61.175.100.12:8801/zsgwuias/rest/out/getTxl',
            // url: 'http://220.189.207.21:8709/WebServiceSSO.asmx/GetAllUserFullData',
          data: 'k=eagleSoftWebService',
          type: 'POST',
          fail(res) {
            console.log('fail', res);
          },
          success: res => {
              DepartmentActionCreators.setRes({res: res.data});
          }
        });
    }

    // 创建webservicee请求
    function ajaxFunc() {
        var url = 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService';
        var method = 'selectXzrz';
        var data = '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><n0:queryGroup id="o0" c:root="1" xmlns:n0="http://eaglesoft"><id i:type="d:string">673080096</id></n0:queryGroup></v:Body></v:Envelope>'
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                console.log(xmlhttp.responseText);
            }
        }
        xmlhttp.open('POST', url + '/' + method, true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
        xmlhttp.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
        xmlhttp.send(data);
    }

    // ajaxFunc();



    // ActorClient.postOAWebservice({
    //     //url: 'http://g.portzhoushan.com/MoaService/MoaService.asmx/GetAllUserFullData',
    //     url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
    //     // url: 'http://220.189.207.21:8709/WebServiceSSO.asmx/GetAllUserFullData',
    //     data: 'messageId=123',
    //     success: res => {
    //         DepartmentActionCreators.setRes({res});
    //     }
    // });

    getDepartment();
    var start = new Date().getTime();
    // 定时更新
    setInterval(() => {
        var now = new Date().getTime();
        if ((now - start) / 1000 / 60 / 60 >= 6) {
            start = now;
            getDepartment(); 
        }
    }, 360000);
    // JoinGroupActions.joinAfterLogin();
  }

  setLoggedOut(obj) {
    const delegate = DelegateContainer.get();



    if (delegate.actions.setLoggedOut) {
      return delegate.actions.setLoggedOut();
    }

    this.removeBindings('main');

    dispatch(ActionTypes.AUTH_SET_LOGGED_OUT,{login: obj ? obj:false});
  }
}

export default new LoginActionCreators();
