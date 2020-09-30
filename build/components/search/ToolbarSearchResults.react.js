'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _ContactItem = require('../common/ContactItem.react');

var _ContactItem2 = _interopRequireDefault(_ContactItem);

var _Popover = require('../common/Popover.react');

var _Popover2 = _interopRequireDefault(_Popover);

var _SelectListItem = require('../common/SelectListItem.react');

var _SelectListItem2 = _interopRequireDefault(_SelectListItem);

var _ContactDetails = require('../common/ContactDetails.react');

var _ContactDetails2 = _interopRequireDefault(_ContactDetails);

var _EventListener = require('fbjs/lib/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

var _DepartmentStore = require('../../stores/DepartmentStore');

var _DepartmentStore2 = _interopRequireDefault(_DepartmentStore);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ToolbarSearchResults = function (_Component) {
  _inherits(ToolbarSearchResults, _Component);

  function ToolbarSearchResults(props) {
    _classCallCheck(this, ToolbarSearchResults);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      isShow: false,
      node: null,
      department: _DepartmentStore2.default.getState(),
      selectedUserId: -1
    };
    return _this;
  }

  ToolbarSearchResults.prototype.componentDidMount = function componentDidMount() {
    this.setListeners();
  };

  ToolbarSearchResults.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanListeners();
  };

  ToolbarSearchResults.prototype.renderInfo = function renderInfo() {
    var _state = this.state,
        department = _state.department,
        selectedUserId = _state.selectedUserId;
    var yh_data = department.yh_data;

    var info = _Linq2.default.from(yh_data).where('parseFloat($.iGIMID) ==' + selectedUserId).toArray()[0];
    if (!info) return null;
    return _react2.default.createElement(_ContactDetails2.default, { peerInfo: info });
  };

  ToolbarSearchResults.prototype.renderResults = function renderResults() {
    var _this2 = this;

    var _props = this.props,
        query = _props.query,
        results = _props.results;


    if (!results.length) {
      return _react2.default.createElement(
        'div',
        { className: 'not-found' },
        _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'search.notFound', values: { query: query } })
      );
    }

    return results.map(function (item, index) {
      return _react2.default.createElement(
        _SelectListItem2.default,
        { index: index, key: item.peerInfo.peer.key },
        _react2.default.createElement(_ContactItem2.default, {
          uid: item.peerInfo.peer.id,
          name: item.peerInfo.title,
          avatar: item.peerInfo.avatar,
          type: item.peerInfo.peer.type,
          placeholder: item.peerInfo.placeholder,
          showDetial: true,
          instance: _this2
        })
      );
    });
  };

  ToolbarSearchResults.prototype.setListeners = function setListeners() {
    this.cleanListeners();
    this.listeners = [
    // EventListener.listen(document, 'keydown', this.handleKeyDown),
    _EventListener2.default.listen(document, 'mousemove', this.popoverHide.bind(this)), _EventListener2.default.listen(this.refs.results, 'scroll', this.popoverHide.bind(this))];
  };

  ToolbarSearchResults.prototype.cleanListeners = function cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        return listener.remove();
      });
      this.listeners = null;
    }
  };

  ToolbarSearchResults.prototype.popoverHide = function popoverHide() {
    var isShow = this.state.isShow;

    if (isShow) {
      this.setState({ 'isShow': false });
      this.cleanListeners();
    }
  };

  ToolbarSearchResults.prototype.render = function render() {
    var _state2 = this.state,
        isShow = _state2.isShow,
        node = _state2.node;

    return _react2.default.createElement(
      'div',
      { className: 'popover-outer', ref: 'outer' },
      _react2.default.createElement(
        _Popover2.default,
        { node: node, isShow: isShow, container: this.refs.outer },
        this.renderInfo()
      ),
      _react2.default.createElement(
        'div',
        { className: 'toolbar__search__results', ref: 'results' },
        this.renderResults()
      )
    );
  };

  return ToolbarSearchResults;
}(_react.Component);

ToolbarSearchResults.propTypes = {
  query: _react.PropTypes.string.isRequired,
  results: _react.PropTypes.array.isRequired
};
exports.default = ToolbarSearchResults;
//# sourceMappingURL=ToolbarSearchResults.react.js.map