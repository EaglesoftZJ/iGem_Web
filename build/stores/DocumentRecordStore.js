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

var DocumentRecordStore = function (_ReduceStore) {
  _inherits(DocumentRecordStore, _ReduceStore);

  function DocumentRecordStore() {
    _classCallCheck(this, DocumentRecordStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  DocumentRecordStore.prototype.getInitialState = function getInitialState() {
    return {
      isShow: false,
      record: null,
      node: null
    };
  };

  DocumentRecordStore.prototype.getShowState = function getShowState() {
    var _getState = this.getState(),
        isShow = _getState.isShow;

    return isShow;
  };

  DocumentRecordStore.prototype.getCurrentRecord = function getCurrentRecord() {
    var _getState2 = this.getState(),
        record = _getState2.record;

    return record;
  };

  DocumentRecordStore.prototype.getCurrentNode = function getCurrentNode() {
    var _getState3 = this.getState(),
        node = _getState3.node;

    return node;
  };

  DocumentRecordStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.DOCUMENT_RECORD_SHOW:
        return _extends({}, state, {
          isShow: true,
          node: action.node
        });
        break;
      case _ActorAppConstants.ActionTypes.DOCUMENT_RECORD_HIDE:
        return _extends({}, state, {
          isShow: false
        });
        break;
      case _ActorAppConstants.ActionTypes.DOCUMENT_RECORD_CHANGE:
        return _extends({}, state, {
          record: action.record
        });
      default:
        return state;
    }
  };

  return DocumentRecordStore;
}(_utils.ReduceStore);

exports.default = new DocumentRecordStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=DocumentRecordStore.js.map