import React from 'react';
import classNames from 'classnames';

function errorClass (error) {
    return classNames({ 'UserInfo': !error, 'field-error': error });
}

export default function InputWithErrorInfo (props) {
    const { name, error, value, onChange, isEditing } = props;
    let requiredMark =  isEditing ? '*' : '';

    return (
        <p><label>
            {requiredMark + name[0].toUpperCase() + name.slice(1)}:
            <input type="text"
                   name={name}
                   className={`${errorClass(error)}`}
                   value={value}
                   onChange={onChange}/>
            <nobr className="formErrors">{error}</nobr>
        </label></p>
    );

}
