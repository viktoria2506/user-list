import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import classNames from 'classnames';
import ERRORS from '../errors';

import Address from './address.js';
import Company from './company.js';
import Info from './info';
import DuplicateError from './duplicate-error';
import Edit from './edit';

export const FIELD_NAMES = {
    name:    'name',
    email:   'email',
    phone:   'phone',
    website: 'website'
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
                phone: '',
                email: ''
            },
            showAddress:       false,
            showCompany:       false,
            editMode:          false,
            hasDuplicateError: false,
            formAllErrors:     {
                name:  ERRORS.nameInvalid,
                phone: ERRORS.phoneInvalid,
                email: ERRORS.emailInvalid,
            }
        };
    }

    _isUserInfoValid () {
        const { formErrors } = this.state;

        return !formErrors.name &&
               !formErrors.phone &&
               !formErrors.email;
    }

    _isUserAllInfoValid () {
        const { formAllErrors } = this.state;

        return !formAllErrors.name &&
               !formAllErrors.phone &&
               !formAllErrors.email;
    }

    _handleClickAddress = e => {
        this.setState({ showAddress: !this.state.showAddress });
        e.preventDefault();
    };

    _handleClickCompany = e => {
        this.setState({ showCompany: !this.state.showCompany });
        e.preventDefault();
    };

    _handleClickEdit = unmodifiedUser => {
        this.setState({ editMode: !this.state.editMode, unmodifiedUser: unmodifiedUser });
    };

    _handleChange = (type, userValue, formErrors, allErrors, hasDuplicateError = this.state.hasDuplicateError) => {
        const { currentUser } = this.state;

        currentUser[type] = userValue;
        this.setState({
            currentUser,
            formErrors:        formErrors,
            hasDuplicateError: hasDuplicateError,
            formAllErrors:     allErrors
        });
    };

    _handleClickSubmit = e => {
        const { currentUser, hasDuplicateError, formErrors, formAllErrors } = this.state;
        const newUser                                                       = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        if (this._isUserAllInfoValid()) {
            const forceAdding = !!hasDuplicateError;

            UserAction.addNewUser(newUser, forceAdding);
            this.setState({ formErrors, hasDuplicateError: !hasDuplicateError });
        }
        else {
            this.setState({ formErrors: formAllErrors });
        }
        e.preventDefault();
    };

    _handleClickUndo = () => {
        const { editMode, unmodifiedUser } = this.state;

        this.setState({ editMode: !editMode, currentUser: unmodifiedUser, formErrors: {} });
    };

    _handleClickSave = () => {
        this.setState({ editMode: !this.state.editMode });
    };

    render () {
        const { isNewUser, duplicateUserId, highlightedFields = {} } = this.props;
        const {
                  showAddress,
                  showCompany,
                  editMode,
                  currentUser,
                  formErrors,
                  hasDuplicateError
              }                                                      = this.state;
        let buttonAddress                                            = '';
        let buttonCompany                                            = '';

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
                {
                    hasDuplicateError &&
                    <DuplicateError userId={duplicateUserId}/>
                }
                <Info info={currentUser.info}
                      formErrors={formErrors}
                      onChange={this._handleChange}
                      editMode={editMode}
                      isNewUser={isNewUser}
                      highlightedFields={highlightedFields}/>
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
                        className={classNames({
                            ButtonAddUser:  this._isUserInfoValid(),
                            ButtonDisabled: !this._isUserInfoValid()
                        })}
                        disabled={!this._isUserInfoValid()}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <Edit disabled={!this._isUserInfoValid() && editMode}
                              onClickSave={this._handleClickSave}
                              onClickEdit={this._handleClickEdit}
                              onClickUndo={this._handleClickUndo}
                              currentUser={currentUser}
                              editMode={editMode}
                        />
                    )
                }
            </form>
        );
    }
}
