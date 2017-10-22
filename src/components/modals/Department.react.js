/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Container } from 'flux/utils';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
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
      selectedBm: '',
      selectedYhIndex: 0,

      szk: '',

      selectedDwmc: '',
      selectedBmmc: ''
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

  dwSelect(dwid, dwmc, szk) {
    this.setState({ selectedDw: dwid ,selectedDwmc: dwmc, szk: szk });
  }

  bmSelect(bmid, bmmc) {
    this.setState({ selectedBm: bmid, selectedBmmc: bmmc, selectedYhIndex: 0});
  }

  
  handleScroll(top) {
    findDOMNode(this.refs.results).scrollTop = top;

    Console.log('scroll--------');
  }


  renderDw() {
    const { selectedIndex, dw_data } = this.state;
    if (dw_data.length <= 0) {
      return (
        <li className="results__item results__item--suggestion row">
          <FormattedHTMLMessage id="modal.department.notFound" values={{ query }} />
          <button className="button button--rised hide">Create new dialog {query}</button>
        </li>
      )
    }

    return dw_data.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': selectedIndex === index
      });

      return (
        <li
          className={resultClassName} key={`r${index}`}
          onClick={() => this.dwSelect(result.id, result.mc, result.szk)}
          onMouseOver={() => this.setState({ selectedIndex: index })}>

          <div className="title col-xs">
            {result.mc}
          </div>
        </li>
      );
    });
  }

  renderYh() {
    const { selectedYhIndex, yh_data, selectedBm, selectedDw, szk } = this.state;
    if (selectedBm.length <= 0) {
      return (
        <li className="results__item results__item--suggestion row">
          <FormattedHTMLMessage id="modal.department.notFound" />
          <button className="button button--rised hide">Create new dialog </button>
        </li>
      )
    }

    let results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" &&' + '$.szk == "' + szk +'"').orderBy('$.wzh').toArray();
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

  renderBm(parentId, tier) {
    const { bm_data, selectedDw, selectedBmIndex, selectedBmTier, szk } = this.state;

    let results = linq.from(bm_data).where('$.dwid.trim() == "' + selectedDw + '" && $.fid.trim() == "' + parentId + '" && $.szk ==' + '"' + szk + '"').orderBy('$.wzh').toArray();
    if (results.length <= 0) {
      return null;
    }

    return results.map((result, index) => {
      const resultClassName = classnames('results__item row', {
        'results__item--active': selectedBmIndex === tier + index
      });

      return (
        <div key={result.id + result.szk} style={{ paddingLeft: '20px' }}>
          <div
            className={resultClassName} key={`r${index}`}
            onClick={() => this.bmSelect(result.id, result.mc)}
            onMouseOver={() => this.setState({ selectedBmIndex: (tier + index ), selectedBmTier: tier })}>

            <div className="title col-xs">
              {result.mc}
            </div>

          </div>
          {this.renderBm(result.id, (tier + index + 1) * 20)}
        </div>

      );
    });

  }

  

  renderHeader() {
    const { selectedDw, selectedDwmc, selectedBmmc } = this.state;

    if (selectedDw.length <= 0) {
      return (
        <header className="header">
          <div className="pull-left"><FormattedMessage id="modal.department.title" /></div>
          <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.handleClose()}>关闭</strong></div>
        </header>
      );
    }
    
    return (
      <header className="header">
        <div className="pull-left"><strong>{selectedDwmc}-{selectedBmmc}</strong></div>
        <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.handleClose()}>关闭</strong></div>
        <div className="pull-right" style={{cursor: 'Pointer'}}><strong onClick={() => this.setState({ selectedDw: '', selectedBm: '', selectedDwmc: '', selectedBmmc: '' })}>返回</strong></div>
      </header>
    );
  }

 

  render() {

    const { selectedDw } = this.state;

    if (selectedDw.length <= 0) {
      return (
        <Modal
          overlayClassName="modal-overlay"
          className="modal"
          onRequestClose={this.handleClose}
          isOpen>

          <div className="department">
            <div className="modal__content">

              {this.renderHeader()}

              <ul className="dwResults" ref="results">
                {this.renderDw()}
              </ul>

            </div>
          </div>

        </Modal>
      );
    } else {
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
                <div className="bmResults" ref="bms">
                  {this.renderBm('-1', 0)}
                </div>

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
}

export default Container.create(Department, { pure: false });
