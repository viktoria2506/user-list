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
            duplicateUserId: '',
            highlightFields: '',
            wantAdd:         false,
            wantFind:        false,
            usersNotFound:   false,
            users:           UserStore.getUsers()
        };
    }

    _onChange = () => {
        this.setState(this._getAppState());
    };

    _handleClickAddUser = () => {
        this.setState({ wantAdd: !this.state.wantAdd });
    };

    _addingFailed = userId => {
        this.setState({ duplicateUserId: userId });
    };

    _handleClickFindUser = (e) => {
        const { wantFind } = this.state;

        this.setState({ wantFind: !wantFind });
        e.preventDefault();
    };

    _usersFound = (usersFound, highlightFields) => {
        let { usersNotFound } = this.state;

        usersNotFound = usersFound.length === 0;
        this.setState({ users: usersFound, usersNotFound, highlightFields: highlightFields });
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
        const { wantAdd, users, duplicateUserId, wantFind, usersNotFound, highlightFields } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonFindUser"
                        onClick={wantFind ? this._handleClickStopSearch : this._handleClickFindUser}>
                    {wantFind ? 'Stop searching' : 'Find User'}
                </button>
                {
                    wantFind &&
                    <SearchForm/>
                }
                <button className="ButtonAddUser" data-testid="ButtonAddUser"
                        onClick={this._handleClickAddUser}>
                    {wantAdd ? 'Cancel adding' : 'Add new User'}
                </button>
                {
                    wantAdd &&
                    <User isNewUser={true} duplicateUserId={duplicateUserId} wantFind={wantFind} highlightFields={''}/>
                }
                <hr/>
                {usersNotFound &&
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
                                      searchMode={wantFind}
                                      highlightFields={highlightFields}
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
