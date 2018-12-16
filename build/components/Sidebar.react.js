'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _DelegateContainer = require('../utils/DelegateContainer');

var _DelegateContainer2 = _interopRequireDefault(_DelegateContainer);

var _Recent = require('./sidebar/Recent.react');

var _Recent2 = _interopRequireDefault(_Recent);

var _QuickSearchButton = require('./sidebar/QuickSearchButton.react');

var _QuickSearchButton2 = _interopRequireDefault(_QuickSearchButton);

var _DepartmentButton = require('./sidebar/DepartmentButton.react');

var _DepartmentButton2 = _interopRequireDefault(_DepartmentButton);

var _DialogStore = require('../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _PingyinSearchStore = require('../stores/PingyinSearchStore');

var _PingyinSearchStore2 = _interopRequireDefault(_PingyinSearchStore);

var _ArchiveStore = require('../stores/ArchiveStore');

var _ArchiveStore2 = _interopRequireDefault(_ArchiveStore);

var _linq = require('linq');

var _linq2 = _interopRequireDefault(_linq);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Sidebar = function (_Component) {
  _inherits(Sidebar, _Component);

  Sidebar.getStores = function getStores() {
    return [_DialogStore2.default, _PingyinSearchStore2.default, _ArchiveStore2.default];
  };

  Sidebar.calculateState = function calculateState() {
    return {
      currentPeer: _DialogStore2.default.getCurrentPeer(),
      dialogs: _DialogStore2.default.getDialogs(),
      archive: _ArchiveStore2.default.getArchiveChatState(),
      pingyinSearch: _PingyinSearchStore2.default.getState()
    };
  };

  function Sidebar(props) {
    _classCallCheck(this, Sidebar);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.components = _this.getComponents();
    return _this;
  }

  Sidebar.prototype.getComponents = function getComponents() {
    var _DelegateContainer$ge = _DelegateContainer2.default.get(),
        components = _DelegateContainer$ge.components;

    var sidebar = components.sidebar;

    if (sidebar) {
      return {
        Recent: (0, _lodash.isFunction)(sidebar.recent) ? sidebar.recent : _Recent2.default,
        DepSection: _DepartmentButton2.default,
        FooterSection: _QuickSearchButton2.default

      };
    }

    return {
      Recent: _Recent2.default,
      DepSection: _DepartmentButton2.default,
      FooterSection: _QuickSearchButton2.default
    };
  };

  Sidebar.prototype.filterDailogs = function filterDailogs() {
    // 过滤删除的群组
    var _state = this.state,
        dialogs = _state.dialogs,
        pingyinSearch = _state.pingyinSearch;

    var group = pingyinSearch['群组'] || [];
    var newDialog = [],
        obj = {};
    for (var i = 0; i < dialogs.length; i++) {
      obj = _jquery2.default.extend({}, dialogs[i]);
      newDialog.push(obj);
      if (dialogs[i].key !== 'privates') {
        var _ref;

        // 非用户组
        var arr = _linq2.default.from(dialogs[i].shorts).where('$.peer.peer.type === "group"').toArray(); // 群组部分
        var arr1 = _linq2.default.from(dialogs[i].shorts).where('$.peer.peer.type !== "group"').toArray(); // 非群组部分
        var activeGroup = _linq2.default.from(arr).join(group, 'outer => outer.peer.peer.id', 'inner => inner.peerInfo.peer.id', 'outer => outer').toArray(); // 未删除群组
        obj.shorts = (_ref = []).concat.apply(_ref, arr1.concat(activeGroup)); // 重新组合
        obj.shorts.sort(function (a, b) {
          return b.updateTime - a.updateTime;
        });
      }
    }
    return newDialog;
  };

  Sidebar.prototype.render = function render() {
    var _state2 = this.state,
        currentPeer = _state2.currentPeer,
        archive = _state2.archive;
    var _components = this.components,
        Recent = _components.Recent,
        DepSection = _components.DepSection,
        FooterSection = _components.FooterSection;


    return _react2.default.createElement(
      'aside',
      { className: 'sidebar' },
      _react2.default.createElement(Recent, {
        currentPeer: currentPeer,
        dialogs: this.filterDailogs(),
        archive: archive
      }),
      _react2.default.createElement(DepSection, null),
      _react2.default.createElement(FooterSection, null)
    );
  };

  return Sidebar;
}(_react.Component);

exports.default = _utils.Container.create(Sidebar, { pure: false });
//# sourceMappingURL=Sidebar.react.js.map