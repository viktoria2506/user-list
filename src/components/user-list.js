import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import EVENT_TYPE from '../stores/event-type';

import User from './user.js';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = this._getAppState();
    }

    _getAppState () {
        return {
            duplicateUserId: '',
            addDuplicate:    false,
            wantAdd:         false,
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
        let { addDuplicate } = this.state;

        this.setState({ duplicateUserId: userId, addDuplicate: !addDuplicate });
    };

    componentDidMount () {
        UserStore.on(EVENT_TYPE.change, this._onChange);
        UserStore.on(EVENT_TYPE.userAdded, this._onChange);
        UserStore.on(EVENT_TYPE.addingFailed, this._addingFailed);
    }

    componentWillUnmount () {
        UserStore.off(EVENT_TYPE.change, this._onChange);
        UserStore.off(EVENT_TYPE.userAdded, this._onChange);
        UserStore.off(EVENT_TYPE.addingFailed, this._addingFailed);
    }

    render () {
        const { wantAdd, users, duplicateUserId, addDuplicate } = this.state;

        return (
            <div className="UserList">
                <button className="ButtonAddUser" data-testid="ButtonAddUser" onClick={this._handleClickAddUser}>
                    Add new User
                </button>
                {
                    wantAdd &&
                    (
                        <User isNewUser={true} duplicateUserId={duplicateUserId} addDuplicate={addDuplicate}/>
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
