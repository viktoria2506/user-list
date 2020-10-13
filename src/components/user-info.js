import React from 'react';

const INFO = 'info';

export default function Info (props) {
    function errorClass (valid) {
        return valid ? '' : 'field-error';
    }

    const { info = {}, onChange, valid } = props;
    const _onChange                      = e => onChange(e, INFO);
    return (
        <div>
            <p><label>
                Name: <input type="text"
                             name="name"
                             className={`${errorClass(valid.name)}`}
                             value={info.name}
                             onChange={_onChange}/>
            </label></p>
            <p><label>
                Phone: <input type="text"
                              name="phone"
                              className={`${errorClass(valid.phone)}`}
                              value={info.phone}
                              onChange={_onChange}/>
            </label></p>
            <p><label>
                Email: <input type="email"
                              name="email"
                              className={`${errorClass(valid.email)}`}
                              value={info.email}
                              onChange={_onChange}/>
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
