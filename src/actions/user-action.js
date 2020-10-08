import Dispatcher from '../dispatcher/app-dispatcher';
import ACTION_TYPE from './action-type';

export function addNewUser (user) {
    Dispatcher.dispatch({
        ACTION_TYPE: ACTION_TYPE.addNewUser,
        user:        user
    });
}

