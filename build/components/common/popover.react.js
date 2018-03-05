'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

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

  Popover.prototype.componentDidMount = function componentDidMount() {};

  Popover.prototype.componentDidUpdate = function componentDidUpdate() {
    var isShow = this.props.isShow;

    isShow && this.resetPopoverPosition();
  };

  Popover.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {};

  function Popover(props) {
    _classCallCheck(this, Popover);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      left: 0,
      top: 0,
      allowTop: 0
    };
    return _this;
  }

  Popover.prototype.resetPopoverPosition = function resetPopoverPosition() {
    var _props = this.props,
        node = _props.node,
        container = _props.container;
    var _state = this.state,
        left = _state.left,
        top = _state.top,
        allowTop = _state.allowTop;

    if (!node) return;
    // this.setState({'left': 10, 'top': 10});
    var popoverHeight = (0, _jquery2.default)(this.refs.popover).outerHeight();
    var nodeTop = (0, _jquery2.default)(node).position().top;
    var nodeLeft = (0, _jquery2.default)(node).position().left;
    var nodeWidth = (0, _jquery2.default)(node).outerWidth(true);
    var nodeHeight = (0, _jquery2.default)(node).outerHeight(true);
    var toLeft = nodeLeft + nodeWidth + 10;
    var toTop = nodeTop + nodeHeight - popoverHeight / 2 - nodeHeight / 2;
    var wTop = (0, _jquery2.default)(window).scrollTop();
    var wBottom = wTop + (0, _jquery2.default)(window).height();
    var aTop = (0, _jquery2.default)(this.refs.popover).outerHeight() / 2 - 10;
    var newToTop = 0;
    if (container && (0, _jquery2.default)(container).offset().top - wTop + toTop < 0) {
      newToTop = wTop - (0, _jquery2.default)(container).offset().top + 4;
    } else if (container && wTop + wBottom < (0, _jquery2.default)(container).offset().top + toTop + popoverHeight) {
      newToTop = wTop + wBottom - 4 - popoverHeight - (0, _jquery2.default)(container).offset().top;
    }
    if (newToTop) {
      aTop = aTop + (toTop - newToTop);
      toTop = newToTop;
    }
    if (left !== toLeft || top !== toTop || aTop !== allowTop) {
      this.setState({ 'left': toLeft, 'top': toTop, 'allowTop': aTop });
    }
  };

  Popover.prototype.handleMouseMove = function handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  };

  Popover.prototype.renderArrow = function renderArrow() {
    var allowTop = this.state.allowTop;

    var style = {
      // top: ($(this.refs.popover).outerHeight() / 2 - 10) + 'px' 
      top: allowTop + 'px'
    };
    return _react2.default.createElement('div', { className: 'arrow', style: style });
  };

  Popover.prototype.renderInfo = function renderInfo() {
    var children = this.props.children;

    if (!children) {
      return _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'modal.quickSearch.notHaveInfo' });
    }
    return children;
  };

  Popover.prototype.render = function render() {
    var isShow = this.props.isShow;
    var _state2 = this.state,
        left = _state2.left,
        top = _state2.top;

    var popoverClassName = (0, _classnames2.default)('popover-con', { 'hide': !isShow });
    return _react2.default.createElement(
      'div',
      { ref: 'popover', onMouseMove: this.handleMouseMove, className: popoverClassName, style: { left: left + 'px', top: top + 'px' } },
      this.renderInfo(),
      this.renderArrow()
    );
  };

  return Popover;
}(_react.Component);

Popover.propTypes = {
  node: _react.PropTypes.object,
  isShow: _react.PropTypes.bool,
  container: _react.PropTypes.object
};
exports.default = Popover;
//# sourceMappingURL=popover.react.js.map