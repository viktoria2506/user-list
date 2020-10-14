import React from 'react';

export default function FormError (props) {
    const { formErrors, fieldName } = props;

    if (fieldName === 'duplicate' && formErrors[fieldName][0].length > 0) {
        const textError = formErrors[fieldName][0];
        const href      = formErrors[fieldName][1];
        const link      = <a href={href}>{textError.substr(0, textError.indexOf(' '))}</a>;

        return (
            <nobr>{link} {textError.substr(textError.indexOf(' '), textError.length)}</nobr>
        );
    }
    return (
        <nobr className="formErrors">{formErrors[fieldName]}</nobr>
    );
}

