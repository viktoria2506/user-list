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

const MATCH_PHONE        = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL        = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;
export const FIELD_NAMES = {
    name:    'name',
    email:   'email',
    phone:   'phone',
    website: 'website'
};
const MODES              = {
    editing: 'editing',
    new:     'new',
    default: 'default'
};
const SHOW               = {
    show: 'show',
    hide: 'hide'
};

const VIEWS = {
    [MODES.editing]: {
        [SHOW.show]: {
            buttonAddress: 'Show Address',
            buttonCompany: 'Show Company'
        },
        [SHOW.hide]: {
            buttonAddress: 'Hide Address',
            buttonCompany: 'Hide Company'
        }
    },
    [MODES.new]: {
        [SHOW.show]: {
            buttonAddress: 'Add Address',
            buttonCompany: 'Add Company'
        },
        [SHOW.hide]: {
            buttonAddress: 'Remove Address',
            buttonCompany: 'Remove Company'
        }
    },
    [MODES.editing]: {
        [SHOW.show]: {
            buttonAddress: 'Show Address',
            buttonCompany: 'Show Company'
        },
        [SHOW.hide]: {
            buttonAddress: 'Hide Address',
            buttonCompany: 'Hide Company'
        }
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
            editMode:          false,
            hasDuplicateError: false,
            mode: MODES.default
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
        if (this.state.showAddress === SHOW.hide) this.setState({ showAddress: SHOW.show });
        else this.setState({ showAddress: SHOW.hide });
        e.preventDefault();
    };

    _handleClickCompany = e => {
        if (this.state.showCompany === SHOW.hide) this.setState({ showCompany: SHOW.show });
        else this.setState({ showCompany: SHOW.hide });
        e.preventDefault();
    };

    _handleChange = (e, type) => {
        let { currentUser, editMode, formErrors, hasDuplicateError } = this.state;
        const { isNewUser }                                          = this.props;

        if (editMode || isNewUser) {
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
            this.setState({ formErrors, hasDuplicateError: !hasDuplicateError });
        }
        else {
            this.setState({ formErrors: { ...resultValid } });
        }
        e.preventDefault();
    };

    _handleClickEdit = unmodifiedUser => {
        this.setState({ editMode: !this.state.editMode, unmodifiedUser: unmodifiedUser });
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
        const isFormFieldsValid                                      = this._isUserInfoValid(formErrors);
        let buttonAddress                                            = '';
        let buttonCompany                                            = '';


        if (isNewUser) {
            buttonAddress = VIEWS[MODES.new][showAddress].buttonAddress;
            buttonCompany = VIEWS[MODES.new][showCompany].buttonAddress;
        }
        else {
            buttonAddress = VIEWS[MODES.editing][showAddress].buttonAddress;
            buttonCompany = VIEWS[MODES.editing][showCompany].buttonAddress;
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
                    (showAddress === SHOW.hide) &&
                    <Address address={currentUser.address} onChange={this._handleChange}/>
                }
                <button className="ButtonAddDetails" onClick={this._handleClickCompany}>
                    {buttonCompany}
                </button>
                {
                    (showCompany  === SHOW.hide)&&
                    <Company company={currentUser.company} onChange={this._handleChange}/>
                }
                {
                    isNewUser ?
                    <button
                        className={classNames({
                            ButtonAddUser:  isFormFieldsValid,
                            ButtonDisabled: !isFormFieldsValid
                        })}
                        disabled={!isFormFieldsValid}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <Edit disabled={!isFormFieldsValid && editMode}
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
