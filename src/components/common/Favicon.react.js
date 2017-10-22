/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { Component } from 'react';
import { Container } from 'flux/utils';
import Favico from 'favico.js';
import FaviconStore from '../../stores/FaviconStore';
import ActorClient from '../../utils/ActorClient'

class Favicon extends Component {
  constructor(props) {
    super(props);

    this.favico = new Favico({
      position: 'up',
      animation: 'none'
    });
  }

  static getStores() {
    return [FaviconStore];
  }

  static calculateState() {
    return {
      counter: FaviconStore.getState()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { counter } = nextState;

    if (counter) {

      // if (ActorClient.isElectron()) {
      //   ActorClient.sendToElectron ('tray-badge', {counter});
      // }
      this.favico.badge(counter);
    } else {
      this.favico.reset();
      // if (ActorClient.isElectron()) {
      //   ActorClient.sendToElectron ('new-messages-hide', {});
      // }
    }
  }

  render() {
    return null;
  }
}

export default Container.create(Favicon);
