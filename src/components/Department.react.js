import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import DepartmentActionCreators from '../actions/DepartmentActionCreators';
import DepartmenDetial from './modals/DepartmentDetial.react';

class Department extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        DepartmentActionCreators.show();
    }
    componentWillUnmount() {
        DepartmentActionCreators.hide();
    }
    render() {
        return (
            <div className="department">
              <DepartmenDetial />
            </div>
        );
    }
}
export default Department;
