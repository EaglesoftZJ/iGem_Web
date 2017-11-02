/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container } from 'flux/utils'
import { FormattedMessage } from 'react-intl';

import CreateGroupActionCreators from '../../actions/CreateGroupActionCreators';

import CreateGroupStore from '../../stores/CreateGroupStore';

import GroupForm from './createGroup/Form.react';


class CreateGroup extends Component {
  static getStores() {
    return [CreateGroupStore];
  }
  static calculateState() {
    return {
      name: CreateGroupStore.getGroupName(),
      search: CreateGroupStore.getGroupSearch(),
      step: CreateGroupStore.getCurrentStep(),
      selectedUserIds: CreateGroupStore.getSelectedUserIds()
    };
  }
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    CreateGroupActionCreators.close();
  }
  renderHeader() {
    return (
      <header className="header">
        <div className="pull-left"><FormattedMessage id="modal.createGroup.title"/></div>
        <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.handleClose()}>关闭</strong></div>
      </header>
    );
  }
  onContactToggle(userIds) {
    CreateGroupActionCreators.setSelectedUserIds(userIds);
  }
  handleNameChange(value) {
    CreateGroupActionCreators.setGroupName(value);
  }
  handleSearchChange(value) {
    CreateGroupActionCreators.setGroupSearch(value);
  }
  handleSubmit(idList, name, peer) {
    CreateGroupActionCreators.createGroup(name, null, idList);
  }
  handleDelete(selectedUserIds) {
    CreateGroupActionCreators.setSelectedUserIds(selectedUserIds);
  }
  
  
  render() {
    var props = {
      onContactToggle: this.onContactToggle,
      handleNameChange: this.handleNameChange,
      handleSearchChange: this.handleSearchChange,
      handleDelete: this.handleDelete,
      handleSubmit: this.handleSubmit,
      handleClose: this.handleClose,
      ...this.state
    }
    return (
      <Modal
        overlayClassName="modal-overlay"
        className="modal"
        onRequestClose={this.handleClose}
        isOpen>

        <div className="create-group">
          <div className="modal__content">
            { this.renderHeader() }
            <GroupForm {...props} />
          </div>
        </div>

      </Modal>
    );
  }
}

export default Container.create(CreateGroup, {pure: false});
