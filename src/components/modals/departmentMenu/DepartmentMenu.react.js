import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import EventListener from 'fbjs/lib/EventListener';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import $ from 'jquery';
import linq from 'Linq';

class DepartementItem extends Component {
    static PropTypes = {
        dw_data: PropTypes.array.isRequired,
        bm_data: PropTypes.array.isRequired,
        hoverId: PropTypes.string,
        onSelectDw: PropTypes.func,
        onSelectBm: PropTypes.func,
        onItemHover: PropTypes.func,
        scrollBox: PropTypes.element
    }
    

    constructor(props) {
        super(props);
        
        this.state = {
            selectedDw: -1,
            selectedDwmc: '',
            selectedBm: -1,
            selectedBmmc: '',
            szk: '',
            scrollTo: null,
            hoverable: true
        }
    }
    componentDidMount() {
        this.setListeners();
    }
    componentWillUnmount() {
        this.cleanListeners();
    }
    componentDidUpdate() {
        this.scrollTo();
    }
    setListeners() {
        this.cleanListeners();
        this.listeners = [
          EventListener.listen(document, 'mousemove', this.handleMouseMove.bind(this))
        ];
    }    

    cleanListeners() {
        if (this.listeners) {
          this.listeners.forEach((listener) => listener.remove());
          this.listeners = null;
        }
    }
    handleMouseMove() {
        this.setState({'hoverable': true});
    }

    scrollTo()  {
        const { scrollTo } = this.state;
        const { scrollBox } = this.props
         if (scrollTo) {
           setTimeout(() => {
             var scrollTop = $(scrollBox).scrollTop() + $(scrollTo).position().top;
             $(scrollBox).scrollTop(scrollTop);
             this.setState({scrollTo: null});
           }, 10);  
        }
    }

    renderDw() {
        const { dw_data, hoverId } = this.props;
        const { selectedDw, szk } = this.state;
        if (dw_data.length <= 0) {
          return (
            <li className="results__item results__item--suggestion row">
              <FormattedHTMLMessage id="modal.department.notFound" />
              <button className="button button--rised hide">Create new dialog</button>
            </li>
          )
        }
    
        return dw_data.map((result, index) => {
          const itemId = result.id + result.szk;
          const selected = (selectedDw + szk) === itemId;
          const hover = hoverId === itemId;
          const resultClassName = classnames('results__item row', {
            'results__item--active': hover,
            'results__item--open': selected
          });
        //   const iconClassName = classnames('material-icons icon', hover ? 'icon--blue' : 'icon--blue');
    
          return (
            <li
              className="results__item__dw"
              style={{'position': 'relative'}}
              key={`r${index}`}>
              <div className={resultClassName} 
              onClick={(event) => this.dwSelect(result.id, result.mc, result.szk, event)}
              onMouseOver={this.handleMouseOver.bind(this, result.id, result.szk)}>
                <div className="title col-xs">
                    {result.mc}
                    {/* {result.mc} <i className={ iconClassName }>business</i> */}
                </div>
                <div className="arrow"></div>
              </div>
              <div className="children-box">
              { selected ? this.renderBm(result.id, result.szk, -1) : null }
              </div>
            </li>
          );
        });
      }

    renderBm(dwId, szk1, parentId) {
        const { bm_data, hoverId } = this.props;
        const { selectedBm, szk} = this.state;

        let results = linq.from(bm_data).where('$.dwid.trim() == "' + dwId + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk1 + '"').orderBy('$.wzh').toArray();
    
        if (results.length <= 0) {
            return null;
        }
    

        return results.map((result, index) => {
            const itemId = result.id + result.szk;
            const selected = (selectedBm + szk) === itemId;
            const hover = hoverId === itemId;
            const resultClassName = classnames('results__item row', {
            'results__item--active': hover,
            'results__item--selected': selected
            });

            return (
                <div key={result.id + result.szk} className="results__item__bm">
                    <div
                    className={resultClassName} key={`r${index}`}
                    onClick={() => this.bmSelect(result.id, result.mc)}
                    onMouseOver={this.handleMouseOver.bind(this, result.id, result.szk)}>
                    <div className="title col-xs">
                        {result.mc}
                    </div>
                    </div>
                    <div className="children-box">
                    {this.renderBm(dwId, szk1, result.id)}
                    </div>
                </div>
            );
        });
    }
    dwSelect(dwid, dwmc, szk, event) {
        const { selectedDw, selectedDwmc } = this.state;
        const { onSelectDw } = this.props;
        var hoverable = false;
        var scrollTo = $(event.target).parents('li');
        if (selectedDw === dwid && selectedDwmc === dwmc) {
          dwid = '';
          dwmc = '';
          szk = '';
          hoverable = true;
          scrollTo = null;
        }
        this.setState({ 
          selectedDw: dwid,
          selectedDwmc: dwmc, 
          selectedBm: '',
          selectedBmmc: '',
          scrollTo,
          szk,
          hoverable
        });
        onSelectDw && onSelectDw({selectedDwmc: dwmc});
    }

    bmSelect(bmid, bmmc) {
        const { onSelectBm } = this.props;
        const { selectedDw, selectedDwmc, szk} = this.state;
        var data = {
            selectedBm: bmid, 
            selectedBmmc: bmmc
        }
        this.setState(data);
        onSelectBm && onSelectBm({selectedDw, selectedDwmc, szk, ...data});
    }

    handleMouseOver(id, szk) {
        const { onItemHover } = this.props;
        const { hoverable } = this.state;
        var hoverId = id + szk;
        hoverable && onItemHover && onItemHover(hoverId);
    }

    render() {
        return (
            <ul className="department-menu">
                { this.renderDw() }
            </ul>
        );
    }
}
export default DepartementItem;