import React from 'react';

import { MODES } from '../modes';
import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default function EditingButtons (props) {
    const { disabled, currentUser, isEditing, onChange } = props;

    const _handleClickUndo = e => {
        onChange({ mode: MODES.default, formErrors: {} });
        e.preventDefault();
    };

    const _handleClickSave = e => {
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser);
        onChange({ mode: MODES.default, currentUser: currentUser });
        e.preventDefault();
    };

    const _handleClickEdit = e => {
        const unmodifiedUser = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        onChange({ mode: MODES.editing, currentUser: currentUser, unmodifiedUser: unmodifiedUser });
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <button className="ButtonEdit"
                    disabled={disabled}
                    onClick={isEditing ? _handleClickSave : _handleClickEdit}>
                {isEditing ? 'Save' : 'Edit'}
            </button>
            {
                isEditing &&
                <button className="ButtonEdit" onClick={_handleClickUndo}>Undo</button>
            }
        </React.Fragment>
    );
};
