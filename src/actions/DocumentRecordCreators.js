/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import loading from '../utils/DataLoading';
import $ from 'jquery';


export default {

  show(message, node) {
    var spapdata = `<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                        <v:Header />
                        <v:Body>
                            <n0:selectXzrz id="o0" c:root="1" xmlns:n0="http://eaglesoft">
                                <messageId i:type="d:string">${ message.rid }</messageId>
                            </n0:selectXzrz>
                        </v:Body>
                    </v:Envelope>`;
    var method = 'selectXzrz';  
    loading('show');
    $.ajax({
        url: 'http://61.175.100.14:8012/ActorServices-Maven/services/ActorService',
        type: 'post',
        data: spapdata,
        beforeSend(request) {
            console.log('beforeSend', request);
            request.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
            request.setRequestHeader('SOAPActrin', 'http://eaglesoft/' + method);
        },
        success: (res) => {
            console.log(123123, res, $(res).find('return').html());
            $(res).find('return');
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

            this.setRecord(JSON.parse($(res).find('return').html()));
            dispatch(ActionTypes.DOCUMENT_RECORD_SHOW, {node});
            loading('hide');
        }
    });
  },

  hide() {
    dispatch(ActionTypes.DOCUMENT_RECORD_HIDE);
  },
  setRecord(record) {
    dispatch(ActionTypes.DOCUMENT_RECORD_CHANGE, { record });
  }

//   setMessage(message) {
//     dispatch(ActionTypes.DOCUMENT_RECORD_MESSAGE_CHNAGE, {message} );
//   },

//   setNode(node) {
//     dispatch(ActionTypes.DOCUMENT_RECORD_NODE_CHNAGE, { node });
//   }
};
