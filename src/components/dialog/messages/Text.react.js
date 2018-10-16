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

function processText(text) {
  let processedText = text;
  var md = new MarkdownIt({
    linkify: true
  });
  processedText = md.render(processedText);

  processedText = processedText.replace(/<a[\w\s]*href=/g, (str) => {
    str = str.slice(0, 2) + ' target="_blank" onClick="window.messenger.handleLinkClick(event)"' + str.slice(2);
    return str;
  });

  // processedText = ActorClient.renderMarkdown(processedText);
  // 链接匹配
//   var exp = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g
//   processedText = processedText.replace(exp, (str) => {
//     var url = /^http/.test(str) ? str : 'http://' + str;
//     return `<a target="_blank" href="${url}" onClick="window.messenger.handleLinkClick(event)">${str}</a>`;
//   });


  processedText = processEmojiText(processedText);
  var list = QuickSearchStore.getSearchList();
  var id = '';
  var name = '';
  processedText = processedText.replace(/(@[0-9a-zA-Z_]{1,32})/ig, (str) => {
    // var item = linq.from(list).where(`$.peerInfo.userName == '${str.slice(1)}'`).toArray()[0];
    // if (item) {
    //     name = item.peerInfo.title;
    // }
    
    if (ProfileStore.getState().profile.nick === str.slice(1)) {
        id = 'ring_' + new Date().getTime();
        // name = ProfileStore.getState().profile.name;
    }
    return '<span class="message__mention" id="' + id + '">' + (name ? '@' + name : str) + '</span>';
  });

//   setTimeout(function() {
//     if (RingStore.isNewMessage()) {
//         RingActionCreators.setNew(false);
//         id && RingActionCreators.setRingDomId(id);
//         console.log('设置id设置id')
//     }
// }, 1);  

  return processedText;
}

class Text extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  render() {
    const { text, className } = this.props;

    return (
      <div className={className}>
        <div className="text" dangerouslySetInnerHTML={{ __html: processText(text) }}/>
      </div>
    );
  }
}

export default Text;
