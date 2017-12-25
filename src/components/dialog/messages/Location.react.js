/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import ActorClient from '../../../utils/ActorClient';

const MAP_SIZE = '300*100';

/**
 * Class that represent a component for display location messages content
 */
class Location extends Component {
  static propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);

    this.handleMapClick = this.handleMapClick.bind(this);
  }

  handleMapClick(event) {
    const { latitude, longitude } = this.props;
    const linkToMap = `http://uri.amap.com/marker?position=${longitude},${latitude}`;

    if (ActorClient.isElectron()) {
      // ActorClient.handleLinkClick(event);
      window.open(linkToMap);
    } else {
      window.open(linkToMap);
    }
  }

  render() {
    const { latitude, longitude, className } = this.props;

    return (
      <div className={className}>
        <div className="location" onClick={this.handleMapClick}>
          <img
            // src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=${MAP_SIZE}&scale=2&maptype=roadmap&markers=color:red%7C${latitude},${longitude}`}  
            src={`http://restapi.amap.com/v3/staticmap?location=${longitude},${latitude}&zoom=15&size=${MAP_SIZE}&scale=2&markers=mid,,A:${longitude},${latitude}&key=2c676be192641e1611b4e44087061878`}
            alt="Location"
          />
        </div>
      </div>
    );
  }
}

export default Location;
