'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _SharedContainer = require('../utils/SharedContainer');

var _SharedContainer2 = _interopRequireDefault(_SharedContainer);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _reactIntl = require('react-intl');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _LoginActionCreators = require('../actions/LoginActionCreators');

var _LoginActionCreators2 = _interopRequireDefault(_LoginActionCreators);

var _DepartmentActionCreators = require('../actions/DepartmentActionCreators');

var _DepartmentActionCreators2 = _interopRequireDefault(_DepartmentActionCreators);

var _LoginStore = require('../stores/LoginStore');

var _LoginStore2 = _interopRequireDefault(_LoginStore);

var _TextField = require('./common/TextField.react');

var _TextField2 = _interopRequireDefault(_TextField);

var _Checkbox = require('./common/Checkbox.react');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Login = function (_Component) {
  _inherits(Login, _Component);

  function Login(props) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onLoginChange = function (event) {
      event.preventDefault();
      _LoginActionCreators2.default.changeLogin(event.target.value);
    };

    _this.onCodeChange = function (event) {
      event.preventDefault();
      _LoginActionCreators2.default.changeCode(event.target.value);
    };

    _this.onNameChange = function (event) {
      event.preventDefault();
      _LoginActionCreators2.default.changeName(event.target.value);
    };

    _this.onRequestCode = function (event) {
      event && event.preventDefault();
      localStorage.clear();
      // console.log('localStorage', JSON.parse(JSON.stringify(localStorage)));
      var prmoise = new Promise(function (resolve, reject) {
        _LoginActionCreators2.default.requestNickName(_this.state.login, resolve, reject);
      });
      prmoise.then(function () {
        var prmoise = new Promise(function (resolve, reject) {
          _LoginActionCreators2.default.sendPassword(_this.state.code, resolve, reject);
        });
        prmoise.then(function () {}, function () {
          _this.handleFocus();
        });
      }, function () {
        _this.handleFocus();
      });
    };

    _this.onSignupRequested = function (event) {
      event.preventDefault();
      _LoginActionCreators2.default.sendSignup(_this.state.name);
    };

    _this.handleRestartAuthClick = function (event) {
      event.preventDefault();
      _LoginActionCreators2.default.restartAuth();
    };

    _this.handleSelectName = function (name, event) {
      event.preventDefault();
      _LoginActionCreators2.default.changeLogin(name);
      _LoginActionCreators2.default.changeCode('');
    };

    _this.handleChangeRemember = function (event) {
      _LoginActionCreators2.default.changeRemember(event.target.checked);
      if (!event.target.checked) {
        _LoginActionCreators2.default.changeAuto(event.target.checked);
      }
    };

    _this.handleChangeAuto = function (event) {
      _LoginActionCreators2.default.changeAuto(event.target.checked);
      if (event.target.checked) {
        _LoginActionCreators2.default.changeRemember(event.target.checked);
      }
    };

    _this.toggleDropdown = function (event) {
      event.preventDefault();
      var isOpened = _this.state.isOpened;

      if (!isOpened) {
        _this.setState({ 'isOpened': true });
        document.addEventListener('click', _this.closeDropdown);
      } else {
        _this.closeDropdown();
      }
    };

    _this.closeDropdown = function () {
      _this.setState({ 'isOpened': false });
      document.removeEventListener('click', _this.closeDropdown);
    };

    _this.handleFocus = function () {
      var step = _this.state.step;


      switch (step) {
        case _ActorAppConstants.AuthSteps.LOGIN_WAIT:
        case _ActorAppConstants.AuthSteps.CODE_WAIT:
          if (!_this.state.isCodeRequested) {
            _this.refs.login.focus();
          } else if (!_this.state.isCodeSended) {
            _this.refs.code.focus();
          }
          break;
        case _ActorAppConstants.AuthSteps.NAME_WAIT:
          _this.refs.name.focus();
          break;
        default:
      }
    };

    _LoginActionCreators2.default.start();

    var SharedActor = _SharedContainer2.default.get();
    _this.appName = SharedActor.appName ? SharedActor.appName : _ActorAppConstants.appName;
    return _this;
  }

  Login.getStores = function getStores() {
    return [_LoginStore2.default];
  };

  Login.calculateState = function calculateState() {
    return {
      login: _LoginStore2.default.getLogin(),
      code: _LoginStore2.default.getCode(),
      name: _LoginStore2.default.getName(),
      step: _LoginStore2.default.getStep(),
      remember: _LoginStore2.default.getRemember(),
      auto: _LoginStore2.default.getAuto(),
      nameList: _LoginStore2.default.getNameList(),
      errors: _LoginStore2.default.getErrors(),
      isCodeRequested: _LoginStore2.default.isCodeRequested(),
      isCodeSended: _LoginStore2.default.isCodeSended(),
      isLoginRequested: _LoginStore2.default.isLoginRequested(),
      isSignupStarted: _LoginStore2.default.isSignupStarted(),
      isOpened: false
    };
  };

  Login.prototype.componentWillMount = function componentWillMount() {
    // ActorClient.sendToElectron('setLoginStore', {key: 'nameList', value: ''});
  };

  Login.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.handleFocus();
    if (_ActorClient2.default.isElectron()) {
      window.messenger.listenOnRender('loginStore', function (event, data) {
        if (!data) {
          return;
        }
        // this.setState('store', data.info);
        _LoginActionCreators2.default.changeCode(data.info.code);
        _LoginActionCreators2.default.changeLogin(data.info.login);
        _LoginActionCreators2.default.changeRemember(data.info.remember);
        _LoginActionCreators2.default.changeAuto(data.info.auto);
        _LoginActionCreators2.default.changeNameList(data.nameList);
        if (data.info.auto) {
          _this2.onRequestCode();
        }
      });
      _ActorClient2.default.sendToElectron('logged-in');
      _ActorClient2.default.sendToElectron('active-focus');
    }
  };

  Login.prototype.componentDidUpdate = function componentDidUpdate() {
    // this.handleFocus();
    var auto = this.state.auto;
  };

  // From change handlers


  // Form submit handlers


  Login.prototype.renderDropDown = function renderDropDown() {
    var _this3 = this;

    var nameList = this.state.nameList;

    if (nameList && nameList.size === 0) return null;
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'i',
        { className: 'drop-icon material-icons', onClick: this.toggleDropdown },
        'arrow_drop_down'
      ),
      _react2.default.createElement(
        'ul',
        { className: 'dropdown__menu' },
        nameList.map(function (item, index) {
          return _react2.default.createElement(
            'li',
            { className: 'dropdown__menu__item', onClick: _this3.handleSelectName.bind(_this3, item), key: index },
            item
          );
        })
      )
    );
  };

  Login.prototype.renderCheckbox = function renderCheckbox() {
    var _state = this.state,
        remember = _state.remember,
        auto = _state.auto;

    if (!_ActorClient2.default.isElectron()) {
      return null;
    }
    return _react2.default.createElement(
      'div',
      { className: 'login-remember' },
      _react2.default.createElement(_Checkbox2.default, { label: '\u8BB0\u4F4F\u7528\u6237\u540D\u548C\u5BC6\u7801', id: 'remember', name: 'remember', value: remember, onChange: this.handleChangeRemember }),
      _react2.default.createElement(_Checkbox2.default, { label: '\u81EA\u52A8\u767B\u5F55', id: 'autoLogin', name: 'autoLogin', value: auto, onChange: this.handleChangeAuto })
    );
  };

  Login.prototype.render = function render() {
    var _state2 = this.state,
        step = _state2.step,
        errors = _state2.errors,
        login = _state2.login,
        code = _state2.code,
        name = _state2.name,
        isOpened = _state2.isOpened,
        remember = _state2.remember,
        auto = _state2.auto,
        isCodeRequested = _state2.isCodeRequested,
        isCodeSended = _state2.isCodeSended,
        isSignupStarted = _state2.isSignupStarted,
        isLoginRequested = _state2.isLoginRequested;
    var intl = this.context.intl;


    console.log('remember', remember);

    var requestFormClassName = (0, _classnames2.default)('login-new__forms__form', 'login-new__forms__form--request', {
      'login-new__forms__form--active': step === _ActorAppConstants.AuthSteps.LOGIN_WAIT || step === _ActorAppConstants.AuthSteps.CODE_WAIT,
      'login-new__forms__form--done': step !== _ActorAppConstants.AuthSteps.LOGIN_WAIT && step !== _ActorAppConstants.AuthSteps.CODE_WAIT
    });
    // let checkFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--check', {
    //   'login-new__forms__form--active': step === AuthSteps.CODE_WAIT && isCodeRequested,
    //   'login-new__forms__form--done': step !== AuthSteps.CODE_WAIT && isCodeSended
    // });
    var signupFormClassName = (0, _classnames2.default)('login-new__forms__form', 'login-new__forms__form--signup', {
      'login-new__forms__form--active': step === _ActorAppConstants.AuthSteps.NAME_WAIT
    });

    var dropClassName = (0, _classnames2.default)('dropdown', {
      'dropdown--opened': isOpened
    });

    var spinner = _react2.default.createElement(
      'div',
      { className: 'spinner' },
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null),
      _react2.default.createElement('div', null)
    );

    return _react2.default.createElement(
      'div',
      { className: 'login-bg-box' },
      _react2.default.createElement(
        'section',
        { className: 'login-new row center-xs middle-xs' },
        _react2.default.createElement(
          'div',
          { className: 'login-new__forms row center-xs middle-xs' },
          _react2.default.createElement('img', { alt: this.appName + ' messenger',
            className: 'logo',
            src: 'assets/images/logo1.png',
            width: '70' }),
          _react2.default.createElement(
            'h2',
            { className: 'login-title' },
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'login.name' }),
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'login.name_en' })
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'form',
              { className: requestFormClassName, onSubmit: this.onRequestCode },
              _react2.default.createElement(
                'div',
                { className: dropClassName },
                _react2.default.createElement(_TextField2.default, { className: 'login-input login-input-user',
                  disabled: isLoginRequested || step !== _ActorAppConstants.AuthSteps.LOGIN_WAIT && step !== _ActorAppConstants.AuthSteps.CODE_WAIT,
                  errorText: errors.login,
                  floatingLabel: intl.messages['login.user'],
                  onChange: this.onLoginChange,
                  placeholder: intl.messages['login.user'],
                  ref: 'login',
                  value: login }),
                this.renderDropDown()
              ),
              _react2.default.createElement(_TextField2.default, { className: 'login-input login-input-password',
                disabled: isLoginRequested || step !== _ActorAppConstants.AuthSteps.LOGIN_WAIT && step !== _ActorAppConstants.AuthSteps.CODE_WAIT,
                errorText: errors.code,
                floatingLabel: intl.messages['login.authPassword'],
                onChange: this.onCodeChange,
                placeholder: intl.messages['login.authPassword'],
                ref: 'code',
                type: 'password',
                value: code }),
              this.renderCheckbox(),
              _react2.default.createElement(
                'footer',
                { className: 'text-center' },
                _react2.default.createElement(
                  'button',
                  { className: 'button button--rised button--wide',
                    type: 'submit',
                    disabled: isLoginRequested },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.login' }),
                  isLoginRequested ? spinner : null
                )
              )
            ),
            _react2.default.createElement(
              'form',
              { className: signupFormClassName, onSubmit: this.onSignupRequested },
              _react2.default.createElement(_TextField2.default, { className: 'login-new__forms__form__input input__material--wide',
                disabled: isSignupStarted || step === _ActorAppConstants.AuthSteps.COMPLETED,
                errorText: errors.signup,
                floatingLabel: intl.messages['login.yourName'],
                onChange: this.onNameChange,
                ref: 'name',
                type: 'text',
                value: name }),
              _react2.default.createElement(
                'footer',
                { className: 'text-center' },
                _react2.default.createElement(
                  'button',
                  { className: 'button button--rised button--wide',
                    type: 'submit',
                    disabled: isSignupStarted },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.signUp' }),
                  isSignupStarted ? spinner : null
                )
              )
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'bottom-info' },
        _react2.default.createElement('img', { src: '../assets/images/logo2.png', width: '22', height: '25', style: { 'vertical-align': 'middle' } }),
        ' ',
        _react2.default.createElement(
          'span',
          { style: { 'vertical-align': 'middle' } },
          '\u6D59\u6C5F\u6613\u8238\u8F6F\u4EF6\u6709\u9650\u516C\u53F8'
        )
      )
    );
  };

  return Login;
}(_react.Component);

Login.contextTypes = {
  intl: _react.PropTypes.object
};
exports.default = _utils.Container.create(Login, { pure: false, withProps: true });
//# sourceMappingURL=Login.react.js.map