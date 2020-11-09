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
const initializedInfo    = {
    id:      '',
    name:    '',
    email:   '',
    phone:   '',
    website: ''
};
const initializedAddress = {
    city:    '',
    street:  '',
    suite:   '',
    zipcode: ''
};
const initializedCompany = {
    companyName: '',
    catchPhrase: '',
    bs:          ''
};
export default class User extends React.Component {
    constructor (props) {
        super(props);

        const { info = initializedInfo, address = initializedAddress, company = initializedCompany, isNewUser } = this.props;

        this.state = {
            currentUser: {
                info,
                address,
                company
            },
            formErrors:  {
                name:  '',
                email: '',
                phone: ''
            },
            showAddress: false,
            showCompany: false,
            mode:        isNewUser ? MODES.new : MODES.default
        };
    }

    _onUpdateMode = () => {
        this.setState({ mode: MODES.default });
        this.props.resetDuplicateUserId();
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
        let { currentUser, formErrors, mode }           = this.state;
        const { duplicateUserId, resetDuplicateUserId } = this.props;

        if (mode !== MODES.default) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[type][name] = value;
            formErrors[name]        = this._validateField(name, value);
            if (name === FIELD_NAMES.name && !!duplicateUserId) {
                resetDuplicateUserId();
            }
            this.setState({ currentUser, formErrors });
        }
        e.preventDefault();
    };

    _handleClickSubmit = e => {
        const { currentUser, formErrors } = this.state;
        const { duplicateUserId }         = this.props;
        const newUser                     = new UserInfo(currentUser.info, currentUser.address, currentUser.company);
        const resultValid                 = this._validateFields(currentUser.info);

        if (this._isUserInfoValid(resultValid)) {
            UserAction.addNewUser(newUser, !!duplicateUserId);
            this.setState({
                formErrors
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
            currentUser: newState.currentUser || this.state.currentUser
        });
        if (newState.undo &&
            newState.currentUser.info.id === this.props.userId) {
            this.props.resetDuplicateUserId();
        }
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

        return !currentUser.company || (!currentUser.company.companyName &&
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

        currentUser.company.companyName = '';
        currentUser.company.catchPhrase = '';
        currentUser.company.bs          = '';
        this.setState(currentUser);
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

        return !currentUser.company || (!currentUser.company.companyName &&
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

        currentUser.company.companyName        = '';
        currentUser.company.catchPhrase = '';
        currentUser.company.bs          = '';
        this.setState(currentUser);
    };

    render () {
        const {
                  highlightedFields = {},
                  duplicateUserId,
                  userId
              } = this.props;

        const {
                  showAddress,
                  showCompany,
                  currentUser,
                  formErrors,
                  mode
              }                 = this.state;
        const isFormFieldsValid = this._isUserInfoValid(formErrors);


        return (
            <form className="UserInfo" id={`${currentUser.info.id}`}>
                {
                    !!duplicateUserId && mode !== MODES.default && currentUser.info.id === userId &&
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
                            ButtonAddUser:  isFormFieldsValid && !(!!duplicateUserId && currentUser.info.id !== userId),
                            ButtonDisabled: !isFormFieldsValid || (!!duplicateUserId && currentUser.info.id !== userId)
                        })}
                        disabled={!isFormFieldsValid || (!!duplicateUserId && currentUser.info.id !== userId)}
                        onClick={this._handleClickSubmit}>Submit</button> :
                    (
                        <EditingButtons
                            disabled={!isFormFieldsValid || (!!duplicateUserId && currentUser.info.id !== userId)}
                            onChange={this._handleEdit}
                            currentUser={currentUser}
                            isEditing={mode === MODES.editing}
                            duplicateUserId={duplicateUserId}
                            updateMode={this._onUpdateMode}
                        />
                    )
                }
            </form>
        );
    }
}
