'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _ProfileStore = require('../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interval = null; /*
                      * Copyright (C) 2015 Actor LLC. <https://actor.im>
                      */

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

var QuickSearchActionCreators = {
  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_SHOW);
    _ComposeActionCreators2.default.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_HIDE);
    _ComposeActionCreators2.default.toggleAutoFocus(true);
  },
  setQuickSearchList: function setQuickSearchList(list) {
    // 过滤系统管理员，过滤群组
    list = _Linq2.default.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1 && $.peerInfo.title.indexOf("账号已删除") == -1 && $.peerInfo.peer.type !== "group"').toArray();
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_CHANGED_USER, { list: list });
    // 从另外的接口获取群组数据更新
    clearInterval(interval);
    var time = 0;
    interval = setInterval(group, 100);
    function group() {
      time++;
      if (_ProfileStore2.default.getProfile()) {
        QuickSearchActionCreators.setGroupList();
        clearInterval(interval);
      } else if (time === 100) {
        clearInterval(interval);
      }
    }
    group();
  },
  setGroupList: function setGroupList() {
    getGroup(_ProfileStore2.default.getProfile().id, function (groups) {
      var arr = [];
      for (var i = 0; i < groups.length; i++) {
        var group = _ActorClient2.default.getGroup(groups[i].id);
        if (group) {
          arr.push({
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
      (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.QUICK_SEARCH_CHANGED_GROUP, { list: arr });
    });
  }
};
exports.default = QuickSearchActionCreators;
//# sourceMappingURL=QuickSearchActionCreators.js.map