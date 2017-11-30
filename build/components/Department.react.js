'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('flux/utils');

var _DepartmentActionCreators = require('../actions/DepartmentActionCreators');

var _DepartmentActionCreators2 = _interopRequireDefault(_DepartmentActionCreators);

var _DepartmentDetial = require('./modals/DepartmentDetial.react');

var _DepartmentDetial2 = _interopRequireDefault(_DepartmentDetial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Department = function (_Component) {
    _inherits(Department, _Component);

    function Department(props) {
        _classCallCheck(this, Department);

        return _possibleConstructorReturn(this, _Component.call(this, props));
    }

    Department.prototype.componentDidMount = function componentDidMount() {
        _DepartmentActionCreators2.default.show();
    };

    Department.prototype.componentWillUnmount = function componentWillUnmount() {
        _DepartmentActionCreators2.default.hide();
    };

    Department.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            { className: 'department' },
            _react2.default.createElement(_DepartmentDetial2.default, null)
        );
    };

    return Department;
}(_react.Component);

exports.default = Department;
//# sourceMappingURL=Department.react.js.map