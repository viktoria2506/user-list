import Dispatcher from '../dispatcher/app-dispatcher';
import ACTION_TYPE from './action-type';

class UserAction {
    addNewUser (user, force) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.addNewUser,
            user,
            force
        });
    }

    updateUser (user, force) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.updateUser,
            user,
            force
        });
    }

    findUser (userInfo) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.findUser,
            userInfo
        });
    }

    stopFindUser () {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.stopFindUser
        });
    }
}

export default new UserAction();

