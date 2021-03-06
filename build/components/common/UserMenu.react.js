'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ActorClient = require('../../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _EmojiUtils = require('../../utils/EmojiUtils');

var _confirm = require('../../utils/confirm');

var _confirm2 = _interopRequireDefault(_confirm);

var _SharedContainer = require('../../utils/SharedContainer');

var _SharedContainer2 = _interopRequireDefault(_SharedContainer);

var _reactIntl = require('react-intl');

var _ProfileActionCreators = require('../../actions/ProfileActionCreators');

var _ProfileActionCreators2 = _interopRequireDefault(_ProfileActionCreators);

var _CreateGroupActionCreators = require('../../actions/CreateGroupActionCreators');

var _CreateGroupActionCreators2 = _interopRequireDefault(_CreateGroupActionCreators);

var _LoginActionCreators = require('../../actions/LoginActionCreators');

var _LoginActionCreators2 = _interopRequireDefault(_LoginActionCreators);

var _HelpActionCreators = require('../../actions/HelpActionCreators');

var _HelpActionCreators2 = _interopRequireDefault(_HelpActionCreators);

var _AddContactActionCreators = require('../../actions/AddContactActionCreators');

var _AddContactActionCreators2 = _interopRequireDefault(_AddContactActionCreators);

var _PreferencesActionCreators = require('../../actions/PreferencesActionCreators');

var _PreferencesActionCreators2 = _interopRequireDefault(_PreferencesActionCreators);

var _MessageActionCreators = require('../../actions/MessageActionCreators');

var _MessageActionCreators2 = _interopRequireDefault(_MessageActionCreators);

