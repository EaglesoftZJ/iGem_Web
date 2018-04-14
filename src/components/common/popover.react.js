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
    isShow: PropTypes.bool,
    container: PropTypes.object,
    addLeft: PropTypes.number,
    addTop: PropTypes.number,
    emptyMsg: PropTypes.string,
    maxHeight: PropTypes.number,
  };

  static defaultProps = {
    addLeft: 0,
    addTop: 0
  }
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
      top: 0,
      allowTop: 0
    };
  }

  resetPopoverPosition() {
    const { node, container, addLeft, addTop } = this.props;
    const { left, top, allowTop } = this.state; 
    if (!node) return;
    // this.setState({'left': 10, 'top': 10});
    let popoverHeight = $(this.refs.popover).outerHeight();
    let nodeTop = $(node).position().top;
    let nodeLeft = $(node).position().left;
    let nodeWidth = $(node).outerWidth(true);
    let nodeHeight = $(node).outerHeight(true);
    let toLeft = nodeLeft + nodeWidth + 10 + addLeft;
    let toTop = nodeTop + nodeHeight - popoverHeight / 2 - nodeHeight / 2 + addTop;
    let wTop = $(window).scrollTop();
    let wBottom = wTop + $(window).height();
    let aTop = $(this.refs.popover).outerHeight() / 2 - 10;
    let newToTop = 0;
    if (container && $(container).offset().top - wTop + toTop < 0) {
      newToTop = wTop - $(container).offset().top + 4;
    } else if (container && (wTop + wBottom) < $(container).offset().top + toTop + popoverHeight) {
      newToTop = wTop + wBottom - 4 - popoverHeight - $(container).offset().top;
    }
    if (newToTop) {
      aTop = aTop + (toTop - newToTop);
      toTop = newToTop;
    }
    if (left !== toLeft || top !== toTop || aTop !== allowTop) {
      this.setState({'left': toLeft, 'top': toTop, 'allowTop': aTop});
    }
  }

  handleMouseMove(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  renderArrow() {
    const { allowTop } = this.state;
    let style = {
      // top: ($(this.refs.popover).outerHeight() / 2 - 10) + 'px' 
      top: allowTop + 'px'
    };
    return (
      <div className="arrow" style={style}></div>
    )
  }
  renderInfo() {
    const { children, emptyMsg } = this.props;
    var msg = emptyMsg;
    if (!emptyMsg) {
        msg = 'modal.quickSearch.notHaveInfo';
    }
    if (!children) {
      return <FormattedHTMLMessage id={ msg }/>
    }
    return children;
  }

  render() {
    const { isShow, maxHeight } = this.props;
    const { left, top } = this.state;
    let popoverClassName = classnames('popover-con', {'hide': !isShow});
   return (
      <div ref="popover" onMouseMove={this.handleMouseMove} className={popoverClassName} style={{left: left + 'px', top: top + 'px'}}>
        <div className="popover-scroll" style={{maxHeight}}>
            { this.renderInfo() }
            { this.renderArrow() }
        </div>
      </div>
    );
  }
}

export default Popover;
