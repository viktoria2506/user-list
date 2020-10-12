import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

import Address from './address.js';
import Company from './company.js';
import Info from './user-info';
import FormErrors from './form-errors';


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
            formErrors:  { name: '', email: '', phone: '' },
            valid:       {
                email: true,
                name:  true,
                phone: true,
                form:  false,
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
        const { currentUser, wantEdit } = this.state;

        if (wantEdit) {
            const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

            UserAction.updateUser(newUser);
        }
        this.setState({ wantEdit: !wantEdit });
        e.preventDefault();
    }

    validateField (fieldName, value) {
        let { formErrors, valid } = this.state;

        switch (fieldName) {
            case 'name':
                valid.name      = value.length > 0;
                formErrors.name = valid.name ? '' : ' cannot be empty';
                break;
            case 'phone':
                valid.phone      = value.length > 0;
                formErrors.phone = valid.phone ? '' : ' cannot be empty';
                break;
            case 'email':
                valid.email      = value.match(/^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i);
                formErrors.email = valid.email ? '' : ' is invalid';
                break;
            default:
                break;
        }
        valid.form = valid.email && valid.name && valid.phone;
        this.setState({
            formErrors: formErrors,
            valid:    valid
        });
    }


    handleChange (e, obj) {
        const { currentUser, wantEdit } = this.state;
        const { isNewUser }             = this.props;

        if (wantEdit || isNewUser) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[obj][name] = value;
            this.setState({ currentUser }, () => {
                this.validateField(name, value);
            });
        }
        e.preventDefault();
    }

    handleClickSubmit () {
        const { currentUser } = this.state;
        const newUser         = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.addNewUser(newUser);
    }

    render () {
        const { isNewUser } = this.props;
        const {
                  showAddress,
                  showCompany,
                  wantEdit,
                  currentUser,
                  valid,
                  formErrors
              }             = this.state;
        let buttonAddress   = '';
        let buttonCompany   = '';

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
                <FormErrors formErrors={formErrors}/>
                <Info info={currentUser.info}
                      valid={valid}
                      onChange={this.handleChange}/>
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
                    isNewUser ?
                    <button className="ButtonAddUser" disabled={!this.state.valid.form}
                            onClick={this.handleClickSubmit}>Submit</button> :
                    (
                        <button className="ButtonEdit" disabled={!this.state.valid.form && wantEdit}
                                onClick={this.handleClickEdit}>
                            {wantEdit ? 'Save' : 'Edit'}
                        </button>
                    )

                }
            </form>
        );
    }
}
