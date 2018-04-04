/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import MarkdownIt from 'markdown-it';
import ActorClient from '../../../utils/ActorClient';

import { processEmojiText } from '../../../utils/EmojiUtils';

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
  processedText = processedText.replace(/(@[0-9a-zA-Z_]{5,32})/ig, '<span class="message__mention">$1</span>');

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
