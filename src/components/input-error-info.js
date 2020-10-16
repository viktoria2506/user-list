import React from 'react';
import classNames from 'classnames';

export default function InputWithErrorInfo (props) {
    const { name, error, info = {}, onChange, showNeed } = props;

    function errorClass (error) {
        return classNames({ 'UserInfo': !error, 'field-error': error });
    }

    return (
        <p><label>
            {showNeed + name[0].toUpperCase() + name.slice(1)}:
            <input type="text"
                   name={name}
                   className={`${errorClass(error)}`}
                   value={info[name]}
                   onChange={onChange}/>
            <nobr className="formErrors">{error}</nobr>
        </label></p>
    );

}
