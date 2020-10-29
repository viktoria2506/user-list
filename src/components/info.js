import React from 'react';

import { FIELD_NAMES } from './user';

import InputWithErrorInfo from './input-error-info';
import ERRORS from '../errors';

const INFO        = 'info';
const MATCH_PHONE = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;

export default function Info (props) {
    const { info = {}, onChange, formErrors, editMode, isNewUser, highlightedFields } = props;
    const isEditing                                                                   = editMode || isNewUser;

    const _validateField = (fieldName, value) => {
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
    };

    const _validateFields = (info) => {
        return {
            [FIELD_NAMES.name]:  _validateField(FIELD_NAMES.name, info.name),
            [FIELD_NAMES.phone]: _validateField(FIELD_NAMES.phone, info.phone),
            [FIELD_NAMES.email]: _validateField(FIELD_NAMES.email, info.email),
        };
    };

    const _isUserInfoValid = (info) => {
        return !_validateField(FIELD_NAMES.name, info.name) &&
               !_validateField(FIELD_NAMES.phone, info.phone) &&
               !_validateField(FIELD_NAMES.email, info.email);
    };

    const _handleChange = (e) => {
        const name    = e.target.name;
        const value   = e.target.value;
        let formError = { ...formErrors };

        let changedInfo   = { ...info };
        changedInfo[name] = value;
        formError[name]   = _validateField(name, value);
        if (name === FIELD_NAMES.name) {
            const hasDuplicateError = false;

            onChange(INFO, changedInfo, formError, _isUserInfoValid(changedInfo), _validateFields(changedInfo), hasDuplicateError);
        }
        else {
            onChange(INFO, changedInfo, formError, _isUserInfoValid(changedInfo), _validateFields(changedInfo));
        }
        e.preventDefault();
    };

    return (
        <div className="Info">
            <InputWithErrorInfo value={info[FIELD_NAMES.name]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.name}
                                error={formErrors[FIELD_NAMES.name]}
                                onChange={_handleChange}
                                highlighted={highlightedFields[FIELD_NAMES.name]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.phone]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.phone}
                                error={formErrors[FIELD_NAMES.phone]}
                                onChange={_handleChange}
                                highlighted={highlightedFields[FIELD_NAMES.phone]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.email]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.email}
                                error={formErrors[FIELD_NAMES.email]}
                                onChange={_handleChange}
                                highlighted={highlightedFields[FIELD_NAMES.email]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.website]}
                                isEditing={isEditing} requiredField={false}
                                name={FIELD_NAMES.website}
                                onChange={_handleChange}
                                highlighted={highlightedFields[FIELD_NAMES.website]}/>
        </div>

    );
}
