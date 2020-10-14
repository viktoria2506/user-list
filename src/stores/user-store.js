import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import EVENT_TYPE from './event-type';
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

    _addNewUser (user, force) {
        const index = this._users.findIndex((oldUser) => user.name === oldUser.name);
        if (index === -1 || force) {
            user.id = this._users.length + 1;
            this._users.push(user);
        } else {
            return this._users[index].id;
        }
    }

    _updateUser (user) {
        const index = this._users.findIndex((oldUser) => user.id === oldUser.id);
        if (index >= 0) {
            this._users[index] = user;
        } else {
            throw new Error("User with this id not found.")
        }
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            let result = this._addNewUser(action.user, action.force);
            if (result > 0) {
                this.emit(EVENT_TYPE.addNewUser, result);
            } else {
                this.emit(EVENT_TYPE.change);
            }
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._updateUser(action.user);
            this.emit(EVENT_TYPE.change);
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
