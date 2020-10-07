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

        usersData.map((person) => {
            let user = new UserInfo(
                person.name, person.phone, person.email, person.website,
                person.address.city, person.address.street, person.address.suite, person.address.zipcode,
                person.company.name, person.company.catchPhrase, person.company.bs
                );
            this._users.push(user);
        });

        Dispatcher.register(this.registerActions.bind(this));
    }

    registerActions (action) {
        if (action.ACTION_TYPE === ACTION_TYPE.addNewUser) {
            this._addNewUser(action.user);
            this.emit(CHANGE_EVENT);
        }
    }

    _addNewUser (user) {
        this._users.push(user);
    }

    getUsers () {
        return this._users;
    }
}

export default new UserStore();
