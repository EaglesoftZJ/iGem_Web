/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Container } from 'flux/utils';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import $ from 'jquery';
import EventListener from 'fbjs/lib/EventListener';
import fuzzaldrin from 'fuzzaldrin';
import Modal from 'react-modal';
import classnames from 'classnames';
import history from '../../utils/history';
import PeerUtils from '../../utils/PeerUtils';

import { KeyCodes } from '../../constants/ActorAppConstants';

import DepartmentActionCreators from '../../actions/DepartmentActionCreators';

import DepartmentStore from '../../stores/DepartmentStore';

import AvatarItem from '../common/AvatarItem.react';

import linq from 'Linq';

const RESULT_ITEM_HEIGHT = 44;
let scrollIndex = 0;

class Department extends Component {
  static getStores() {
    return [DepartmentStore];
  }

  static calculateState() {
    let res = DepartmentStore.getState();
    return {
      dw_data: linq.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      selectedIndex: 0,
      selectedDw: '',
      selectedBmIndex: 0,
      selectedBmTier: 0,
      hoverId: '',
      selectedBm: '',
      selectedYhIndex: 0,

      szk: '',

      selectedDwmc: '',
      selectedBmmc: '',
      scrollTo: -1
    }
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.handleDialogSelect = this.handleDialogSelect.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.setListeners();
  }

  componentWillUnmount() {
    this.cleanListeners();
  }
  componentDidUpdate() {
    // this.scrollTo();
  }
  scrollTo()  {
   const { scrollTo } = this.state;
    if (scrollTo > -1) {
      $(this.refs.bms).scrollTop(scrollTo);
      this.setState({scrollTo: -1})
      debugger;
    }
  }

  setListeners() {
    this.cleanListeners();
    this.listeners = [
      EventListener.listen(document, 'keydown', this.handleKeyDown)
    ];
  }

  cleanListeners() {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  }


  handleClose() {
    DepartmentActionCreators.hide();
  }


  handleDialogSelect(peer) {
    const peerStr = PeerUtils.peerToString(peer);
    history.push(`/im/${peerStr}`);
    this.handleClose();
  }

  dwSelect(dwid, dwmc, szk, event) {
    const {selectedDw, selectedDwmc} = this.state;
    var scrollTop = $(event.target).parents('li').position().top;
    var scrollTo = $(this.refs.bms).scrollTop() + scrollTop;
    if (selectedDw === dwid && selectedDwmc === dwmc) {
      dwid = '';
      dwmc = '';
      szk = '';
    }
    this.setState({ selectedDw: dwid ,selectedBm: '', selectedDwmc: dwmc, selectedBmmc: '', szk: szk, scrollTo });
  }

  bmSelect(bmid, bmmc) {
    this.setState({ selectedBm: bmid, selectedBmmc: bmmc, selectedYhIndex: 0});
  }

  
  handleScroll(top) {
    findDOMNode(this.refs.results).scrollTop = top;

    Console.log('scroll--------');
  }


  renderDw() {
    const { selectedIndex, dw_data, selectedDw, hoverId } = this.state;
    if (dw_data.length <= 0) {
      return (
        <li className="results__item results__item--suggestion row">
          <FormattedHTMLMessage id="modal.department.notFound" />
          <button className="button button--rised hide">Create new dialog</button>
        </li>
      )
    }

    return dw_data.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': hoverId === result.id,
        'results__item--open': selectedDw === result.id
      });
      const childrenStyle = {display: selectedDw === result.id ? 'block' : 'none'};

      return (
        <li
          style={{'position': 'relative'}}
          key={`r${index}`}>
          <div className={resultClassName} 
          onClick={(event) => this.dwSelect(result.id, result.mc, result.szk, event)}
          onMouseEnter={() => this.setState({ hoverId: result.id })}>
            <div className="title col-xs">
              {result.mc}
            </div>
            <div className="arrow"></div>
          </div>
          <div className="children-box">
          { selectedDw === result.id ? this.renderBm(result.id, result.szk, -1) : null }
          </div>
        </li>
      );
    });
  }

  renderYh() {
    const { selectedYhIndex, yh_data, selectedBm, selectedDw, szk } = this.state;
    let results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&&$.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    if (results.length <= 0) {
      return (
        <li className="results__item results__item--suggestion row">
          <FormattedHTMLMessage id="modal.department.notFound" />
          <button className="button button--rised hide">Create new dialog </button>
        </li>
      )
    }
    return results.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': selectedYhIndex === index
      });

      return (
        <li
          className={resultClassName} key={`r${index}`}
          onClick={() => this.handleDialogSelect(
            {
              id: result.IGIMID,
              type: 'user',
              key: 'u' + result.IGIMID
            }
          )}
          onMouseOver={() => this.setState({ selectedYhIndex: index })}>
          <div className="title col-xs">
            <div className="hint pull-right"><FormattedMessage id="modal.department.openDialog" /></div>
            {result.xm}{result.zwmc ? '(' + result.zwmc +')' : ''}
          </div>
        </li>
      );
    });
  }

  renderBm(dwId, szk, parentId) {
    const { bm_data, selectedBm, hoverId } = this.state;

    let results = linq.from(bm_data).where('$.dwid.trim() == "' + dwId + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();
    
    if (results.length <= 0) {
      return null;
    }
    

    return results.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': hoverId === result.id,
        'results__item--selected': selectedBm === result.id
      });

      return (
        <div key={result.id + result.szk} className="results__item__bm" style={{ paddingLeft: '20px' }}>
          <div
            className={resultClassName} key={`r${index}`}
            onClick={() => this.bmSelect(result.id, result.mc)}
            onMouseEnter={() => this.setState({ hoverId: result.id})}>
            <div className="title col-xs">
              {result.mc}
            </div>
          </div>
          {/* {this.renderBm(dwId, szk, result.id)} */}
        </div>

      );
    });

  }

  

  renderHeader() {
    const { selectedDw, selectedDwmc, selectedBmmc } = this.state;

    return (
      <header className="header">
        <div className="pull-left"><strong>{selectedDwmc}{selectedDw.length <= 0 ? <FormattedMessage id="modal.department.title" /> : selectedBmmc && '-' + selectedBmmc}</strong></div>
        <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.handleClose()}>关闭</strong></div>
      </header>
    );
  }

 

  render() {

    const { selectedDw } = this.state;
      return (
        <Modal
          overlayClassName="modal-overlay"
          className="modal"
          onRequestClose={this.handleClose}
          isOpen>

          <div className="department">
            <div className="modal__content">

              {this.renderHeader()}

              <div className="results">
                <ul className="dw_bm_Results" ref="bms" style={{position: 'relative'}}>
                  {this.renderDw()}
                </ul>

                <div className="yhResults" ref="yhs">
                  {this.renderYh()}
                </div>
              </div>



            </div>
          </div>

        </Modal>
      );
  }
}

export default Container.create(Department, { pure: false });
