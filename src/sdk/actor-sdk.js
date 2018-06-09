/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import 'babel-polyfill';
import 'setimmediate';
import 'intl';

import Actor from 'actor-js';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import Modal from 'react-modal';
import Pace from 'pace';
import crosstab from 'crosstab';
import assignDeep from 'assign-deep';

import DelegateContainer from '../utils/DelegateContainer';
import SharedContainer from '../utils/SharedContainer';
import SDKDelegate from './actor-sdk-delegate';
import { endpoints, rootElement, helpPhone, appName } from '../constants/ActorAppConstants'

import history from '../utils/history';
import RouterHooks from '../utils/RouterHooks';
import { IntlProvider } from 'react-intl';
import { lightbox, handleCopy, downloadClick } from '../utils/ImageUtils'

import LoginActionCreators from '../actions/LoginActionCreators';
import defaultLogHandler from '../utils/defaultLogHandler';
import ActorClient from '../utils/ActorClient';

import LoginStore from '../stores/LoginStore';

import App from '../components/App.react';
import Main from '../components/Main.react';
import DefaultLogin from '../components/Login.react';
import DefaultDeactivated from '../components/Deactivated.react';
import DefaultJoin from '../components/Join.react';
import DefaultInstall from '../components/Install.react';
import DefaultArchive from '../components/Archive.react';
import DefaultDialog from '../components/Dialog.react';
import DefaultEmpty from '../components/Empty.react';
import Department from '../components/Department.react';
import $ from 'jquery';
import eventDrag from 'jquery.event.drag';
eventDrag($);
import 'jquery.mousewheel';
import 'screenfull';
import '../../assets/scripts/mag-analytics.js';
import '../../assets/scripts/mag.js';
import '../../assets/scripts/mag-jquery.js';
import '../../assets/scripts/mag-control.js';


console.log('滚动测试', $('img').mag);
// console.log('显示！！！');

import { extendL18n, getIntlData } from '../l18n';

const ACTOR_INIT_EVENT = 'INIT';

// Init app loading progressbar
Pace.start({
  ajax: false,
  restartOnRequestAfter: false,
  restartOnPushState: false,
});

// Init lightbox
lightbox.load({
  animation: 500,
    asyn: true,
    carousel: false,
    controlClose: '<i class="material-icons">close</i>',
    btns: [
        '<a class="download img-icon" href="javascript:;" target="_self">下载</a>',
        '<a class="copy img-icon" href="javascript:;" target="_self">复制</a>'
    ],
    funs: [downloadClick, handleCopy],
    onload() {
        setTimeout(() => {
            var $host = $('[mag-thumb=drag]');
            console.log('初始化img',  $host);
            $host.mag({
                position: 'drag',
                zoomMin: 0.5,
                toggle: false
            });
        }, 100);
      
  }
});

window.isJsAppLoaded = false;
window.jsAppLoaded = () => window.isJsAppLoaded = true;

/**
 * Class represents ActorSKD itself
 *
 * @param {object} options - Object contains custom components, actions and localisation strings.
 */
class ActorSDK {
  static defaultOptions = {
    endpoints,
    rootElement,
    appName,
    helpPhone,
    homePage: null,
    twitter: null,
    facebook: null,
    delegate: null,
    forceLocale: null,
    features: {
      calls: true,
      search: false,
      editing: false
    },
    routes: null,
    isExperimental: false,
    logHandler: defaultLogHandler
  };

  constructor(options = {}) {
    assignDeep(this, ActorSDK.defaultOptions, options);

    if (!this.delegate) {
      this.delegate = new SDKDelegate();
    }

    DelegateContainer.set(this.delegate);

    if (this.delegate.l18n) extendL18n();

    SharedContainer.set(this);
  }

  getRoutes() {
    if (this.routes) {
      return this.routes;
    }

    const Login = (typeof this.delegate.components.login == 'function') ? this.delegate.components.login : DefaultLogin;
    const Deactivated = (typeof this.delegate.components.deactivated == 'function') ? this.delegate.components.deactivated : DefaultDeactivated;
    const Install = (typeof this.delegate.components.install == 'function') ? this.delegate.components.install : DefaultInstall;
    const Archive = (typeof this.delegate.components.archive == 'function') ? this.delegate.components.archive : DefaultArchive; // TODO: Rename this component
    const Join = (typeof this.delegate.components.join == 'function') ? this.delegate.components.join : DefaultJoin;
    const Empty = (typeof this.delegate.components.empty == 'function') ? this.delegate.components.empty : DefaultEmpty;
    const Dialog = (typeof this.delegate.components.dialog == 'function') ? this.delegate.components.dialog : DefaultDialog;

    return (
      <Route path="/" component={App}>
        <Route path="auth" component={Login}/>
        <Route path="deactivated" component={Deactivated}/>
        <Route path="install" component={Install}/>

        <Route path="im" component={Main} onEnter={RouterHooks.requireAuth}>
          <Route path="history" component={Archive} />
          <Route path="department" component={Department} />
          <Route path="join/:token" component={Join} />
          <Route path=":id" component={Dialog} />
          <IndexRoute component={Empty} />
        </Route>

        <Redirect from="join/:token" to="im/join/:token" />
        <IndexRedirect to={'auth'}/>
      </Route>
    );
  }

  _starter = () => {
    if (crosstab.supported) {
      crosstab.on(ACTOR_INIT_EVENT, (msg) => {
        if (msg.origin !== crosstab.id && window.location.hash !== '#/deactivated') {
          history.push('deactivated');
        }
      });
    }

    const appRootElemet = document.getElementById(this.rootElement);

    if (window.location.hash !== '#/deactivated') {
      if (crosstab.supported) crosstab.broadcast(ACTOR_INIT_EVENT, {});
      window.messenger = Actor.create({
        endpoints: this.endpoints,
        logHandler: this.logHandler
      });
    }

    const intlData = getIntlData(this.forceLocale);

    /**
     * Method for pulling props to router components
     *
     * @param RoutedComponent component for extending
     * @param props props to extend
     * @returns {object} extended component
     */
    const createElement = (Component, props) => {
      return <Component {...props} delegate={this.delegate} isExperimental={this.isExperimental}/>;
    };

    const root = (
      <IntlProvider {...intlData}>
        <Router history={history} createElement={createElement}>
          {this.getRoutes()}
        </Router>
      </IntlProvider>
    );

    render(root, appRootElemet);

    // initial setup fot react modal
    Modal.setAppElement(appRootElemet);


    if (window.location.hash !== '#/deactivated') {
      if (!ActorClient.isElectron() && LoginStore.isLoggedIn()) {
        console.log('sdk loggedin');
        LoginActionCreators.setLoggedIn({ redirect: false });
      }
    }
  };

  /**
   * Start application
   */
  startApp() {
    if (window.isJsAppLoaded) {
      this._starter();
    } else {
      window.jsAppLoaded = this._starter;
    }
  }
}

export default ActorSDK;
