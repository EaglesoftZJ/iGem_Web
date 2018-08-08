/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import MarkdownIt from 'markdown-it';
import linq from 'linq';
import ActorClient from '../../../utils/ActorClient';

import { processEmojiText } from '../../../utils/EmojiUtils';
import QuickSearchStore from '../../../stores/QuickSearchStore';
import RingStore from '../../../stores/RingStore';
import ProfileStore from '../../../stores/ProfileStore';

import RingActionCreators from '../../../actions/RingActionCreators'

class Text extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    className: PropTypes.string
  };

  renderMessage() {
    const { text, className } = this.props;
    const { rid, uid } = JSON.parse(text);
    let msg = JSON.parse(text).text;
    if (ProfileStore.getProfile().id === uid) {
      msg = '您撤回了一条消息';
    }
    return msg;
  }

  render() {
    const { text, className, id } = this.props;

    return (
      <div className={className}>
        <div className="text systext">
        { this.renderMessage() }
        </div>
      </div>
    );
  }
}

export default Text;
