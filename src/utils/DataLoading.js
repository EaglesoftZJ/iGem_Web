import React, {Component, PropTypes, createElement} from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';

class DataLoading extends Component {
    static PropTypes = {
        progress:  PropTypes.number,
        total: PropTypes.number
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { progress, total } = this.props;
        return (
            <div className="box">
                <div className="loader"></div>
                { progress ? <div className="progress">{progress} / {total}</div> : null }
            </div>
        )
    }
}

var wrapper = null;
var component = '';

export default function loading(type, progress, total) {
    if (type === 'show') {
        wrapper = document.createElement('div');
        wrapper.className = 'loading-wrapper';
        document.body.appendChild(wrapper);
        component = render(createElement(DataLoading, {progress, total}), wrapper);
    } else if (wrapper && type === 'hide') {
        // document.body.removeChild(wrapper);
        unmountComponentAtNode(wrapper);
        setImmediate(() => wrapper.remove());
    } else if (type === 'info') {
        component.props.progress = progress;
        component.props.total = total;
    }
}