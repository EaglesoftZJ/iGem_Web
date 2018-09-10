'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _ProfileStore = require('../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _makepy = require('makepy');

var _makepy2 = _interopRequireDefault(_makepy);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

var interval = null;

function getGroup(uid, callback) {
  console.log('getRroup uid', uid);
  var spapdata = '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">\n                    <v:Header />\n                    <v:Body>\n                        <n0:queryGroup id="o0" c:root="1" xmlns:n0="http://eaglesoft">\n                            <id i:type="d:string">' + uid + '</id>\n                        </n0:queryGroup>\n                    </v:Body>\n                </v:Envelope>';
  var method = 'queryGroup';
  _jquery2.default.ajax({
    url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
    type: 'post',
    data: spapdata,
    beforeSend: function beforeSend(request) {
      console.log('beforeSend', request);
      request.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
      request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
    },

    success: function success(res) {
      if (res && res.nodeName) {
        callback(JSON.parse((0, _jquery2.default)(res).find('return').html()));
      }
    }
  });
}

exports.default = {
  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_SHOW);
    _ComposeActionCreators2.default.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_HIDE);
    _ComposeActionCreators2.default.toggleAutoFocus(true);
  },
  setPingyinSearchList: function setPingyinSearchList(list) {
    clearInterval(interval);
    interval = setInterval(function () {
      if (_ProfileStore2.default.getProfile()) {
        getGroup(_ProfileStore2.default.getProfile().id, getSearch);
        clearInterval(interval);
      }
    }, 100);

    function getSearch(groups) {
      var obj = { '群组': [] };
      // 过滤系统管理员
      list = _Linq2.default.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1').toArray();
      for (var _iterator = list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var item = _ref;

        if (!item.peerInfo.title) continue;
        if (item.peerInfo.peer.type === 'group') {
          obj['群组'].push(item);
          continue;
        }
        var letterStore = [];
        for (var _iterator2 = _makepy2.default.make.pingYing(item.peerInfo.title), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var pingyin = _ref2;

          var letter = pingyin.substring(0, 1).toLowerCase();
          if (letterStore.indexOf(letter) !== -1) {
            continue;
          } else {
            letterStore.push(letter);
          }
          var _key = '';
          _key = /[a-z]/.test(letter) ? letter : '#';
          if (!obj[_key]) {
            obj[_key] = [];
          }
          obj[_key].push(item);
        }
      }
      if (groups && groups.length > obj['群组'].length) {
        obj['群组'] = [];
        for (var i = 0; i < groups.length; i++) {
          var group = _ActorClient2.default.getGroup(groups[i].id);
          console.log('getGroup123', group);
          if (group) {
            obj['群组'].push({
              peerInfo: {
                avatar: group.avatar,
                placeholder: group.placeholder,
                title: group.name,
                peer: {
                  id: group.id,
                  type: 'group',
                  key: 'g' + group.id
                }
              }
            });
          }
        }
      }
      for (var key in obj) {
        obj[key].sort(function (a, b) {
          if (a.peerInfo.title > b.peerInfo.title) {
            return 1;
          } else if (a.peerInfo.title > b.peerInfo.title) {
            return 0;
          } else {
            return -1;
          }
        });
      }
      (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.PINGYIN_SEARCH_CHANGED, { obj: obj });
    }
  }
};
//# sourceMappingURL=PingyinSearchActionCreators.js.map