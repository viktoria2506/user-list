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

    _findUserIndexByName (user) {
        return this._users.findIndex((oldUser) => user.name === oldUser.name);
    }

    _findUserIndexById (user) {
        return this._users.findIndex((oldUser) => user.id === oldUser.id);
    }

    _addNewUser (user) {
        user.id = this._users.length + 1;
        this._users.push(user);
    }

    _updateUser (user) {
        const index = this._findUserIndexById(user);
        if (index >= 0) {
            this._users[index] = user;
        }
        else {
            throw new Error('User with this id not found.');
        }
    }

    _findUser (user) {
        this._foundUsers = this._users.filter((anyUser) =>
            (anyUser.name.toLowerCase().includes(user.name.toLowerCase()) &&
             anyUser.phone.toLowerCase().includes(user.phone.toLowerCase()) &&
             anyUser.email.toLowerCase().includes(user.email.toLowerCase()) &&
             anyUser.website.toLowerCase().includes(user.website.toLowerCase())
            ));
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            const index = this._findUserIndexByName(action.user);
            if (index === -1 || action.force) {
                this._addNewUser(action.user);
                this.emit(EVENT_TYPE.userAdded);
            }
            else {
                const userId = this._users[index].id;
                this.emit(EVENT_TYPE.addingFailed, userId);
            }
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._updateUser(action.user);
            this.emit(EVENT_TYPE.change);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.findUser) {
            this._findUser(action.user);
            this.emit(EVENT_TYPE.change, this._foundUsers);
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
