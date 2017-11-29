/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import { Container } from 'flux/utils';
import { FormattedMessage } from 'react-intl';
import Tooltip from 'rc-tooltip';
import EventListener from 'fbjs/lib/EventListener';
import { KeyCodes } from '../../constants/ActorAppConstants';
import DepartmentActionCreators from '../../actions/DepartmentActionCreators';
import DepartmentStore from '../../stores/DepartmentStore';
import history from '../../utils/history';

class QuickSearchButton extends Component {
  static getStores() {
    return [DepartmentStore];
  }
  static calculateState() {
    return {
      show: DepartmentStore.getState().department_show
    }
  }
  constructor(props) {
    super(props);

    this.openQuickSearch = this.openQuickSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.setListeners();
  }

  componentWillUnmount() {
    this.cleanListeners();
  }

  setListeners() {
    this.cleanListeners();
    this.listeners = [
      EventListener.listen(document, 'keydown', this.handleKeyDown)
    ];
  }

  cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === KeyCodes.K && event.metaKey) {
      event.stopPropagation();
      event.preventDefault();
      this.openQuickSearch()
    }
  }

  openQuickSearch() {
    // DepartmentActionCreators.show();
    history.push('/im/department');
  }

  render() {
    const { show } = this.state;
    console.log('show', show);
    var className = classNames({selected: show});
    return (
      <footer className="sidebar__department">
        <Tooltip
          placement="top"
          mouseEnterDelay={0.15}
          mouseLeaveDelay={0}
          overlay={<FormattedMessage id="tooltip.department"/>}>
          <a onClick={this.openQuickSearch} className={className}>
            <div className="icon-holder"><i className="material-icons">search</i></div>
            <FormattedMessage id="button.department"/>
          </a>
        </Tooltip>
      </footer>
    )
  }
}

export default Container.create(QuickSearchButton);
