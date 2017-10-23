'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _utils = require('flux/utils');

var _reactIntl = require('react-intl');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _EventListener = require('fbjs/lib/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

var _fuzzaldrin = require('fuzzaldrin');

var _fuzzaldrin2 = _interopRequireDefault(_fuzzaldrin);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _history = require('../../utils/history');

var _history2 = _interopRequireDefault(_history);

var _PeerUtils = require('../../utils/PeerUtils');

var _PeerUtils2 = _interopRequireDefault(_PeerUtils);

var _ActorAppConstants = require('../../constants/ActorAppConstants');

var _DepartmentActionCreators = require('../../actions/DepartmentActionCreators');

var _DepartmentActionCreators2 = _interopRequireDefault(_DepartmentActionCreators);

var _DepartmentStore = require('../../stores/DepartmentStore');

var _DepartmentStore2 = _interopRequireDefault(_DepartmentStore);

var _AvatarItem = require('../common/AvatarItem.react');

var _AvatarItem2 = _interopRequireDefault(_AvatarItem);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var RESULT_ITEM_HEIGHT = 44;
var scrollIndex = 0;

var Department = function (_Component) {
  _inherits(Department, _Component);

  Department.getStores = function getStores() {
    return [_DepartmentStore2.default];
  };

  Department.calculateState = function calculateState() {
    var res = _DepartmentStore2.default.getState();
    return {
      dw_data: _Linq2.default.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      selectedIndex: 0,
      selectedDw: '',
      selectedBmIndex: 0,
      selectedBmTier: 0,
      hoverId: '',
      selectedBm: '',
      selectedYhIndex: 0,

      szk: '',

      selectedDwmc: '',
      selectedBmmc: '',
      scrollTo: -1
    };
  };

  function Department(props, context) {
    _classCallCheck(this, Department);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleDialogSelect = _this.handleDialogSelect.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    return _this;
  }

  Department.prototype.componentDidMount = function componentDidMount() {
    this.setListeners();
  };

  Department.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanListeners();
  };

  Department.prototype.componentDidUpdate = function componentDidUpdate() {
    // this.scrollTo();
  };

  Department.prototype.scrollTo = function scrollTo() {
    var scrollTo = this.state.scrollTo;

    if (scrollTo > -1) {
      (0, _jquery2.default)(this.refs.bms).scrollTop(scrollTo);
      this.setState({ scrollTo: -1 });
      debugger;
    }
  };

  Department.prototype.setListeners = function setListeners() {
    this.cleanListeners();
    this.listeners = [_EventListener2.default.listen(document, 'keydown', this.handleKeyDown)];
  };

  Department.prototype.cleanListeners = function cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        return listener.remove();
      });
      this.listeners = null;
    }
  };

  Department.prototype.handleClose = function handleClose() {
    _DepartmentActionCreators2.default.hide();
  };

  Department.prototype.handleDialogSelect = function handleDialogSelect(peer) {
    var peerStr = _PeerUtils2.default.peerToString(peer);
    _history2.default.push('/im/' + peerStr);
    this.handleClose();
  };

  Department.prototype.dwSelect = function dwSelect(dwid, dwmc, szk, event) {
    var _state = this.state,
        selectedDw = _state.selectedDw,
        selectedDwmc = _state.selectedDwmc;

    var scrollTop = (0, _jquery2.default)(event.target).parents('li').position().top;
    var scrollTo = (0, _jquery2.default)(this.refs.bms).scrollTop() + scrollTop;
    if (selectedDw === dwid && selectedDwmc === dwmc) {
      dwid = '';
      dwmc = '';
      szk = '';
    }
    this.setState({ selectedDw: dwid, selectedBm: '', selectedDwmc: dwmc, selectedBmmc: '', szk: szk, scrollTo: scrollTo });
  };

  Department.prototype.bmSelect = function bmSelect(bmid, bmmc) {
    this.setState({ selectedBm: bmid, selectedBmmc: bmmc, selectedYhIndex: 0 });
  };

  Department.prototype.handleScroll = function handleScroll(top) {
    (0, _reactDom.findDOMNode)(this.refs.results).scrollTop = top;

    Console.log('scroll--------');
  };

  Department.prototype.renderDw = function renderDw() {
    var _this2 = this;

    var _state2 = this.state,
        selectedIndex = _state2.selectedIndex,
        dw_data = _state2.dw_data,
        selectedDw = _state2.selectedDw,
        hoverId = _state2.hoverId;

    if (dw_data.length <= 0) {
      return _react2.default.createElement(
        'li',
        { className: 'results__item results__item--suggestion row' },
        _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'modal.department.notFound' }),
        _react2.default.createElement(
          'button',
          { className: 'button button--rised hide' },
          'Create new dialog'
        )
      );
    }

    return dw_data.map(function (result, index) {
      var resultClassName = (0, _classnames2.default)('results__item row', {
        'results__item--active': hoverId === result.id,
        'results__item--open': selectedDw === result.id
      });
      var childrenStyle = { display: selectedDw === result.id ? 'block' : 'none' };

      return _react2.default.createElement(
        'li',
        {
          style: { 'position': 'relative' },
          key: 'r' + index },
        _react2.default.createElement(
          'div',
          { className: resultClassName,
            onClick: function onClick(event) {
              return _this2.dwSelect(result.id, result.mc, result.szk, event);
            },
            onMouseEnter: function onMouseEnter() {
              return _this2.setState({ hoverId: result.id });
            } },
          _react2.default.createElement(
            'div',
            { className: 'title col-xs' },
            result.mc
          ),
          _react2.default.createElement('div', { className: 'arrow' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'children-box' },
          selectedDw === result.id ? _this2.renderBm(result.id, result.szk, -1) : null
        )
      );
    });
  };

  Department.prototype.renderYh = function renderYh() {
    var _this3 = this;

    var _state3 = this.state,
        selectedYhIndex = _state3.selectedYhIndex,
        yh_data = _state3.yh_data,
        selectedBm = _state3.selectedBm,
        selectedDw = _state3.selectedDw,
        szk = _state3.szk;

    var results = _Linq2.default.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&&$.szk == "' + szk + '"').orderBy('$.wzh').toArray();
    if (results.length <= 0) {
      return _react2.default.createElement(
        'li',
        { className: 'results__item results__item--suggestion row' },
        _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'modal.department.notFound' }),
        _react2.default.createElement(
          'button',
          { className: 'button button--rised hide' },
          'Create new dialog '
        )
      );
    }
    return results.map(function (result, index) {
      var resultClassName = (0, _classnames2.default)('results__item row', {
        'results__item--active': selectedYhIndex === index
      });

      return _react2.default.createElement(
        'li',
        {
          className: resultClassName, key: 'r' + index,
          onClick: function onClick() {
            return _this3.handleDialogSelect({
              id: result.IGIMID,
              type: 'user',
              key: 'u' + result.IGIMID
            });
          },
          onMouseOver: function onMouseOver() {
            return _this3.setState({ selectedYhIndex: index });
          } },
        _react2.default.createElement(
          'div',
          { className: 'title col-xs' },
          _react2.default.createElement(
            'div',
            { className: 'hint pull-right' },
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.department.openDialog' })
          ),
          result.xm,
          result.zwmc ? '(' + result.zwmc + ')' : ''
        )
      );
    });
  };

  Department.prototype.renderBm = function renderBm(dwId, szk, parentId) {
    var _this4 = this;

    var _state4 = this.state,
        bm_data = _state4.bm_data,
        selectedBm = _state4.selectedBm,
        hoverId = _state4.hoverId;


    var results = _Linq2.default.from(bm_data).where('$.dwid.trim() == "' + dwId + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();

    if (results.length <= 0) {
      return null;
    }

    return results.map(function (result, index) {
      var resultClassName = (0, _classnames2.default)('results__item row', {
        'results__item--active': hoverId === result.id,
        'results__item--selected': selectedBm === result.id
      });

      return _react2.default.createElement(
        'div',
        { key: result.id + result.szk, className: 'results__item__bm', style: { paddingLeft: '20px' } },
        _react2.default.createElement(
          'div',
          {
            className: resultClassName, key: 'r' + index,
            onClick: function onClick() {
              return _this4.bmSelect(result.id, result.mc);
            },
            onMouseEnter: function onMouseEnter() {
              return _this4.setState({ hoverId: result.id });
            } },
          _react2.default.createElement(
            'div',
            { className: 'title col-xs' },
            result.mc
          )
        )
      );
    });
  };

  Department.prototype.renderHeader = function renderHeader() {
    var _this5 = this;

    var _state5 = this.state,
        selectedDw = _state5.selectedDw,
        selectedDwmc = _state5.selectedDwmc,
        selectedBmmc = _state5.selectedBmmc;


    return _react2.default.createElement(
      'header',
      { className: 'header' },
      _react2.default.createElement(
        'div',
        { className: 'pull-left' },
        _react2.default.createElement(
          'strong',
          null,
          selectedDwmc,
          selectedDw.length <= 0 ? _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.department.title' }) : selectedBmmc && '-' + selectedBmmc
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'pull-right', style: { cursor: 'Pointer' } },
        _react2.default.createElement(
          'strong',
          { onClick: function onClick() {
              return _this5.handleClose();
            } },
          '\u5173\u95ED'
        )
      )
    );
  };

  Department.prototype.render = function render() {
    var selectedDw = this.state.selectedDw;

    return _react2.default.createElement(
      _reactModal2.default,
      {
        overlayClassName: 'modal-overlay',
        className: 'modal',
        onRequestClose: this.handleClose,
        isOpen: true },
      _react2.default.createElement(
        'div',
        { className: 'department' },
        _react2.default.createElement(
          'div',
          { className: 'modal__content' },
          this.renderHeader(),
          _react2.default.createElement(
            'div',
            { className: 'results' },
            _react2.default.createElement(
              'ul',
              { className: 'dw_bm_Results', ref: 'bms', style: { position: 'relative' } },
              this.renderDw()
            ),
            _react2.default.createElement(
              'div',
              { className: 'yhResults', ref: 'yhs' },
              this.renderYh()
            )
          )
        )
      )
    );
  };

  return Department;
}(_react.Component);

Department.contextTypes = {
  intl: _react.PropTypes.object.isRequired
};
exports.default = _utils.Container.create(Department, { pure: false });
//# sourceMappingURL=Department.react.js.map