import React from 'react';

export default function FormError (props) {
    const { formErrors, fieldName} = props;
    if (fieldName === 'duplicateUser') {
        if (formErrors[fieldName].text.length > 0) {
            const textError = formErrors[fieldName].text;
            const href      = formErrors[fieldName].userId;
            const link      = <a href={href}>{textError.substr(0, textError.indexOf(' '))}</a>;

            return (
                <nobr>{link} {textError.substr(textError.indexOf(' '), textError.length)}</nobr>
            );
        }
        return null;
    }
    else {
        return (
            <nobr className="formErrors">{formErrors[fieldName]}</nobr>
        );
    }
}

