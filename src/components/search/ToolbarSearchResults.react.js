/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import ContactItem from '../common/ContactItem.react';
import Popover from '../common/Popover.react';
import SelectListItem from '../common/SelectListItem.react';
import ContactDetails from '../common/ContactDetails.react';
import EventListener from 'fbjs/lib/EventListener';
import DepartmentStore from '../../stores/DepartmentStore';
import linq from 'Linq';

class ToolbarSearchResults extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      node: null,
      department: DepartmentStore.getState(),
      selectedUserId: -1
    }
  }

  componentDidMount() {
    this.setListeners();
  }

  componentWillUnmount() {
    this.cleanListeners();
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

  renderResults() {
    const { query, results } = this.props;

    if (!results.length) {
      return (
        <div className="not-found">
          <FormattedHTMLMessage id="search.notFound" values={{ query }} />
        </div>
      );
    }

    return results.map((item, index) => {
      return (
        <SelectListItem index={index} key={item.peerInfo.peer.key}>
          <ContactItem
            uid={item.peerInfo.peer.id}
            name={item.peerInfo.title}
            avatar={item.peerInfo.avatar}
            type={item.peerInfo.peer.type}
            placeholder={item.peerInfo.placeholder}
            showDetial
            instance={this}
          />
        </SelectListItem>
      )
    });
  }
  setListeners() {
    this.cleanListeners();
    this.listeners = [
      // EventListener.listen(document, 'keydown', this.handleKeyDown),
      EventListener.listen(document, 'mousemove', this.popoverHide.bind(this)),
      EventListener.listen(this.refs.results, 'scroll', this.popoverHide.bind(this))
    ];
  }

  cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  }

  popoverHide() {
    const { isShow } = this.state;
    if (isShow) {
      this.setState({'isShow': false});
      this.cleanListeners();
    } 
  }

  render() {
    const { isShow, node } = this.state;
    return (
      <div className="popover-outer" ref="outer">
          <Popover node={node} isShow={isShow} container={this.refs.outer}>
            { this.renderInfo() }
          </Popover>
        <div className="toolbar__search__results" ref="results">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default ToolbarSearchResults;
