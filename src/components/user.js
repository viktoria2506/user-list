import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import UserStore from '../stores/user-store';
import classNames from 'classnames';
import ERRORS from '../errors';
import { MODES } from '../modes';
import EVENT_TYPE from '../stores/event-type';

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
            duplicateUserId:   '',
            mode:              isNewUser ? MODES.new : MODES.default
        };
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.updateFailed, this._onUpdateFailed);
        UserStore.off(EVENT_TYPE.userUpdated, this._onUpdateMode);
    }

    _onUpdateFailed = (userId) => {
        this.setState({ duplicateUserId: userId, hasDuplicateError: true });
    };

    _onUpdateMode = () => {
        this.setState({ mode: MODES.default, hasDuplicateError: false });
        this.props.onChange();
    };

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
                hasDuplicateError: !hasDuplicateError
            });
        }
        else {
            this.setState({ formErrors: { ...resultValid } });
        }
        e.preventDefault();
    };

    _handleEdit = (newState) => {
        this.setState({
            showAddress: this._isAddressEmpty() ? false : this.state.showAddress,
            showCompany: this._isCompanyEmpty() ? false : this.state.showCompany,
            mode:        newState.mode,
            formErrors:  newState.undo ? {} : this.state.formErrors,
            currentUser: newState.currentUser || this.state.currentUser,
            hasDuplicateError: newState.undo ? false : this.state.hasDuplicateError
        });
    };

    _isAddressEmpty = () => {
        const { currentUser } = this.state;

        return !currentUser.address || (!currentUser.address.city &&
                                        !currentUser.address.street &&
                                        !currentUser.address.suite &&
                                        !currentUser.address.zipcode);
    };

    _isCompanyEmpty = () => {
        const { currentUser } = this.state;

        return !currentUser.company || (!currentUser.company.name &&
                                        !currentUser.company.catchPhrase &&
                                        !currentUser.company.bs);
    };

    _handleDeleteAddress = e => {
        const { currentUser } = this.state;

        currentUser.address.street  = '';
        currentUser.address.city    = '';
        currentUser.address.suite   = '';
        currentUser.address.zipcode = '';
        this.setState(currentUser);
        e.preventDefault();
    };

    _handleDeleteCompany = () => {
        const { currentUser } = this.state;

        currentUser.company.name        = '';
        currentUser.company.catchPhrase = '';
        currentUser.company.bs          = '';
        this.setState(currentUser);
    };

    render () {
        const {  highlightedFields = {} } = this.props;
        const {
                  showAddress,
                  showCompany,
                  currentUser,
                  formErrors,
                  hasDuplicateError,
                  duplicateUserId,
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
                            {this._isAddressEmpty() ?
                             `${showAddress ? VIEWS[MODES.new].hideButtonPrefix : VIEWS[MODES.new].showButtonPrefix} Address` :
                             `${showAddress ? VIEWS[mode].hideButtonPrefix : VIEWS[mode].showButtonPrefix} Address`
                            }
                        </button>
                        {
                            mode === MODES.editing && !this._isAddressEmpty() &&
                            <button className="ButtonDeleteDetails" onClick={this._handleDeleteAddress}>Delete
                                Address</button>
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
                            {this._isCompanyEmpty() ?
                             `${showCompany ? VIEWS[MODES.new].hideButtonPrefix : VIEWS[MODES.new].showButtonPrefix} Company` :
                             `${showCompany ? VIEWS[mode].hideButtonPrefix : VIEWS[mode].showButtonPrefix} Company`
                            }
                        </button>
                        {
                            mode === MODES.editing && !this._isCompanyEmpty() &&
                            <button className="ButtonDeleteDetails" onClick={this._handleDeleteCompany}>Delete
                                Company</button>

                        }
                    </React.Fragment>
                }
                {
                    showCompany &&
                    <Company company={currentUser.company} onChange={this._handleChange} mode={mode}/>
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
                                        hasDuplicateError={hasDuplicateError}
                                        updateFailed={this._onUpdateFailed}
                                        updateMode={this._onUpdateMode}
                        />
                    )
                }
            </form>
        );
    }
}
