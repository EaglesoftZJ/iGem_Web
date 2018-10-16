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
import PingyinSearchStore from '../stores/PingyinSearchStore';
import ArchiveStore from '../stores/ArchiveStore';
import linq from 'linq';
import $ from 'jquery';

class Sidebar extends Component {
  static getStores() {
    return [DialogStore, PingyinSearchStore, ArchiveStore];
  }

  static calculateState() {
    return {
      currentPeer: DialogStore.getCurrentPeer(),
      dialogs: DialogStore.getDialogs(),
      archive: ArchiveStore.getArchiveChatState(),
      pingyinSearch: PingyinSearchStore.getState()
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

  filterDailogs() {
    // 过滤删除的群组
    const { dialogs, pingyinSearch } = this.state;
    let group = pingyinSearch['群组'] || [];
    var newDialog = [],
        obj = {};
    for (var i = 0; i < dialogs.length; i++) {
      obj = $.extend({}, dialogs[i]);
      newDialog.push(obj);
      if (dialogs[i].key !== 'privates') {
        // 非用户组
        var arr = linq.from(dialogs[i].shorts).where('$.peer.peer.type === "group"').toArray(); // 群组部分
        var arr1 = linq.from(dialogs[i].shorts).where('$.peer.peer.type !== "group"').toArray(); // 非群组部分
        var activeGroup = linq.from(arr).join(group, 'outer => outer.peer.peer.id', 'inner => inner.peerInfo.peer.id', 'outer => outer').toArray(); // 未删除群组
        obj.shorts = [].concat(...arr1, ...activeGroup); // 重新组合
      }
    }
    return newDialog;
  }

  render() {
    const { currentPeer, archive } = this.state;
    const { Recent, DepSection, FooterSection } = this.components;
    
    return (
      <aside className="sidebar">
        <Recent
          currentPeer={currentPeer}
          dialogs={this.filterDailogs()}
          archive={archive}
        />

        <DepSection/>
        <FooterSection/>
      </aside>
    );
  }
}

export default Container.create(Sidebar, { pure: false });
