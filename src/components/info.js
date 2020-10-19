import React from 'react';

import { FIELD_NAMES } from './user';

import InputWithErrorInfo from './input-error-info';

const INFO  = 'info';

export default function Info (props) {
    const { info = {}, onChange, formErrors, wantEdit, isNewUser } = props;
    const _onChange                                                = e => onChange(e, INFO);

    return (
        <div className="Info">
            <InputWithErrorInfo value={info[FIELD_NAMES.name]} wantEdit={wantEdit} isNewUser={isNewUser} name={FIELD_NAMES.name} error={formErrors[FIELD_NAMES.name]}
                                onChange={_onChange}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.phone]} wantEdit={wantEdit} isNewUser={isNewUser} name={FIELD_NAMES.phone} error={formErrors[FIELD_NAMES.phone]}
                                onChange={_onChange}/>
            <InputWithErrorInfo value={info[FIELD_NAMES.email]}  wantEdit={wantEdit} isNewUser={isNewUser} name={FIELD_NAMES.email} error={formErrors[FIELD_NAMES.email]}
                                onChange={_onChange}/>
            <p><label>
                Website: <input type="text"
                                name="website"
                                value={info.website}
                                onChange={_onChange}/>
            </label></p>
        </div>

    );
}
