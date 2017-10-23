/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import { Store } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, AsyncActionStates } from '../constants/ActorAppConstants';
import linq from 'linq';

class ArchiveStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);

    this.isLoading = true;
    this.dialogs = [];
    this.archiveChatState = {};
    this._isAllLoaded = false;
    this._isInitialLoadingComplete = false;
  }

  isArchiveLoading() {
    return this.isLoading;
  }

  isAllLoaded() {
    return this._isAllLoaded;
  }

  isInitialLoadingComplete() {
    return this._isInitialLoadingComplete;
  }

  getDialogs() {
    return this.dialogs;
  }

  getArchiveChatState() {
    return this.archiveChatState;
  }


  __onDispatch(action) {
    switch(action.type) {
      case ActionTypes.ARCHIVE_ADD:
        this.archiveChatState[action.peer.key] = AsyncActionStates.PROCESSING;
        this.__emitChange();
        break;
      case ActionTypes.ARCHIVE_ADD_SUCCESS:
        delete this.archiveChatState[action.peer.key];
        this.__emitChange();
        break;
      case ActionTypes.ARCHIVE_ADD_ERROR:
        this.archiveChatState[action.peer.key] = AsyncActionStates.FAILURE;
        this.__emitChange();
        break;

      case ActionTypes.ARCHIVE_LOAD:
        this.isLoading = true;
        this._isAllLoaded = false;
        this._isInitialLoadingComplete = false;
        this.__emitChange();
        break;

      case ActionTypes.ARCHIVE_LOAD_SUCCESS:
        this.isLoading = false;
        this._isInitialLoadingComplete = true;
        this.dialogs = action.response;
        this.__emitChange();
        break;

      case ActionTypes.ARCHIVE_LOAD_MORE:
        this.isLoading = true;
        this.__emitChange();
        break;

      case ActionTypes.ARCHIVE_LOAD_MORE_SUCCESS:
        this.isLoading = false;
        var id = action.response[0].peer.peer.id;
        var results = linq.from(this.dialogs).where('$.peer.peer.id ==' + id).toArray();
        if (results.length > 0 || action.response.length === 0) {
          this._isAllLoaded = true;
        }
        !this._isAllLoaded && this.dialogs.push.apply(this.dialogs, action.response);
        this.__emitChange();  
        break;

      default:
    }
  }
}

export default new ArchiveStore(Dispatcher);
