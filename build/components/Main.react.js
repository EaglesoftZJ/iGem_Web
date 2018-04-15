'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DelegateContainer = require('../utils/DelegateContainer');

var _DelegateContainer2 = _interopRequireDefault(_DelegateContainer);

var _VisibilityActionCreators = require('../actions/VisibilityActionCreators');

var _VisibilityActionCreators2 = _interopRequireDefault(_VisibilityActionCreators);

var _LoginActionCreators = require('../actions/LoginActionCreators');

var _LoginActionCreators2 = _interopRequireDefault(_LoginActionCreators);

var _MessageAlertActionCreators = require('../actions/MessageAlertActionCreators');

var _MessageAlertActionCreators2 = _interopRequireDefault(_MessageAlertActionCreators);

var _DialogActionCreators = require('../actions/DialogActionCreators');

var _DialogActionCreators2 = _interopRequireDefault(_DialogActionCreators);

var _Sidebar = require('./Sidebar.react');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Toolbar = require('./Toolbar.react');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _ConnectionState = require('./common/ConnectionState.react');

var _ConnectionState2 = _interopRequireDefault(_ConnectionState);

var _Favicon = require('./common/Favicon.react');

var _Favicon2 = _interopRequireDefault(_Favicon);

var _Department = require('./Department.react');

var _Department2 = _interopRequireDefault(_Department);

var _ModalsWrapper = require('./modals/ModalsWrapper.react');

var _ModalsWrapper2 = _interopRequireDefault(_ModalsWrapper);

var _MenuOverlay = require('./common/MenuOverlay.react');

var _MenuOverlay2 = _interopRequireDefault(_MenuOverlay);

var _SmallCall = require('./SmallCall.react');

var _SmallCall2 = _interopRequireDefault(_SmallCall);

var _MessageAlert = require('./common/MessageAlert.react');

var _MessageAlert2 = _interopRequireDefault(_MessageAlert);

var _LoginStore = require('../stores/LoginStore');

var _LoginStore2 = _interopRequireDefault(_LoginStore);

