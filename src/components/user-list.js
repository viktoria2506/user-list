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
            duplicateNewUserId: '',
            highlightedFields:  '',
            addUserMode:        false,
            searchMode:         false,
            hasDuplicateError:  false,
            users:              UserStore.getUsers()
        };
    }

    _onChange = () => {
        this.setState(this._getInitialState());
    };

    _handleAddUserClick = () => {
        this.setState({ addUserMode: !this.state.addUserMode });
    };

    _onAddingFailed = (userId) => {
        this.setState({ duplicateNewUserId: userId, hasDuplicateError: true });
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

    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this._onChange);
        UserStore.on(EVENT_TYPE.userAdded, this._onChange);
        UserStore.on(EVENT_TYPE.addingFailed, this._onAddingFailed);
        UserStore.on(EVENT_TYPE.usersFound, this._onUsersFound);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this._onChange);
        UserStore.off(EVENT_TYPE.userAdded, this._onChange);
        UserStore.off(EVENT_TYPE.addingFailed, this._onAddingFailed);
        UserStore.off(EVENT_TYPE.usersFound, this._onUsersFound);
    }

    render () {
        const { addUserMode, users, duplicateNewUserId, searchMode, highlightedFields, hasDuplicateError } = this.state;

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
                    <User isNewUser={true} duplicateNewUserId={duplicateNewUserId}
                          hasDuplicateError={hasDuplicateError}/>
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
                                      onChange={this._onChange}
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
