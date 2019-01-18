/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';

import ActorClient from '../utils/ActorClient';

import DialogStore from '../stores/DialogStore';
import linq from 'linq';

const DialogInfoActionCreators = {
  setDialogInfo(info) {
    dispatch(ActionTypes.DIALOG_INFO_CHANGED, { info });



    var peer = DialogStore.getCurrentPeer();
    if (peer && peer.type === PeerTypes.GROUP) {
      ActorClient.loadMembers(info.id, 10000, null).then((data) => {
        if(info.members && info.members.length > 0) {
          info.members = data.members;
          info.adminId = linq.from(info.members).where('$.isAdmin === true').toArray()[0].peerInfo.peer.id;
          dispatch(ActionTypes.DIALOG_INFO_CHANGED, { info });
        }  
      });
    }


    // function loadMembers(gid, size, next, members) {
    //   if (next && next.length === 0) {
    //     info.members = members;
    //     dispatch(ActionTypes.DIALOG_INFO_CHANGED, { info });
    //     return;
    //   } else {
    //     ActorClient.loadMembers(gid, size, next).then((data) => {
    //       if (data.next.length >= 2 && data.next[1] < 0) {
    //         data.next[1] = 256 + data.next[1];
    //         data.next = data.next.splice(0, 2);
    //       }
    //       loadMembers(gid, size, data.next, members.concat(data.members));
    //     })
    //   }
    //   return;    
    // }
  }
};

export default DialogInfoActionCreators;
