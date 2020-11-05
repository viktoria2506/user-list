import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import UserInfo from './user-info';
import EVENT_TYPE from './event-type';
import ACTION_TYPE from '../actions/action-type';

class UserStore extends EventEmitter {
    _users        = [];
    _searchedInfo = null;

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

    _findUserIndexByName (name) {
        return this._users.findIndex((oldUser) => name === oldUser.name);
    }

    _findUserIndexById (id) {
        return this._users.findIndex((oldUser) => id === oldUser.id);
    }

    _addNewUser (user) {
        user.id = this._users.length + 1;
        this._users.push(user);
    }

    _updateUser (user) {
        const index = this._findUserIndexById(user.id);
        if (index >= 0) {
            this._users[index] = user;
        }
        else {
            throw new Error('User with this id not found.');
        }
    }

    _findUser (userInfo) {
        const hasMatchedFields = (item, name) => item[name].toLowerCase().includes(userInfo[name].trim().toLowerCase());

        return this._users.filter(anyUser => {
            return hasMatchedFields(anyUser, 'name') &&
                   hasMatchedFields(anyUser, 'phone') &&
                   hasMatchedFields(anyUser, 'email') &&
                   hasMatchedFields(anyUser, 'website');
        });
    }

    _defineSearchFields () {
        return {
            name:    !!this._searchedInfo.name.trim(),
            phone:   !!this._searchedInfo.phone.trim(),
            email:   !!this._searchedInfo.email.trim(),
            website: !!this._searchedInfo.website.trim()
        };
    }

    _executeSearch () {
        const _foundUsers = this._findUser(this._searchedInfo);

        this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
    }

    _actionAddNewUser (user, force) {
        const index = this._findUserIndexByName(user.name);

        if (index === -1 || force) {
            this._addNewUser(user);
            if (this._searchedInfo) {
                this._executeSearch();
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

    _actionUpdateUser (user, force) {
        const index = this._findUserIndexByName(user.name);

        if (index === -1 || force) {
            this._updateUser(user);
            if (this._searchedInfo) {
                this._executeSearch();
            }
            else {
                this.emit(EVENT_TYPE.userUpdated);
            }
        }
        else {
            const userId = this._users[index].id;
            this.emit(EVENT_TYPE.updateFailed, userId);
        }
    }

    _actionFindUser (userInfo) {
        this._searchedInfo = userInfo;
        const _foundUsers  = this._findUser(userInfo);
        this.emit(EVENT_TYPE.usersFound, _foundUsers, this._defineSearchFields());
    }

    _actionStopFindUser () {
        this._searchedInfo = null;
        this.emit(EVENT_TYPE.change);
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            this._actionAddNewUser(action.user, action.force);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.updateUser) {
            this._actionUpdateUser(action.user, action.force);
        }
        else if (action.ACTION_TYPE === ACTION_TYPE.findUser) {
            this._actionFindUser(action.userInfo);
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
