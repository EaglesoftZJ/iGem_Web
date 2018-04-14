/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Tooltip from 'rc-tooltip';
import DialogStore from '../../../stores/DialogStore';
import ActorClient from '../../../utils/ActorClient';


/**
 * Class that represents a component for display document message content
 */
class Document extends Component {
  static propTypes = {
    fileUrl: PropTypes.string,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.string.isRequired,
    fileExtension: PropTypes.string.isRequired,
    isUploading: PropTypes.bool.isRequired,
    className: PropTypes.string,
    sortKey: PropTypes.string,
    container: PropTypes.object,
  }
  
  static contextTypes = {
    showDocumentRecord: PropTypes.func,
    message: PropTypes.object
  }
  

  constructor(props, context) {
    super(props, context);
    this.state = {
      peer: DialogStore.getCurrentPeer()
    };
  }

  renderIcon() {
    const { fileUrl, isUploading } = this.props;

    if (isUploading) {
      return (
        <div className="document__icon">
          <i className="material-icons">attach_file</i>
        </div>
      );
    } else {
      return (
        <a className="document__icon" href={fileUrl}>
          <i className="material-icons">attach_file</i>
        </a>
      );
    }
  }

  renderActions() {
    const { fileUrl, isUploading } = this.props;

    if (isUploading) {
      return (
        <span><FormattedMessage id="message.uploading"/></span>
      );
    } else {
      return (
        <div className="btn-group">
            <a href={fileUrl} onClick={this.handleDownloadClick.bind(this)}><FormattedMessage id="message.download"/></a>
            <Tooltip
                placement="top"
                mouseEnterDelay={0.15}
                mouseLeaveDelay={0}
                overlay={<FormattedMessage id="tooltip.documentRecord"/>}>
                <button onMouseMove={this.handleMouseMove} onClick={this.handleOpenRecord.bind(this)} className="button button--icon" style={{padding: 0, height: 24, marginTop: -2, marginLeft: 5, color: '#468ee5'}}><i style={{fontSize: 20}} className="material-icons">history</i></button>
            </Tooltip>
            {/* <a href={fileUrl} style={{'paddingLeft': 5}} onMouseMove={this.handleMouseMove} onMouseEnter={this.handleOpenRecord.bind(this)}><FormattedMessage id="message.downloadDetial"/></a> */}
        </div>
      );
    }
  }
  
  handleDownloadClick() {
    const { peer } = this.state;
    const { message } = this.context;
    if (ActorClient.isElectron()) {
      window.messenger.sendToElectron('will-download-info', {rid: message.rid, ...peer});
    }
  }

  handleOpenRecord(event) {
    const { showDocumentRecord } = this.context;
    showDocumentRecord();
    event.nativeEvent.stopImmediatePropagation();
  }

  handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { fileName, fileSize, fileExtension, className } = this.props;

    const documentClassName = classnames(className, 'row');

    return (
      <div className={documentClassName} ref>
        <div className="document row">
          {this.renderIcon()}
          <div className="col-xs">
            <span className="document__filename">{fileName}</span>
            <div className="document__meta">
              <span className="document__meta__size">{fileSize}</span>
              <span className="document__meta__ext">{fileExtension}</span>
            </div>
            <div className="document__actions">
              {this.renderActions()}
            </div>
          </div>
        </div>
        <div className="col-xs"/>
      </div>
    );
  }
}

export default Document;
