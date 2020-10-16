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
import FormErrors from './form-errors';

const MATCH_PHONE     = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL     = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;
const FIELD_NAME      = 'name';
const FIELD_EMAIL     = 'email';
const FIELD_PHONE     = 'phone';
const FIELD_DUPLICATE = 'duplicateUser';

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
                duplicateUser: {
                    text:   '',
                    userId: ''
                }
            },
            showAddress:  false,
            showCompany:  false,
            wantEdit:     false,
            addDuplicate: false
        };

        this._handleClickAddress = this._handleClickAddress.bind(this);
        this._handleClickCompany = this._handleClickCompany.bind(this);
        this._handleChange       = this._handleChange.bind(this);
        this._handleClickEdit    = this._handleClickEdit.bind(this);
        this._handleClickSubmit  = this._handleClickSubmit.bind(this);
    }

    _validateField (fieldName, value) {
        switch (fieldName) {
            case FIELD_NAME:
                return value ? '' : ERRORS.nameInvalid;
            case FIELD_PHONE:
                return value && MATCH_PHONE.test(value) ? '' : ERRORS.phoneInvalid;
            case FIELD_EMAIL:
                return value && MATCH_EMAIL.test(value) ? '' : ERRORS.emailInvalid;
            default:
                return '';
        }
    }

    _validateFields (user) {
        const nameValid  = this._validateField(FIELD_NAME, user.name);
        const phoneValid = this._validateField(FIELD_PHONE, user.phone);
        const emailValid = this._validateField(FIELD_EMAIL, user.email);

        return { nameValid, phoneValid, emailValid };
    }

    _handleClickAddress (e) {
        this.setState({ showAddress: !this.state.showAddress });
        e.preventDefault();
    }

    _handleClickCompany (e) {
        this.setState({ showCompany: !this.state.showCompany });
        e.preventDefault();
    }

    _handleClickEdit (e) {
        const { currentUser, wantEdit } = this.state;

        if (wantEdit) {
            const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

            UserAction.updateUser(newUser);
        }
        this.setState({ wantEdit: !wantEdit });
        e.preventDefault();
    }

    _handleChange (e, obj) {
        const { currentUser, wantEdit, formErrors } = this.state;
        const { isNewUser }                         = this.props;

        if (wantEdit || isNewUser) {
            const name  = e.target.name;
            const value = e.target.value;

            currentUser[obj][name] = value;
            formErrors[name]       = this._validateField(name, value);
            this.setState({ currentUser, formErrors });
        }
        e.preventDefault();
    }

    _addingFailed = userId => {
        const { isNewUser }                = this.props;
        const { formErrors, addDuplicate } = this.state;

        if (isNewUser && userId > 0) {
            formErrors.duplicateUser.text   = ERRORS.userExist;
            formErrors.duplicateUser.userId = `#${userId}`;
            this.setState({ formErrors: formErrors, addDuplicate: !addDuplicate });
        }
    };

    _handleClickSubmit (e) {
        const { currentUser, addDuplicate, formErrors } = this.state;
        const newUser                                   = new UserInfo(currentUser.info, currentUser.address, currentUser.company);
        const resultValid                               = this._validateFields(currentUser.info);

        if (resultValid.nameValid === '' && resultValid.phoneValid === '' && resultValid.emailValid === '') {
            UserAction.addNewUser(newUser, addDuplicate);
        }
        else {
            formErrors.name  = resultValid.nameValid;
            formErrors.phone = resultValid.phoneValid;
            formErrors.email = resultValid.emailValid;
            this.setState({ formErrors });
        }
        e.preventDefault();
    }

    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this.props.onChange);
        UserStore.on(EVENT_TYPE.addingFailed, this._addingFailed);
        UserStore.on(EVENT_TYPE.userAdded, this.props.onChange);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this.props.onChange);
        UserStore.off(EVENT_TYPE.addingFailed, this._addingFailed);
        UserStore.off(EVENT_TYPE.userAdded, this.props.onChange);
    }

    render () {
        const { isNewUser }     = this.props;
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
                <FormErrors formErrors={formErrors} fieldName={FIELD_DUPLICATE}/>
                <Info info={currentUser.info}
                      formErrors={formErrors}
                      onChange={this._handleChange}/>
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
