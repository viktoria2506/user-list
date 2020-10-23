import React from 'react';
import ERRORS from '../errors';

export default function DuplicateError (props) {
    const { userId } = props;
    const textError  = ERRORS.userExist;

    if (userId) {
        const link = <a href={`#${userId}`}>{textError.substr(0, textError.indexOf(' '))}</a>;

        return (
            <nobr>{link} {textError.substr(textError.indexOf(' '), textError.length)}</nobr>
        );
    }
    return null;
}



