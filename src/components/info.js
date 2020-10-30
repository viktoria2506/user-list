import React, { useEffect, useState } from 'react';

import { FIELD_NAMES } from './user';

import InputWithErrorInfo from './input-error-info';
import ERRORS from '../errors';

const INFO        = 'info';
const MATCH_PHONE = /^([\d.\-+x() ]+)$/i;
const MATCH_EMAIL = /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i;

export default function Info (props) {
    const { info = {}, onChange, editMode, isNewUser, highlightedFields, checkAllFields } = props;
    const isEditing                                                                       = editMode || isNewUser;

    const [formErrors, setFormErrors]                                                     = useState({
        name:  '',
        phone: '',
        email: ''
    });
    const [formAllErrors, setFormAllErrors]                                               = useState({
        name:  ERRORS.nameInvalid,
        phone: ERRORS.phoneInvalid,
        email: ERRORS.emailInvalid,
    });

    const showError = (field) => {
        if (checkAllFields) {
            return _validateField(FIELD_NAMES[field], info[field]);
        }
        return formErrors[field];
    };


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

    useEffect(() => {
        debugger;
            formErrors.name  = _validateField(FIELD_NAMES.name, info.name);
            formErrors.phone = _validateField(FIELD_NAMES.phone, info.phone);
            formErrors.email = _validateField(FIELD_NAMES.email, info.email);
            setFormErrors(formErrors);
    }, [checkAllFields, info, formErrors]);

    const _allFieldsCorrect = () => {
        return !formAllErrors.name &&
               !formAllErrors.phone &&
               !formAllErrors.email;
    };

    const _noCurrentErrors = () => {
        return !formErrors.name &&
               !formErrors.phone &&
               !formErrors.email;
    };

    const _handleChange = (e) => {
        const name      = e.target.name;
        const value     = e.target.value;
        let changedInfo = { ...info };

        changedInfo[name] = value;

        formErrors[name]  = _validateField(name, value);
        setFormErrors(formErrors);
        formAllErrors[name] = _validateField(name, value);
        setFormAllErrors(formAllErrors);

        if (name === FIELD_NAMES.name) {
            const hasDuplicateError = false;

            onChange(INFO, changedInfo, _noCurrentErrors(), _allFieldsCorrect(), hasDuplicateError);
        }
        else {
            onChange(INFO, changedInfo, _noCurrentErrors(), _allFieldsCorrect());
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
                                error={showError(FIELD_NAMES.phone)}
                                onChange={_handleChange}
                                highlighted={highlightedFields[FIELD_NAMES.phone]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.email]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.email}
                                error={showError(FIELD_NAMES.email)}
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
