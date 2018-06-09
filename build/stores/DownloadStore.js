'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

var DownloadStore = function (_ReduceStore) {
  _inherits(DownloadStore, _ReduceStore);

  function DownloadStore() {
    _classCallCheck(this, DownloadStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  DownloadStore.prototype.getInitialState = function getInitialState() {
    return {
      list: [1, 2, 3]
    };
  };

  DownloadStore.prototype.getList = function getList() {
    var _getState = this.getState(),
        list = _getState.list;

    return list;
  };

  DownloadStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.DOWNLOAD_CHANGE:
        return _extends({}, state, {
          list: action.list
        });
        break;
      default:
        return state;
    }
  };

  return DownloadStore;
}(_utils.ReduceStore);

exports.default = new DownloadStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=DownloadStore.js.map