import { EventEmitter } from 'events';

import Dispatcher from '../dispatcher/app-dispatcher';
import usersData from '../data/users.json';
import CHANGE_EVENT from './event-type';
import ACTION_TYPE from '../actions/action-type';
import UserInfo from './user-info';


class UserStore extends EventEmitter {
    _users = [];

    constructor () {
        super();

        usersData.map((user) => {
            let newUser = new UserInfo(
                user.name, user.phone, user.email, user.website,
                user.address.city, user.address.street, user.address.suite, user.address.zipcode,
                user.company.name, user.company.catchPhrase, user.company.bs
            );
            this._users.push(user);
        });

        Dispatcher.register(this.registerActions.bind(this));
    }

    _addNewUser (user) {
        this._users.push(user);
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            this._addNewUser(action.user);
            this.emit(CHANGE_EVENT);
        }
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
