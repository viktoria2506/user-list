import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';
import ERRORS from '../errors';
import UserAction from '../actions/user-action';

import User from './user.js';
import SearchForm from './search-form';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = this._getInitialState();
    }

    _getInitialState () {
        return {
            duplicateUserId:   '',
            highlightedFields: '',
            addUserMode:       false,
            searchMode:        false,
            users:             UserStore.getUsers()

        };
    }

    _onChange = () => {
        this.setState(this._getInitialState());
    };

    _handleAddUserClick = () => {
        this.setState({ addUserMode: !this.state.addUserMode });
    };

    _onAddingFailed = (userId) => {
        this.setState({ duplicateUserId: userId });

    };

    _handleFindUserClick = (e) => {
        const { searchMode } = this.state;

        this.setState({ searchMode: !searchMode });
        e.preventDefault();
    };

    _onUsersFound = (usersFound, highlightedFields) => {
        this.setState({ users: usersFound, highlightedFields, addUserMode: false });
    };

    _handleStopSearchClick = (e) => {
        UserAction.stopFindUser();
        e.preventDefault();
    };

    _onUpdateFailed = (userId) => {
        this.setState({ duplicateUserId: userId });
    };

    _resetDuplicateUserId = () => {
        this.setState({ duplicateUserId: '' });
    };


    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this._onChange);
        UserStore.on(EVENT_TYPE.userAdded, this._onChange);
        UserStore.on(EVENT_TYPE.addingFailed, this._onAddingFailed);
        UserStore.on(EVENT_TYPE.usersFound, this._onUsersFound);
        UserStore.on(EVENT_TYPE.updateFailed, this._onUpdateFailed);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this._onChange);
        UserStore.off(EVENT_TYPE.userAdded, this._onChange);
        UserStore.off(EVENT_TYPE.addingFailed, this._onAddingFailed);
        UserStore.off(EVENT_TYPE.usersFound, this._onUsersFound);
        UserStore.off(EVENT_TYPE.updateFailed, this._onUpdateFailed);
    }

    render () {
        const { addUserMode, users, duplicateUserId, searchMode, highlightedFields } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonFindUser"
                        onClick={searchMode ? this._handleStopSearchClick : this._handleFindUserClick}>
                    {searchMode ? 'Stop searching' : 'Find User'}
                </button>
                {
                    searchMode &&
                    <SearchForm/>
                }
                <button className="ButtonAddUser" data-testid="ButtonAddUser"
                        onClick={this._handleAddUserClick}>
                    {addUserMode ? 'Cancel adding' : 'Add new User'}
                </button>
                {
                    addUserMode &&
                    <User isNewUser={true} duplicateUserId={duplicateUserId} onChange={this._onChange}
                          resetDuplicateUserId={this._resetDuplicateUserId}/>
                }
                <hr/>
                {!users.length &&
                 <p>{ERRORS.usersNotFound}</p>
                }
                {
                    users.map(user => {
                        const info = {
                            id:      user.id,
                            name:    user.name,
                            email:   user.email,
                            phone:   user.phone,
                            website: user.website
                        };

                        return (
                            <div className="UserInner" key={user.id}>
                                <User info={info}
                                      address={user.address}
                                      company={user.company}
                                      highlightedFields={highlightedFields}
                                      duplicateUserId={duplicateUserId}
                                      onUpdateMode={this._onUpdateMode}
                                      onChange={this._onChange}
                                      resetDuplicateUserId={this._resetDuplicateUserId}
                                />
                                <hr/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
