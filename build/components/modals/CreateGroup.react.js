'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _utils = require('flux/utils');

var _reactIntl = require('react-intl');

var _CreateGroupActionCreators = require('../../actions/CreateGroupActionCreators');

var _CreateGroupActionCreators2 = _interopRequireDefault(_CreateGroupActionCreators);

var _CreateGroupStore = require('../../stores/CreateGroupStore');

var _CreateGroupStore2 = _interopRequireDefault(_CreateGroupStore);

var _Form = require('./createGroup/Form.react');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CreateGroup = function (_Component) {
  _inherits(CreateGroup, _Component);

  CreateGroup.getStores = function getStores() {
    return [_CreateGroupStore2.default];
  };

  CreateGroup.calculateState = function calculateState() {
    return {
      name: _CreateGroupStore2.default.getGroupName(),
      search: _CreateGroupStore2.default.getGroupSearch(),
      step: _CreateGroupStore2.default.getCurrentStep(),
      selectedUserIds: _CreateGroupStore2.default.getSelectedUserIds()
    };
  };

  function CreateGroup(props) {
    _classCallCheck(this, CreateGroup);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleClose = _this.handleClose.bind(_this);
    return _this;
  }

  CreateGroup.prototype.handleClose = function handleClose() {
    _CreateGroupActionCreators2.default.close();
  };

  CreateGroup.prototype.renderHeader = function renderHeader() {
    var _this2 = this;

    return _react2.default.createElement(
      'header',
      { className: 'header' },
      _react2.default.createElement(
        'div',
        { className: 'pull-left' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.createGroup.title' })
      ),
      _react2.default.createElement(
        'div',
        { className: 'pull-right', style: { cursor: 'Pointer' } },
        _react2.default.createElement(
          'strong',
          { onClick: function onClick() {
              return _this2.handleClose();
            } },
          '\u5173\u95ED'
        )
      )
    );
  };

  CreateGroup.prototype.onContactToggle = function onContactToggle(userIds) {
    _CreateGroupActionCreators2.default.setSelectedUserIds(userIds);
  };

  CreateGroup.prototype.handleNameChange = function handleNameChange(value) {
    _CreateGroupActionCreators2.default.setGroupName(value);
  };

  CreateGroup.prototype.handleSearchChange = function handleSearchChange(value) {
    _CreateGroupActionCreators2.default.setGroupSearch(value);
  };

  CreateGroup.prototype.handleSubmit = function handleSubmit(idList, name, peer) {
    _CreateGroupActionCreators2.default.createGroup(name, null, idList);
  };

  CreateGroup.prototype.handleDelete = function handleDelete(selectedUserIds) {
    _CreateGroupActionCreators2.default.setSelectedUserIds(selectedUserIds);
  };

  CreateGroup.prototype.render = function render() {
    var props = _extends({
      onContactToggle: this.onContactToggle,
      handleNameChange: this.handleNameChange,
      handleSearchChange: this.handleSearchChange,
      handleDelete: this.handleDelete,
      handleSubmit: this.handleSubmit,
      handleClose: this.handleClose
    }, this.state);
    return _react2.default.createElement(
      _reactModal2.default,
      {
        overlayClassName: 'modal-overlay',
        className: 'modal',
        onRequestClose: this.handleClose,
        isOpen: true },
      _react2.default.createElement(
        'div',
        { className: 'create-group' },
        _react2.default.createElement(
          'div',
          { className: 'modal__content' },
          this.renderHeader(),
          _react2.default.createElement(_Form2.default, props)
        )
      )
    );
  };

  return CreateGroup;
}(_react.Component);

exports.default = _utils.Container.create(CreateGroup, { pure: false });
//# sourceMappingURL=CreateGroup.react.js.map