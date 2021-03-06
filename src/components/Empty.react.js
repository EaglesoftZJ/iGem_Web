/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component } from 'react';

import SvgIcon from './common/SvgIcon.react';

class EmptyScreen extends Component {
  render() {
    return (
      <section className="main">
        <div className="flexrow">
          <section className="dialog dialog--empty row center-xs middle-xs">
            <div className="advice">
              <div className="logo">
              </div>
            </div>
          </section>
        </div>
      </section>
    );
  }
}

export default EmptyScreen;
