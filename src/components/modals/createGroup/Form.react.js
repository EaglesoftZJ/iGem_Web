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
import PeopleStore from '../../../stores/PeopleStore';
import CreateGroupStore from '../../../stores/CreateGroupStore';

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

  static getStores() {
    return [CreateGroupStore, PeopleStore, DepartmentStore];
  }

  static calculateState() {
    let res = DepartmentStore.getState();
    return {
      name: CreateGroupStore.getGroupName(),
      search: CreateGroupStore.getGroupSearch(),
      step: CreateGroupStore.getCurrentStep(),
      selectedUserIds: CreateGroupStore.getSelectedUserIds(),
      dw_data: linq.from(res.dw_data).where('$.id!=="dw017"').orderBy('$.wzh').toArray(),
      bm_data: res.bm_data,
      yh_data: res.yh_data
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
    }
    
    this.onContactToggle = this.onContactToggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
  }

  componentDidMount() {
    this.refs.name.focus();
  }
  componentDidUpdate() {
    this.handleUpdate();
  }

  handleUpdate() {
    const { shouldScroll } = this.state;
    if (shouldScroll) {
      $(this.refs.select).scrollTop(100000);
      this.setState({shouldScroll: false});
    }
  }

  getContacts() {
    const { yh_data, search, selectedBm, selectedDw, szk } = this.state;

    let results = linq.from(yh_data).where('$.bmid.trim() == "' + selectedBm + '" && $.dwid.trim() == "' + selectedDw + '"&& $.szk == "' + szk +'"').orderBy('$.wzh').toArray();

    if (!search) {
      return results;
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
    const { selectedUserIds } = this.state;
    // console.log(selectedUserIds, 'selectedUserIds');
    var isSelected = false;
    var contacts = null;
    if (type === 'item') {
      isSelected = selectedUserIds.has(contact.IGIMID);
      contacts = [contact];
    } else {
      var arr = contact.filter((item) => {
        return !selectedUserIds.has(item.IGIMID);
      })
      isSelected = arr.length > 0 ? false : true;
      contacts = contact;
    }
    
    const icon = isSelected ? 'check_box' : 'check_box_outline_blank';

    var name = type === 'item' ? contact.xm + (contact.zwmc ? ` (${contact.zwmc})` : '') : '全选';
    var key = type === 'item' ? contact.IGIMID : 'all';
    var itemClassName = classnames('group-name-item', icon);

    return (
      <div className={ itemClassName } key={ key } onClick={() => this.onContactToggle(type, contacts, !isSelected)}>
        <a className="material-icons">
          {icon}
        </a>
        <span title={ name }>{ name }</span>
      </div>
    );
  }

  onContactToggle(type, contacts, isSelected) {
    const { selectedUserIds } = this.state;
    var userIds = selectedUserIds;
    contacts.forEach((item) => {
      userIds = isSelected ? userIds.add(item.IGIMID) : userIds.delete(item.IGIMID);
    });
    isSelected && this.setState({'shouldScroll': true});
    CreateGroupActionCreators.setSelectedUserIds(userIds);
  }

  handleNameChange(event) {
    event.preventDefault();

    CreateGroupActionCreators.setGroupName(event.target.value);
    this.setState({ error: '', nameError: '' });
  }

  handleCreateGroup(event) {
    event.preventDefault();

    const { name, selectedUserIds } = this.state;
    console.log('name', name);
    const trimmedName = name.trim();

    if (trimmedName.length > 0) {
      CreateGroupActionCreators.createGroup(name, null, selectedUserIds.toJS());
    } else {
      this.refs.name.focus();
      this.setState({ error: ' ', nameError: 'error' });
    }
  }

  renderSelect() {
    const { yh_data, selectedUserIds } = this.state;
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
    const { name, error, nameError } = this.state;
    return (
      <TextField
        className="input__material--wide"
        floatingLabel={<FormattedMessage id={nameError ? 'modal.createGroup.groupName_error' : 'modal.createGroup.groupName'}/>}
        ref="name"
        errorText={error}
        onChange={this.handleNameChange}
        value={name}/>
    );
  }

  handleSearchChange(event) {
    CreateGroupActionCreators.setGroupSearch(event.target.value);
  }

  handleDelete(item) {
    const { selectedUserIds } = this.state;
    CreateGroupActionCreators.setSelectedUserIds(selectedUserIds.delete(item.IGIMID));
  }

  renderAddUsersButton() {
    const { step } = this.state;
    return (
      <div className="button-group">
        <button className="button button--plain--primary" onClick={this.handleCreateGroup} disabled={step === CreateGroupSteps.CREATION_STARTED}>
          <FormattedMessage id="button.ok"/>
        </button>
        <button className="button button--plain--cancel" onClick={() => CreateGroupActionCreators.close()}>
          <FormattedMessage id="button.cancel"/>
        </button>
      </div>
    );
  }

  renderUserSearchInput() {
    const { search } = this.state;
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
    const { selectedUserIds } = this.state;
    return (
      <div className="count">
        <FormattedMessage id="members" values={{ numMembers: selectedUserIds.size }}/>
      </div>
    );
  }

  renderCreateGroupButton() {
    const { step } = this.state;

    if (step !== CreateGroupSteps.CREATION_STARTED) {
      return (
        <button className="button button--lightblue" onClick={this.handleCreateGroup}>
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
    this.setState({...obj});
  }

  handleSelectBm(obj) {
    this.setState({...obj});
  }

  render() {
    console.log('department', this.refs.department);
    const { step, dw_data, bm_data, search} = this.state;
    var props = {
      dw_data,
      bm_data,
      onSelectDw: this.handleSelectDw.bind(this),
      onSelectBm: this.handleSelectBm.bind(this),
      scrollBox: this.refs.department
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
            <DepartmentMenu {...props}></DepartmentMenu>
            <div className="department-forbid-mc" style={{top: this.refs.department ? $(this.refs.department).scrollTop() : 0}}></div>
          </div>
          <div className="group-name-col group-name-people">
            <div className="group-name-people-all">
            { this.renderAll() }
            </div>
            <div className="group-name-people-list">
            { this.renderContacts() }
            </div>
          </div>

          <div className="group-name-col group-name-select" ref="select">
            { this.renderSelect() }
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
