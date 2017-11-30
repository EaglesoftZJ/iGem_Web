'use strict';

exports.__esModule = true;

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _l18n = require('../l18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var step = _ActorAppConstants.AuthSteps.LOGIN_WAIT,
    errors = {
  login: null,
  code: null,
  signup: null
},
    login = '',
    code = '',
    name = '',
    remember = false,
    auto = false,
    nameList = new _immutable2.default.OrderedSet(),
    isCodeRequested = false,
    isCodeSended = false,
    isLoginRequested = false,
    isSignupStarted = false,
    myUid = null;

console.log(123, nameList);

var LoginStore = function (_Store) {
  _inherits(LoginStore, _Store);

  function LoginStore(dispatcher) {
    _classCallCheck(this, LoginStore);

    // TODO: do not use intlData here. save error codes and send them to ui.
    var _this = _possibleConstructorReturn(this, _Store.call(this, dispatcher));

    _this.getStep = function () {
      return step;
    };

    _this.getErrors = function () {
      return errors;
    };

    _this.getLogin = function () {
      return login;
    };

    _this.getCode = function () {
      return code;
    };

    _this.getName = function () {
      return name;
    };

    _this.getRemember = function () {
      return remember;
    };

    _this.getAuto = function () {
      return auto;
    };

    _this.getNameList = function () {
      return nameList;
    };

    _this.isCodeRequested = function () {
      return isCodeRequested;
    };

    _this.isCodeSended = function () {
      return isCodeSended;
    };

    _this.isLoginRequested = function () {
      return isLoginRequested;
    };

    _this.isSignupStarted = function () {
      return isSignupStarted;
    };

    _this.getMyId = function () {
      return myUid;
    };

    _this.isLoggedIn = function () {
      return _ActorClient2.default.isLoggedIn();
    };

    _this.resetStore = function () {
      step = _ActorAppConstants.AuthSteps.LOGIN_WAIT;
      errors = {
        login: null,
        code: null,
        signup: null
      };
      login = code = name = '';
      remember = auto = false;
      nameList = new _immutable2.default.OrderedSet(), isCodeRequested = isCodeSended = isSignupStarted = false;
      myUid = null;
    };

    _this.intl = (0, _l18n.getIntlData)();
    return _this;
  }

  LoginStore.prototype.__onDispatch = function __onDispatch(action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_NAME_LIST:
        console.log(111, action.list);
        nameList = action.list ? new _immutable2.default.OrderedSet(action.list) : new _immutable2.default.OrderedSet();
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_REMEMBER:
        remember = action.remember;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_AUTO:
        auto = action.auto;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_LOGIN:
        login = action.login;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_CODE:
        code = action.code;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CHANGE_NAME:
        name = action.name;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_CODE_REQUEST:
        isCodeRequested = true;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CODE_REQUEST_SUCCESS:
        step = _ActorAppConstants.AuthSteps.CODE_WAIT;
        errors.login = null;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CODE_REQUEST_FAILURE:
        switch (action.error) {
          case 'PHONE_NUMBER_INVALID':
            errors.login = this.intl.messages['login.errors.numberInvalid'];
            break;
          case 'CODE_WAIT':
            errors.login = this.intl.messages['login.errors.codeWait'];
            break;
          default:
            errors.login = action.error;
        }
        isCodeRequested = false;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_USER_REQUEST:
        isCodeRequested = true;
        isLoginRequested = true;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_USER_REQUEST_SUCCESS:
        step = _ActorAppConstants.AuthSteps.CODE_WAIT;
        errors.login = null;
        isLoginRequested = false;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_USER_REQUEST_FAILURE:
        switch (action.error) {
          case 'USER_INVALID':
            errors.login = this.intl.messages['login.errors.numberInvalid'];
            break;
          case 'CODE_WAIT':
            errors.login = this.intl.messages['login.errors.codeWait'];
            break;
          default:
            errors.login = action.error;
        }
        isCodeRequested = false;
        isLoginRequested = false;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_CODE_SEND:
        isCodeSended = true;
        isLoginRequested = true;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CODE_SEND_SUCCESS:
        errors.code = null;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_CODE_SEND_FAILURE:
        switch (action.error) {
          case 'PHONE_CODE_INVALID':
          case 'EMAIL_CODE_INVALID':
            errors.code = this.intl.messages['login.errors.codeInvalid'];
            break;
          case 'PHONE_CODE_EXPIRED':
            errors.code = this.intl.messages['login.errors.codeExpired'];
            break;
          default:
            errors.code = action.error;
        }
        isCodeSended = false;
        isLoginRequested = false;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_PASSWORD_SEND:
        isCodeSended = true;
        isLoginRequested = true;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_PASSWORD_SEND_SUCCESS:
        errors.code = null;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_PASSWORD_SEND_FAILURE:
        switch (action.error) {
          case 'PHONE_CODE_INVALID':
          case 'EMAIL_CODE_INVALID':
            errors.code = this.intl.messages['login.errors.codeInvalid'];
            break;
          case 'PHONE_CODE_EXPIRED':
            errors.code = this.intl.messages['login.errors.codeExpired'];
            break;
          default:
            errors.code = action.error;
        }
        isCodeSended = false;
        isLoginRequested = false;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_SIGNUP_START:
        step = _ActorAppConstants.AuthSteps.NAME_WAIT;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_SIGNUP:
        isSignupStarted = true;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_SIGNUP_SUCCESS:
        errors.signup = null;
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_SIGNUP_FAILURE:
        switch (action.error) {
          case 'NAME_INVALID':
            errors.signup = this.intl.messages['login.errors.nameInvalid'];
            break;
          default:
            errors.signup = action.error;
        }
        isSignupStarted = false;
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_RESTART:
        this.resetStore();
        this.__emitChange();
        break;

      case _ActorAppConstants.ActionTypes.AUTH_SET_LOGGED_SET_STORE:
        // 登录后操作
        if (_ActorClient2.default.isElectron()) {
          var obj = {
            auto: auto,
            remember: remember,
            login: remember ? login : '',
            code: remember ? code : '',
            isLogin: true
          };
          _ActorClient2.default.sendToElectron('setLoginStore', { key: 'info', value: obj });
          _ActorClient2.default.sendToElectron('setLoginStore', { key: 'nameList', value: nameList.add(login).toJS() });
        }
        break;
      case _ActorAppConstants.ActionTypes.AUTH_SET_LOGGED_IN:
        myUid = _ActorClient2.default.getUid();
        this.__emitChange();
        break;
      case _ActorAppConstants.ActionTypes.AUTH_SET_LOGGED_OUT:
        // 退出登录
        if (_ActorClient2.default.isElectron()) {
          _ActorClient2.default.sendToElectron('setLoginStore', { key: 'info.auto', value: action.keepAuto && auto });
          _ActorClient2.default.sendToElectron('setLoginStore', { key: 'info.isLogin', value: false });
        }
        localStorage.clear();
        location.reload();
        break;
      default:
    }
  };

  return LoginStore;
}(_utils.Store);

exports.default = new LoginStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=LoginStore.js.map