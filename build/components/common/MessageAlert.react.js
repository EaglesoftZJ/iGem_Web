'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _MessageAlertStore = require('../../stores/MessageAlertStore');

var _MessageAlertStore2 = _interopRequireDefault(_MessageAlertStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageAlert = function (_Component) {
    _inherits(MessageAlert, _Component);

    MessageAlert.getStores = function getStores() {
        return [_MessageAlertStore2.default];
    };

    MessageAlert.calculateState = function calculateState() {
        return {
            msg: _MessageAlertStore2.default.getState().msg
        };
    };

    function MessageAlert(props) {
        _classCallCheck(this, MessageAlert);

        return _possibleConstructorReturn(this, _Component.call(this, props));
    }

    MessageAlert.prototype.renderMsg = function renderMsg() {
        var msg = this.state.msg;

        console.log('msg', msg);
        return msg.map(function (item) {
            var className = (0, _classnames2.default)('message-info', {
                'message-info__success': item.type === 'success',
                'message-info__error': item.type === 'error',
                'message-info__warning': item.type === 'warning'
            });
            return _react2.default.createElement(
                'div',
                { className: className, key: item.key },
                item.title
            );
        });
    };

    MessageAlert.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            { className: 'message-alert' },
            _react2.default.createElement(
                _rcAnimate2.default,
                { transitionName: 'fade' },
                this.renderMsg()
            )
        );
    };

    return MessageAlert;
}(_react.Component);

exports.default = _utils.Container.create(MessageAlert, { pure: false });
//# sourceMappingURL=MessageAlert.react.js.map