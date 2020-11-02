import React from 'react';
import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';
import { MODES } from '../modes';

export default function Edit (props) {
    const { disabled, currentUser, mode } = props;

    const _handleClickUndo = e => {
        props.onClickUndo();
        e.preventDefault();
    };

    const _handleClickSave = e => {
        const newUser = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser);
        props.onClickSave();
        e.preventDefault();
    };
    const _handleClickEdit = e => {
        const unmodifiedUser = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        props.onClickEdit(unmodifiedUser);
        e.preventDefault();
    };
    const VIEWS            = {
        [MODES.editing]: {
            buttonEdit: 'Save',
            buttonUndo: 'Undo',
            handle:     _handleClickSave
        },
        [MODES.default]: {
            buttonEdit: 'Edit',
            handle:     _handleClickEdit
        }
    };

    return (
        <div>
            <button className="ButtonEdit"
                    disabled={disabled}
                    onClick={VIEWS[mode].handle}>
                {VIEWS[mode].buttonEdit}
            </button>
            {
                (mode === MODES.editing) &&
                <button className="ButtonEdit" onClick={_handleClickUndo}>{VIEWS[mode].buttonUndo}</button>
            }
        </div>
    );
};
