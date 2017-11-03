/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import { FormattedMessage } from 'react-intl';
import fuzzaldrin from 'fuzzaldrin';
import classnames from 'classnames';
import { CreateGroupSteps } from '../../../constants/ActorAppConstants';

import CreateGroupActionCreators from '../../../actions/CreateGroupActionCreators';

import DepartmentStore from '../../../stores/DepartmentStore';
import DialogStore from '../../../stores/DialogStore';

import DepartmentMenu from '../departmentMenu/DepartmentMenu.react';
import ContactItem from '../../common/ContactItem.react';
import TextField from '../../common/TextField.react';
import Tab from '../../common/Tab.react';
import $ from 'jquery';
import linq from 'Linq';

class CreateGroupForm extends Component {
  static contextTypes = {
    intl: PropTypes.object
  };
  static PropTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    search: PropTypes.string,
    step: PropTypes.string,
    members: PropTypes.array,
    selectedUserIds: PropTypes.object,
    onContactToggle: PropTypes.func,
    handleNameChange: PropTypes.func,
    handleSearchChange: PropTypes.fuc,
    handleSubmit: PropTypes.fuc,
    handleDelete: PropTypes.fuc
  }

  static getStores() {
    return [DepartmentStore];
  }

  static calculateState() {
    let res = DepartmentStore.getState();
    return {
      dw_data: linq.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data,
      peer: DialogStore.getCurrentPeer()
    };
  }

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      selectedDw: '',
      selectedDwmc: '',
      selectedBm: '',
      selectedBmmc: '',
      szk: '',
      error: '',
      nameError: '',
      shouldScroll: false,
      dwAll: false,
    }
    
    this.onContactToggle = this.onContactToggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.refs.name.focus();
  }
  componentDidUpdate() {
    this.handleUpdate();
  }

  handleUpdate() {
    const { shouldScroll } = this.state;
    console.log('shouldScroll', shouldScroll);
    if (shouldScroll) {
      setTimeout(() => {
        $(this.refs.select_con).scrollTop(10000);
        this.setState({shouldScroll: false});
      }, 100);
    }
  }

  getContacts() {
    const { yh_data, selectedBm, selectedDw, szk, dwAll } = this.state;
    const { search } = this.props;
    let results = null;
    if (!dwAll) {
      results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    } else {
      results = linq.from(yh_data).where('$.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();
    }

    if (!search) {
      return results;
    }

    if (search === "*") {
      return yh_data.slice(0, 300);
    }
    
    return fuzzaldrin.filter(yh_data, search, {
      key: 'xm'
    });
  }

  renderAll() {
    const contacts = this.getContacts();
    if (!contacts.length) {
      return  (
        <div className="contacts__list__item contacts__list__item--empty text-center">
          <FormattedMessage id="invite.notFound"/>
        </div>
      );
    }
    return this.handleName('all', contacts);
  }

  renderContacts() {
    const contacts = this.getContacts();
    if (!contacts.length) {
      return null;
    }
    return contacts.map((contact, i) => this.handleName('item', contact));
  }

  handleName(type, contact) {
    const { selectedUserIds, members } = this.props;
    // console.log(selectedUserIds, 'selectedUserIds');
    var isSelected = false;
    var isMember = false;
    var contacts = null;
    var set = null;
    if (members) {
      set = new Set(linq.from(members).select('$.peerInfo.peer.id.toString()').toArray());
    }
    if (type === 'item') {
      isSelected = selectedUserIds.has(contact.IGIMID);
      isMember = set && set.has(contact.IGIMID);
      contacts = [contact];
    } else {
      var arr = contact.filter((item) => {
        return !selectedUserIds.has(item.IGIMID) && !(set && set.has(item.IGIMID));
      })
      isSelected = arr.length > 0 ? false : true;
      contacts = contact;
    }
    
    const icon = isSelected || isMember ? 'check_box' : 'check_box_outline_blank';
  
    var name = type === 'item' ? contact.xm + (contact.zwmc ? ` (${contact.zwmc})` : '') : '全选';
    var key = type === 'item' ? contact.IGIMID : 'all';
    var itemClassName = classnames('group-name-item', icon, {'disabled': isMember});

    return (
      <div className={ itemClassName } key={ key } onClick={() => this.onContactToggle(type, contacts, set, !isSelected)}>
        <a className="material-icons">
          {icon}
        </a>
        <span title={ name }>{ name }</span>
      </div>
    );
  }

  onContactToggle(type, contacts, set, isSelected) {
    const { selectedUserIds, onContactToggle } = this.props;
    var userIds = selectedUserIds;
    contacts.forEach((item) => {
      if (!set || !set.has(item.IGIMID)) {
        userIds = isSelected ? userIds.add(item.IGIMID) : userIds.delete(item.IGIMID);
      } 
    });
    isSelected && this.setState({'shouldScroll': true});
    onContactToggle && onContactToggle(userIds);
  }

  handleNameChange(event) {
    event.preventDefault();
    const { handleNameChange } = this.props;
    handleNameChange && handleNameChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { name, selectedUserIds, handleSubmit } = this.props;
    const { peer } = this.state;
    const trimmedName = name.trim();
    console.log('123123123');

    if (trimmedName.length > 0) {
      handleSubmit && handleSubmit(selectedUserIds.toJS(), name, peer);
    } else {
      this.refs.name.focus();
      this.setState({ error: ' ', nameError: 'error' });
    }
  }

  renderDwSelectSize() {
    const { selectedUserIds } = this.props;
    const contacts = this.getContacts();
    var results = contacts.filter((contact, i) => {
      return selectedUserIds.has(contact.IGIMID);
    });
    return results.length;
  }

  renderSelect() {
    const { yh_data } = this.state;
    const { selectedUserIds } = this.props;
    var results = [];
    selectedUserIds.forEach((item) => {
      var result = linq.from(yh_data).where(`$.IGIMID == "${item}"`).toArray();
      result.length > 0 && results.push(result[0]);
    });
    return results.map((item) => {
      return (
        <div key={ item.IGIMID } className="group-name-select-tag">
          <a href="javascript:;" target="_self" className="material-icons delete" onClick={this.handleDelete.bind(this, item)}>clear</a>
          <div className="name">{item.xm} <span style={{'fontSize': 12 + 'px', 'fontWeight': 'normal'}}>{ item.bmmc }</span></div>
          <div className="info" title={ item.dwmc + ' ' + item.bmmc }>{ item.dwmc }</div>
        </div>
      )
    })
  }
  renderGroupNameInput() {
    const { error, nameError } = this.state;
    const { name, handleNameChange } = this.props;
    return (
      <TextField
        className="input__material--wide"
        floatingLabel={<FormattedMessage id={nameError ? 'modal.createGroup.groupName_error' : 'modal.createGroup.groupName'}/>}
        ref="name"
        errorText={error}
        onChange={this.handleNameChange}
        value={name}
        disabled={!handleNameChange} />
    );
  }

  handleSearchChange(event) {
    const { handleSearchChange } = this.props;
    handleSearchChange && handleSearchChange(event.target.value)
  }

  handleDelete(item) {
    const { selectedUserIds, handleDelete } = this.props;
    handleDelete && handleDelete(selectedUserIds.delete(item.IGIMID));
  }


  renderAddUsersButton() {
    const { step, handleClose } = this.props;
    return (
      <div className="button-group">
        <button className="button button--plain--primary" onClick={this.handleSubmit} disabled={step === CreateGroupSteps.CREATION_STARTED}>
          <FormattedMessage id="button.ok"/>
        </button>
        <button className="button button--plain--cancel" onClick={ handleClose }>
          <FormattedMessage id="button.cancel"/>
        </button>
      </div>
    );
  }

  renderUserSearchInput() {
    const { search } = this.props;
    const { intl } = this.context;

    return (
      <div className="small-search">
        <i className="material-icons">search</i>
        <input
          className="input"
          onChange={this.handleSearchChange}
          placeholder={intl.messages['invite.search']}
          type="search"
          value={search}/>
      </div>
    );
  }

  renderSelectedUsersCount() {
    const { selectedUserIds } = this.props;
    return (
      <div className="count">
        <FormattedMessage id="members" values={{ numMembers: selectedUserIds.size }}/>
      </div>
    );
  }

  renderCreateGroupButton() {
    const { step } = this.props;

    if (step !== CreateGroupSteps.CREATION_STARTED) {
      return (
        <button className="button button--lightblue" onClick={this.handleSubmit}>
          <FormattedMessage id="button.createGroup"/>
        </button>
      )
    }

    return (
      <button className="button button--lightblue" disabled>
        <FormattedMessage id="button.createGroup"/>
      </button>
    );
  }
  handleSelectDw(obj) {
    this.setState({...obj, dwAll: false});
  }

  handleSelectBm(obj) {
    this.setState({...obj, dwAll: false});
  }

  handleShowAll(obj) {
    this.setState({...obj, dwAll: true});
  }

  render() {
    const { dw_data, bm_data, selectedDwmc, selectedBmmc } = this.state;
    const { step, search, selectedUserIds } = this.props;
    var result = this.getContacts();
    var props = {
      dw_data,
      bm_data,
      onSelectDw: this.handleSelectDw.bind(this),
      onSelectBm: this.handleSelectBm.bind(this),
      onShowAll: this.handleShowAll.bind(this),
      scrollBox: this.refs.department_con
    }
    var className = classnames('group-name-col group-name-department', {
      'department-forbid': search
    })
    return (
      <form className="group-name">
        <div className="modal__body">
          <div className="input-group">
            {this.renderGroupNameInput()}
            {this.renderUserSearchInput()}
          </div>
          <div className="form-body">
          <div className={className} ref="department">
            <div className="info">{ selectedDwmc ? selectedDwmc : '组织结构' } { selectedBmmc ? '> ' + selectedBmmc : ''}</div>
            <div className="con" ref="department_con">
              <DepartmentMenu {...props}></DepartmentMenu>
              <div className="department-forbid-mc" style={{top: this.refs.department_con ? $(this.refs.department_con).scrollTop() : 0}}></div>
            </div>
          </div>
          <div className="group-name-col group-name-people">
            <div className="info"> { this.renderDwSelectSize() } / {result.length}</div>
            <div className="con">
              <div className="group-name-people-all">
                  { this.renderAll() }
              </div>
              <div className="group-name-people-list">
                { this.renderContacts() }
              </div>
            </div>
          </div>

          <div className="group-name-col group-name-select" ref="select">
              <div className="info">共选择{selectedUserIds.size}人</div>
              <div className="con" ref="select_con">
                { this.renderSelect() }
              </div>
          </div>
        </div>
        </div>

        <footer className="modal__footer text-right">
          {this.renderAddUsersButton()}
        </footer>
      </form>
    );
  }
}

export default Container.create(CreateGroupForm, { pure: false });
