import React from 'react';

import UserAction from '../actions/user-action';
import UserInfo from '../stores/user-info';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';
import { MODES } from '../modes';

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
        const { currentUser, hasDuplicateError } = this.props;
        const newUser                            = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser, hasDuplicateError);
        e.preventDefault();
    };

    _updateFailed = (userId) => {
        this.props.updateFailed(userId);
    };

    _updateMode = () => {
        this.props.updateMode();
    };

    _handleClickEdit = e => {
        const { currentUser, onChange } = this.props;
        const unmodifiedUser            = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        UserStore.on(EVENT_TYPE.updateFailed, this._updateFailed);
        UserStore.on(EVENT_TYPE.userUpdated, this._updateMode);
        this.setState({ unmodifiedUser });
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
