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

import DepartmentMenu from './departmentMenu/DepartmentMenu.react';
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
      selectedYhIndex: -1,
      szk: '',
      selectedDwmc: '',
      selectedBmmc: '',
      hoverable: true,
      scrollTo: null,
      dwAll: false
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
  
  handleScroll(top) {
    findDOMNode(this.refs.results).scrollTop = top;
  }


  renderYh() {
    const { selectedYhIndex, yh_data, hoverId, dwAll, selectedBm, selectedDw, szk } = this.state;
    let results = null;
    if (!dwAll) {
      results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    } else {
      results = linq.from(yh_data).where('$.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    }
    
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
        'results__item--active': hoverId === (result.IGIMID + result.szk)
      });

      return (
        <li
          className={resultClassName} key={`r${index}`}
          onClick={() => this.handleDialogSelect(
            {
              id: parseFloat(result.IGIMID),
              type: 'user',
              key: 'u' + result.IGIMID
            }
          )}
          onMouseOver={() => this.setState({ hoverId: (result.IGIMID + result.szk) })}>
          <div className="title col-xs">
            <div className="hint pull-right"><FormattedMessage id="modal.department.openDialog" /></div>
            {result.xm}{result.zwmc ? '(' + result.zwmc +')' : ''}
          </div>
        </li>
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

  handleSelectDw(obj) {
    this.setState({...obj, dwAll: false});
  }

  handleSelectBm(obj) {
    this.setState({...obj, dwAll: false});
  }

  handleItemHover(hoverId) {
    this.setState({hoverId});
  }

  handleShowAll(obj) {
    this.setState({...obj, dwAll: true});
  }

 

  render() {
      const { dw_data, bm_data, hoverId} = this.state;
      var props = {
        dw_data,
        bm_data,
        hoverId,
        onSelectDw: this.handleSelectDw.bind(this),
        onSelectBm: this.handleSelectBm.bind(this),
        onItemHover: this.handleItemHover.bind(this),
        onShowAll: this.handleShowAll.bind(this),
        scrollBox: this.refs.bms
      }
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
                <div className="dw_bm_Results" ref="bms" style={{position: 'relative'}}>
                  <DepartmentMenu {...props}></DepartmentMenu>
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

export default Container.create(Department, { pure: false });
