import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/AppDispatcher';
import ActionType from '../actions/ActionType';
import usersData from '../data/users.json';

const CHANGE_EVENT = 'CHANGE';
let _users         = usersData;

class UserStore extends EventEmitter {

    constructor () {
        super();

        Dispatcher.register(this.registerActions.bind(this));
    }

    registerActions (action) {
        switch (action.actionType) {
            case ActionType.ADD_NEW_USER:
                this._addNewUser(action.user);
                this.emit(CHANGE_EVENT);
                break;
            case ActionType.SHOW_USERS:
                this.getUsers();
                this.emit(CHANGE_EVENT);
                break;
        }
    }

    _addNewUser (user) {
        _users.push(user);

    }

    getUsers () {
        //var reader = new FileReader();
        console.log(_users);
        return _users;
    }

    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default new UserStore();
