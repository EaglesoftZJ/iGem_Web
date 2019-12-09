/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */
import { isFunction } from 'lodash';
import React, { Component, PropTypes } from 'react';
import DelegateContainer from '../utils/DelegateContainer';

import VisibilityActionCreators from '../actions/VisibilityActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import MessageAlertActionCreators from '../actions/MessageAlertActionCreators';
import DialogActionCreators from '../actions/DialogActionCreators';

import DefaultSidebar from './Sidebar.react';
import DefaultToolbar from './Toolbar.react';
import ConnectionState from './common/ConnectionState.react';
import Favicon from './common/Favicon.react';
import Department from './Department.react';
import ModalsWrapper from './modals/ModalsWrapper.react';
import MenuOverlay from './common/MenuOverlay.react';
import SmallCall from './SmallCall.react';
import MessageAlert from './common/MessageAlert.react';

import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';

import loading from '../utils/DataLoading';
import ActorClient from '../utils/ActorClient';
import { prepareTextMessage } from '../utils/MessageUtils';

import history from '../utils/history';
import { setTimeout } from 'timers';
import $ from 'jquery';

class Main extends Component {
  static propTypes = {
    params: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  constructor(props) {
    super(props);

    this.components = this.getComponents();
  }

  getComponents() {
    const { components } = DelegateContainer.get();

    if (components) {
      return {
        Sidebar: isFunction(components.sidebar) ? components.sidebar : DefaultSidebar,
        Toolbar: isFunction(components.toolbar) ? components.toolbar : DefaultToolbar
      };
    }

    return {
      Sidebar: DefaultSidebar,
      Toolbar: DefaultToolbar
    };
  }
  componentWillMount() {
    if (ActorClient.isElectron()) {
      // this.handleEletronEr();
    }
  }

  componentDidMount() {
    // 测试

    this.onVisibilityChange(true);
    if (ActorClient.isElectron()) {
      window.messenger.listenOnRender('windows-blur', function(event, arg) {
        history.push('/im');
      })

      window.messenger.listenOnRender('windows-focus', (event, arg) => {
        VisibilityActionCreators.createAppVisible(); // 客户端中 web无法监听到visibilitychange事件 所以通过客户端的windows-focus来执行
        history.push(`/im/${arg}`);
      });


      window.messenger.listenOnRender('setLoggedOut', function(event, arg) {
        if (ActorClient.isElectron()) {
          LoginActionCreators.setLoggedOut();
        }
      })
      window.messenger.listenOnRender('downloadCompleted', function(event, arg) {
        MessageAlertActionCreators.show({title: '下载完成', type: 'success', key: new Date().getTime()});
        if (arg && arg.info) {
          console.log('我要发信息我要发信息');
          const {profile: {name, id}} = ProfileStore.getState();
        //   var text = prepareTextMessage(':paperclip:"' + arg.name + '"接收成功');
        //   ActorClient.sendTextMessage(arg.info, text);
            var spapdata = `<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                            <v:Header />
                            <v:Body>
                                <n0:insertXzrz id="o0" c:root="1" xmlns:n0="http://eaglesoft">
                                    <json i:type="d:string">{'messageId': '${ arg.info.rid }','userId': '${ id }','userName':'${ name }'}</json>
                                </n0:insertXzrz>
                            </v:Body>
                        </v:Envelope>`;
            var method = 'selectXzrz';  
            $.ajax({
                url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
                type: 'post',
                data: spapdata,
                beforeSend(request) {
                    console.log('beforeSend', request);
                    request.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
                    request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
                },
                success(res) {
                }
            });
        }
      });
      window.messenger.listenOnRender('downloadCancelled', function(event, arg) {
        MessageAlertActionCreators.show({title: '下载取消', type: 'warning', key: new Date().getTime()});
      });
      this.getDialogStore();
    } else {
      document.addEventListener('visibilitychange', this.onVisibilityChange);

    }
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  handleEletronEr() {
    window.messenger.listenOnRender('inMainTimes', (event, data) => {
      console.log('inMainTimes', data, LoginStore.isLoggedIn());
      if (data.main === 1 && data.login === 0 && LoginStore.isLoggedIn()) {
        // 直接进入main并处于登录状态，需要退出登录处理
        LoginActionCreators.setLoggedOut(true);
      }
    });
    ActorClient.sendToElectron('recodeInMain');
  }

  getDialogStore() {
    window.messenger.listenOnRender('dialogStore', function(event, arg) {
      // console.log('dialogStore', arg, );
      if (arg && arg['dialogs_' + ProfileStore.getProfile().id]) {
        setTimeout(() => {
          DialogActionCreators.setDialogs(arg['dialogs_' + ProfileStore.getProfile().id]);
        }, 1)
      }
    });
    ActorClient.sendToElectron('getDialogStore');
  }

  handleVisible() {
    if (document.visibilityState === 'visible') {
      ActorClient.sendToElectron('window-visible');
    } else if (document.visibilityState === 'hidden') {
      ActorClient.sendToElectron('window-hidden');
    }
  }

  onVisibilityChange = (isNotTj) => {
    console.log('onVisibilityChange is-hidden', document.hidden);
    if (document.hidden) {
      VisibilityActionCreators.createAppHidden();
    } else {
      VisibilityActionCreators.createAppVisible(isNotTj);
    }
  };

  renderCall() {
    const { features } = DelegateContainer.get();

    if (!features.calls) {
      return null;
    }

    return <SmallCall />;
  }
  handleClick() {
    MessageAlertActionCreators.show({name: 123, type: 'success', key: new Date().getTime()})
  }

  render() {
    console.log('main render========');
    const { Sidebar, Toolbar } = this.components;
    return (
      <div className="app">
        {/* <a href="javascript:;" target="_self" onClick={this.handleClick.bind(this)} style={{position: 'absolute', 'zIndex': 99999, top: 0, left: 0}}>click</a> */}

        <ConnectionState />
        <Favicon />

        <Toolbar />
        <section className="wrapper">
          <Sidebar />
          {this.props.children}
        </section>

        <MessageAlert />
        <ModalsWrapper />
        <MenuOverlay />

        {this.renderCall()}
      </div>
    );
  }
}

export default Main;
