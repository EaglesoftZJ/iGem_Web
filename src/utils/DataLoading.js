import React, {Component, createElement} from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';

class DataLoading extends Component {

}

var element = null;

export default function loading(type) {
    if (type === 'show') {
        element = document.createElement('div');
        element.className = 'loading-wraper';
        document.body.appendChild(element);
        render(<div className="loader"></div>, element);
    } else if (element && type === 'hide') {
        document.body.removeChild(element);
    }
}