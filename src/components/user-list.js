import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';

import User from './user.js';
import SearchForm from './search-form';
import ERRORS from '../errors';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = this._getAppState();
    }

    _getAppState () {
        return {
            duplicateUserId:   '',
            highlightedFields: '',
            userAddMode:           false,
            searchMode:        false,
            users:             UserStore.getUsers()
        };
    }

    _onChange = () => {
        this.setState(this._getAppState());
    };

    _handleClickAddUser = () => {
        this.setState({ userAddMode: !this.state.userAddMode });
    };

    _addingFailed = userId => {
        this.setState({ duplicateUserId: userId });
    };

    _handleFindUserClick = (e) => {
        const { searchMode } = this.state;

        this.setState({ searchMode: !searchMode });
        e.preventDefault();
    };

    _usersFound = (usersFound, highlightedFields) => {
        this.setState({ users: usersFound, highlightedFields: highlightedFields });
    };

    _handleClickStopSearch = (e) => {
        this.setState(this._getAppState());
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
        const { userAddMode, users, duplicateUserId, searchMode, highlightedFields } = this.state;

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
                        onClick={this._handleClickAddUser}>
                    {userAddMode ? 'Cancel adding' : 'Add new User'}
                </button>
                {
                    userAddMode &&
                    <User isNewUser={true} duplicateUserId={duplicateUserId} searchMode={searchMode} highlightedFields={''}/>
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
