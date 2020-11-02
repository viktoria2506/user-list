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
import { MODES } from '../modes';

const MATCH_PHONE        = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL        = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;
export const FIELD_NAMES = {
    name:    'name',
    email:   'email',
    phone:   'phone',
    website: 'website'
};

const SHOW = {
    show: 'show',
    hide: 'hide'
};

export const VIEWS = {
    [MODES.editing]: {
        [SHOW.show]:      {
            buttonAddress: 'Show Address',
            buttonCompany: 'Show Company'
        },
        [SHOW.hide]:      {
            buttonAddress: 'Hide Address',
            buttonCompany: 'Hide Company'
        },
        showRequiredMark: true
    },
    [MODES.new]:     {
        [SHOW.show]:      {
            buttonAddress: 'Add Address',
            buttonCompany: 'Add Company'
        },
        [SHOW.hide]:      {
            buttonAddress: 'Remove Address',
            buttonCompany: 'Remove Company'
        },
        showRequiredMark: true
    },
    [MODES.default]: {
        [SHOW.show]:      {
            buttonAddress: 'Show Address',
            buttonCompany: 'Show Company'
        },
        [SHOW.hide]:      {
            buttonAddress: 'Hide Address',
            buttonCompany: 'Hide Company'
        },
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
            unmodifiedUser:    null,
            formErrors:        {
                name:  '',
                email: '',
                phone: ''
            },
            showAddress:       SHOW.show,
            showCompany:       SHOW.show,
            hasDuplicateError: false,
            mode:              (isNewUser ? MODES.new : MODES.default)
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
        this.setState({ showAddress: this.state.showAddress === SHOW.hide ? SHOW.show : SHOW.hide });
        e.preventDefault();
    };

    _handleClickCompany = e => {
        this.setState({ showCompany: this.state.showCompany === SHOW.hide ? SHOW.show : SHOW.hide });
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

    _handleClickEdit = unmodifiedUser => {
        this.setState({ mode: MODES.editing, unmodifiedUser: unmodifiedUser });
    };

    _handleClickUndo = () => {
        const { unmodifiedUser } = this.state;

        this.setState({ mode: MODES.default, currentUser: unmodifiedUser, formErrors: {} });
    };

    _handleClickSave = () => {
        this.setState({ mode: MODES.default });
    };

    render () {
        const { duplicateUserId, highlightedFields = {} } = this.props;
        const {
                  showAddress,
                  showCompany,
                  currentUser,
                  formErrors,
                  hasDuplicateError,
                  mode
              }                                                      = this.state;
        const isFormFieldsValid                                      = this._isUserInfoValid(formErrors);

        return (
            <form className="UserInfo" id={`${currentUser.info.id}`}>
                {
                    hasDuplicateError &&
                    <DuplicateError userId={duplicateUserId}/>
                }
                <Info info={currentUser.info}
                      formErrors={formErrors}
                      onChange={this._handleChange}
                      mode={mode}
                      highlightedFields={highlightedFields}/>
                <button className="ButtonAddDetails" onClick={this._handleClickAddress}>
                    {VIEWS[mode][showAddress].buttonAddress}
                </button>
                {
                    (showAddress === SHOW.hide) &&
                    <Address address={currentUser.address} onChange={this._handleChange}/>
                }
                <button className="ButtonAddDetails" onClick={this._handleClickCompany}>
                    {VIEWS[mode][showCompany].buttonAddress}
                </button>
                {
                    (showCompany === SHOW.hide) &&
                    <Company company={currentUser.company} onChange={this._handleChange}/>
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
                        <Edit disabled={!isFormFieldsValid}
                              onClickSave={this._handleClickSave}
                              onClickEdit={this._handleClickEdit}
                              onClickUndo={this._handleClickUndo}
                              currentUser={currentUser}
                              mode={mode}
                        />
                    )
                }
            </form>
        );
    }
}
