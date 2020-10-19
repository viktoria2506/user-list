import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';

import User from './user.js';
import SearchForm from './search-form';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            wantAdd:  false,
            wantEdit: false,
            wantFind: false,
            users:    UserStore.getUsers()
        };

    }

    _getAppState () {
        return {
            duplicateUserId: '',
            wantAdd:         false,
            wantEdit:        false,
            wantFind:        false,
            users:           UserStore.getUsers()
        };
    }


    _onChange = (userList) => {
        this.setState({ users: userList });
    };

    _handleClickAddUser = () => {
        this.setState({ wantAdd: !this.state.wantAdd });
    };

    _addingFailed = userId => {
        this.setState({ duplicateUserId: userId });
    };

    _handleClickFindUser = () => {

        const { wantFind } = this.state;

        this.setState({ wantFind: !wantFind });
    };

    _usersFound = (usersFound) => {
        this.setState({ users: usersFound });
    };

    _handleClickStopSearch = () => {
        this.setState(this._getAppState());
    }

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
        const { wantAdd, users, duplicateUserId, wantFind } = this.state;
        return (
            <div className="UserList">
                <button className="ButtonFindUser"
                        onClick={wantFind ? this._handleClickStopSearch : this._handleClickFindUser}>
                    {wantFind ? 'Stop searching' : 'Find User'}
                </button>
                {
                    wantFind &&
                    (
                        <SearchForm/>

                    )
                }
                <button className="ButtonAddUser" data-testid="ButtonAddUser"
                        onClick={this._handleClickAddUser}>
                    {wantAdd ? 'Cancel adding' : 'Add new User'}
                </button>
                {
                    wantAdd &&
                    (
                        <User isNewUser={true} duplicateUserId={duplicateUserId}/>
                    )
                }
                <hr/>
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
                                      isNewUser={false}
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
