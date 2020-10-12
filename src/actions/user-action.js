import Dispatcher from '../dispatcher/app-dispatcher';
import ACTION_TYPE from './action-type';


class UserAction {
    addNewUser (user) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.addNewUser,
            user:        user
        });
    }
    updateUser (user) {
        Dispatcher.dispatch({
            ACTION_TYPE: ACTION_TYPE.updateUser,
            user:        user
        });
    }
}
export default new UserAction();

