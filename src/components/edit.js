import React from 'react';
import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default function Edit (props) {
    const { disabled, currentUser, editMode } = props;

    const _handleClickEdit = e => {
        const unmodifiedUser = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        props.onClickEdit(unmodifiedUser);
        e.preventDefault();
    };

    const _handleClickUndo = e => {
        props.onClickUndo();
        e.preventDefault();
    };

    const _handleClickSave = e => {
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser);
        props.onClickSave(editMode);
        e.preventDefault();
    };

    return (
        <div>
            <button className="ButtonEdit"
                    disabled={disabled}
                    onClick={editMode ? _handleClickSave : _handleClickEdit}>
                {editMode ? 'Save' : 'Edit'}
            </button>
            {
                editMode &&
                <button className="ButtonEdit" onClick={_handleClickUndo}>Undo</button>
            }
        </div>
    );
};
