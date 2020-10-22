import React from 'react';
import classNames from 'classnames';

function nameClass (error, highlighted) {
    return classNames({ 'UserInfo': !error, 'field-error': error, highlighted });
}

export default function InputWithErrorInfo (props) {
    const { name, error, value, onChange, isEditing, highlighted, requiredField } = props;
    let requiredMark                                             = requiredField && isEditing ? '*' : '';

    return (
        <p><label>
            {requiredMark + name[0].toUpperCase() + name.slice(1)}:
            <input type="text"
                   name={name}
                   className={`${nameClass(error, highlighted)}`}
                   value={value}
                   onChange={onChange}/>
            <nobr className="formErrors">{error}</nobr>
        </label></p>
    );

}
