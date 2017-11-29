import React, {Component, PropTypes, createElement} from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import Animate from 'rc-animate';
import { setTimeout } from 'timers';

class Message extends Component {
    static PropTypes = {
        // msg:  PropTypes.string
    }
    static defaultProps = {
        time: 500
    }
    constructor(props) {
        super(props);
        this.state = {
            msg:'',
            show: false
        }
    }

    showMessage(msg, div) {
        const { time } = this.props;
        this.setState({msg, show: true});
        setTimeout(() => {
            this.setState({show: false});
            document.body.removeChild(div);
        }, time);
    }


    render() {
        const { show, msg } = this.state;
        return (            
            <Animate transitionName="fade" component="div" >
                { show ? <div className="Message-info">{ msg }</div> : null }
            </Animate>
        );
    }
}

var component = '';

export default function message(msg) {
        var div = document.createElement('div');
        div.className = 'flytchat-message';
        div.style = `position: absolute;z-index:99999;top: 0;left:50%;background: red;`;
        document.body.appendChild(div);
        component = render(createElement(Message), div);
        setTimeout(() => {
            component.showMessage(msg, div);
        }, 10);





    // var clean = () => {
    //     unmountComponentAtNode(wrapper);
    //     document.body.removeChild(wrapper);
    //     // setImmediate(() => wrapper.remove());
    //     wrapper = null;
    // }
    // if (type === 'show') {
    //     wrapper && clean();
    //     wrapper = document.createElement('div');
    //     wrapper.className = 'loading-wrapper';
    //     document.body.appendChild(wrapper);
    //     component = render(createElement(DataLoading, {progress, total}), wrapper);
    // } else if (wrapper && type === 'hide') {
    //     // document.body.removeChild(wrapper);
    //     clean();
    // } else if (type === 'info') {
    //     component.props.progress = progress;
    //     component.props.total = total;
    // }
}