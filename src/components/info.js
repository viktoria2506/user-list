import React from 'react';
import classNames from 'classnames';

import FormErrors from './form-errors';

const INFO = 'info';

export default function Info (props) {
    function errorClass (valid) {
        return classNames({ 'UserInfo': valid === '', 'field-error': valid !== '' });
    }

    const { info = {}, onChange, formErrors } = props;
    const _onChange                           = e => onChange(e, INFO);

    return (
        <div className="Info">
            <p><label>
                *Name: <input type="text"
                              name="name"
                              className={`${errorClass(formErrors.name)}`}
                              value={info.name}
                              onChange={_onChange}/>
                <FormErrors formErrors={formErrors} fieldName='name'/>
            </label></p>
            <p><label>
                *Phone: <input type="text"
                               name="phone"
                               className={`${errorClass(formErrors.phone)}`}
                               value={info.phone}
                               onChange={_onChange}/>
                <FormErrors formErrors={formErrors} fieldName='phone'/>
            </label></p>
            <p><label>
                *Email: <input type="email"
                               name="email"
                               className={`${errorClass(formErrors.email)}`}
                               value={info.email}
                               onChange={_onChange}/>
                <FormErrors formErrors={formErrors} fieldName='email'/>
            </label></p>
            <p><label>
                Website: <input type="text"
                                name="website"
                                value={info.website}
                                onChange={_onChange}/>
            </label></p>
        </div>
    );
}
