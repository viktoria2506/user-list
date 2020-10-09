import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import CHANGE_EVENT from '../stores/event-type';

import User from './user.js';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = this._getAppState();

        this.handleClickAddUser = this.handleClickAddUser.bind(this);
    }

    _getAppState () {
        return {
            wantAdd:  false,
            wantEdit: false,
            users:    UserStore.getUsers()
        };
    }

    handleClickAddUser () {
        this.setState({ wantAdd: !this.state.wantAdd });
    }

    _onChange = () => {
        this.setState(this._getAppState());
    };

    componentDidMount () {
        UserStore.on(CHANGE_EVENT, this._onChange);
    }

    componentWillUnmount () {
        UserStore.removeListener(CHANGE_EVENT, this._onChange);
    }

    render () {
        const { wantAdd, users } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonAddUser" data-testid="ButtonAddUser" onClick={this.handleClickAddUser}>
                    Add new User
                </button>
                {
                    wantAdd &&
                    (
                        <User isNewUser={true}/>
                    )

                }
                <hr/>
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
