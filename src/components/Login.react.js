/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import classnames from 'classnames';
import SharedContainer from '../utils/SharedContainer';
import { appName, AuthSteps } from '../constants/ActorAppConstants';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import ActorClient from '../utils/ActorClient';

import LoginActionCreators from '../actions/LoginActionCreators';
import DepartmentAcationCreators from '../actions/DepartmentActionCreators';

import LoginStore from '../stores/LoginStore';

import TextField from './common/TextField.react';
import Checkbox from './common/Checkbox.react';

class Login extends Component {
  constructor(props) {
    super(props);

    LoginActionCreators.start();

    const SharedActor = SharedContainer.get();
    this.appName = SharedActor.appName ? SharedActor.appName : appName;
  }

  static getStores() {
    return [LoginStore];
  }

  static calculateState() {
    return {
      login: LoginStore.getLogin(),
      code: LoginStore.getCode(),
      name: LoginStore.getName(),
      step: LoginStore.getStep(),
      remember: LoginStore.getRemember(),
      auto: LoginStore.getAuto(),
      nameList: LoginStore.getNameList(),
      errors: LoginStore.getErrors(),
      isCodeRequested: LoginStore.isCodeRequested(),
      isCodeSended: LoginStore.isCodeSended(),
      isLoginRequested: LoginStore.isLoginRequested(),
      isSignupStarted: LoginStore.isSignupStarted(),
      isOpened: false
    }
  }

  static contextTypes = {
    intl: PropTypes.object
  };
  componentWillMount() {
    // ActorClient.sendToElectron('setLoginStore', {key: 'nameList', value: ''});
  }

  componentDidMount() {
    this.handleFocus();
    if (ActorClient.isElectron()) {   
      window.messenger.listenOnRender('loginStore', (event, data) => {
        if (!data) {
          return;
        }
        this.setState('store', data.info);
        LoginActionCreators.changeCode(data.info.code);
        LoginActionCreators.changeLogin(data.info.login);
        LoginActionCreators.changeRemember(data.info.remember);
        LoginActionCreators.changeAuto(data.info.auto);
        LoginActionCreators.changeNameList(data.nameList);
        if (data.info.auto) {
          // this.onRequestCode();
        }
      });
      ActorClient.sendToElectron('logged-in');
      ActorClient.sendToElectron('active-focus');

    }
  }

  componentDidUpdate() {
    // this.handleFocus();
    const { auto } = this.state;
   
  }

  // From change handlers
  onLoginChange = event => {
    event.preventDefault();
    LoginActionCreators.changeLogin(event.target.value);
  };
  onCodeChange = event => {
    event.preventDefault();
    LoginActionCreators.changeCode(event.target.value);
  };
  onNameChange = event => {
    event.preventDefault();
    LoginActionCreators.changeName(event.target.value);
  };

  // Form submit handlers
  onRequestCode = event => {
    event && event.preventDefault();
    localStorage.clear();
    // console.log('localStorage', JSON.parse(JSON.stringify(localStorage)));
    let prmoise = new Promise((resolve, reject) => {
      LoginActionCreators.requestNickName(this.state.login, resolve, reject);
    });
    prmoise.then(() => {
      let prmoise = new Promise((resolve, reject) => {
        LoginActionCreators.sendPassword(this.state.code, resolve, reject);
      });
      prmoise.then(() => {}, () => {
        this.handleFocus();
      });
    }, () => {
      this.handleFocus();
    });
  };
  onSignupRequested = event => {
    event.preventDefault();
    LoginActionCreators.sendSignup(this.state.name);
  };

  handleRestartAuthClick = event => {
    event.preventDefault();
    LoginActionCreators.restartAuth();
  };

  handleSelectName = (name, event) => {
    event.preventDefault();
    LoginActionCreators.changeLogin(name);
    LoginActionCreators.changeCode('');
  }

  handleChangeRemember = (event) => {
    LoginActionCreators.changeRemember(event.target.checked);
    if (!event.target.checked) {
      LoginActionCreators.changeAuto(event.target.checked);
    }
  }

  handleChangeAuto = (event) => {
    LoginActionCreators.changeAuto(event.target.checked);
    if (event.target.checked) {
      LoginActionCreators.changeRemember(event.target.checked);
    }
  }

  toggleDropdown = event => {
    event.preventDefault();
    const { isOpened } = this.state;
    if (!isOpened) {
      this.setState({'isOpened': true});
      document.addEventListener('click', this.closeDropdown);
    } else {
      this.closeDropdown();
    }
  }
  closeDropdown = () => {
    this.setState({'isOpened': false});
    document.removeEventListener('click', this.closeDropdown);
  }

