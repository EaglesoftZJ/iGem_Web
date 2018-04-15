'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _DataLoading = require('../utils/DataLoading');

var _DataLoading2 = _interopRequireDefault(_DataLoading);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    show: function show(message, node) {
        var _this = this;

        var spapdata = '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">\n                        <v:Header />\n                        <v:Body>\n                            <n0:selectXzrz id="o0" c:root="1" xmlns:n0="http://eaglesoft">\n                                <messageId i:type="d:string">' + message.rid + '</messageId>\n                            </n0:selectXzrz>\n                        </v:Body>\n                    </v:Envelope>';
        var method = 'selectXzrz';
        (0, _DataLoading2.default)('show');
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
                console.log(123123, res, (0, _jquery2.default)(res).find('return').html());
                (0, _jquery2.default)(res).find('return');
                // var arr = [{'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':816390165,'userName':'beizx','time':'2018年04月13日 16:29'},
                // {'messageId':-5310016413293830527,'userId':182777372,'userName':'eg_admin','time':'2018年04月13日 16:31'}];

                _this.setRecord(JSON.parse((0, _jquery2.default)(res).find('return').html()));
                (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DOCUMENT_RECORD_SHOW, { node: node });
                (0, _DataLoading2.default)('hide');
            }
        });
    },
    hide: function hide() {
        (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DOCUMENT_RECORD_HIDE);
    },
    setRecord: function setRecord(record) {
        (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DOCUMENT_RECORD_CHANGE, { record: record });
    }

    //   setMessage(message) {
    //     dispatch(ActionTypes.DOCUMENT_RECORD_MESSAGE_CHNAGE, {message} );
    //   },

    //   setNode(node) {
    //     dispatch(ActionTypes.DOCUMENT_RECORD_NODE_CHNAGE, { node });
    //   }

}; /*
    * Copyright (C) 2015 Actor LLC. <https://actor.im>
    */
//# sourceMappingURL=DocumentRecordCreators.js.map