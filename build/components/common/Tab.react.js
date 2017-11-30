'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tab = function (_Component) {
    _inherits(Tab, _Component);

    function Tab(props) {
        _classCallCheck(this, Tab);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            showIndex: 0,
            lineWidth: 0,
            lineLeft: 0
        };
        return _this;
    }

    Tab.prototype.componentWillMount = function componentWillMount() {};

    Tab.prototype.componentDidMount = function componentDidMount() {
        this.initTab();
    };

    Tab.prototype.renderTab = function renderTab() {
        var _this2 = this;

        var tabList = this.props.tabList;
        var showIndex = this.state.showIndex;

        return tabList.map(function (item, index) {
            var className = (0, _classnames2.default)('tab-top-item', {
                'tab-top-item__active': showIndex === index
            });
            return _react2.default.createElement(
                'a',
                { href: 'javascript:;', target: 'self', key: index, className: className, onClick: _this2.selectTab.bind(_this2, index) },
                item
            );
        });
    };

    Tab.prototype.renderLine = function renderLine() {
        var _state = this.state,
            lineWidth = _state.lineWidth,
            lineLeft = _state.lineLeft;

        var style = { width: lineWidth + 'px', left: lineLeft + 'px' };
        return _react2.default.createElement('div', { className: 'tab-top-line', style: style });
    };

    Tab.prototype.renderChildren = function renderChildren() {
        var children = this.props.children;
        var showIndex = this.state.showIndex;

        return _react.Children.map(children, function (item, index) {
            var className = (0, _classnames2.default)('tab-con-item', {
                'tab-con-item__show': showIndex === index
            });
            return _react2.default.createElement(
                'div',
                { className: className },
                item
            );
        });
    };

    Tab.prototype.initTab = function initTab() {
        var defaultIndex = this.props.defaultIndex;
        var showIndex = this.state.showIndex;

        var index = showIndex;
        if (defaultIndex !== undefined) {
            index = defaultIndex;
        }
        this.selectTab(index);
    };

    Tab.prototype.selectTab = function selectTab(index) {
        var tabList = this.props.tabList;

        if (tabList.length - 1 < index || index < 0) {
            return false;
        }
        var $node = (0, _jquery2.default)(this.refs.top).find('.tab-top-item').eq(index);
        var lineWidth = $node.outerWidth();
        var lineLeft = $node.position().left;
        this.setState({ 'showIndex': index, lineWidth: lineWidth, lineLeft: lineLeft });
    };

    Tab.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            { className: 'tab' },
            _react2.default.createElement(
                'div',
                { className: 'tab-top', ref: 'top' },
                this.renderTab(),
                this.renderLine()
            ),
            _react2.default.createElement(
                'div',
                { className: 'tab-con' },
                this.renderChildren()
            )
        );
    };

    return Tab;
}(_react.Component);

Tab.PropTypes = {
    tabList: _react.PropTypes.array.isRequired,
    defaultIndex: _react.PropTypes.number
};
exports.default = Tab;
//# sourceMappingURL=Tab.react.js.map