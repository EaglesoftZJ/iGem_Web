import React, { Component, Children, PropTypes } from 'react';
import classnames from 'classnames';
import $ from 'jquery';

class Tab extends Component {
    static PropTypes = {
        tabList: PropTypes.array.isRequired,
        defaultIndex: PropTypes.number
    }

    constructor(props) {
        super(props);

        this.state = {
            showIndex: 0,
            lineWidth: 0,
            lineLeft: 0
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        this.initTab();
    }

    renderTab() {
        const { tabList } = this.props;
        const { showIndex } = this.state;
        return tabList.map((item, index) => {
            var className = classnames('tab-top-item', {
                'tab-top-item__active': showIndex === index
            });
            return <a href="javascript:;" target="self" key={ index } className={ className } onClick={this.selectTab.bind(this, index)}>{ item }</a>
        })
    }
    
    renderLine() {
        const { lineWidth, lineLeft } = this.state;
        var style = {width: lineWidth + 'px', left: lineLeft + 'px'};
        return <div className="tab-top-line" style={style}></div>
    }

    renderChildren() {
        const { children } = this.props;
        const { showIndex } = this.state;
        return Children.map(children, function(item, index) {
            var className = classnames('tab-con-item', {
                'tab-con-item__show': showIndex === index
            })
            return <div className={ className }>{ item }</div>
        })
    }
    initTab() {
        const { defaultIndex } = this.props;
        const { showIndex } = this.state;
        var index = showIndex;
        if (defaultIndex !== undefined) {
            index = defaultIndex;
        }
        this.selectTab(index);
    }
    selectTab(index) {
        const { tabList } = this.props;
        if (tabList.length - 1 < index || index < 0) {
            return false;
        }
        var $node = $(this.refs.top).find('.tab-top-item').eq(index);
        var lineWidth = $node.outerWidth();
        var lineLeft = $node.position().left;
        this.setState({'showIndex': index, lineWidth, lineLeft});
    }
    render() {
        return (
           <div className="tab">
               <div className="tab-top" ref="top">
                   { this.renderTab() }
                   { this.renderLine() }
                </div>
                <div className="tab-con">
                    { this.renderChildren() }
                </div>
            </div>
        );
    }
}
export default Tab;