var _ProfileStore = require('../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _DataLoading = require('../utils/DataLoading');

var _DataLoading2 = _interopRequireDefault(_DataLoading);

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _MessageUtils = require('../utils/MessageUtils');

var _history = require('../utils/history');

var _history2 = _interopRequireDefault(_history);

var _timers = require('timers');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Main = function (_Component) {
  _inherits(Main, _Component);

  function Main(props) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onVisibilityChange = function () {
      if (document.hidden) {
        _VisibilityActionCreators2.default.createAppHidden();
      } else {
        _VisibilityActionCreators2.default.createAppVisible();
      }
    };

    _this.components = _this.getComponents();
    return _this;
  }

  Main.prototype.getComponents = function getComponents() {
    var _DelegateContainer$ge = _DelegateContainer2.default.get(),
        components = _DelegateContainer$ge.components;

    if (components) {
      return {
        Sidebar: (0, _lodash.isFunction)(components.sidebar) ? components.sidebar : _Sidebar2.default,
        Toolbar: (0, _lodash.isFunction)(components.toolbar) ? components.toolbar : _Toolbar2.default
      };
    }

    return {
      Sidebar: _Sidebar2.default,
      Toolbar: _Toolbar2.default
    };
  };

  Main.prototype.componentWillMount = function componentWillMount() {
    if (_ActorClient2.default.isElectron()) {
      // this.handleEletronEr();
    }
  };

  Main.prototype.componentDidMount = function componentDidMount() {
    // 测试

    this.onVisibilityChange();
    if (_ActorClient2.default.isElectron()) {
      window.messenger.listenOnRender('windows-blur', function (event, arg) {
        _history2.default.push('/im');
      });

      window.messenger.listenOnRender('windows-focus', function (event, arg) {

        _history2.default.push('/im/' + arg);
      });

      window.messenger.listenOnRender('setLoggedOut', function (event, arg) {
        if (_ActorClient2.default.isElectron()) {
          _LoginActionCreators2.default.setLoggedOut();
        }
      });
      window.messenger.listenOnRender('downloadCompleted', function (event, arg) {
        _MessageAlertActionCreators2.default.show({ title: '下载完成', type: 'success', key: new Date().getTime() });
        if (arg && arg.info) {
          console.log('我要发信息我要发信息');

          var _ProfileStore$getStat = _ProfileStore2.default.getState(),
              _ProfileStore$getStat2 = _ProfileStore$getStat.profile,
              name = _ProfileStore$getStat2.name,
              id = _ProfileStore$getStat2.id;
          //   var text = prepareTextMessage(':paperclip:"' + arg.name + '"接收成功');
          //   ActorClient.sendTextMessage(arg.info, text);


          var spapdata = '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">\n                            <v:Header />\n                            <v:Body>\n                                <n0:insertXzrz id="o0" c:root="1" xmlns:n0="http://eaglesoft">\n                                    <json i:type="d:string">{\'messageId\': \'' + arg.info.rid + '\',\'userId\': \'' + id + '\',\'userName\':\'' + name + '\'}</json>\n                                </n0:insertXzrz>\n                            </v:Body>\n                        </v:Envelope>';
          var method = 'selectXzrz';
          _jquery2.default.ajax({
            url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
            type: 'post',
            data: spapdata,
            beforeSend: function beforeSend(request) {
              console.log('beforeSend', request);
              request.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
              request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
            },
            success: function success(res) {}
          });
        }
      });
      window.messenger.listenOnRender('downloadCancelled', function (event, arg) {
        _MessageAlertActionCreators2.default.show({ title: '下载取消', type: 'warning', key: new Date().getTime() });
      });
      this.getDialogStore();
    } else {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  };

  Main.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  };

  Main.prototype.handleEletronEr = function handleEletronEr() {
    window.messenger.listenOnRender('inMainTimes', function (event, data) {
      console.log('inMainTimes', data, _LoginStore2.default.isLoggedIn());
      if (data.main === 1 && data.login === 0 && _LoginStore2.default.isLoggedIn()) {
        // 直接进入main并处于登录状态，需要退出登录处理
        _LoginActionCreators2.default.setLoggedOut(true);
      }
    });
    _ActorClient2.default.sendToElectron('recodeInMain');
  };

  Main.prototype.getDialogStore = function getDialogStore() {
    window.messenger.listenOnRender('dialogStore', function (event, arg) {
      if (arg) {
        _DialogActionCreators2.default.setDialogs(arg.dialogs);
      }
    });
    _ActorClient2.default.sendToElectron('getDialogStore');
  };

  Main.prototype.handleVisible = function handleVisible() {
    if (document.visibilityState === 'visible') {
      _ActorClient2.default.sendToElectron('window-visible');
    } else if (document.visibilityState === 'hidden') {
      _ActorClient2.default.sendToElectron('window-hidden');
    }
  };

  Main.prototype.renderCall = function renderCall() {
    var _DelegateContainer$ge2 = _DelegateContainer2.default.get(),
        features = _DelegateContainer$ge2.features;

    if (!features.calls) {
      return null;
    }

    return _react2.default.createElement(_SmallCall2.default, null);
  };

  Main.prototype.handleClick = function handleClick() {
    _MessageAlertActionCreators2.default.show({ name: 123, type: 'success', key: new Date().getTime() });
  };

  Main.prototype.render = function render() {
    var _components = this.components,
        Sidebar = _components.Sidebar,
        Toolbar = _components.Toolbar;

    return _react2.default.createElement(
      'div',
      { className: 'app' },
      _react2.default.createElement(_ConnectionState2.default, null),
      _react2.default.createElement(_Favicon2.default, null),
      _react2.default.createElement(Toolbar, null),
      _react2.default.createElement(
        'section',
        { className: 'wrapper' },
        _react2.default.createElement(Sidebar, null),
        this.props.children
      ),
      _react2.default.createElement(_MessageAlert2.default, null),
      _react2.default.createElement(_ModalsWrapper2.default, null),
      _react2.default.createElement(_MenuOverlay2.default, null),
      this.renderCall()
    );
  };

  return Main;
}(_react.Component);

Main.propTypes = {
  params: _react.PropTypes.object,
  children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
};
exports.default = Main;
//# sourceMappingURL=Main.react.js.map