/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Container } from 'flux/utils';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import EventListener from 'fbjs/lib/EventListener';
import fuzzaldrin from 'fuzzaldrin';
import Modal from 'react-modal';
import classnames from 'classnames';
import history from '../../utils/history';
import PeerUtils from '../../utils/PeerUtils';
import linq from 'Linq';

import { KeyCodes } from '../../constants/ActorAppConstants';

import PingyinSearchActionCreators from '../../actions/PingyinSearchActionCreators';

import PingyinSearchStore from '../../stores/PingyinSearchStore';
import DepartmentStore from '../../stores/DepartmentStore';

import AvatarItem from '../common/AvatarItem.react';
import Popover from '../common/Popover.react';
import ContactDetails from '../common/ContactDetails.react';

const RESULT_ITEM_HEIGHT = 44;
let scrollIndex = 0;

class QuickSearch extends Component {
  static getStores() {
    return [PingyinSearchStore];
  }

  static calculateState() {
    return {
      obj: PingyinSearchStore.getState(),
      department: DepartmentStore.getState(),
      selectedLetter: 'a',
      selectedIndex: 0,
      selectedUserId: -1,
      node: null,
      isShow: false
    }
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);

    this.setFocus = this.setFocus.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDialogSelect = this.handleDialogSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    // this.setFocus();
    this.setListeners();
  }

  componentWillUnmount() {
    this.cleanListeners();
  }

  setListeners() {
    this.cleanListeners();
    this.listeners = [
      // EventListener.listen(document, 'keydown', this.handleKeyDown),
      EventListener.listen(document, 'mousemove', this.popoverHide),
      EventListener.listen(this.refs.results, 'scroll', this.popoverHide)
    ];
  }

  cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  }

  setFocus() {
    setImmediate(() => findDOMNode(this.refs.query).focus());
  }

  handleClose() {
    PingyinSearchActionCreators.hide();
  }

  handleSearch(event) {
    this.setState({ query: event.target.value });
  }

  handleDialogSelect(peer) {
    const peerStr = PeerUtils.peerToString(peer);
    history.push(`/im/${peerStr}`);
    this.handleClose();
  }

  handleKeyDown(event) {
    const { selectedIndex } = this.state;
    const results = this.getResults();
    const visibleItems = 8;
    let index = selectedIndex;

    switch (event.keyCode) {
      case KeyCodes.ENTER:
        event.stopPropagation();
        event.preventDefault();
        this.handleDialogSelect(results[selectedIndex].peerInfo.peer);
        break;

      case KeyCodes.ARROW_UP:
        event.stopPropagation();
        event.preventDefault();

        if (index > 0) {
          index -= 1;
        } else if (index === 0) {
          index = results.length - 1;
        }

        if (scrollIndex > index) {
          scrollIndex = index;
        } else if (index === results.length - 1) {
          scrollIndex = results.length - visibleItems;
        }

        this.handleScroll(scrollIndex * RESULT_ITEM_HEIGHT);
        this.setState({ selectedIndex: index });
        break;
      case KeyCodes.ARROW_DOWN:
      case KeyCodes.TAB:
        event.stopPropagation();
        event.preventDefault();

        if (index < results.length - 1) {
          index += 1;
        } else if (index === results.length - 1) {
          index = 0;
        }

        if (index + 1 > scrollIndex + visibleItems) {
          scrollIndex = index + 1 - visibleItems;
        } else if (index === 0) {
          scrollIndex = 0;
        }

        this.handleScroll(scrollIndex * RESULT_ITEM_HEIGHT);
        this.setState({ selectedIndex: index });
        break;

      default:
    }
  }

  handleScroll(top) {
    findDOMNode(this.refs.results).scrollTop = top;

    // Console.log('scroll--------');
  }

  handleLetterClick(letter) {
    this.setState({'selectedLetter': letter});
    this.handleScroll(0);
  }

  handleMouseEnter = (id, event) => {
    event.stopPropagation();
    this.setState({'isShow': true, 'node': event.currentTarget, 'selectedUserId': id });
    this.setListeners();
  }

  handleMouseMove = event => {
    event.nativeEvent.stopImmediatePropagation();
  }

  popoverHide = event => {
    const { isShow } = this.state;
    if (isShow) {
      this.setState({'isShow': false});
      this.cleanListeners();
    }
  }

  getResults() {
    const { list } = this.state;
    if (!query || query === '') return list;

    return list.filter((result) => {
      return fuzzaldrin.score(result.peerInfo.title, query) > 0 ||
             fuzzaldrin.score(result.peerInfo.userName, query) > 0;
    });
  }

  renderResults() {
    const { selectedIndex, selectedLetter, obj } = this.state;
    const results = obj[selectedLetter];

    if (!results || !results.length) {
      return (
        <li className="results__item results__item--suggestion row">
          <FormattedHTMLMessage id="modal.quickSearch.notHaveData"/>
          <button className="button button--rised hide">Create new dialog</button>
        </li>
      )
    }

    return results.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': selectedIndex === index
      });

      return (
        <li
          className={resultClassName} key={`r${index}`}
          onClick={() => this.handleDialogSelect(result.peerInfo.peer)}
          onMouseOver={() => this.setState({ selectedIndex: index})}>
          <AvatarItem
            className="quick-search__avatar"
            size="small"
            image={result.peerInfo.avatar}
            placeholder={result.peerInfo.placeholder}
            title={result.peerInfo.title}
          />
          <div className="title col-xs">
            <div className="hint pull-right"><FormattedMessage id="modal.quickSearch.openDialog"/></div>
            {result.peerInfo.title}
            {result.peerInfo.peer.type !== 'group' ? <span className="account-icon" onMouseMove={this.handleMouseMove} onMouseEnter={this.handleMouseEnter.bind(this, result.peerInfo.peer.id)}><i className="material-icons" >account_circle</i><i style={{fontStyle: 'normal', fontSize: '12px'}}>查看详情</i></span> : null}
          </div>
        </li>
      );
    });
  }

  renderInfo() {
    const { department, selectedUserId } = this.state;
    const { yh_data } = department;
    let info = linq.from(yh_data).where('parseFloat($.IGIMID) ==' + selectedUserId).toArray()[0];
    if (!info) return null;
    return (
      <ContactDetails peerInfo={info}></ContactDetails>
    )
  }

  renderHeader() {
    return (
      <header className="header">
        <div className="pull-left"><FormattedMessage id="modal.quickSearch.title"/></div>
        <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.handleClose()}>关闭</strong></div>
      </header>
    );
  }

  renderSearchInput() {
    const { query } = this.state;
    const { intl } = this.context;

    return (
      <div className="large-search">
        <input
          className="input"
          type="text"
          placeholder={intl.messages['modal.quickSearch.placeholder']}
          onChange={this.handleSearch}
          value={query}
          ref="query"/>
      </div>
    );
  }
  renderSearchLetter() {
    const { selectedLetter } = this.state;
    let items = [],
        letter = '',
        title = '';
    for (let i = 0; i < 28; i++) {
      if  (i < 26) {
        title = letter = String.fromCharCode(97 + i);
      } else if(i === 26) {
        letter = '#';
        title = '其他';
      } else {
        title = letter = '群组';
      }
      let itemClassName = classnames('search-letter-item', {'selected': selectedLetter === letter, 'flex2': i === 27});
      items.push(<a href="javascript:;" key={i} target="self" title={title} onClick={this.handleLetterClick.bind(this, letter)} className={itemClassName}><span>{letter}</span></a>);
    }
    
    return (
      <div className="search-letter">
        { items }
      </div>
    )
 
  }

  render() {
    const { isShow, node } = this.state;
    return (
      <Modal
        overlayClassName="modal-overlay"
        className="modal"
        onRequestClose={this.handleClose}
        isOpen>
        <div className="popover-outer" ref="outer">

          <Popover node={node} isShow={isShow} container={this.refs.outer}>
            { this.renderInfo() }
          </Popover>

          <div className="quick-search">
            <div className="modal__content">

              {this.renderHeader()}

              {/*this.renderSearchInput()*/}
              { this.renderSearchLetter() }
              

              <ul className="results" ref="results">
                {this.renderResults()}
              </ul>

            </div>
          </div>
        </div>

      </Modal>
    );
  }
}

export default Container.create(QuickSearch, { pure: false });
