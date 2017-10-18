'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _DialogStore = require('../../stores/DialogStore');

var _DialogStore2 = _interopRequireDefault(_DialogStore);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Popover = function (_Component) {
  _inherits(Popover, _Component);

  Popover.getStores = function getStores() {
    return [_DialogStore2.default];
  };

  Popover.calculateState = function calculateState() {
    return {
      left: 0,
      top: 0
    };
  };

  Popover.prototype.componentDidMount = function componentDidMount() {
    // this.resetPopoverPosition();
  };

  Popover.prototype.componentDidUpdate = function componentDidUpdate() {
    var isShow = this.props.isShow;

    if (isShow) {
      this.resetPopoverPosition();
    }
  };

  Popover.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    // const { isShow } = this.props;
    // console.log(nextProps);
    // if (isShow !== nextProps.isShow && nextProps.isShow) {
    //   this.resetPopoverPosition();
    // }
  };

  Popover.prototype.resetPopoverPosition = function resetPopoverPosition() {
    var node = this.props.node;

    if (!node) return;
    // this.setState({'left': 10, 'top': 10});
    var nodeTop = (0, _jquery2.default)(node).position().top;
    var nodeLeft = (0, _jquery2.default)(node).position().left;
    var nodeWidth = (0, _jquery2.default)(node).width();
    var nodeHeight = (0, _jquery2.default)(node).height();
    var left = nodeLeft + nodeWidth + 10;
    var top = nodeTop + nodeHeight - 100;
    this.setState({ 'left': left, 'top': top });
  };

  Popover.prototype.handleMouseMove = function handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  };

  function Popover(props) {
    _classCallCheck(this, Popover);

    return _possibleConstructorReturn(this, _Component.call(this, props));
  }

  Popover.prototype.renderArrow = function renderArrow() {
    var node = this.props.node;
    var _state = this.state,
        left = _state.left,
        top = _state.top;

    var style = {
      top: 90 - (0, _jquery2.default)(node).height() / 2 + 'px'
    };
    return _react2.default.createElement('div', { className: 'arrow', style: style });
  };

  Popover.prototype.render = function render() {
    var _props = this.props,
        isShow = _props.isShow,
        children = _props.children;
    var _state2 = this.state,
        left = _state2.left,
        top = _state2.top;

    var popoverClassName = (0, _classnames2.default)('popover-con', { 'hide': !isShow });
    return _react2.default.createElement(
      'div',
      { ref: 'popover', onMouseMove: this.handleMouseMove, className: popoverClassName, style: { left: left + 'px', top: top + 'px' } },
      children,
      this.renderArrow()
    );
  };

  return Popover;
}(_react.Component);

Popover.propTypes = {
  node: _react.PropTypes.node,
  isShow: _react.PropTypes.bool
};
exports.default = _utils.Container.create(Popover);
//# sourceMappingURL=popover.react.js.map