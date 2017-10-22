'use strict';

exports.__esModule = true;

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
      selectedBm: '',
      selectedYhIndex: 0,

      szk: '',

      selectedDwmc: '',
      selectedBmmc: ''
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

  Department.prototype.dwSelect = function dwSelect(dwid, dwmc, szk) {
    this.setState({ selectedDw: dwid, selectedDwmc: dwmc, szk: szk });
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

    var _state = this.state,
        selectedIndex = _state.selectedIndex,
        dw_data = _state.dw_data;

    if (dw_data.length <= 0) {
      return _react2.default.createElement(
        'li',
        { className: 'results__item results__item--suggestion row' },
        _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'modal.department.notFound', values: { query: query } }),
        _react2.default.createElement(
          'button',
          { className: 'button button--rised hide' },
          'Create new dialog ',
          query
        )
      );
    }

    return dw_data.map(function (result, index) {
      var resultClassName = (0, _classnames2.default)('results__item row', {
        'results__item--active': selectedIndex === index
      });

      return _react2.default.createElement(
        'li',
        {
          className: resultClassName, key: 'r' + index,
          onClick: function onClick() {
            return _this2.dwSelect(result.id, result.mc, result.szk);
          },
          onMouseOver: function onMouseOver() {
            return _this2.setState({ selectedIndex: index });
          } },
        _react2.default.createElement(
          'div',
          { className: 'title col-xs' },
          result.mc
        )
      );
    });
  };

  Department.prototype.renderYh = function renderYh() {
    var _this3 = this;

    var _state2 = this.state,
        selectedYhIndex = _state2.selectedYhIndex,
        yh_data = _state2.yh_data,
        selectedBm = _state2.selectedBm,
        selectedDw = _state2.selectedDw,
        szk = _state2.szk;

    if (selectedBm.length <= 0) {
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

    var results = _Linq2.default.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" &&' + '$.szk == "' + szk + '"').orderBy('$.wzh').toArray();
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

  Department.prototype.renderBm = function renderBm(parentId, tier) {
    var _this4 = this;

    var _state3 = this.state,
        bm_data = _state3.bm_data,
        selectedDw = _state3.selectedDw,
        selectedBmIndex = _state3.selectedBmIndex,
        selectedBmTier = _state3.selectedBmTier,
        szk = _state3.szk;


    var results = _Linq2.default.from(bm_data).where('$.dwid.trim() == "' + selectedDw + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();
    if (results.length <= 0) {
      return null;
    }

    return results.map(function (result, index) {
      var resultClassName = (0, _classnames2.default)('results__item row', {
        'results__item--active': selectedBmIndex === tier + index
      });

      return _react2.default.createElement(
        'div',
        { key: result.id + result.szk, style: { paddingLeft: '20px' } },
        _react2.default.createElement(
          'div',
          {
            className: resultClassName, key: 'r' + index,
            onClick: function onClick() {
              return _this4.bmSelect(result.id, result.mc);
            },
            onMouseOver: function onMouseOver() {
              return _this4.setState({ selectedBmIndex: tier + index, selectedBmTier: tier });
            } },
          _react2.default.createElement(
            'div',
            { className: 'title col-xs' },
            result.mc
          )
        ),
        _this4.renderBm(result.id, (tier + index + 1) * 20)
      );
    });
  };

  Department.prototype.renderHeader = function renderHeader() {
    var _this5 = this;

    var _state4 = this.state,
        selectedDw = _state4.selectedDw,
        selectedDwmc = _state4.selectedDwmc,
        selectedBmmc = _state4.selectedBmmc;


    if (selectedDw.length <= 0) {
      return _react2.default.createElement(
        'header',
        { className: 'header' },
        _react2.default.createElement(
          'div',
          { className: 'pull-left' },
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.department.title' })
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
          '-',
          selectedBmmc
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
      ),
      _react2.default.createElement(
        'div',
        { className: 'pull-right', style: { cursor: 'Pointer' } },
        _react2.default.createElement(
          'strong',
          { onClick: function onClick() {
              return _this5.setState({ selectedDw: '', selectedBm: '', selectedDwmc: '', selectedBmmc: '' });
            } },
          '\u8FD4\u56DE'
        )
      )
    );
  };

  Department.prototype.render = function render() {
    var selectedDw = this.state.selectedDw;


    if (selectedDw.length <= 0) {
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
              'ul',
              { className: 'dwResults', ref: 'results' },
              this.renderDw()
            )
          )
        )
      );
    } else {
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
                'div',
                { className: 'bmResults', ref: 'bms' },
                this.renderBm('-1', 0)
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
    }
  };

  return Department;
}(_react.Component);

Department.contextTypes = {
  intl: _react.PropTypes.object.isRequired
};
exports.default = _utils.Container.create(Department, { pure: false });
//# sourceMappingURL=Department.react.js.map