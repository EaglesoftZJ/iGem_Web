/*
* Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
*/

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import SvgIcon from '../common/SvgIcon.react';

class ContactDetails extends Component {
  static propTypes = {
    peerInfo: React.PropTypes.object.isRequired
  };

renderNickname() {
    const { nick } = this.props.peerInfo;
    if (!nick) return null;

    return (
      <li>
        <SvgIcon className="icon icon--pink" glyph="username"/>
        <span className="title">{nick}</span>
        <span className="description"><FormattedMessage id="profile.nickname"/></span>
      </li>
    );
  }

  renderPhone() {
    const { phones } = this.props.peerInfo;
    if (phones.length === 0) return null;

    return phones.map((phone, index) => {
      return (
        <li key={`p${index}`}>
          <i className="material-icons icon icon--green">call</i>
          <span className="title"><a href={'tel:+' + phone.number}>{'+' + phone.number}</a></span>
          <span className="description"><FormattedMessage id="profile.phone"/></span>
        </li>
      );
    });
  }
    renderSjh() {
        const { sjh } = this.props.peerInfo;
        if (!sjh) return null;
        return (
            <li>
                <i className="material-icons icon icon--green">call</i>
                <span className="title"><a href={'tel:+' + sjh}>{'+' + sjh}</a></span>
                <span className="description"><FormattedMessage id="profile.cellphone"/></span>
            </li>
        );
    }
    renderDh() {
      // 电话
      const { dh } = this.props.peerInfo;
      if (!dh) return null;
      return (
          <li>
              <i className="material-icons icon icon--green">call</i>
              <span className="title"><a href={'tel:+' + dh}>{'+' + dh}</a></span>
              <span className="description"><FormattedMessage id="profile.telephone"/></span>
          </li>
      );
    }
    renderDuh() {
      // 短号
      const { duh } = this.props.peerInfo;
      if (!duh) return null;
      return (
          <li>
              <i className="material-icons icon icon--green">call</i>
              <span className="title"><a href={'tel:+' + duh}>{'+' + duh}</a></span>
              <span className="description"><FormattedMessage id="profile.cornet"/></span>
          </li>
      );
    }

    renderDwmc() {
        const { dwmc } = this.props.peerInfo;
        if (!dwmc) return null;
        return (
            <li>
                <i className="material-icons icon icon--blue">business</i>
                <span className="title">{dwmc}</span>
                <span className="description"><FormattedMessage id="profile.unit"/></span>
            </li>
        );
    }
    renderBmmc() {
        const { bmmc } = this.props.peerInfo;
        if (!bmmc) return null;
        return (
            <li>
                <i className="material-icons icon icon--blue">device_hub</i>
                <span className="title">{bmmc}</span>
                <span className="description"><FormattedMessage id="profile.dept"/></span>
            </li>
        );
    }
    renderZwmc() {
        const { zwmc } = this.props.peerInfo;
        if (!zwmc) return null;
        return (
            <li>
                <i className="material-icons icon icon--blue">work</i>
                <span className="title">{zwmc}</span>
                <span className="description"><FormattedMessage id="profile.post"/></span>

            </li>
        );
    }

  renderEmail() {
    const { emails } = this.props.peerInfo;
    if (emails.length === 0) return null;

    return emails.map((email, index) => {
      return (
        <li key={`e${index}`}>
          <SvgIcon className="icon icon--blue" glyph="envelope"/>
          <span className="title"><a href={'mailto:' + email.email}>{email.email}</a></span>
          <span className="description"><FormattedMessage id="profile.email"/></span>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="user_profile__contact_info__list">
        {this.renderNickname()}
        {this.renderSjh()}
        {this.renderDh()}
        {this.renderDuh()}
        {this.renderDwmc()}
        {this.renderBmmc()}
        {this.renderZwmc()}
        {/*this.renderEmail()*/}
      </ul>
    );
  }
}

export default ContactDetails;
