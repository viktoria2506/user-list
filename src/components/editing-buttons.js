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
        const { currentUser, duplicateUserId } = this.props;
        const newUser                          = new UserInfo(currentUser.info, currentUser.address, currentUser.company);

        UserAction.updateUser(newUser, !!duplicateUserId);
        e.preventDefault();
    };

    _onUpdateMode = () => {
        this.props.updateMode();
    };

    _handleClickEdit = e => {
        const { currentUser, onChange } = this.props;
        const unmodifiedUser            = {
            info:    { ...currentUser.info },
            address: { ...currentUser.address },
            company: { ...currentUser.company }
        };

        UserStore.on(EVENT_TYPE.userUpdated, this._onUpdateMode);
        this.setState({ unmodifiedUser });
        onChange({ mode: MODES.editing, currentUser });
        e.preventDefault();
    };

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.userUpdated, this._onUpdateMode);
    }

    render () {
        const { disabled, isEditing } = this.props;

        return (
            <React.Fragment>
                <button type="button"
                        className="ButtonEdit"
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
