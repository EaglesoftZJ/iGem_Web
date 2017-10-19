/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes, Children } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Container } from 'flux/utils';
import $ from 'jquery';

import DialogStore from '../../stores/DialogStore';

import classnames from 'classnames';

class Popover extends Component {
  static propTypes = {
    node: PropTypes.node,
    isShow: PropTypes.bool
  };

  static getStores() {
    return [DialogStore];
  }

  static calculateState() {
    return {
      left: 0,
      top: 0
    };
  }

  componentDidMount() {
    // this.resetPopoverPosition();
  }
  componentDidUpdate() {
    const { isShow } = this.props;
    if (isShow) {
      this.resetPopoverPosition();
    }
  }
  componentWillReceiveProps (nextProps) {
    // const { isShow } = this.props;
    // console.log(nextProps);
    // if (isShow !== nextProps.isShow && nextProps.isShow) {
    //   this.resetPopoverPosition();
    // }
  }
  
  resetPopoverPosition() {
    const { node } = this.props;
    if (!node) return;
    // this.setState({'left': 10, 'top': 10});
    let nodeTop = $(node).position().top;
    let nodeLeft = $(node).position().left;
    let nodeWidth = $(node).width();
    let nodeHeight = $(node).height();
    let left = nodeLeft + nodeWidth + 10;
    let top = nodeTop + nodeHeight - 100;
    this.setState({'left': left, 'top': top});
  }

  handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  constructor(props) {
    super(props);
  }

  renderArrow() {
    const { node } = this.props;
    const { left, top } = this.state;
    let style = {
      top: (90 - $(node).height() / 2) + 'px' 
    };
    return (
      <div className="arrow" style={style}></div>
    )
  }
  renderInfo() {
    const { children } = this.props;
    if (!children) {
      return <FormattedHTMLMessage id="modal.quickSearch.notHaveInfo"/>
    }
    return children;
  }

  render() {
    const { isShow } = this.props;
    const { left, top } = this.state;
    let popoverClassName = classnames('popover-con', {'hide': !isShow});
   return (
      <div ref="popover" onMouseMove={this.handleMouseMove} className={popoverClassName} style={{left: left + 'px', top: top + 'px'}}>
        { this.renderInfo() }
        { this.renderArrow() }
      </div>
    );
  }
}

export default Container.create(Popover);
