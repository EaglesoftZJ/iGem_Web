/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */
import { isFunction } from 'lodash';
import React, { Component, PropTypes } from 'react';
import DelegateContainer from '../utils/DelegateContainer';

import VisibilityActionCreators from '../actions/VisibilityActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';

import DefaultSidebar from './Sidebar.react';
import DefaultToolbar from './Toolbar.react';
import ConnectionState from './common/ConnectionState.react';
import Favicon from './common/Favicon.react';

import ModalsWrapper from './modals/ModalsWrapper.react';
import MenuOverlay from './common/MenuOverlay.react';
import SmallCall from './SmallCall.react';
import loading from '../utils/DataLoading';
import ActorClient from '../utils/ActorClient';

import history from '../utils/history';
import { setTimeout } from 'timers';

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
      this.handleEletronEr();
    }
  }

  componentDidMount() {
    this.onVisibilityChange();
    if (ActorClient.isElectron()) {
      window.messenger.listenOnRender('windows-blur', function(event, arg) {
        history.push('/im');
      })

      window.messenger.listenOnRender('windows-focus', function(event, arg) {

        history.push(`/im/${arg}`);
      })

      window.messenger.listenOnRender('setLoggedOut', function(event, arg) {
        if (ActorClient.isElectron()) {
            // 存储用户信息
          ActorClient.sendToElectron('setLoginStore', {key: 'info.auto', value: false });
          ActorClient.sendToElectron('setLoginStore', {key: 'info.isLogin', value: false });
        }
      })
    } else {
      document.addEventListener('visibilitychange', this.onVisibilityChange);

    }
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  handleEletronEr() {
    window.messenger.listenOnRender('loginStore', (event, data) => {
      console.log(123, data.info.isLogin)
      if (!data.info.isLogin) {
        history.push('/auth');
      } else {
        LoginActionCreators.setLoggedIn({redirect: false})
      }
    });
    ActorClient.sendToElectron('logged-in');
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      VisibilityActionCreators.createAppHidden();
    } else {
      VisibilityActionCreators.createAppVisible();
    }
  };

  renderCall() {
    const { features } = DelegateContainer.get();

    if (!features.calls) {
      return null;
    }

    return <SmallCall />;
  }

  render() {
    const { Sidebar, Toolbar } = this.components;

    return (
      <div className="app">
        <ConnectionState />
        <Favicon />

        <Toolbar />
        <section className="wrapper">
          <Sidebar />
          {this.props.children}
        </section>


        <ModalsWrapper />
        <MenuOverlay />

        {this.renderCall()}
      </div>
    );
  }
}

export default Main;
