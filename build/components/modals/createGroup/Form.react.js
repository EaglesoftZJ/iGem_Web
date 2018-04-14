'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _reactIntl = require('react-intl');

var _fuzzaldrin = require('fuzzaldrin');

var _fuzzaldrin2 = _interopRequireDefault(_fuzzaldrin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ActorAppConstants = require('../../../constants/ActorAppConstants');

var _CreateGroupActionCreators = require('../../../actions/CreateGroupActionCreators');

var _CreateGroupActionCreators2 = _interopRequireDefault(_CreateGroupActionCreators);

var _DepartmentStore = require('../../../stores/DepartmentStore');

var _DepartmentStore2 = _interopRequireDefault(_DepartmentStore);

var _DialogStore = require('../../../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _DepartmentMenu = require('../departmentMenu/DepartmentMenu.react');

var _DepartmentMenu2 = _interopRequireDefault(_DepartmentMenu);

var _ContactItem = require('../../common/ContactItem.react');

var _ContactItem2 = _interopRequireDefault(_ContactItem);

var _TextField = require('../../common/TextField.react');

var _TextField2 = _interopRequireDefault(_TextField);

var _Tab = require('../../common/Tab.react');

var _Tab2 = _interopRequireDefault(_Tab);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CreateGroupForm = function (_Component) {
  _inherits(CreateGroupForm, _Component);

  CreateGroupForm.getStores = function getStores() {
    return [_DepartmentStore2.default];
  };

  CreateGroupForm.calculateState = function calculateState() {
    var res = _DepartmentStore2.default.getState();
    return {
      dw_data: _Linq2.default.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      peer: _DialogStore2.default.getCurrentPeer()
    };
  };

  function CreateGroupForm(props, context) {
    _classCallCheck(this, CreateGroupForm);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      selectedDw: '',
      selectedDwmc: '',
      selectedBm: '',
      selectedBmmc: '',
      szk: '',
      error: '',
      nameError: '',
      shouldScroll: false,
      dwAll: false
    };

    _this.onContactToggle = _this.onContactToggle.bind(_this);
    _this.handleNameChange = _this.handleNameChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleSearchChange = _this.handleSearchChange.bind(_this);
    return _this;
  }

  CreateGroupForm.prototype.componentDidMount = function componentDidMount() {
    this.refs.name.focus();
  };

  CreateGroupForm.prototype.componentDidUpdate = function componentDidUpdate() {
    this.handleUpdate();
  };

  CreateGroupForm.prototype.handleUpdate = function handleUpdate() {
    var _this2 = this;

    var shouldScroll = this.state.shouldScroll;

    console.log('shouldScroll', shouldScroll);
    if (shouldScroll) {
      setTimeout(function () {
        (0, _jquery2.default)(_this2.refs.select_con).scrollTop(10000);
        _this2.setState({ shouldScroll: false });
      }, 100);
    }
  };

  CreateGroupForm.prototype.getContacts = function getContacts() {
    var _state = this.state,
        yh_data = _state.yh_data,
        selectedBm = _state.selectedBm,
        selectedDw = _state.selectedDw,
        szk = _state.szk,
        dwAll = _state.dwAll;
    var search = this.props.search;

    var results = null;
    if (!dwAll) {
      results = _Linq2.default.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk + '"').orderBy('$.wzh').toArray();
    } else {
      results = _Linq2.default.from(yh_data).where('$.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk + '"').orderBy('$.wzh').toArray();
    }

    if (!search) {
      return results;
    }

    if (search === '*') {
      return yh_data.slice(0, 300);
    }

    return _fuzzaldrin2.default.filter(yh_data, search, {
      key: 'xm'
    });
  };

  CreateGroupForm.prototype.renderAll = function renderAll() {
    var contacts = this.getContacts();
    if (!contacts.length) {
      return _react2.default.createElement(
        'div',
        { className: 'contacts__list__item contacts__list__item--empty text-center' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'invite.notFound' })
      );
    }
    return this.handleName('all', contacts);
  };

  CreateGroupForm.prototype.renderContacts = function renderContacts() {
    var _this3 = this;

    var contacts = this.getContacts();
    if (!contacts.length) {
      return null;
    }
    return contacts.map(function (contact, i) {
      return _this3.handleName('item', contact);
    });
  };

  CreateGroupForm.prototype.handleName = function handleName(type, contact) {
    var _this4 = this;

    var _props = this.props,
        selectedUserIds = _props.selectedUserIds,
        members = _props.members;
    // console.log(selectedUserIds, 'selectedUserIds');

    var isSelected = false;
    var isMember = false;
    var contacts = null;
    var set = null;
    if (members) {
      set = new Set(_Linq2.default.from(members).select('$.peerInfo.peer.id.toString()').toArray());
    }
    if (type === 'item') {
      isSelected = selectedUserIds.has(contact.IGIMID);
      isMember = set && set.has(contact.IGIMID);
      contacts = [contact];
    } else {
      var arr = contact.filter(function (item) {
        return !selectedUserIds.has(item.IGIMID) && !(set && set.has(item.IGIMID));
      });
      isSelected = arr.length > 0 ? false : true;
      contacts = contact;
    }

    var icon = isSelected || isMember ? 'check_box' : 'check_box_outline_blank';

    var name = type === 'item' ? contact.xm + (contact.zwmc ? ' (' + contact.zwmc + ')' : '') : '全选';
    var key = type === 'item' ? contact.IGIMID : 'all';
    var itemClassName = (0, _classnames2.default)('group-name-item', icon, { 'disabled': isMember });

    return _react2.default.createElement(
      'div',
      { className: itemClassName, key: key, onClick: function onClick() {
          return _this4.onContactToggle(type, contacts, set, !isSelected);
        } },
      _react2.default.createElement(
        'a',
        { className: 'material-icons' },
        icon
      ),
      _react2.default.createElement(
        'span',
        { title: name },
        name
      )
    );
  };

  CreateGroupForm.prototype.onContactToggle = function onContactToggle(type, contacts, set, isSelected) {
    var _props2 = this.props,
        selectedUserIds = _props2.selectedUserIds,
        onContactToggle = _props2.onContactToggle;

    var userIds = selectedUserIds;
    contacts.forEach(function (item) {
      if (!set || !set.has(item.IGIMID)) {
        userIds = isSelected ? userIds.add(item.IGIMID) : userIds.delete(item.IGIMID);
      }
    });
    isSelected && this.setState({ 'shouldScroll': true });
    onContactToggle && onContactToggle(userIds);
  };

  CreateGroupForm.prototype.handleKeyDown = function handleKeyDown(event) {
    event.nativeEvent.stopImmediatePropagation();
  };

  CreateGroupForm.prototype.handleNameChange = function handleNameChange(event) {
    event.preventDefault();
    var handleNameChange = this.props.handleNameChange;

    handleNameChange && handleNameChange(event.target.value);
  };

  CreateGroupForm.prototype.handleSubmit = function handleSubmit(event) {
    event.preventDefault();

    var _props3 = this.props,
        name = _props3.name,
        selectedUserIds = _props3.selectedUserIds,
        handleSubmit = _props3.handleSubmit;
    var peer = this.state.peer;

    var trimmedName = name.trim();
    console.log('123123123');

    if (trimmedName.length > 0) {
      handleSubmit && handleSubmit(selectedUserIds.toJS(), name, peer);
    } else {
      this.refs.name.focus();
      this.setState({ error: ' ', nameError: 'error' });
    }
  };

  CreateGroupForm.prototype.renderDwSelectSize = function renderDwSelectSize() {
    var selectedUserIds = this.props.selectedUserIds;

    var contacts = this.getContacts();
    var results = contacts.filter(function (contact, i) {
      return selectedUserIds.has(contact.IGIMID);
    });
    return results.length;
  };

  CreateGroupForm.prototype.renderSelect = function renderSelect() {
    var _this5 = this;

    var yh_data = this.state.yh_data;
    var selectedUserIds = this.props.selectedUserIds;

    var results = [];
    selectedUserIds.forEach(function (item) {
      var result = _Linq2.default.from(yh_data).where('$.IGIMID == "' + item + '"').toArray();
      result.length > 0 && results.push(result[0]);
    });
    return results.map(function (item) {
      return _react2.default.createElement(
        'div',
        { key: item.IGIMID, className: 'group-name-select-tag' },
        _react2.default.createElement(
          'a',
          { href: 'javascript:;', target: '_self', className: 'material-icons delete', onClick: _this5.handleDelete.bind(_this5, item) },
          'clear'
        ),
        _react2.default.createElement(
          'div',
          { className: 'name' },
          item.xm,
          ' ',
          _react2.default.createElement(
            'span',
            { style: { 'fontSize': 12 + 'px', 'fontWeight': 'normal' } },
            item.bmmc
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'info', title: item.dwmc + ' ' + item.bmmc },
          item.dwmc
        )
      );
    });
  };

  CreateGroupForm.prototype.renderGroupNameInput = function renderGroupNameInput() {
    var _state2 = this.state,
        error = _state2.error,
        nameError = _state2.nameError;
    var _props4 = this.props,
        name = _props4.name,
        handleNameChange = _props4.handleNameChange;

    return _react2.default.createElement(_TextField2.default, {
      className: 'input__material--wide',
      floatingLabel: _react2.default.createElement(_reactIntl.FormattedMessage, { id: nameError ? 'modal.createGroup.groupName_error' : 'modal.createGroup.groupName' }),
      ref: 'name',
      errorText: error,
      onChange: this.handleNameChange,
      value: name,
      disabled: !handleNameChange });
  };

  CreateGroupForm.prototype.handleSearchChange = function handleSearchChange(event) {
    var handleSearchChange = this.props.handleSearchChange;

    handleSearchChange && handleSearchChange(event.target.value);
  };

  CreateGroupForm.prototype.handleDelete = function handleDelete(item) {
    var _props5 = this.props,
        selectedUserIds = _props5.selectedUserIds,
        handleDelete = _props5.handleDelete;

    handleDelete && handleDelete(selectedUserIds.delete(item.IGIMID));
  };

  CreateGroupForm.prototype.renderAddUsersButton = function renderAddUsersButton() {
    var _props6 = this.props,
        step = _props6.step,
        handleClose = _props6.handleClose;

    return _react2.default.createElement(
      'div',
      { className: 'button-group' },
      _react2.default.createElement(
        'button',
        { className: 'button button--plain--primary', onClick: this.handleSubmit, disabled: step === _ActorAppConstants.CreateGroupSteps.CREATION_STARTED },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.ok' })
      ),
      _react2.default.createElement(
        'button',
        { className: 'button button--plain--cancel', onClick: handleClose },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.cancel' })
      )
    );
  };

  CreateGroupForm.prototype.renderUserSearchInput = function renderUserSearchInput() {
    var search = this.props.search;
    var intl = this.context.intl;


    return _react2.default.createElement(
      'div',
      { className: 'small-search' },
      _react2.default.createElement(
        'i',
        { className: 'material-icons' },
        'search'
      ),
      _react2.default.createElement('input', {
        onKeyDown: this.handleKeyDown,
        className: 'input',
        onChange: this.handleSearchChange,
        placeholder: intl.messages['invite.search'],
        type: 'search',
        value: search })
    );
  };

  CreateGroupForm.prototype.renderSelectedUsersCount = function renderSelectedUsersCount() {
    var selectedUserIds = this.props.selectedUserIds;

    return _react2.default.createElement(
      'div',
      { className: 'count' },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'members', values: { numMembers: selectedUserIds.size } })
    );
  };

  CreateGroupForm.prototype.renderCreateGroupButton = function renderCreateGroupButton() {
    var step = this.props.step;


    if (step !== _ActorAppConstants.CreateGroupSteps.CREATION_STARTED) {
      return _react2.default.createElement(
        'button',
        { className: 'button button--lightblue', onClick: this.handleSubmit },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.createGroup' })
      );
    }

    return _react2.default.createElement(
      'button',
      { className: 'button button--lightblue', disabled: true },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'button.createGroup' })
    );
  };

  CreateGroupForm.prototype.handleSelectDw = function handleSelectDw(obj) {
    this.setState(_extends({}, obj, { dwAll: false }));
  };

  CreateGroupForm.prototype.handleSelectBm = function handleSelectBm(obj) {
    this.setState(_extends({}, obj, { dwAll: false }));
  };

  CreateGroupForm.prototype.handleShowAll = function handleShowAll(obj) {
    this.setState(_extends({}, obj, { dwAll: true }));
  };

  CreateGroupForm.prototype.render = function render() {
    var _state3 = this.state,
        dw_data = _state3.dw_data,
        bm_data = _state3.bm_data,
        selectedDwmc = _state3.selectedDwmc,
        selectedBmmc = _state3.selectedBmmc;
    var _props7 = this.props,
        step = _props7.step,
        search = _props7.search,
        selectedUserIds = _props7.selectedUserIds;

    var result = this.getContacts();
    var props = {
      dw_data: dw_data,
      bm_data: bm_data,
      onSelectDw: this.handleSelectDw.bind(this),
      onSelectBm: this.handleSelectBm.bind(this),
      onShowAll: this.handleShowAll.bind(this),
      scrollBox: this.refs.department_con
    };
    var className = (0, _classnames2.default)('group-name-col group-name-department', {
      'department-forbid': search
    });
    return _react2.default.createElement(
      'form',
      { className: 'group-name' },
      _react2.default.createElement(
        'div',
        { className: 'modal__body' },
        _react2.default.createElement(
          'div',
          { className: 'input-group' },
          this.renderGroupNameInput(),
          this.renderUserSearchInput()
        ),
        _react2.default.createElement(
          'div',
          { className: 'form-body' },
          _react2.default.createElement(
            'div',
            { className: className, ref: 'department' },
            _react2.default.createElement(
              'div',
              { className: 'info' },
              selectedDwmc ? selectedDwmc : '组织结构',
              ' ',
              selectedBmmc ? '> ' + selectedBmmc : ''
            ),
            _react2.default.createElement(
              'div',
              { className: 'con', ref: 'department_con' },
              _react2.default.createElement(_DepartmentMenu2.default, props),
              _react2.default.createElement('div', { className: 'department-forbid-mc', style: { top: this.refs.department_con ? (0, _jquery2.default)(this.refs.department_con).scrollTop() : 0 } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'group-name-col group-name-people' },
            _react2.default.createElement(
              'div',
              { className: 'info' },
              ' ',
              this.renderDwSelectSize(),
              ' / ',
              result.length
            ),
            _react2.default.createElement(
              'div',
              { className: 'con' },
              _react2.default.createElement(
                'div',
                { className: 'group-name-people-all' },
                this.renderAll()
              ),
              _react2.default.createElement(
                'div',
                { className: 'group-name-people-list' },
                this.renderContacts()
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'group-name-col group-name-select', ref: 'select' },
            _react2.default.createElement(
              'div',
              { className: 'info' },
              '\u5171\u9009\u62E9',
              selectedUserIds.size,
              '\u4EBA'
            ),
            _react2.default.createElement(
              'div',
              { className: 'con', ref: 'select_con' },
              this.renderSelect()
            )
          )
        )
      ),
      _react2.default.createElement(
        'footer',
        { className: 'modal__footer text-right' },
        this.renderAddUsersButton()
      )
    );
  };

  return CreateGroupForm;
}(_react.Component);

CreateGroupForm.contextTypes = {
  intl: _react.PropTypes.object
};
CreateGroupForm.PropTypes = {
  type: _react.PropTypes.string,
  name: _react.PropTypes.string,
  search: _react.PropTypes.string,
  step: _react.PropTypes.string,
  members: _react.PropTypes.array,
  selectedUserIds: _react.PropTypes.object,
  onContactToggle: _react.PropTypes.func,
  handleNameChange: _react.PropTypes.func,
  handleSearchChange: _react.PropTypes.fuc,
  handleSubmit: _react.PropTypes.fuc,
  handleDelete: _react.PropTypes.fuc
};
exports.default = _utils.Container.create(CreateGroupForm, { pure: false });
//# sourceMappingURL=Form.react.js.map