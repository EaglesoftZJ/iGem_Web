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
import QuickSearchStore from '../../stores/QuickSearchStore';

import DepartmentMenu from './departmentMenu/DepartmentMenu.react';
import AvatarItem from '../common/AvatarItem.react';

import linq from 'Linq';

const RESULT_ITEM_HEIGHT = 44;
let scrollIndex = 0;

class DepartmentDetial extends Component {
    static propTypes = {
        hasHeader: PropTypes.bool,
    };

  static getStores() {
    return [DepartmentStore, QuickSearchStore];
  }

  static calculateState() {
    let res = DepartmentStore.getState();
    return {
      dw_data: linq.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      quickSearchData: QuickSearchStore.getState(),
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
    const { selectedYhIndex, yh_data, quickSearchData, hoverId, dwAll, selectedBm, selectedDw, szk } = this.state;
    let results = null;
    if (!dwAll) {
      results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    } else {
      results = linq.from(yh_data).where('$.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    }

    // results = linq.from(results).join(quickSearchData, 'a => parseFloat(a.IGIMID)', 'b => b.peerInfo.peer.id', 'a, b => {...a, ...b}').toArray();
    results = linq.from(results).join(quickSearchData, 'a => parseFloat(a.IGIMID)', 'b => b.peerInfo.peer.id', 'department, user=>{department: department, user: user}').toArray();


    console.log(results, quickSearchData);
    console.log(111, results);
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
        'results__item--active': hoverId === (result.department.IGIMID + result.department.szk)
      });

      return (
        <li
          className={resultClassName} key={`r${index}`}
          onClick={() => this.handleDialogSelect(
            {
              id: parseFloat(result.department.IGIMID),
              type: 'user',
              key: 'u' + result.department.IGIMID
            }
          )}
          onMouseOver={() => this.setState({ hoverId: (result.department.IGIMID + result.department.szk) })}>
          <div className="title col-xs">
            {/* <div className="hint pull-right"><FormattedMessage id="modal.department.openDialog" /></div> */}
            <AvatarItem
              className="group_profile__avatar"
              size="small"
              image={result.user.peerInfo.avatar}
              placeholder={result.user.peerInfo.placeholder}
              title={result.user.peerInfo.title}
              onClick={() => this.onClick(result.user.peerInfo.peer.id)}
            />
            <div className="username" title={result.department.zwmc ? '(' + result.department.zwmc +')' : ''}>{result.department.xm}{result.department.zwmc ? '(' + result.department.zwmc +')' : ''}</div>
          </div>
        </li>
      );
    });
  }

  renderHeader() {
    const { selectedDw, selectedDwmc, selectedBmmc } = this.state;
    const { hasHeader } = this.props;
    if (!hasHeader) {
        return null;
    }

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
      const { dw_data, bm_data, yh_data, hoverId} = this.state;
      var props = {
        dw_data,
        bm_data,
        yh_data,
        hoverId,
        onSelectDw: this.handleSelectDw.bind(this),
        onSelectBm: this.handleSelectBm.bind(this),
        onItemHover: this.handleItemHover.bind(this),
        onShowAll: this.handleShowAll.bind(this),
        scrollBox: this.refs.bms
      }
      return (
        <div className="department-detial">
            {this.renderHeader()}
            <div className="results">
                <div className="dw_bm_Results" ref="bms" style={{position: 'relative'}}>
                    <DepartmentMenu {...props} />
                </div>

                <div className="yhResults" ref="yhs">
                    {this.renderYh()}
                </div>
            </div>
        </div>
      );
  }
}

export default Container.create(DepartmentDetial, { withProps: true });
