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
            hoverable: true,
            innerHoverId: ''
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
        const { selectedDw, szk, innerHoverId } = this.state;
        var _hoverId = hoverId === undefined ? innerHoverId : hoverId;
        if (dw_data && dw_data.length <= 0) {
          return (
            <li className="results__item--suggestion row">
              <FormattedHTMLMessage id="modal.department.notFound" />
              <button className="button button--rised hide">Create new dialog</button>
            </li>
          )
        }
    
        return dw_data.map((result, index) => {
          const itemId = result.id + result.szk;
          const selected = (selectedDw + szk) === itemId;
          const hover = _hoverId === itemId;
          const resultClassName = classnames('results__item row', {
            'results__item--active': hover,
            'results__item--open': selected
          });
        //   const iconClassName = classnames('material-icons icon', hover ? 'icon--blue' : 'icon--blue');
    
          return (
            <li
              className="results__dw"
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
        const { selectedBm, szk, innerHoverId} = this.state;
        var _hoverId = hoverId === undefined ? innerHoverId : hoverId;

        let results = linq.from(bm_data).where('$.dwid.trim() == "' + dwId + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk1 + '"').orderBy('$.wzh').toArray();
    
        if (results.length <= 0) {
            return null;
        }
    

        return results.map((result, index) => {
            const itemId = result.id + result.szk;
            const selected = (selectedBm + szk) === itemId;
            const hover = _hoverId === itemId;
            const resultClassName = classnames('results__item row', {
            'results__item--active': hover,
            'results__item--selected': selected
            });

            return (
                <div key={result.id + result.szk} className="results__bm">
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
        const { onSelectDw, bm_data } = this.props;
        var hoverable = false,
            _dwid = '',
            _dwmc = '',
            _szk = '',
            _bmid = '',
            _bmmc = '',
            _hoverable = true,
            _scrollTo = null; 
        if (selectedDw !== dwid || selectedDwmc !== dwmc) {
            console.log('open');
            var results = linq.from(bm_data).where('$.dwid.trim() == "' + dwid + '" && $.fid.trim() == "-1" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();
            _dwid = dwid;
            _dwmc = dwmc;
            _szk = szk;
            _bmid = results.length > 0 ? results[0].id : '';
            _bmmc = results.length > 0 ? results[0].title : '';
            _hoverable = false;
            _scrollTo = $(event.target).parents('li');
        }
        this.setState({ 
          selectedDw: _dwid,
          selectedDwmc: _dwmc, 
          selectedBm: _bmid,
          selectedBmmc: _bmmc,
          scrollTo: _scrollTo,
          szk: _szk,
          hoverable: _hoverable
        });
        onSelectDw && onSelectDw({
            selectedDw: _dwid,
            selectedDwmc: _dwmc, 
            selectedBm: _bmid,
            selectedBmmc: _bmmc,
            szk: _szk
        });
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
        if (onItemHover === undefined) {
            this.setState({innerHoverId: hoverId});
        }
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