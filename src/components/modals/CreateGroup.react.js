/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container } from 'flux/utils'
import { FormattedMessage } from 'react-intl';

import CreateGroupActionCreators from '../../actions/CreateGroupActionCreators';

import CreateGroupForm from './createGroup/Form.react';


class CreateGroup extends Component {
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
  
  render() {
    return (
      <Modal
        overlayClassName="modal-overlay"
        className="modal"
        onRequestClose={this.handleClose}
        isOpen>

        <div className="create-group">
          <div className="modal__content">
            { this.renderHeader() }
            <CreateGroupForm/>
          </div>
        </div>

      </Modal>
    );
  }
}

export default CreateGroup;
