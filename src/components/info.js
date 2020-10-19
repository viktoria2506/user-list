import React from 'react';

import InputWithErrorInfo from './input-error-info';

const INFO  = 'info';
const NAME  = 'name';
const PHONE = 'phone';
const EMAIL = 'email';

export default function Info (props) {
    const { info = {}, onChange, formErrors, wantEdit, isNewUser } = props;
    const _onChange                                                = e => onChange(e, INFO);
    let showNeed                                                   = wantEdit || isNewUser ? '*' : '';

    return (
        <div className="Info">
            <InputWithErrorInfo info={info} showNeed={showNeed} name={NAME} error={formErrors[NAME]}
                                onChange={_onChange}/>
            <InputWithErrorInfo info={info} showNeed={showNeed} name={PHONE} error={formErrors[PHONE]}
                                onChange={_onChange}/>
            <InputWithErrorInfo info={info} showNeed={showNeed} name={EMAIL} error={formErrors[EMAIL]}
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
