/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import EventListener from 'fbjs/lib/EventListener';
import { findDOMNode } from 'react-dom';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';

import isInside from '../../../utils/isInside';
import { quoteMessage } from '../../../utils/MessageUtils';
import ActorClient from '../../../utils/ActorClient';

import { MessageContentTypes } from '../../../constants/ActorAppConstants';

import MessageActionCreators from '../../../actions/MessageActionCreators';
import ComposeActionCreators from '../../../actions/ComposeActionCreators';
import DropdownActionCreators from '../../../actions/DropdownActionCreators';

import UserStore from '../../../stores/UserStore';

class MessageActions extends Component {
  static propTypes = {
    peer: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    targetRect: PropTypes.object.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.listeners = [
      EventListener.capture(document, 'click', this.handleDocumentClick),
      EventListener.capture(document, 'scroll', this.handleDropdownClose)
    ];
  }

  componentWillUnmount() {
    this.listeners.forEach((listener) => {
      listener.remove();
    });

    this.listeners = null;
  }

  handleDocumentClick = (event) => {
    const dropdown = findDOMNode(this.refs.dropdown);
    const dropdownRect = dropdown.getBoundingClientRect();
    const coords = {
      x: event.pageX || event.clientX,
      y: event.pageY || event.clientY
    };

    if (!isInside(coords, dropdownRect)) {
      event.preventDefault();
      this.handleDropdownClose();
    }
  };


  handleDropdownClose = () => DropdownActionCreators.hideMessageDropdown();

  handleDelete = () => {
    const { peer, message } = this.props;
    MessageActionCreators.deleteMessage(peer, message.rid);
    this.handleDropdownClose();
  };

  handleRepeat= ()=> {
    // 消息转发
    const { message } = this.props;
    const sendType = {
      'text': {type: 'sendTextMessage', key: 'text'},
      'photo': {type: 'sendPhotoMessage', key: 'preview'}
    };
    const type = sendType[message.content.content].type;
    const key = sendType[message.content.content].key;
    var peer1 = {
      id: 130508843,
      key: 'g130508843',
      type: 'group'
    };
    var peer2 = {
      id: 182777372,
      key: "u182777372",
      type: "user"
    }
    console.log('preview', message.content[key]);
    // ActorClient[type](peer1, message.content[key]);
    ActorClient[type](peer2, this.dataURItoBlob(message.content[key]));
    // ActorClient.sendPhotoMessage
    
  }
  
  dataURItoBlob(dataURI) {  
    var byteString = atob(dataURI.split(',')[1]);  
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];  
    var ab = new ArrayBuffer(byteString.length);  
    var ia = new Uint8Array(ab);  
    for (var i = 0; i < byteString.length; i++) {  
        ia[i] = byteString.charCodeAt(i);  
    }  
    return new Blob([ab], {type: mimeString});  
}  

  handleReply = () => {
    const { message } = this.props;
    const info = UserStore.getUser(message.sender.peer.id);
    const replyText = info.nick ? `@${info.nick}: ` : `${info.name}: `;
    ComposeActionCreators.pasteText(replyText);
    this.handleDropdownClose();
  };

  handleQuote = () => {
    const { message } = this.props;
    ComposeActionCreators.pasteText(quoteMessage(message.content.text) + '\n');
    this.handleDropdownClose();
  };

  render() {
    const { message, targetRect } = this.props;
    const { intl } = this.context;

    const isThisMyMessage = UserStore.getMyId() === message.sender.peer.id;

    const dropdownStyles = {
      top: targetRect.top,
      left: targetRect.left
    };

    const dropdownMenuStyles = {
      minWidth: 120,
      right: 2,
      top: -4
    };

    return (
      <div className="dropdown dropdown--opened dropdown--small" style={dropdownStyles}>
        <ul className="dropdown__menu dropdown__menu--right" ref="dropdown" style={dropdownMenuStyles}>
          <li className="dropdown__menu__item hide">
            <i className="icon material-icons">star_rate</i> {intl.messages['message.pin']}
          </li>
          {/* <li className="dropdown__menu__item" onClick={this.handleRepeat}>
            <i className="icon material-icons">repeat</i> {intl.messages['message.repeat']}
          </li> */}
          {
            !isThisMyMessage
              ? <li className="dropdown__menu__item" onClick={this.handleReply}>
                  <i className="icon material-icons">reply</i> {intl.messages['message.reply']}
                </li>
              : null
          }
          {
            message.content.content === MessageContentTypes.TEXT
              ? <li className="dropdown__menu__item" onClick={this.handleQuote}>
                  <i className="icon material-icons">format_quote</i> {intl.messages['message.quote']}
                </li>
              : null
          }
          <li className="dropdown__menu__item hide">
            <i className="icon material-icons">forward</i> {intl.messages['message.forward']}
          </li>
          <li className="dropdown__menu__item" onClick={this.handleDelete}>
            <i className="icon material-icons">delete</i> {intl.messages['message.delete']}
          </li>
        </ul>
      </div>
    );
  }
}

export default MessageActions;
