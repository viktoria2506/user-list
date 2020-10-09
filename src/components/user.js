import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

import Address from './address.js';
import Company from './company.js';
import Info from './user-info';


export default class User extends React.Component {
    constructor (props) {
        super(props);

        const { info = {}, address = {}, company = {} } = this.props;

        this.state = {
            currentUser: {
                info,
                address,
                company
            },
            showAddress: false,
            showCompany: false,
            wantEdit:    false
        };

        this.handleClickAddress = this.handleClickAddress.bind(this);
        this.handleClickCompany = this.handleClickCompany.bind(this);
        this.handleChange       = this.handleChange.bind(this);
        this.handleClickEdit    = this.handleClickEdit.bind(this);
        this.handleClickSubmit  = this.handleClickSubmit.bind(this);
    }

    handleClickAddress (e) {
        this.setState({ showAddress: !this.state.showAddress });
        e.preventDefault();
    }

    handleClickCompany (e) {
        this.setState({ showCompany: !this.state.showCompany });
        e.preventDefault();
    }

    handleClickEdit (e) {
        const { currentUser } = this.state;
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        this.setState({ wantEdit: !this.state.wantEdit });

        if (this.state.wantEdit) {
            UserAction.updateUser(newUser);
        }
        e.preventDefault();
    }

    handleChange (e, obj) {
        const { currentUser } = this.state;

        currentUser[obj][e.target.name] = e.target.value;

        if (this.state.wantEdit || this.props.isNewUser) {
            this.setState({ currentUser });
        }
        e.preventDefault();
    }

    handleClickSubmit () {
        const { currentUser } = this.state;
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.addNewUser(newUser);
    }

    render () {
        const { isNewUser }                                       = this.props;
        const { showAddress, showCompany, wantEdit, currentUser } = this.state;
        let buttonAddress                                         = '';
        let buttonCompany                                         = '';

        if (isNewUser) {
            buttonAddress = `${showAddress ? 'Remove' : 'Add'} Address`;
            buttonCompany = `${showCompany ? 'Remove' : 'Add'} Company`;
        }
        else {
            buttonAddress = `${showAddress ? 'Hide' : 'Show'} Address`;
            buttonCompany = `${showCompany ? 'Hide' : 'Show'} Company`;
        }

        return (
            <form className="UserInfo">
                <Info info={currentUser.info} onChange={this.handleChange}/>
                <button className="ButtonAddDetails" onClick={this.handleClickAddress}>
                    {buttonAddress}
                </button>
                {
                    showAddress &&
                    (
                        <Address address={currentUser.address} onChange={this.handleChange}/>
                    )
                }
                <button className="ButtonAddDetails" onClick={this.handleClickCompany}>
                    {buttonCompany}
                </button>
                {
                    showCompany &&
                    (
                        <Company company={currentUser.company} onChange={this.handleChange}/>
                    )
                }

                {
                    isNewUser ? <button className="ButtonAddUser" onClick={this.handleClickSubmit}>
                               Submit
                             </button>
                           : <button className="ButtonEdit" onClick={this.handleClickEdit}>
                               {wantEdit ? 'Save' : 'Edit'}
                             </button>
                }
            </form>
        );
    }
}
