/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

import AvatarItem from './AvatarItem.react';

import { escapeWithEmoji } from '../../utils/EmojiUtils';


class ContactItem extends Component {
  static propTypes = {
    uid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    type: PropTypes.string,

    className: PropTypes.string,

    onClick: PropTypes.func,

    children: PropTypes.node,
    showDetial: PropTypes.bool,
    instance: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    console.log('instance', this.props.instance);
  }

  handleClick() {
    const { onClick } = this.props;
    onClick && onClick();
  }

  handleMouseMove = event => {
    event.nativeEvent.stopImmediatePropagation();
  }

  handleMouseEnter = (id, event) => {
    const { instance } = this.props;
    event.stopPropagation();
    instance.setState({'isShow': true, 'node': event.currentTarget, 'selectedUserId': id });
    instance.setListeners();
  }

  popoverHide = event => {
    const { isShow } = this.state;
    if (isShow) {
      this.setState({'isShow': false});
    }
  }

  render() {
    const { uid, name, placeholder, avatar, type, children, className, showDetial } = this.props;
    const contactClassName = classnames('contact row middle-xs', className);
    return (
      <div className={contactClassName} onClick={this.handleClick}>
        <div className="contact__avatar">
          <AvatarItem
            image={avatar}
            placeholder={placeholder}
            size="small"
            title={name}
          />
        </div>

        <div className="contact__body col-xs">
          <span className="title" dangerouslySetInnerHTML={{ __html: escapeWithEmoji(name) }}/>
          { showDetial && type!== 'group' ? <span className="account-icon" onMouseMove={this.handleMouseMove} onMouseEnter={this.handleMouseEnter.bind(this, uid)}><i className="material-icons" >account_circle</i><i style={{fontStyle: 'normal', fontSize: '12px'}}>查看详情</i></span> : null }
        </div>

        <div className="contact__controls">
          {children}
        </div>
      </div>
    );
  }
}

export default ContactItem;
