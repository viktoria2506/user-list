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
        const hasMatchedFields = (item, name) => item[name].toLowerCase().includes(user[name].trim().toLowerCase());

        return this._users.filter(anyUser => {
            return hasMatchedFields(anyUser, 'name') &&
                   hasMatchedFields(anyUser, 'phone') &&
                   hasMatchedFields(anyUser, 'email') &&
                   hasMatchedFields(anyUser, 'website');
        });
    }

    _defineSearchFields () {
        return {
            name:    !!this._searchedUser.name.trim(),
            phone:   !!this._searchedUser.phone.trim(),
            email:   !!this._searchedUser.email.trim(),
            website: !!this._searchedUser.website.trim()
        };
    }

    _checkSearchModeAndEmit(emit) {
        if (this._searchedUser instanceof UserInfo) {
            const _foundUsers = this._findUser(this._searchedUser);

            this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
        }
        else {
            this.emit(EVENT_TYPE[emit]);
        }
    }

    _actionAddNewUser (user, force) {
        const index = this._findUserIndexByName(user);

        if (index === -1 || force) {
            this._addNewUser(user);
            this._checkSearchModeAndEmit('userAdded')
        }
        else {
            const userId = this._users[index].id;
            this.emit(EVENT_TYPE.addingFailed, userId);
        }
    }

    _actionUpdateUser (user) {
        this._updateUser(user);
        this._checkSearchModeAndEmit('change');
    }

    _actionFindUser (user) {
        this._searchedUser = user;
        const _foundUsers  = this._findUser(user);
        this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
    }

    _actionStopFindUser () {
        this._searchedUser = {};
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
