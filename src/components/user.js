import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import classNames from 'classnames';
import ERRORS from '../errors';

import Address from './address.js';
import Company from './company.js';
import Info from './info';
import DuplicateError from './duplicate-error';

const MATCH_PHONE        = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL        = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;
export const FIELD_NAMES = {
    name:  'name',
    email: 'email',
    phone: 'phone'
};

export default class User extends React.Component {
    constructor (props) {
        super(props);

        const { info = {}, address = {}, company = {} } = this.props;

        this.state = {
            currentUser:       {
                info,
                address,
                company
            },
            unmodifiedUser:    null,
            formErrors:        {
                name:  '',
                email: '',
                phone: ''
            },
            showAddress:       false,
            showCompany:       false,
            wantEdit:          false,
            hasDuplicateError: false
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

    _isUserInfoValid (validInfo) {
        return !validInfo[FIELD_NAMES.name] &&
               !validInfo[FIELD_NAMES.phone] &&
               !validInfo[FIELD_NAMES.email];
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
        let { currentUser, wantEdit, unmodifiedUser } = this.state;

        this.setState({ wantEdit: !wantEdit, unmodifiedUser: unmodifiedUser });
        e.preventDefault();
    };

    _handleChange = (e, type) => {
        let { currentUser, wantEdit, formErrors, hasDuplicateError } = this.state;
        const {isNewUser} = this.props;

        if (wantEdit || isNewUser) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[type][name] = value;
            formErrors[name]       = this._validateField(name, value);
            if (name === FIELD_NAMES.name) {
                hasDuplicateError = false;
            }
            this.setState({ currentUser, formErrors, hasDuplicateError });
        }
        e.preventDefault();
    };

    _handleClickSubmit = e => {
        const { currentUser, hasDuplicateError, formErrors } = this.state;
        const newUser                                        = new UserInfo(currentUser.info, currentUser.address, currentUser.company);
        const resultValid                                    = this._validateFields(currentUser.info);

        if (this._isUserInfoValid(resultValid)) {
            const forceAdding = !!hasDuplicateError;

            UserAction.addNewUser(newUser, forceAdding);
            this.setState({ formErrors, hasDuplicateError: !hasDuplicateError });
        }
        else {
            this.setState({ formErrors: { ...resultValid } });
        }
        e.preventDefault();
    };

    _handleClickUndo = e => {
        const { wantEdit, unmodifiedUser } = this.state;

        this.setState({ wantEdit: !wantEdit, currentUser: unmodifiedUser,  formErrors: {}});
        e.preventDefault();
    };

    _handleClickSave = e => {
        let { currentUser, wantEdit } = this.state;
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser);
        this.setState({ wantEdit: !wantEdit });
        e.preventDefault();
    };
    

    render () {
        const { isNewUser, duplicateUserId } = this.props;
        const {
                  showAddress,
                  showCompany,
                  wantEdit,
                  currentUser,
                  formErrors,
                  hasDuplicateError
              }                              = this.state;
        const isFormFieldsValid              = this._isUserInfoValid(formErrors);
        let buttonAddress                    = '';
        let buttonCompany                    = '';

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
                {hasDuplicateError &&
                 (
                     <DuplicateError userId={duplicateUserId}/>
                 )
                }
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
                    <Address address={currentUser.address} onChange={this._handleChange}/>
                }
                <button className="ButtonAddDetails" onClick={this._handleClickCompany}>
                    {buttonCompany}
                </button>
                {
                    showCompany &&
                    <Company company={currentUser.company} onChange={this._handleChange}/>
                }
                {
                    isNewUser ?
                    <button
                        className={classNames({ ButtonAddUser: isFormFieldsValid, ButtonDisabled: !isFormFieldsValid })}
                        disabled={!isFormFieldsValid}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <button className="ButtonEdit"
                                disabled={!isFormFieldsValid && wantEdit}
                                onClick={wantEdit ? this._handleClickSave : this._handleClickEdit}>
                            {wantEdit ? 'Save' : 'Edit'}
                        </button>
                    )
                }
                {
                    wantEdit &&
                    (
                        <button className="ButtonEdit" onClick={this._handleClickUndo}>Undo</button>
                    )

                }
            </form>
        );
    }
}
