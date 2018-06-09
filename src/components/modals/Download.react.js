import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import Modal from 'react-modal';

import DownloadStore from '../../stores/DownloadStore';

class Download extends Component {
  static getStores() {
    return [DownloadStore];
  }

  static calculateState() {
    return {
      list: DownloadStore.getList()
    }
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { list } = this.state;
    var arr = list.map((item, index) => {
      return <div className="test-item">{ index }</div>
    });
    return (
      <Modal
        overlayClassName="modal-overlay"
        className="modal"
        onRequestClose={this.handleClose}
        isOpen>
      <div className="document-list">{arr}</div>
      </Modal>
    )
  }
   
}

export default Container.create(Download);