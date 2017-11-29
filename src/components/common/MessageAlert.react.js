import React, { Component } from 'react';
import { Container } from 'flux/utils';
import Animate from 'rc-animate';
import classnames from 'classnames';

import MessageAlertStore from '../../stores/MessageAlertStore';


class MessageAlert extends Component {
    static getStores() {
        return [MessageAlertStore];
    }
    static calculateState() {
        return {
            msg: MessageAlertStore.getState().msg
        }
    }
    constructor(props) {
        super(props);
    }
    renderMsg() {
        const { msg } = this.state;
        console.log('msg', msg);
        return msg.map((item) => {
            var className = classnames('message-info', {
            'message-info__success': item.type === 'success',
            'message-info__error': item.type === 'error',
            'message-info__warning': item.type === 'warning'
            })
            return <div className={className} key={item.key}>{item.title}</div>;
        });
    }
    render() {
        return (
            <div className="message-alert">
                <Animate transitionName="fade" >
                    { this.renderMsg() }
                </Animate>
            </div>
        );
    }
}

export default Container.create(MessageAlert, { pure: false });