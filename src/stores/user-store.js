import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import EVENT_TYPE from './event-type';
import ACTION_TYPE from '../actions/action-type';

class UserStore extends EventEmitter {
    _users        = [];
    _searchedUser = new UserInfo({}, {}, {});

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
        return this._users.filter((anyUser) =>
            (anyUser.name.toLowerCase().includes(user.name.toLowerCase()) &&
             anyUser.phone.toLowerCase().includes(user.phone.toLowerCase()) &&
             anyUser.email.toLowerCase().includes(user.email.toLowerCase()) &&
             anyUser.website.toLowerCase().includes(user.website.toLowerCase())
            ));
    }

    _defineSearchFields () {
        return {
            name:    this._searchedUser.name !== '',
            phone:   this._searchedUser.phone !== '',
            email:   this._searchedUser.email !== '',
            website: this._searchedUser.website !== ''
        };
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
            if (action.searchMode) {
                const _foundUsers = this._findUser(this._searchedUser);
                this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
            }
            else {
                this.emit(EVENT_TYPE.change);
            }
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.findUser) {
            this._searchedUser = action.user;
            const _foundUsers  = this._findUser(action.user);
            this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
