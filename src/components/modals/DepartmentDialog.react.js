/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

import DepartmentDetial from './DepartmentDetial.react';

const RESULT_ITEM_HEIGHT = 44;
let scrollIndex = 0;

class DepartmentDialog extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
      return (
        <Modal
          overlayClassName="modal-overlay"
          className="modal"
          onRequestClose={this.handleClose}
          isOpen>

          <div className="department-dialog">
            <div className="modal__content">
              <div className="department-dailog">
                <DepartmentDetial hasHeader />
              </div>
            </div>
          </div>

        </Modal>
      );
  }
}

export default DepartmentDialog;
