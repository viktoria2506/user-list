import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import UserStore from '../stores/user-store';
import classNames from 'classnames';
import EVENT_TYPE from '../stores/event-type';
import ERRORS from '../errors';

import Address from './address.js';
import Company from './company.js';
import Info from './info';
import FormErrors from './duplicate-error';
import DuplicateError from './duplicate-error';

const MATCH_PHONE     = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL     = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;
const FIELD_NAMES = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    duplicateUser: 'duplicateUser'
}

export default class User extends React.Component {
    constructor (props) {
        super(props);

        const { info = {}, address = {}, company = {} } = this.props;

        this.state = {
            currentUser:  {
                info,
                address,
                company
            },
            formErrors:   {
                name:          '',
                email:         '',
                phone:         '',
            },
            showUserError: true,
            showAddress:  false,
            showCompany:  false,
            wantEdit:     false,
            addDuplicate: false
        };
    }

    _validateField (fieldName, value) {
        switch (fieldName) {
            case FIELD_NAMES.name:
                return value ? '' : ERRORS.nameInvalid;
            case FIELD_NAMES.phone:
                return value && MATCH_PHONE.test(value) ? '' : ERRORS.phoneInvalid;
            case FIELD_NAMES.email:
                return value && MATCH_EMAIL.test(value) ? '' : ERRORS.emailInvalid;
            default:
                return '';
        }
    }

    _validateFields (user) {
        return {
            [FIELD_NAMES.name]:  this._validateField(FIELD_NAMES.name, user.name),
            [FIELD_NAMES.phone]: this._validateField(FIELD_NAMES.phone, user.phone),
            [FIELD_NAMES.email]: this._validateField(FIELD_NAMES.email, user.email),
        };
    }

    _handleClickAddress = e => {
        this.setState({ showAddress: !this.state.showAddress });
        e.preventDefault();
    };

    _handleClickCompany = e => {
        this.setState({ showCompany: !this.state.showCompany });
        e.preventDefault();
    };

    _handleClickEdit = e => {
        const { currentUser, wantEdit } = this.state;

        if (wantEdit) {
            const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

            UserAction.updateUser(newUser);
        }
        this.setState({ wantEdit: !wantEdit });
        e.preventDefault();
    };

    _handleChange = (e, obj) => {
        let { currentUser, wantEdit, formErrors, showUserError } = this.state;
        let { isNewUser }                         = this.props;

        if (wantEdit || isNewUser) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[obj][name] = value;
            formErrors[name]       = this._validateField(name, value);
            if (name === FIELD_NAMES.name) {
               //showUserError = false;
            }
            this.setState({ currentUser, formErrors, showUserError });
        }
        e.preventDefault();
    };

    _handleClickSubmit = e => {
        const { currentUser, addDuplicate, formErrors } = this.state;
        const newUser                                   = new UserInfo(currentUser.info, currentUser.address, currentUser.company);
        const resultValid                               = this._validateFields(currentUser.info);
        const isUserInfoValid                           = !resultValid[FIELD_NAMES.name] &&
                                                          !resultValid[FIELD_NAMES.phone] &&
                                                          !resultValid[FIELD_NAMES.email];

        if (isUserInfoValid) {
            UserAction.addNewUser(newUser, addDuplicate);
        }
        else {
            formErrors.name  = resultValid[FIELD_NAMES.name];
            formErrors.phone = resultValid[FIELD_NAMES.phone];
            formErrors.email = resultValid[FIELD_NAMES.email];
            this.setState({ formErrors, addDuplicate: !addDuplicate});
        }
        e.preventDefault();
    };

    render () {
        const { isNewUser, duplicateUserId, onChange }     = this.props;
        const {
                  showAddress,
                  showCompany,
                  wantEdit,
                  currentUser,
                  formErrors
              }                 = this.state;
        const isFormFieldsValid = !formErrors.name && !formErrors.email && !formErrors.phone;
        let buttonAddress       = '';
        let buttonCompany       = '';

        if (isNewUser) {
            buttonAddress = `${showAddress ? 'Remove' : 'Add'} Address`;
            buttonCompany = `${showCompany ? 'Remove' : 'Add'} Company`;
        }
        else {
            buttonAddress = `${showAddress ? 'Hide' : 'Show'} Address`;
            buttonCompany = `${showCompany ? 'Hide' : 'Show'} Company`;
        }

        return (
            <form className="UserInfo" id={`${currentUser.info.id}`}>
                <DuplicateError userId={duplicateUserId}/>
                <Info info={currentUser.info}
                      formErrors={formErrors}
                      onChange={this._handleChange}
                      wantEdit={wantEdit}
                      isNewUser={isNewUser}/>
                <button className="ButtonAddDetails" onClick={this._handleClickAddress}>
                    {buttonAddress}
                </button>
                {
                    showAddress &&
                    (
                        <Address address={currentUser.address} onChange={this._handleChange}/>
                    )
                }
                <button className="ButtonAddDetails" onClick={this._handleClickCompany}>
                    {buttonCompany}
                </button>
                {
                    showCompany &&
                    (
                        <Company company={currentUser.company} onChange={this._handleChange}/>
                    )
                }
                {
                    isNewUser ?
                    <button
                        className={classNames({ ButtonAddUser: isFormFieldsValid, ButtonDisabled: !isFormFieldsValid })}
                        disabled={!isFormFieldsValid}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <button className="ButtonEdit" disabled={!isFormFieldsValid && wantEdit}
                                onClick={this._handleClickEdit}>
                            {wantEdit ? 'Save' : 'Edit'}
                        </button>
                    )
                }
            </form>
        );
    }
}
