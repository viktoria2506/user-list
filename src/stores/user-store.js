import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import CHANGE_EVENT from './event-type';
import ACTION_TYPE from '../actions/action-type';

class UserStore extends EventEmitter {
    _users = [];

    constructor () {
        super();

        this._users = usersData.map((user) => {
            return new UserInfo(
                {
                    id:      user.id,
                    name:    user.name,
                    phone:   user.phone,
                    email:   user.email,
                    website: user.website
                },
                user.address,
                user.company
            );
        });

        Dispatcher.register(this.registerActions.bind(this));
    }

    _addNewUser (user) {
        user.id = this._users.length + 1;
        this._users.push(user);
    }

    _updateUser (user) {
        const index = this._users.findIndex((oldUser) => user.id === oldUser.id);
        if (index) {
            this._users[index] = user;
        } else {
            throw new Error("User with this id not found.")
        }
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            this._addNewUser(action.user);
            this.emit(CHANGE_EVENT);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._updateUser(action.user);
            this.emit(CHANGE_EVENT);
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
