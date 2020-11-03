import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import classNames from 'classnames';
import ERRORS from '../errors';
import { MODES } from '../modes';

import Address from './address.js';
import Company from './company.js';
import Info from './info';
import DuplicateError from './duplicate-error';
import EditingButtons from './editing-buttons';

const MATCH_PHONE = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;

export const FIELD_NAMES = {
    name:    'name',
    email:   'email',
    phone:   'phone',
    website: 'website'
};
const VIEWS              = {
    [MODES.editing]: {
        showButtonPrefix: 'Show',
        hideButtonPrefix: 'Hide',
        showRequiredMark: true
    },
    [MODES.new]:     {
        showButtonPrefix: 'Add',
        hideButtonPrefix: 'Remove',
        showRequiredMark: true
    },
    [MODES.default]: {
        showButtonPrefix: 'Show',
        hideButtonPrefix: 'Hide',
        showRequiredMark: false
    }
};

export default class User extends React.Component {
    constructor (props) {
        super(props);

        const { info = {}, address = {}, company = {}, isNewUser } = this.props;

        this.state = {
            currentUser:       {
                info,
                address,
                company
            },
            formErrors:        {
                name:  '',
                email: '',
                phone: ''
            },
            showAddress:       false,
            showCompany:       false,
            hasDuplicateError: false,
            mode:              isNewUser ? MODES.new : MODES.default
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

    _handleChange = (e, type) => {
        let { currentUser, formErrors, hasDuplicateError, mode } = this.state;

        if (mode !== MODES.default) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[type][name] = value;
            formErrors[name]        = this._validateField(name, value);
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
            this.setState({
                formErrors,
                hasDuplicateError: !hasDuplicateError,
                mode:              forceAdding ? MODES.default : MODES.new
            });
        }
        else {
            this.setState({ formErrors: { ...resultValid } });
        }
        e.preventDefault();
    };

    _handleEdit = (newState) => {
        if (this._isAddressEmpty()) {
            this.setState({ showAddress: false });
        }
        if (this._isCompanyEmpty()) {
            this.setState({ showCompany: false });
        }
        this.setState({
            mode:        newState.mode,
            formErrors:  newState.undo ? {} : this.state.formErrors,
            currentUser: newState.currentUser || this.state.currentUser
        });
    };

    _isCompanyEmpty = () => {
        const { currentUser } = this.state;

        return !currentUser.company || (!currentUser.company.name &&
               !currentUser.company.catchPhrase &&
               !currentUser.company.bs);
    };

    _isAddressEmpty = () => {
        const { currentUser } = this.state;

        return !currentUser.address || (!currentUser.address.city &&
               !currentUser.address.street &&
               !currentUser.address.suite &&
               !currentUser.address.zipcode);
    };

    _handleDeleteAddress = e => {
        const { currentUser } = this.state;

        currentUser.address.street = '';
        currentUser.address.city = '';
        currentUser.address.suite = '';
        currentUser.address.zipcode = '';
        this.setState(currentUser);
        e.preventDefault();
    }

    _handleDeleteCompany = () => {
        const { currentUser } = this.state;

        currentUser.company.name = '';
        currentUser.company.catchPhrase = '';
        currentUser.company.bs = '';
        this.setState(currentUser);
    }

    render () {
        const { duplicateUserId, highlightedFields = {} } = this.props;
        const {
                  showAddress,
                  showCompany,
                  currentUser,
                  formErrors,
                  hasDuplicateError,
                  mode
              }                                           = this.state;
        const isFormFieldsValid                           = this._isUserInfoValid(formErrors);


        return (
            <form className="UserInfo" id={`${currentUser.info.id}`}>
                {
                    hasDuplicateError &&
                    <DuplicateError userId={duplicateUserId}/>
                }
                <Info info={currentUser.info}
                      formErrors={formErrors}
                      onChange={this._handleChange}
                      showRequiredMark={VIEWS[mode].showRequiredMark}
                      highlightedFields={highlightedFields}/>
                {
                    (mode !== MODES.default || !this._isAddressEmpty()) &&
                    <React.Fragment>
                        <button className="ButtonAddDetails" onClick={this._handleClickAddress}>
                            {`${showAddress ? VIEWS[mode].hideButtonPrefix : VIEWS[mode].showButtonPrefix} Address`}
                        </button>
                        {
                            mode === MODES.editing && !this._isAddressEmpty() &&
                            <button className="ButtonDeleteDetails" onClick={this._handleDeleteAddress}>Delete Address</button>
                        }
                    </React.Fragment>
                }
                {
                    showAddress &&
                    <Address address={currentUser.address} onChange={this._handleChange} mode={mode}/>
                }
                {
                    (mode !== MODES.default || !this._isCompanyEmpty()) &&
                    <React.Fragment>
                        <button className="ButtonAddDetails" onClick={this._handleClickCompany}>
                            {`${showCompany ? VIEWS[mode].hideButtonPrefix : VIEWS[mode].showButtonPrefix} Company`}
                        </button>
                        {
                            mode === MODES.editing && !this._isCompanyEmpty() &&
                            <button className="ButtonDeleteDetails" onClick={this._handleDeleteCompany}>Delete Company</button>
                        }
                    </React.Fragment>
                }
                {
                    showCompany &&
                    <Company address={currentUser.address} onChange={this._handleChange} mode={mode}/>
                }
                {
                    mode === MODES.new ?
                    <button
                        className={classNames({
                            ButtonAddUser:  isFormFieldsValid,
                            ButtonDisabled: !isFormFieldsValid
                        })}
                        disabled={!isFormFieldsValid}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <EditingButtons disabled={!isFormFieldsValid}
                                        onChange={this._handleEdit}
                                        currentUser={currentUser}
                                        isEditing={mode === MODES.editing}
                        />
                    )
                }
            </form>
        );
    }
}
