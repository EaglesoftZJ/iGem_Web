'use strict';

exports.__esModule = true;
exports.default = loading;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataLoading = function (_Component) {
    _inherits(DataLoading, _Component);

    function DataLoading(props) {
        _classCallCheck(this, DataLoading);

        return _possibleConstructorReturn(this, _Component.call(this, props));
    }

    DataLoading.prototype.render = function render() {
        var _props = this.props,
            progress = _props.progress,
            total = _props.total;

        return _react2.default.createElement(
            'div',
            { className: 'box' },
            _react2.default.createElement('div', { className: 'loader' }),
            progress ? _react2.default.createElement(
                'div',
                { className: 'progress' },
                progress,
                ' / ',
                total
            ) : null
        );
    };

    return DataLoading;
}(_react.Component);

DataLoading.PropTypes = {
    progress: _react.PropTypes.number,
    total: _react.PropTypes.number
};


var wrapper = null;
var component = '';

function loading(type, progress, total) {
    var clean = function clean() {
        (0, _reactDom.unmountComponentAtNode)(wrapper);
        document.body.removeChild(wrapper);
        // setImmediate(() => wrapper.remove());
        wrapper = null;
    };
    if (type === 'show') {
        wrapper && clean();
        wrapper = document.createElement('div');
        wrapper.className = 'loading-wrapper';
        document.body.appendChild(wrapper);
        component = (0, _reactDom.render)((0, _react.createElement)(DataLoading, { progress: progress, total: total }), wrapper);
    } else if (wrapper && type === 'hide') {
        // document.body.removeChild(wrapper);
        clean();
    } else if (type === 'info') {
        component.props.progress = progress;
        component.props.total = total;
    }
}
//# sourceMappingURL=DataLoading.js.map