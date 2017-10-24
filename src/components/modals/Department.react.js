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
      hoverId: '',
      selectedDw: '',
      selectedBm: '',
      selectedYhIndex: 0,
      szk: '',
      selectedDwmc: '',
      selectedBmmc: '',
      hoverable: true,
      scrollTo: null,
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
    this.scrollTo();
  }
  scrollTo()  {
   const { scrollTo } = this.state;
    if (scrollTo) {
      setTimeout(() => {
        var scrollTop = $(this.refs.bms).scrollTop() + $(scrollTo).position().top;
        $(this.refs.bms).scrollTop(scrollTop);
        this.setState({scrollTo: null});
      }, 10);  
    }
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

  handleClose() {
    DepartmentActionCreators.hide();
  }


  handleDialogSelect(peer) {
    const peerStr = PeerUtils.peerToString(peer);
    history.push(`/im/${peerStr}`);
    this.handleClose();
  }

  dwSelect(dwid, dwmc, szk, event) {
    const { selectedDw, selectedDwmc } = this.state;
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
  }

  bmSelect(bmid, szk, bmmc) {
    this.setState({ 
      selectedBm: bmid, 
      selectedBmmc: bmmc, 
      selectedYhIndex: 0}
    );
  }

  
  handleScroll(top) {
    findDOMNode(this.refs.results).scrollTop = top;

    Console.log('scroll--------');
  }


  renderDw() {
    const { dw_data, selectedDw, hoverId, szk, hoverable } = this.state;
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
      const iconClassName = classnames('material-icons icon', hover ? 'icon--white' : 'icon--blue');

      return (
        <li
          style={{'position': 'relative'}}
          key={`r${index}`}>
          <div className={resultClassName} 
          onClick={(event) => this.dwSelect(result.id, result.mc, result.szk, event)}
          onMouseOver={() => { hoverable && this.setState({ hoverId: result.id + result.szk })}}>
            <div className="title col-xs">
              {result.mc} <i className={ iconClassName }>business</i>
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

  renderYh() {
    const { selectedYhIndex, yh_data, selectedBm, selectedDw, szk } = this.state;
    let results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
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

  renderBm(dwId, szk1, parentId) {
    const { bm_data, selectedBm, hoverId, szk, hoverable } = this.state;

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
        <div key={result.id + result.szk} className="results__item__bm" style={{ paddingLeft: '20px' }}>
          <div
            className={resultClassName} key={`r${index}`}
            onClick={() => this.bmSelect(result.id, result.szk, result.mc)}
            onMouseOver={() => {hoverable && this.setState({ hoverId: result.id + result.szk})}}>
            <div className="title col-xs">
              {result.mc}
            </div>
          </div>
          {this.renderBm(dwId, szk1, result.id)}
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

    const { selectedDw, a } = this.state;
      return (
        <Modal
          overlayClassName="modal-overlay"
          className="modal"
          onRequestClose={this.handleClose}
          isOpen>
          <div>{a}</div>

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
