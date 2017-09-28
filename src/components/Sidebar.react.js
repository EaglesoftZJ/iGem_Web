/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { isFunction } from 'lodash';
import React, { Component } from 'react';
import { Container } from 'flux/utils';
import DelegateContainer from '../utils/DelegateContainer';

import DefaultRecent from './sidebar/Recent.react';
import QuickSearchButton from './sidebar/QuickSearchButton.react';
import Department from './sidebar/DepartmentButton.react';

import DialogStore from '../stores/DialogStore';
import ArchiveStore from '../stores/ArchiveStore';

class Sidebar extends Component {
  static getStores() {
    return [DialogStore, ArchiveStore];
  }

  static calculateState() {
    return {
      currentPeer: DialogStore.getCurrentPeer(),
      dialogs: DialogStore.getDialogs(),
      archive: ArchiveStore.getArchiveChatState()
    };
  }

  constructor(props) {
    super(props);

    this.components = this.getComponents();
  }

  getComponents() {
    const { components } = DelegateContainer.get();
    const sidebar = components.sidebar;

    if (sidebar) {
      return {
        Recent: isFunction(sidebar.recent) ? sidebar.recent : DefaultRecent,
        DepSection: Department,
        FooterSection: QuickSearchButton
        
      };
    }

    return {
      Recent: DefaultRecent,
      DepSection: Department,
      FooterSection: QuickSearchButton
    };
  }


  render() {
    const { currentPeer, dialogs, archive } = this.state;
    const { Recent,DepSection, FooterSection } = this.components;

    return (
      <aside className="sidebar">
        <Recent
          currentPeer={currentPeer}
          dialogs={dialogs}
          archive={archive}
        />

        <DepSection/>
        <FooterSection/>
      </aside>
    );
  }
}

export default Container.create(Sidebar, { pure: false });
