const assert = require('assert');
const _      = require('lodash');

const usersData  = require('../../test/data/users.json');
const UserAction = require('../../../_compiled_/actions/user-action').default;
const UserInfo   = require('../../../_compiled_/stores/user-info').default;
const UserStore  = require('../../../_compiled_/stores/user-store').default;
const EVENT_TYPE = require('../../../_compiled_/stores/event-type').default;

const UPDATE_USER_EXISTING = new UserInfo(
    {
        id:      4,
        name:    'Ervin Howell',
        phone:   '555',
        email:   'ervin@mail.ru',
        website: 'github.com'
    });

function subEvent (name, raiseAction) {
    return new Promise(resolve => {
        UserStore.on(name, (...args) => {
            resolve(args);
        });
        raiseAction();
    });
}
function _getInitialUserList () {
    return usersData.map((user) => {
        return new UserInfo(
            {
                id:      user.id,
                name:    user.name,
                phone:   user.phone,
                email:   user.email,
                website: user.website
            },
            user.address,
            user.company
        );
    });
}

describe('UserStore', () => {
    afterEach(() => {
        UserStore._users        = _getInitialUserList();
        UserStore._searchedInfo = null;
        UserStore.removeAllListeners();
    });

    describe('Actions', () => {
        describe('updateUser', () => {
            it('Should emit addingFailed event with duplicateUserId if user exists', async () => {
                assert.notEqual(UserStore.getUsers()[4], UPDATE_USER_EXISTING);
                const [userId] = await subEvent(EVENT_TYPE.updateFailed, () => UserAction.updateUser(UPDATE_USER_EXISTING));

                assert.strictEqual(userId, 2);
            });

            it('Should emit change event if user exists, but force flag is true', async () => {
                let newUser = _.cloneDeep(UPDATE_USER_EXISTING);

                await subEvent(EVENT_TYPE.userUpdated, () => UserAction.updateUser(UPDATE_USER_EXISTING, true));

                assert.deepEqual(UserStore._users[3], newUser);
            });
        });
    });
});
