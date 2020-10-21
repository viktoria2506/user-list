import React from 'react';
import classNames from 'classnames';

function nameClass (error, highlight) {
    return classNames({ 'UserInfo': !error, 'field-error': error, 'found': highlight });
}

export default function InputWithErrorInfo (props) {
    const { name, error, value, onChange, isEditing, highlight, requiredField } = props;
    let requiredMark                                             = requiredField && isEditing ? '*' : '';

    return (
        <p><label>
            {requiredMark + name[0].toUpperCase() + name.slice(1)}:
            <input type="text"
                   name={name}
                   className={`${nameClass(error, highlight)}`}
                   value={value}
                   onChange={onChange}/>
            <nobr className="formErrors">{error}</nobr>
        </label></p>
    );

}
