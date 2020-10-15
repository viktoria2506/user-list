import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';

import User from './user.js';
import FindUser from './find-user';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            wantAdd:  false,
            wantFind: false,
            users:    UserStore.getAllUsers()
        };

        this._handleClickAddUser  = this._handleClickAddUser.bind(this);
        this._handleClickFindUser = this._handleClickFindUser.bind(this);
    }

    _onChange = (userList) => {
        this.setState({ users: userList });
    };

    _handleClickAddUser () {
        this.setState({ wantAdd: !this.state.wantAdd });
    }

    _handleClickFindUser () {
        const { wantFind } = this.state;

        if (wantFind) {
            this.setState({ users: UserStore.getAllUsers() });
        }
        this.setState({ wantFind: !wantFind });
    }

    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this._onChange);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this._onChange);
    }

    render () {
        const { wantFind, wantAdd, users } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonFindUser" onClick={this._handleClickFindUser}>
                    {wantFind ? 'Stop searching' : 'Find User'}
                </button>
                {
                    wantFind &&
                    (
                        <FindUser/>
                    )
                }
                {
                    !wantFind &&
                    (
                        <button className="ButtonAddUser" data-testid="ButtonAddUser"
                                onClick={this._handleClickAddUser}>
                            Add new User
                        </button>
                    )
                }
                {
                    !wantFind && wantAdd &&
                    (
                        <User isNewUser={true} />
                    )
                }
                {
                    users.map((user) => {
                        const info = {
                            id:      user.id,
                            name:    user.name,
                            email:   user.email,
                            phone:   user.phone,
                            website: user.website
                        };

                        return (
                            <div className="UserInner" key={user.id}>
                                <hr/>
                                <User info={info}
                                      address={user.address}
                                      company={user.company}
                                      isNewUser={false}
                                />
                                <br/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
