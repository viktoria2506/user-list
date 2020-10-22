import React from 'react';

import { FIELD_NAMES } from './user';

import InputWithErrorInfo from './input-error-info';

const INFO = 'info';

export default function Info (props) {
    const { info = {}, onChange, formErrors, wantEdit, isNewUser, highlightedFields } = props;
    const _onChange                                                                 = e => onChange(e, INFO);
    const isEditing                                                                 = wantEdit || isNewUser;

    return (
        <div className="Info">
            <InputWithErrorInfo value={info[FIELD_NAMES.name]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.name}
                                error={formErrors[FIELD_NAMES.name]}
                                onChange={_onChange}
                                highlight={highlightedFields[FIELD_NAMES.name]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.phone]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.phone}
                                error={formErrors[FIELD_NAMES.phone]}
                                onChange={_onChange}
                                highlight={highlightedFields[FIELD_NAMES.phone]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.email]}
                                isEditing={isEditing} requiredField={true}
                                name={FIELD_NAMES.email}
                                error={formErrors[FIELD_NAMES.email]}
                                onChange={_onChange}
                                highlight={highlightedFields[FIELD_NAMES.email]}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.website]}
                                isEditing={isEditing} requiredField={false}
                                name={FIELD_NAMES.website}
                                onChange={_onChange}
                                highlight={highlightedFields[FIELD_NAMES.website]}/>
        </div>

    );
}