  handleFocus = () => {
    const { step } = this.state;

    switch (step) {
      case AuthSteps.LOGIN_WAIT:
      case AuthSteps.CODE_WAIT:
        if (!this.state.isCodeRequested) {
          this.refs.login.focus();
        } else if (!this.state.isCodeSended) {
          this.refs.code.focus();
        }
        break;
      case AuthSteps.NAME_WAIT:
        this.refs.name.focus();
        break;
      default:
    }
  };
  renderDropDown() {
    const { nameList } = this.state;
    if (nameList && nameList.size === 0) return null;
    return (
      <div>
      <i className="drop-icon material-icons" onClick={this.toggleDropdown}>arrow_drop_down</i>
      <ul className="dropdown__menu">
      { nameList.map((item, index) => {
      return <li className="dropdown__menu__item" onClick={this.handleSelectName.bind(this, item)} key={ index }>{ item }</li>}) }
      </ul>
      </div>
    );
  }
  renderCheckbox() {
    const { remember, auto } = this.state;
    if (!ActorClient.isElectron()) {
      return null;
    }
    return (
      <div className="login-remember">
        <Checkbox label="记住用户名和密码" id="remember" name="remember" value={ remember } onChange={ this.handleChangeRemember } />
        <Checkbox label="自动登录" id="autoLogin" name="autoLogin" value={ auto } onChange={ this.handleChangeAuto } />
      </div>
    );
  }
  render() {
    const { step, errors, login, code, name, isOpened, remember, auto, isCodeRequested, isCodeSended, isSignupStarted, isLoginRequested } = this.state;
    const { intl } = this.context;

    console.log('remember', remember);

    let requestFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--request', {
      'login-new__forms__form--active': step === AuthSteps.LOGIN_WAIT || step === AuthSteps.CODE_WAIT,
      'login-new__forms__form--done': step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT
    });
    // let checkFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--check', {
    //   'login-new__forms__form--active': step === AuthSteps.CODE_WAIT && isCodeRequested,
    //   'login-new__forms__form--done': step !== AuthSteps.CODE_WAIT && isCodeSended
    // });
    let signupFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--signup', {
      'login-new__forms__form--active': step === AuthSteps.NAME_WAIT
    });

    let dropClassName = classnames('dropdown', {
      'dropdown--opened': isOpened
    });

    const spinner = (
      <div className="spinner">
        <div/><div/><div/><div/><div/><div/>
        <div/><div/><div/><div/><div/><div/>
      </div>
    );

    return (
      <div className="login-bg-box">
      <section className="login-new row center-xs middle-xs">

        {/* <div className="login-new__welcome col-xs row center-xs middle-xs">
          <img alt={`${this.appName} messenger`}
               className="logo"
               src="assets/images/logo.png"
               srcSet="assets/images/logo@2x.png 2x"/>

          <article>
            <h1 className="login-new__heading">
              <FormattedHTMLMessage id="login.welcome.header" values={{ appName: this.appName }}/>
            </h1>

            <FormattedHTMLMessage id="login.welcome.text" values={{ appName: this.appName }}/>
          </article>

          <footer>
            <div className="pull-left"><FormattedMessage id="login.welcome.copyright" values={{ appName: this.appName }}/></div>
            <div className="pull-right">
              <a href="//actorapp.ghost.io/desktop-apps">Desktop</a>&nbsp;&nbsp;•&nbsp;&nbsp;
              <a href="//actor.im/ios">iPhone</a>&nbsp;&nbsp;•&nbsp;&nbsp;
              <a href="//actor.im/android">Android</a>
            </div>
          </footer>
        </div> */}

        <div className="login-new__forms row center-xs middle-xs">
        <img alt={`${this.appName} messenger`}
               className="logo"
               src="assets/images/logo1.png"
               width="70"/> 
          <h2 className="login-title">
            <FormattedMessage id="login.name"/>
            <FormattedMessage id="login.name_en"/>
          </h2>
          <div>
            <form className={requestFormClassName} onSubmit={this.onRequestCode}>
              {/* <a className="wrong" onClick={this.handleRestartAuthClick}><FormattedMessage id="login.wrong"/></a>*/}
              <div className={ dropClassName }>
              <TextField className="login-input login-input-user"
                         disabled={isLoginRequested || step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT}
                         errorText={errors.login}
                         floatingLabel={intl.messages['login.user']}
                         onChange={this.onLoginChange}
                         placeholder={intl.messages['login.user']}
                         ref="login"
                         value={login}/>
                { this.renderDropDown() }
              </div>
              <TextField className="login-input login-input-password"
                         disabled={isLoginRequested || step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT}
                         errorText={errors.code}
                         floatingLabel={intl.messages['login.authPassword']}
                         onChange={this.onCodeChange}
                         placeholder={intl.messages['login.authPassword']}
                         ref="code"
                         type="password"
                         value={code}/>
              {/* <div className="login-remember">
                <div className={ selectedClassName }><input type="checkbox" id="remember" checked={ remember } onChange={ this.handleChangeRemember } /></div>
                <label htmlFor="remember" className="login-remember-msg">记住用户名和密码</label>
              </div> */}
              { this.renderCheckbox() }
              <footer className="text-center">
                <button className="button button--rised button--wide"
                        type="submit"
                        disabled={isLoginRequested}>
                  <FormattedMessage id="button.login"/>
                  {isLoginRequested ? spinner : null}

                </button>
              </footer>
            </form>

            <form className={signupFormClassName} onSubmit={this.onSignupRequested}>
              <TextField className="login-new__forms__form__input input__material--wide"
                         disabled={isSignupStarted || step === AuthSteps.COMPLETED}
                         errorText={errors.signup}
                         floatingLabel={intl.messages['login.yourName']}
                         onChange={this.onNameChange}
                         ref="name"
                         type="text"
                         value={name}/>
              <footer className="text-center">
                <button className="button button--rised button--wide"
                        type="submit"
                        disabled={isSignupStarted}>
                  <FormattedMessage id="button.signUp"/>
                  {isSignupStarted ? spinner : null}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </section>
      {/* <img src="../assets/images/bg_bottom.png" className="login-bg-bottom" width="100%" /> */}
      <div className="bottom-info"><img src="../assets/images/logo2.png" width="22" height="25" style={{'vertical-align': 'middle'}} /> <span style={{'vertical-align': 'middle'}}>浙江易舸软件有限公司</span></div>
      </div>
    );
  }
}

export default Container.create(Login, { pure: false, withProps: true });
