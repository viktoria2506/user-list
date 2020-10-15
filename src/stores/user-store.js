import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import EVENT_TYPE from './event-type';
import ACTION_TYPE from '../actions/action-type';

class UserStore extends EventEmitter {
    _allUsers   = [];
    _foundUsers = [];

    constructor () {
        super();

        this._allUsers = usersData.map((user) => {
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
        const index = this._allUsers.findIndex((oldUser) => user.name === oldUser.name);
        if (index === -1 || force) {
            user.id = this._allUsers.length + 1;
            this._allUsers.push(user);
        }
        else {
            return this._allUsers[index].id;
        }
    }

    _updateUser (user) {
        const index = this._allUsers.findIndex((oldUser) => user.id === oldUser.id);
        if (index >= 0) {
            this._allUsers[index] = user;
        }
        else {
            throw new Error('User with this id not found.');
        }
    }

    _findUser (user) {
         this._foundUsers  = this._allUsers.filter((anyUser) =>
            (anyUser.name.includes(user.name) &&
             anyUser.phone.includes(user.phone) &&
             anyUser.email.includes(user.email) &&
             anyUser.website.includes(user.website)
            ));
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            let result = this._addNewUser(action.user, action.force);
            if (result > 0) {
                this.emit(EVENT_TYPE.addNewUser, result);
            }
            else {
                this.emit(EVENT_TYPE.change, this._allUsers);
            }
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._updateUser(action.user);
            this.emit(EVENT_TYPE.change, this._allUsers);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.findUser) {
            this._findUser(action.user);
            this.emit(EVENT_TYPE.change, this._foundUsers);
        }
    }

    getAllUsers () {
        return this._allUsers;
    }

    getFoundUsers () {

    }

}

export default new UserStore();
