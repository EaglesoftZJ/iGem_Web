'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _utils = require('flux/utils');

var _reactIntl = require('react-intl');

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

var _QuickSearchStore = require('../../stores/QuickSearchStore');

var _QuickSearchStore2 = _interopRequireDefault(_QuickSearchStore);

var _DepartmentMenu = require('./departmentMenu/DepartmentMenu.react');

var _DepartmentMenu2 = _interopRequireDefault(_DepartmentMenu);

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

var DepartmentDetial = function (_Component) {
  _inherits(DepartmentDetial, _Component);

  DepartmentDetial.getStores = function getStores() {
    return [_DepartmentStore2.default, _QuickSearchStore2.default];
  };

  DepartmentDetial.calculateState = function calculateState() {
    var res = _DepartmentStore2.default.getState();
    return {
      dw_data: _Linq2.default.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      quickSearchData: _QuickSearchStore2.default.getState(),
      hoverId: '',
      selectedDw: '',
      selectedBm: '',
      selectedYhIndex: -1,
      szk: '',
      selectedDwmc: '',
      selectedBmmc: '',
      hoverable: true,
      scrollTo: null,
      dwAll: false
    };
  };

  function DepartmentDetial(props, context) {
    _classCallCheck(this, DepartmentDetial);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleDialogSelect = _this.handleDialogSelect.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    return _this;
  }

  DepartmentDetial.prototype.componentDidMount = function componentDidMount() {
    this.setListeners();
  };

  DepartmentDetial.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanListeners();
  };

  DepartmentDetial.prototype.componentDidUpdate = function componentDidUpdate() {
    this.scrollTo();
  };

  DepartmentDetial.prototype.scrollTo = function scrollTo() {
    var _this2 = this;

    var scrollTo = this.state.scrollTo;

    if (scrollTo) {
      setTimeout(function () {
        var scrollTop = $(_this2.refs.bms).scrollTop() + $(scrollTo).position().top;
        $(_this2.refs.bms).scrollTop(scrollTop);
        _this2.setState({ scrollTo: null });
      }, 10);
    }
  };

  DepartmentDetial.prototype.setListeners = function setListeners() {
    this.cleanListeners();
    this.listeners = [_EventListener2.default.listen(document, 'mousemove', this.handleMouseMove.bind(this))];
  };

  DepartmentDetial.prototype.cleanListeners = function cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        return listener.remove();
      });
      this.listeners = null;
    }
  };

  DepartmentDetial.prototype.handleMouseMove = function handleMouseMove() {
    this.setState({ 'hoverable': true });
  };

  DepartmentDetial.prototype.handleClose = function handleClose() {
    _DepartmentActionCreators2.default.hide();
  };

  DepartmentDetial.prototype.handleDialogSelect = function handleDialogSelect(peer) {
    var peerStr = _PeerUtils2.default.peerToString(peer);
    _history2.default.push('/im/' + peerStr);
    this.handleClose();
  };

  DepartmentDetial.prototype.handleScroll = function handleScroll(top) {
    (0, _reactDom.findDOMNode)(this.refs.results).scrollTop = top;
  };

  DepartmentDetial.prototype.renderYh = function renderYh() {
    var _this3 = this;

    var _state = this.state,
        selectedYhIndex = _state.selectedYhIndex,
        yh_data = _state.yh_data,
        quickSearchData = _state.quickSearchData,
        hoverId = _state.hoverId,
        dwAll = _state.dwAll,
        selectedBm = _state.selectedBm,
        selectedDw = _state.selectedDw,
        szk = _state.szk;

    var results = null;
    if (!dwAll) {
      results = _Linq2.default.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk + '"').orderBy('$.wzh').toArray();
    } else {
      results = _Linq2.default.from(yh_data).where('$.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk + '"').orderBy('$.wzh').toArray();
    }

    // results = linq.from(results).join(quickSearchData, 'a => parseFloat(a.IGIMID)', 'b => b.peerInfo.peer.id', 'a, b => {...a, ...b}').toArray();
    results = _Linq2.default.from(results).join(quickSearchData, 'a => parseFloat(a.IGIMID)', 'b => b.peerInfo.peer.id', 'department, user=>{department: department, user: user}').toArray();

    console.log(results, quickSearchData);
    console.log(111, results);
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
        'results__item--active': hoverId === result.department.IGIMID + result.department.szk
      });

      return _react2.default.createElement(
        'li',
        {
          className: resultClassName, key: 'r' + index,
          onClick: function onClick() {
            return _this3.handleDialogSelect({
              id: parseFloat(result.department.IGIMID),
              type: 'user',
              key: 'u' + result.department.IGIMID
            });
          },
          onMouseOver: function onMouseOver() {
            return _this3.setState({ hoverId: result.department.IGIMID + result.department.szk });
          } },
        _react2.default.createElement(
          'div',
          { className: 'title col-xs' },
          _react2.default.createElement(_AvatarItem2.default, {
            className: 'group_profile__avatar',
            size: 'small',
            image: result.user.peerInfo.avatar,
            placeholder: result.user.peerInfo.placeholder,
            title: result.user.peerInfo.title,
            onClick: function onClick() {
              return _this3.onClick(result.user.peerInfo.peer.id);
            }
          }),
          _react2.default.createElement(
            'div',
            { className: 'username', title: result.department.zwmc ? '(' + result.department.zwmc + ')' : '' },
            result.department.xm,
            result.department.zwmc ? '(' + result.department.zwmc + ')' : ''
          )
        )
      );
    });
  };

  DepartmentDetial.prototype.renderHeader = function renderHeader() {
    var _this4 = this;

    var _state2 = this.state,
        selectedDw = _state2.selectedDw,
        selectedDwmc = _state2.selectedDwmc,
        selectedBmmc = _state2.selectedBmmc;
    var hasHeader = this.props.hasHeader;

    if (!hasHeader) {
      return null;
    }

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
              return _this4.handleClose();
            } },
          '\u5173\u95ED'
        )
      )
    );
  };

  DepartmentDetial.prototype.handleSelectDw = function handleSelectDw(obj) {
    this.setState(_extends({}, obj, { dwAll: false }));
  };

  DepartmentDetial.prototype.handleSelectBm = function handleSelectBm(obj) {
    this.setState(_extends({}, obj, { dwAll: false }));
  };

  DepartmentDetial.prototype.handleItemHover = function handleItemHover(hoverId) {
    this.setState({ hoverId: hoverId });
  };

  DepartmentDetial.prototype.handleShowAll = function handleShowAll(obj) {
    this.setState(_extends({}, obj, { dwAll: true }));
  };

  DepartmentDetial.prototype.render = function render() {
    var _state3 = this.state,
        dw_data = _state3.dw_data,
        bm_data = _state3.bm_data,
        hoverId = _state3.hoverId;

    var props = {
      dw_data: dw_data,
      bm_data: bm_data,
      hoverId: hoverId,
      onSelectDw: this.handleSelectDw.bind(this),
      onSelectBm: this.handleSelectBm.bind(this),
      onItemHover: this.handleItemHover.bind(this),
      onShowAll: this.handleShowAll.bind(this),
      scrollBox: this.refs.bms
    };
    return _react2.default.createElement(
      'div',
      { className: 'department-detial' },
      this.renderHeader(),
      _react2.default.createElement(
        'div',
        { className: 'results' },
        _react2.default.createElement(
          'div',
          { className: 'dw_bm_Results', ref: 'bms', style: { position: 'relative' } },
          _react2.default.createElement(_DepartmentMenu2.default, props)
        ),
        _react2.default.createElement(
          'div',
          { className: 'yhResults', ref: 'yhs' },
          this.renderYh()
        )
      )
    );
  };

  return DepartmentDetial;
}(_react.Component);

DepartmentDetial.propTypes = {
  hasHeader: _react.PropTypes.bool
};
DepartmentDetial.contextTypes = {
  intl: _react.PropTypes.object.isRequired
};
exports.default = _utils.Container.create(DepartmentDetial, { withProps: true });
//# sourceMappingURL=DepartmentDetial.react.js.map