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

        onChange({ mode: MODES.default, undo: true, currentUser: unmodifiedUser });
        e.preventDefault();
    };

    _handleClickSave = e => {
        const { currentUser, onChange } = this.props;
        const newUser                   = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser);
        onChange({ mode: MODES.default, currentUser });
        e.preventDefault();
    };

    _handleClickEdit = e => {
        const { currentUser, onChange } = this.props;
        const unmodifiedUser            = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        this.setState({unmodifiedUser});
        onChange({ mode: MODES.editing, currentUser });
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
