/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes, Children } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import $ from 'jquery';

import classnames from 'classnames';

class Popover extends Component {
  static propTypes = {
    node: PropTypes.object,
    isShow: PropTypes.bool
  };
  componentDidMount() {
  }
  componentDidUpdate() {
    const { isShow } = this.props;
    isShow && this.resetPopoverPosition();
  }
  componentWillReceiveProps (nextProps) {
  }

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0
    };
  }

  resetPopoverPosition() {
    const { node } = this.props;
    const { left, top } = this.state; 
    if (!node) return;
    // this.setState({'left': 10, 'top': 10});
    let popoverHeight = $(this.refs.popover).outerHeight();
    let nodeTop = $(node).position().top;
    let nodeLeft = $(node).position().left;
    let nodeWidth = $(node).width();
    let nodeHeight = $(node).height();
    let toLeft = nodeLeft + nodeWidth + 10;
    let toTop = nodeTop + nodeHeight - popoverHeight / 2 - nodeHeight / 2;
    let wTop = $(window).scrollTop();
    let wBottom = wTop + $(window).height();
    if (left !== toLeft || top !== toTop) {
      this.setState({'left': toLeft, 'top': toTop});
    }
  }

  handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  renderArrow() {
    const { node } = this.props;
    let style = {
      top: ($(this.refs.popover).outerHeight() / 2 - 10) + 'px' 
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

export default Popover;
