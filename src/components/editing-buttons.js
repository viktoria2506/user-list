import React from 'react';

import { MODES } from '../modes';
import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default class EditingButtons extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            unmodifiedUser: null
        };
    }

    _handleClickUndo = e => {
        const { onChange }       = this.props;
        const { unmodifiedUser } = this.state;

        onChange({ mode: MODES.default, undo: true, currentUser: unmodifiedUser, hasDuplicateError: false });
        e.preventDefault();
    };

    _handleClickSave = e => {
        const { currentUser, onChange, hasDuplicateError, forceSave} = this.props;
        const newUser                   = new UserInfo(currentUser.info, currentUser.address, currentUser.company);
        const forceAdding = !!hasDuplicateError;

        UserAction.updateUser(newUser);
        debugger;
        onChange({ mode: (!forceSave || forceAdding) ? MODES.default : MODES.editing, currentUser, hasDuplicateError: !hasDuplicateError  });
        e.preventDefault();
    };

    _handleClickEdit = e => {
        const { currentUser, onChange, hasDuplicateError } = this.props;
        const unmodifiedUser            = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        this.setState({ unmodifiedUser });
        onChange({ mode: MODES.editing, currentUser, hasDuplicateError });
        e.preventDefault();
    };

    render () {
        const { disabled, isEditing } = this.props;
        return (
            <React.Fragment>
                <button className="ButtonEdit"
                        disabled={disabled}
                        onClick={isEditing ? this._handleClickSave : this._handleClickEdit}>
                    {isEditing ? 'Save' : 'Edit'}
                </button>
                {
                    isEditing &&
                    <button className="ButtonEdit" onClick={this._handleClickUndo}>Undo</button>
                }
            </React.Fragment>
        );
    }
};
