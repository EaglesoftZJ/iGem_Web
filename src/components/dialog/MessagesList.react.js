/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { isFunction, throttle } from 'lodash';

import React, { Component, PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import { Container } from 'flux/utils';
import EventListener from 'fbjs/lib/EventListener';
import { MessageChangeReason } from '../../constants/ActorAppConstants';

import PeerUtils from '../../utils/PeerUtils';
import { getMessageState, isLastMessageMine } from '../../utils/MessageUtils';
import Scroller from '../common/Scroller.react';

import DocumentRecordStore from '../../stores/DocumentRecordStore.js';
import RingStore from '../../stores/RingStore.js';

import DocumentRecordCreators from '../../actions/DocumentRecordCreators';
import RingActionCreators from '../../actions/RingActionCreators'

import DefaultMessageItem from './messages/MessageItem.react';
import DefaultWelcome from './messages/Welcome.react';
import Loading from './messages/Loading.react';
import Popover from '../common/Popover.react';
import $ from 'jquery';
import { lightbox } from '../../utils/ImageUtils';

class MessagesList extends Component {
    static getStores() {
        return [DocumentRecordStore, RingStore];
    }
  static contextTypes = {
    delegate: PropTypes.object.isRequired
  };

  static propTypes = {
    uid: PropTypes.number.isRequired,
    peer: PropTypes.object.isRequired,
    messages: PropTypes.shape({
      messages: PropTypes.array.isRequired,
      overlay: PropTypes.array.isRequired,
      count: PropTypes.number.isRequired,
      isLoaded: PropTypes.bool.isRequired,
      receiveDate: PropTypes.number.isRequired,
      readDate: PropTypes.number.isRequired,
      editId: PropTypes.string,
      unreadId: PropTypes.string,
      selected: PropTypes.object.isRequired,
      changeReason: PropTypes.oneOf([
        MessageChangeReason.UNKNOWN,
        MessageChangeReason.PUSH,
        MessageChangeReason.UNSHIFT,
        MessageChangeReason.UPDATE
      ]).isRequired
    }).isRequired,
    isMember: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  static calculateState() {
    return {
      isShow: DocumentRecordStore.getShowState(),
      record: DocumentRecordStore.getCurrentRecord(),
      node: DocumentRecordStore.getCurrentNode(),
      ringDomId: RingStore.getRingDomId()
    }
  }

  constructor(props, context) {
    super(props, context);

    console.log('messageList', props, context);

    this.state = {
      showScrollToBottom: false,
      updateRecord: false
    };

    this.dimensions = null;
    this.isLoading = false;

    this.onResize = this.onResize.bind(this);
    this.onScroll = throttle(this.onScroll.bind(this), 300);
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.peer !== this.props.peer ||
           nextProps.messages !== this.props.messages ||
           nextProps.isMember !== this.props.isMember ||
           nextState.showScrollToBottom !== this.state.showScrollToBottom
  }

  componentWillMount() {
    // 渲染前
      const { dialog } = this.context.delegate.components;
      console.log('delegate components', this.context.delegate.components);
    if (dialog && dialog.messages) {
      this.components = {
        MessageItem: isFunction(dialog.messages.message) ? dialog.messages.message : DefaultMessageItem,
        Welcome: isFunction(dialog.messages.welcome) ? dialog.messages.welcome : DefaultWelcome
      };
    } else {
    this.components = {
        MessageItem: DefaultMessageItem,
        Welcome: DefaultWelcome
        };
    }
  }

  componentDidMount() {
    this.restoreScroll();
    // this.setListeners();
  }

  componentWillUnmount() {
    this.cleanListeners();
  }

  componentWillReceiveProps(nextProps) {
      const { messages: { messages } } = this.props;
        // console.log('message change', messages.length , nextProps.messages.messages.length, messages.slice(-1)[0] && messages.slice(-1)[0].rid, nextProps.messages.messages.slice(-2)[0] && nextProps.messages.messages.slice(-2)[0].rid)
    //   if (messages.length +  1 === nextProps.messages.messages.length && 
    //     messages.slice(-1)[0].rid === nextProps.messages.messages.slice(-2)[0].rid &&
    //     nextProps.messages.messages.slice(-1)[0].content.content === 'text') {
    //         // 新的消息
    //         console.log('新消息新消息');
    //         setTimeout(function() {
    //             RingActionCreators.setNew(true);
    //         }, 1);
    //   }
    if (!PeerUtils.equals(nextProps.peer, this.props.peer)) {
      this.dimensions = null;
      this.isLoading = false;
    } else {
      this.updateDimensions(this.refs.scroller.getDimensions());
    }
  }

    // componentWillUpdate(nextProps, nextState) {
    //     const { message } = this.state;
    //     if (nextState.message != message) {
    //         this.setState({updateRecord: true});
    //     }
    // }
  
  componentDidUpdate(prevProps, prevState) {

    const { isShow, record } = this.state;
    console.log('更新更新', prevState.isShow, isShow, prevState, this.state, prevProps, this.props);
    if (!prevState.isShow && isShow) {
        this.setListeners();
    }
    if (prevState.showScrollToBottom !== this.state.showScrollToBottom || prevState.record !== record || prevState.isShow !== isShow) {
      return;
    }
    const { dimensions, refs: { scroller }, props: { uid, messages } } = this;
    if (prevProps.messages.messages !== messages.messages) {
        console.log('message发生改变了！！！');
        // lightbox.load({
        //     boxId: false,
        //     dimensions: true,
        //     captions: true,
        //     prevImg: false,
        //     nextImg: false,
        //     hideCloseBtn: false,
        //     closeOnClick: true,
        //     animElCount: 4,
        //     preload: true,
        //     carousel: false,
        //     animation: false,
        //     nextOnClick: true,
        //     responsive: true,
        //     maxImgSize: 0.8,
        //     // callbacks
        //     onopen: function (image) {
        //         // your code goes here
        //         console.log('onopen', image)
        //     },
        //     onclose: function (image) {
        //         // your code goes here
        //         console.log('onclose', image)
        //     },
        //     onload: function (event) {
        //         // your code goes here
        //         console.log('onload', event)
        //     },
        //     onresize: function (image) {
        //         // your code goes here
        //         console.log('onresize', image)
        //     },
        //     onloaderror: function (event) {
        //         // your code goes here
        //         console.log('onloaderror', event)
        //         // just display next or prev picture on error
        //         // if (event._happenedWhile === 'prev')
        //         //     lightbox.prev()
        //         // else
        //         //     lightbox.next()
        //     },
        //     onimageclick: function (image) {
        //         // your code goes here
        //         console.log('Image clicked!', image)
        //     }
        // });
    }
    if (messages.unreadId && messages.unreadId !== prevProps.messages.unreadId) {
      if (this.refs.unread) {
        this.refs.scroller.scrollToNode(this.refs.unread);
      }
    } else if (messages.changeReason === MessageChangeReason.PUSH) {
      const _isLastMessageMine = isLastMessageMine(uid, messages);
      if (!dimensions || _isLastMessageMine) {
        this.scrollToBottom();
      }
    } else if (messages.changeReason === MessageChangeReason.UNSHIFT) {
      this.isLoading = false;
      if (dimensions) {
        const nextDimensions = scroller.getDimensions();
        // Restore scroll
        scroller.scrollTo(nextDimensions.scrollHeight - dimensions.scrollHeight);
      } else {
        this.scrollToBottom();
      }
    } else {
      this.restoreScroll();
    }
  }

  setListeners() {
    this.cleanListeners();
    this.listeners = [
      // EventListener.listen(document, 'keydown', this.handleKeyDown),
      EventListener.listen(document, 'click', this.popoverHide.bind(this))
    ];
  }

  cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  }

  popoverHide() {
    DocumentRecordCreators.hide();
    DocumentRecordCreators.setRecord([]);
    this.cleanListeners();
  }

  onScroll() {
      const { isShow } = this.state;
    const dimensions = this.refs.scroller.getDimensions();
    this.updateDimensions(dimensions);
    isShow && this.popoverHide();
    if (!this.isLoading && dimensions.scrollTop < 100) {
      this.isLoading = true;
      this.props.onLoadMore();
    }

    const showScrollToBottom = dimensions.scrollTop < dimensions.scrollHeight - (2 * dimensions.offsetHeight);

    if (showScrollToBottom !== this.state.showScrollToBottom) {
      this.setState({ showScrollToBottom });
    }
  }

  onResize() {
    const { dimensions, refs: { scroller } } = this;
    if (dimensions) {
      // Fix scroll
      const ratio = dimensions.scrollTop / dimensions.scrollHeight;
      const nextDimensions = scroller.getDimensions();
      scroller.scrollTo(ratio * nextDimensions.scrollHeight);
      this.dimensions = nextDimensions;
    } else {
      scroller.scrollToBottom();
    }
  }

  handleScrollToBottom() {
    this.refs.scroller.scrollToBottom();
  }

  handleScrollToMessage() {
      const { ringDomId } = this.state;
      var span = document.getElementById(ringDomId);
      if (ringDomId && span) {
          console.log('new text', $(span).parents('.message').get(0));
          setTimeout((() => {
            this.refs.scroller.scrollToNode($(span).parents('.message').get(0));
          }), 100);
        
      }
        RingActionCreators.setRingDomId('');
    
       
  }

  handleTableClick(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  renderHeader() {
    const { peer, isMember, messages } = this.props;

    if (!isMember) {
      return null;
    }

    if (messages.isLoaded) {
      const { Welcome } = this.components;
      return <Welcome peer={peer} key="header" />;
    }

    if (!messages.messages.length) {
      return null;
    }

    return <Loading key="header" />;
  }

  renderMessages() {
    const { uid, peer, messages: { messages, overlay, count, selected, receiveDate, readDate, editId, unreadId } } = this.props;
    const { MessageItem } = this.components;

    const result = [];
    for (let index = messages.length - count; index < messages.length; index++) {
      const message = messages[index];
      if (message.rid === unreadId) {
        result.push(
          <div className="unread-divider" ref="unread" key="unread">
            <div className="text">
              <i className="material-icons">expand_more</i>
              <FormattedMessage id="message.unread"/>
              <i className="material-icons">expand_more</i>
            </div>
          </div>
        );
      }

      const overlayItem = overlay[index];
      if (overlayItem && overlayItem.dateDivider) {
        result.push(
          <div className="date-divider" key={overlayItem.dateDivider}>
            {overlayItem.dateDivider}
          </div>
        );
      }

      result.push(
        <MessageItem
          peer={peer}
          message={message}
          state={getMessageState(message, uid, receiveDate, readDate)}
          isShort={overlayItem.useShort}
          isSelected={selected.has(message.rid)}
          isEditing={editId === message.rid}
          onEdit={this.props.onEdit}
          onSelect={this.props.onSelect}
          key={message.sortKey}
        />
      );
    }

    return result;
  }

  renderScrollToBottomButton() {
    const { showScrollToBottom } = this.state;
    if (!showScrollToBottom) {
      return null;
    }

    return (
        <div className="chat__scroll-to-bottom" onClick={this.handleScrollToBottom}>
            <i className="material-icons">keyboard_arrow_down</i>
        </div>
    );
  }
  renderScrollToMessage() {
      console.log('renderScrollToMessage==================')
    const { ringDomId } = this.state;
    console.log('重新渲染数据', ringDomId);
    if (!ringDomId) {
        return null; 
    }
      return (
        <div className="chat__scroll-to-bottom chat__scroll-to-message" onClick={this.handleScrollToMessage.bind(this)}>
            <i>@</i>    
        </div>
      )
  }

  renderInfo() {
    // 渲染下载详情
    const { record } = this.state;
    if (!record || record.length === 0) {
        return null;
    }
    var tr = record.map((item, index) => {
       return(
            <tr key={ index }>
                <td>{ item.userName }</td>
                <td>于{ item.time }下载</td>
            </tr>
       );
    })
    return (
        <table className="message_record_table" onClick={this.handleTableClick}>
            <tbody>
            { tr } 
           </tbody>
        </table>
    )
  }

  render() {
      const { node, isShow } = this.state;
      var addLeft = this.refs.outer ? 305 - this.refs.outer.clientWidth : 0;
      var addTop = ($(node).height() - 22) / 2;
      console.log('偏移量', addLeft, addTop);
      console.log('node isShow', node, isShow);
    return (
      <div className="chat__container" ref="outer">
        <Popover node={node} isShow={isShow} container={this.refs.outer} addLeft={addLeft} addTop={addTop} maxHeight={ 300 } emptyMsg="message.documentRecord">
            { this.renderInfo() }
        </Popover>
        <Scroller
          className="chat__messages"
          ref="scroller"
          onScroll={this.onScroll}
          onResize={this.onResize}
        >
          {this.renderHeader()}
          {this.renderMessages()}
        </Scroller>
        <div className="chat__scroll-to-box">
            {this.renderScrollToMessage()}
            {this.renderScrollToBottomButton()}
        </div>
      </div>
    )
  }

  scrollToBottom() {
    this.dimensions = null;
    this.refs.scroller.scrollToBottom();
  }

  updateDimensions(dimensions) {
    if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
      // Lock scroll to bottom
      this.dimensions = null;
    } else {
      this.dimensions = dimensions;
    }
  }

  restoreScroll() {
    const { dimensions, refs: { scroller } } = this;

    if (dimensions) {
      scroller.scrollTo(dimensions.scrollTop);
    } else {
      scroller.scrollToBottom();
    }
  }
}

export default Container.create(MessagesList, {withProps: true, withContext: true});
;
