'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _EventListener = require('fbjs/lib/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

var _reactIntl = require('react-intl');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DepartementItem = function (_Component) {
    _inherits(DepartementItem, _Component);

    function DepartementItem(props) {
        _classCallCheck(this, DepartementItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            selectedDw: -1,
            selectedDwmc: '',
            selectedBm: -1,
            selectedBmmc: '',
            szk: '',
            scrollTo: null,
            hoverable: true
        };
        return _this;
    }

    DepartementItem.prototype.componentDidMount = function componentDidMount() {
        this.setListeners();
    };

    DepartementItem.prototype.componentWillUnmount = function componentWillUnmount() {
        this.cleanListeners();
    };

    DepartementItem.prototype.componentDidUpdate = function componentDidUpdate() {
        this.scrollTo();
    };

    DepartementItem.prototype.setListeners = function setListeners() {
        this.cleanListeners();
        this.listeners = [_EventListener2.default.listen(document, 'mousemove', this.handleMouseMove.bind(this))];
    };

    DepartementItem.prototype.cleanListeners = function cleanListeners() {
        if (this.listeners) {
            this.listeners.forEach(function (listener) {
                return listener.remove();
            });
            this.listeners = null;
        }
    };

    DepartementItem.prototype.handleMouseMove = function handleMouseMove() {
        this.setState({ 'hoverable': true });
    };

    DepartementItem.prototype.scrollTo = function scrollTo() {
        var _this2 = this;

        var scrollTo = this.state.scrollTo;
        var scrollBox = this.props.scrollBox;

        if (scrollTo) {
            setTimeout(function () {
                var scrollTop = (0, _jquery2.default)(scrollBox).scrollTop() + (0, _jquery2.default)(scrollTo).position().top;
                (0, _jquery2.default)(scrollBox).scrollTop(scrollTop);
                _this2.setState({ scrollTo: null });
            }, 10);
        }
    };

    DepartementItem.prototype.renderDw = function renderDw() {
        var _this3 = this;

        var _props = this.props,
            dw_data = _props.dw_data,
            hoverId = _props.hoverId;
        var _state = this.state,
            selectedDw = _state.selectedDw,
            szk = _state.szk;

        if (dw_data && dw_data.length <= 0) {
            return _react2.default.createElement(
                'li',
                { className: 'results__item--suggestion row' },
                _react2.default.createElement(_reactIntl.FormattedHTMLMessage, { id: 'modal.department.notFound' }),
                _react2.default.createElement(
                    'button',
                    { className: 'button button--rised hide' },
                    'Create new dialog'
                )
            );
        }

        return dw_data.map(function (result, index) {
            var itemId = result.id + result.szk;
            var selected = selectedDw + szk === itemId;
            var hover = hoverId === itemId;
            var resultClassName = (0, _classnames2.default)('results__item row', {
                'results__item--active': hover,
                'results__item--open': selected
            });
            //   const iconClassName = classnames('material-icons icon', hover ? 'icon--blue' : 'icon--blue');

            return _react2.default.createElement(
                'li',
                {
                    className: 'results__dw',
                    style: { 'position': 'relative' },
                    key: 'r' + index },
                _react2.default.createElement(
                    'div',
                    { className: resultClassName,
                        onClick: function onClick(event) {
                            return _this3.dwSelect(result.id, result.mc, result.szk, event);
                        },
                        onMouseOver: _this3.handleMouseOver.bind(_this3, result.id, result.szk) },
                    _react2.default.createElement(
                        'div',
                        { className: 'title col-xs' },
                        result.mc
                    ),
                    _react2.default.createElement('div', { className: 'arrow' })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'children-box' },
                    selected ? _this3.renderBm(result.id, result.szk, -1) : null
                )
            );
        });
    };

    DepartementItem.prototype.renderBm = function renderBm(dwId, szk1, parentId) {
        var _this4 = this;

        var _props2 = this.props,
            bm_data = _props2.bm_data,
            hoverId = _props2.hoverId;
        var _state2 = this.state,
            selectedBm = _state2.selectedBm,
            szk = _state2.szk;


        var results = _Linq2.default.from(bm_data).where('$.dwid.trim() == "' + dwId + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk1 + '"').orderBy('$.wzh').toArray();

        if (results.length <= 0) {
            return null;
        }

        return results.map(function (result, index) {
            var itemId = result.id + result.szk;
            var selected = selectedBm + szk === itemId;
            var hover = hoverId === itemId;
            var resultClassName = (0, _classnames2.default)('results__item row', {
                'results__item--active': hover,
                'results__item--selected': selected
            });

            return _react2.default.createElement(
                'div',
                { key: result.id + result.szk, className: 'results__bm' },
                _react2.default.createElement(
                    'div',
                    {
                        className: resultClassName, key: 'r' + index,
                        onClick: function onClick() {
                            return _this4.bmSelect(result.id, result.mc);
                        },
                        onMouseOver: _this4.handleMouseOver.bind(_this4, result.id, result.szk) },
                    _react2.default.createElement(
                        'div',
                        { className: 'title col-xs' },
                        result.mc
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'children-box' },
                    _this4.renderBm(dwId, szk1, result.id)
                )
            );
        });
    };

    DepartementItem.prototype.dwSelect = function dwSelect(dwid, dwmc, szk, event) {
        var _state3 = this.state,
            selectedDw = _state3.selectedDw,
            selectedDwmc = _state3.selectedDwmc;
        var _props3 = this.props,
            onSelectDw = _props3.onSelectDw,
            bm_data = _props3.bm_data;

        var hoverable = false,
            _dwid = '',
            _dwmc = '',
            _szk = '',
            _bmid = '',
            _bmmc = '',
            _hoverable = true,
            _scrollTo = null;
        if (selectedDw !== dwid || selectedDwmc !== dwmc) {
            console.log('open');
            var results = _Linq2.default.from(bm_data).where('$.dwid.trim() == "' + dwid + '" && $.fid.trim() == "-1" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();
            _dwid = dwid;
            _dwmc = dwmc;
            _szk = szk;
            _bmid = results.length > 0 ? results[0].id : '';
            _bmmc = results.length > 0 ? results[0].title : '';
            _hoverable = false;
            _scrollTo = (0, _jquery2.default)(event.target).parents('li');
        }
        this.setState({
            selectedDw: _dwid,
            selectedDwmc: _dwmc,
            selectedBm: _bmid,
            selectedBmmc: _bmmc,
            scrollTo: _scrollTo,
            szk: _szk,
            hoverable: _hoverable
        });
        onSelectDw && onSelectDw({
            selectedDw: _dwid,
            selectedDwmc: _dwmc,
            selectedBm: _bmid,
            selectedBmmc: _bmmc,
            szk: _szk
        });
    };

    DepartementItem.prototype.bmSelect = function bmSelect(bmid, bmmc) {
        var onSelectBm = this.props.onSelectBm;
        var _state4 = this.state,
            selectedDw = _state4.selectedDw,
            selectedDwmc = _state4.selectedDwmc,
            szk = _state4.szk;

        var data = {
            selectedBm: bmid,
            selectedBmmc: bmmc
        };
        this.setState(data);
        onSelectBm && onSelectBm(_extends({ selectedDw: selectedDw, selectedDwmc: selectedDwmc, szk: szk }, data));
    };

    DepartementItem.prototype.handleMouseOver = function handleMouseOver(id, szk) {
        var onItemHover = this.props.onItemHover;
        var hoverable = this.state.hoverable;

        var hoverId = id + szk;
        hoverable && onItemHover && onItemHover(hoverId);
    };

    DepartementItem.prototype.render = function render() {
        return _react2.default.createElement(
            'ul',
            { className: 'department-menu' },
            this.renderDw()
        );
    };

    return DepartementItem;
}(_react.Component);

DepartementItem.PropTypes = {
    dw_data: _react.PropTypes.array.isRequired,
    bm_data: _react.PropTypes.array.isRequired,
    hoverId: _react.PropTypes.string,
    onSelectDw: _react.PropTypes.func,
    onSelectBm: _react.PropTypes.func,
    onItemHover: _react.PropTypes.func,
    scrollBox: _react.PropTypes.element
};
exports.default = DepartementItem;
//# sourceMappingURL=DepartmentMenu.react.js.map