var _ProfileStore = require('../../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _SvgIcon = require('../common/SvgIcon.react');

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

var _AvatarItem = require('../common/AvatarItem.react');

var _AvatarItem2 = _interopRequireDefault(_AvatarItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var UserMenu = function (_Component) {
  _inherits(UserMenu, _Component);

  UserMenu.getStores = function getStores() {
    return [_ProfileStore2.default];
  };

  UserMenu.calculateState = function calculateState() {
    return {
      profile: _ProfileStore2.default.getProfile()
    };
  };

  function UserMenu(props) {
    _classCallCheck(this, UserMenu);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      isOpened: false
    };

    _this.openHelp = _this.openHelp.bind(_this);
    _this.openTwitter = _this.openTwitter.bind(_this);
    _this.openFacebook = _this.openFacebook.bind(_this);
    _this.openHomePage = _this.openHomePage.bind(_this);
    _this.setLogout = _this.setLogout.bind(_this);
    _this.toggleHeaderMenu = _this.toggleHeaderMenu.bind(_this);
    _this.closeHeaderMenu = _this.closeHeaderMenu.bind(_this);
    _this.openMyProfile = _this.openMyProfile.bind(_this);
    _this.customMessage = _this.customMessage.bind(_this);
    _this.openCreateGroup = _this.openCreateGroup.bind(_this);
    _this.openAddContactModal = _this.openAddContactModal.bind(_this);
    _this.onSettingsOpen = _this.onSettingsOpen.bind(_this);
    // console.log('profile', this.state.profile);
    // localStorage.getItem('storeName').indexOf(this.state.profile)
    return _this;
  }

  UserMenu.prototype.toggleHeaderMenu = function toggleHeaderMenu() {
    var isOpened = this.state.isOpened;


    if (!isOpened) {
      this.setState({ isOpened: true });
      document.addEventListener('click', this.closeHeaderMenu, false);
    } else {
      this.closeHeaderMenu();
    }
  };

  UserMenu.prototype.closeHeaderMenu = function closeHeaderMenu() {
    this.setState({ isOpened: false });
    document.removeEventListener('click', this.closeHeaderMenu, false);
  };

  UserMenu.prototype.openMyProfile = function openMyProfile() {
    _ProfileActionCreators2.default.show();
  };

  UserMenu.prototype.customMessage = function customMessage() {
    // 手动撤回消息代码
    var peer1 = {
      id: 1477384559,
      key: 'u1477384559',
      type: 'user'
    };
    var peer2 = {
      id: 673080096,
      key: 'u673080096',
      type: 'user'
    };

    // ActorClient.sendJson(peer, 
    //   JSON.stringify({
    //     data:{
    //       text:'马小惠撤回了一条消息',
    //       rid: '-3590945943832585683',
    //       uid: 18657304
    //     },
    //     dataType: 'revert',
    //     operation:'revert'
    //   })
    // );
    _MessageActionCreators2.default.sendTextMessage(peer1, '未激活发送个消息试试1');
    _MessageActionCreators2.default.sendTextMessage(peer2, '未激活发送个消息试试2');
    // ActorClient.sendTextMessage
  };

  UserMenu.prototype.openCreateGroup = function openCreateGroup() {
    _CreateGroupActionCreators2.default.open();
  };

  UserMenu.prototype.openAddContactModal = function openAddContactModal() {
    _AddContactActionCreators2.default.open();
  };

  UserMenu.prototype.onSettingsOpen = function onSettingsOpen() {
    _PreferencesActionCreators2.default.show();
  };

  UserMenu.prototype.openHelp = function openHelp() {
    _HelpActionCreators2.default.open();
  };

  UserMenu.prototype.openTwitter = function openTwitter(event) {
    var _SharedContainer$get = _SharedContainer2.default.get(),
        twitter = _SharedContainer$get.twitter;

    event.preventDefault();
    if (_ActorClient2.default.isElectron()) {
      _ActorClient2.default.handleLinkClick(event);
    } else {
      window.open('https://twitter.com/' + twitter, '_blank');
    }
  };

  UserMenu.prototype.openFacebook = function openFacebook(event) {
    var _SharedContainer$get2 = _SharedContainer2.default.get(),
        facebook = _SharedContainer$get2.facebook;

    event.preventDefault();
    if (_ActorClient2.default.isElectron()) {
      _ActorClient2.default.handleLinkClick(event);
    } else {
      window.open('https://facebook.com/' + facebook, '_blank');
    }
  };

  UserMenu.prototype.openHomePage = function openHomePage(event) {
    var _SharedContainer$get3 = _SharedContainer2.default.get(),
        homePage = _SharedContainer$get3.homePage;

    var page = 'http://www.eaglesoft.cn';

    event.preventDefault();
    if (_ActorClient2.default.isElectron()) {
      window.messenger.sendToElectron('openLink', { url: page });
      //   ActorClient.handleLinkClick(event);
    } else {
      window.open(page, '_blank');
    }
  };

  UserMenu.prototype.setLogout = function setLogout() {
    (0, _confirm2.default)(_react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.confirm.logout' })).then(function () {
      return _LoginActionCreators2.default.setLoggedOut();
    }, function () {});
  };

  UserMenu.prototype.openUpdateDetial = function openUpdateDetial() {
    // 显示更新日志
    if (_ActorClient2.default.isElectron()) {
      _ActorClient2.default.sendToElectron('showUpdateDetial');
    }
  };

  UserMenu.prototype.clearCache = function clearCache() {
    // 清除缓存
    if (_ActorClient2.default.isElectron()) {
      (0, _confirm2.default)(_react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.confirm.clearCache' })).then(function () {
        return _LoginActionCreators2.default.setLoggedOut();
      }, function () {});
      _ActorClient2.default.sendToElectron('clearCache');
    }
  };

  UserMenu.prototype.renderTwitterLink = function renderTwitterLink() {
    var _SharedContainer$get4 = _SharedContainer2.default.get(),
        twitter = _SharedContainer$get4.twitter;

    if (!twitter) return null;

    return _react2.default.createElement(
      'li',
      { className: 'dropdown__menu__item' },
      _react2.default.createElement(
        'a',
        { href: 'https://twitter.com/' + twitter, onClick: this.openTwitter },
        _react2.default.createElement(_SvgIcon2.default, { className: 'icon icon--dropdown sidebar__header__twitter', glyph: 'twitter' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.twitter' })
      )
    );
  };

  UserMenu.prototype.renderFacebookLink = function renderFacebookLink() {
    var _SharedContainer$get5 = _SharedContainer2.default.get(),
        facebook = _SharedContainer$get5.facebook;

    if (!facebook) return null;

    return _react2.default.createElement(
      'li',
      { className: 'dropdown__menu__item' },
      _react2.default.createElement(
        'a',
        { href: 'https://facebook.com/' + facebook, onClick: this.openFacebook },
        _react2.default.createElement(_SvgIcon2.default, { className: 'icon icon--dropdown sidebar__header__facebook', glyph: 'facebook' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.facebook' })
      )
    );
  };

  UserMenu.prototype.renderHomeLink = function renderHomeLink() {
    var _SharedContainer$get6 = _SharedContainer2.default.get(),
        homePage = _SharedContainer$get6.homePage;
    // if (!homePage) return null;

    return _react2.default.createElement(
      'li',
      { className: 'dropdown__menu__item' },
      _react2.default.createElement(
        'a',
        { href: 'javascript:;', onClick: this.openHomePage },
        _react2.default.createElement(
          'i',
          { className: 'material-icons' },
          'public'
        ),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.homePage' })
      )
    );
  };

  UserMenu.prototype.renderHelpLink = function renderHelpLink() {
    var _SharedContainer$get7 = _SharedContainer2.default.get(),
        helpPhone = _SharedContainer$get7.helpPhone;

    if (!helpPhone) return null;

    if (/@/.test(helpPhone)) {
      return _react2.default.createElement(
        'li',
        { className: 'dropdown__menu__item' },
        _react2.default.createElement(
          'a',
          { href: 'mailto:' + helpPhone },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'help'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.helpAndFeedback' })
        )
      );
    } else {
      return _react2.default.createElement(
        'li',
        { className: 'dropdown__menu__item', onClick: this.openHelp },
        _react2.default.createElement(
          'i',
          { className: 'material-icons' },
          'help'
        ),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.helpAndFeedback' })
      );
    }
  };

  UserMenu.prototype.renderMenu = function renderMenu() {
    var isOpened = this.state.isOpened;


    var menuClass = (0, _classnames2.default)('dropdown user-menu__dropdown', {
      'dropdown--opened': isOpened
    });

    return _react2.default.createElement(
      'div',
      { className: menuClass },
      _react2.default.createElement(
        'ul',
        { className: 'dropdown__menu dropdown__menu--right' },
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.openMyProfile },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'edit'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.editProfile' })
        ),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.openCreateGroup },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'group_add'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.createGroup' })
        ),
        _react2.default.createElement('li', { className: 'dropdown__menu__separator' }),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.onSettingsOpen },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'settings'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.preferences' })
        ),
        this.renderHomeLink(),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.openUpdateDetial },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'description'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.updateDetial' })
        ),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.clearCache },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'cached'
          ),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.clearCache' })
        ),
        _react2.default.createElement('li', { className: 'dropdown__menu__separator' }),
        _react2.default.createElement(
          'li',
          { className: 'dropdown__menu__item', onClick: this.setLogout },
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'menu.signOut' })
        )
      )
    );
  };

  UserMenu.prototype.render = function render() {
    var className = this.props.className;
    var _state = this.state,
        profile = _state.profile,
        isOpened = _state.isOpened;


    if (!profile) return null;

    var usermenuClassName = (0, _classnames2.default)('user-menu', className, {
      'user-menu--opened': isOpened
    });

    return _react2.default.createElement(
      'div',
      { className: usermenuClassName, onClick: this.toggleHeaderMenu },
      _react2.default.createElement(_AvatarItem2.default, {
        className: 'user-menu__avatar',
        image: profile.avatar,
        placeholder: profile.placeholder,
        size: 'tiny',
        title: profile.name
      }),
      _react2.default.createElement('div', {
        className: 'user-menu__name',
        dangerouslySetInnerHTML: { __html: (0, _EmojiUtils.escapeWithEmoji)(profile.name) }
      }),
      _react2.default.createElement(
        'i',
        { className: 'user-menu__icon material-icons' },
        'arrow_drop_down'
      ),
      this.renderMenu()
    );
  };

  return UserMenu;
}(_react.Component);

UserMenu.propTypes = {
  className: _react.PropTypes.string
};
exports.default = _utils.Container.create(UserMenu);
//# sourceMappingURL=UserMenu.react.js.map