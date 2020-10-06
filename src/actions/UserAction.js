import Dispatcher from '../dispatcher/AppDispatcher';
import ActionType from './ActionType';

class UserAction {

    addNewUser (user) {
        Dispatcher.dispatch({
            actionType: ActionType.ADD_NEW_USER,
            user:       user
        });
    }
}

export default new UserAction();
