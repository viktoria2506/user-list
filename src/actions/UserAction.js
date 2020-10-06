import Dispatcher from '../dispatcher/AppDispatcher';
import ActionType from "./ActionType";

class UserAction {

    addNewUser(user) {
        Dispatcher.dispatch({
            actionType: ActionType.ADD_NEW_USER,
            user: user
        });
    }
    showUsers() {
        Dispatcher.dispatch({
            actionType: ActionType.SHOW_USERS
        });
    }

}

export default new UserAction();
