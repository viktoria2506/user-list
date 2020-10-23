import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import EVENT_TYPE from './event-type';
import ACTION_TYPE from '../actions/action-type';

class UserStore extends EventEmitter {
    _users        = [];
    _searchedUser = {};

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
        return this._users.filter(anyUser => {
            return (anyUser.name.toLowerCase().includes(user.name.toLowerCase()) &&
                    anyUser.phone.toLowerCase().includes(user.phone.toLowerCase()) &&
                    anyUser.email.toLowerCase().includes(user.email.toLowerCase()) &&
                    anyUser.website.toLowerCase().includes(user.website.toLowerCase())
            );
        });
    }

    _defineSearchFields () {
        return {
            name:    this._searchedUser.name !== '',
            phone:   this._searchedUser.phone !== '',
            email:   this._searchedUser.email !== '',
            website: this._searchedUser.website !== ''
        };
    }

    _actionAddNewUser (user, force) {
        debugger;
        const index = this._findUserIndexByName(user);

        if (index === -1 || force) {
            this._addNewUser(user);
            if (this._searchedUser instanceof UserInfo) {
                const _foundUsers = this._findUser(this._searchedUser);

                this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
            }
            else {
                this.emit(EVENT_TYPE.userAdded);
            }
        }
        else {
            const userId = this._users[index].id;
            this.emit(EVENT_TYPE.addingFailed, userId);
        }
    }

    _actionUpdateUser (user) {
        this._updateUser(user);
        if (this._searchedUser) {
            const _foundUsers = this._findUser(this._searchedUser);
            this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
        }
        else {
            this.emit(EVENT_TYPE.change);
        }
    }

    _actionFindUser (user) {
        this._searchedUser = user;
        const _foundUsers  = this._findUser(user);
        this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
    }

    _actionStopFindUser () {
        this._searchedUser = {};
        this.emit(EVENT_TYPE.usersFound);
        this.emit(EVENT_TYPE.change);
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            this._actionAddNewUser(action.user, action.force);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._actionUpdateUser(action.user);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.findUser) {
            this._actionFindUser(action.user);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.stopFindUser) {
            this._actionStopFindUser();
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
