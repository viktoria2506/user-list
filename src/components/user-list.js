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

        this.state = this._getAppState();
    }

    _getAppState () {
        return {
            duplicateUserId:   '',
            highlightedFields: '',
            addUserMode:       false,
            searchMode:        false,
            users:             UserStore.getUsers()
        };
    }

    _onChange = () => {
        this.setState(this._getAppState());
    };

    _handleAddUserClick = () => {
        this.setState({ addUserMode: !this.state.addUserMode });
    };

    _addingFailed = (userId) => {
        this.setState({ duplicateUserId: userId });
    };

    _handleFindUserClick = (e) => {
        const { searchMode } = this.state;

        this.setState({ searchMode: !searchMode });
        e.preventDefault();
    };

    _usersFound = (usersFound, highlightedFields) => {
        this.setState({ users: usersFound, highlightedFields, addUserMode: false });
    };

    _handleClickStopSearch = (e) => {
        UserAction.stopFindUser();
        e.preventDefault();
    };

    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this._onChange);
        UserStore.on(EVENT_TYPE.userAdded, this._onChange);
        UserStore.on(EVENT_TYPE.addingFailed, this._addingFailed);
        UserStore.on(EVENT_TYPE.usersFound, this._usersFound);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this._onChange);
        UserStore.off(EVENT_TYPE.userAdded, this._onChange);
        UserStore.off(EVENT_TYPE.addingFailed, this._addingFailed);
        UserStore.off(EVENT_TYPE.usersFound, this._usersFound);
    }

    render () {
        const { addUserMode, users, duplicateUserId, searchMode, highlightedFields } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonFindUser"
                        onClick={searchMode ? this._handleClickStopSearch : this._handleFindUserClick}>
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
                    <User isNewUser={true} duplicateUserId={duplicateUserId}
                          highlightedFields={''}/>
                }
                <hr/>
                {users.length === 0 &&
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
                                      searchMode={searchMode}
                                      highlightedFields={highlightedFields}
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
