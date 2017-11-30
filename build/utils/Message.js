'use strict';

exports.__esModule = true;
exports.default = message;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _timers = require('timers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_Component) {
    _inherits(Message, _Component);

    function Message(props) {
        _classCallCheck(this, Message);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            msg: '',
            show: false
        };
        return _this;
    }

    Message.prototype.showMessage = function showMessage(msg, div) {
        var _this2 = this;

        var time = this.props.time;

        this.setState({ msg: msg, show: true });
        (0, _timers.setTimeout)(function () {
            _this2.setState({ show: false });
            document.body.removeChild(div);
        }, time);
    };

    Message.prototype.render = function render() {
        var _state = this.state,
            show = _state.show,
            msg = _state.msg;

        return _react2.default.createElement(
            _rcAnimate2.default,
            { transitionName: 'fade', component: 'div' },
            show ? _react2.default.createElement(
                'div',
                { className: 'Message-info' },
                msg
            ) : null
        );
    };

    return Message;
}(_react.Component);

Message.PropTypes = {
    // msg:  PropTypes.string
};
Message.defaultProps = {
    time: 500
};


var component = '';

function message(msg) {
    var div = document.createElement('div');
    div.className = 'flytchat-message';
    div.style = 'position: absolute;z-index:99999;top: 0;left:50%;background: red;';
    document.body.appendChild(div);
    component = (0, _reactDom.render)((0, _react.createElement)(Message), div);
    (0, _timers.setTimeout)(function () {
        component.showMessage(msg, div);
    }, 10);

    // var clean = () => {
    //     unmountComponentAtNode(wrapper);
    //     document.body.removeChild(wrapper);
    //     // setImmediate(() => wrapper.remove());
    //     wrapper = null;
    // }
    // if (type === 'show') {
    //     wrapper && clean();
    //     wrapper = document.createElement('div');
    //     wrapper.className = 'loading-wrapper';
    //     document.body.appendChild(wrapper);
    //     component = render(createElement(DataLoading, {progress, total}), wrapper);
    // } else if (wrapper && type === 'hide') {
    //     // document.body.removeChild(wrapper);
    //     clean();
    // } else if (type === 'info') {
    //     component.props.progress = progress;
    //     component.props.total = total;
    // }
}
//# sourceMappingURL=Message.js.map