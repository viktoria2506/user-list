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
                {
                    city:    user.address.city,
                    street:  user.address.street,
                    suite:   user.address.suite,
                    zipcode: user.address.zipcode
                },
                {
                    nameCompany: user.company.name,
                    catchPhrase: user.company.catchPhrase,
                    bs:          user.company.bs
                }
            );
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

    getSize () {
        return this._users.length;
    }
}

export default new UserStore();
