import Dispatcher from '../dispatcher/app-dispatcher';
import ACTION_TYPE from './action-type';

class UserAction {
    addNewUser (user, force) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.addNewUser,
            user:        user,
            force:       force
        });
    }

    updateUser (user) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.updateUser,
            user:        user
        });
    }
    findUser (user) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.findUser,
            user:        user
        });
    }
}

export default new UserAction();

