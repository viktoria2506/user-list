const assert = require('assert');
const _      = require('lodash');

const usersData  = require('../../test/data/users.json');
const UserAction = require('../../../_compiled_/actions/user-action').default;
const UserInfo   = require('../../../_compiled_/stores/user-info').default;
const UserStore  = require('../../../_compiled_/stores/user-store').default;
const EVENT_TYPE = require('../../../_compiled_/stores/event-type').default;

const TEST_USER = new UserInfo(
    {
        name:    'Ervin New',
        phone:   '89500418181',
        email:   'vika.chernookaya@mail.ru',
        website: 'github.com'
    }
);

const TEST_USER_EXISTING = new UserInfo(
    {
        name:    'Ervin Howell',
        phone:   '0418181',
        email:   'ervin@mail.ru',
        website: 'github.com'
    }
);

const SEARCH_USER_INFO = new UserInfo({ name: 'Ervin' });

const SEARCH_NON_EXIST_USER_INFO = new UserInfo({ name: 'Ivan' });

const UPDATE_USER = new UserInfo(
    {
        id:      2,
        name:    'Vika',
        phone:   '555',
        email:   'ervin@mail.ru',
        website: 'github.com'
    }
);

const UPDATE_USER_EXISTING = new UserInfo(
    {
        id:      4,
        name:    'Ervin Howell',
        phone:   '555',
        email:   'ervin@mail.ru',
        website: 'github.com'
    });


const SEARCH_FIELDS = {
    name:    true,
    phone:   false,
    email:   false,
    website: false
};

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

    describe('.getUsers()', () => {
        it('Should return a list of users', () => {
            const users = _getInitialUserList();

            assert.deepEqual(UserStore.getUsers(), users);
        });
    });

    describe('Actions', () => {
        describe('addNewUser', () => {
            it('Should emit userAdded event', async () => {
                let newUser = _.cloneDeep(TEST_USER);

                newUser.id = UserStore.getUsers().length + 1;
                await subEvent(EVENT_TYPE.userAdded, () => UserAction.addNewUser(TEST_USER));

                assert.deepEqual(UserStore._users[UserStore._users.length - 1], newUser);
            });

            it('Should emit addingFailed event with duplicateUserId if user exists ', async () => {
                const prevUserStoreSize = UserStore.getUsers().length;
                const [userId]          = await subEvent(EVENT_TYPE.addingFailed, () => UserAction.addNewUser(TEST_USER_EXISTING));

                assert(UserStore.getUsers().length, prevUserStoreSize);
                assert.strictEqual(userId, 2);
            });

            it('Should emit userAdded event if user exists, but force flag is true', async () => {
                let newUser = _.cloneDeep(TEST_USER_EXISTING);

                newUser.id = UserStore.getUsers().length + 1;
                await subEvent(EVENT_TYPE.userAdded, () => UserAction.addNewUser(TEST_USER_EXISTING, true));

                assert.deepEqual(UserStore._users[UserStore._users.length - 1], newUser);
            });

            it('Should emit usersFound event with updated foundUsers if we are in search mode', async () => {
                const prevUserStoreSize = UserStore.getUsers().length;

                let newUser = _.cloneDeep(TEST_USER);

                newUser.id                       = prevUserStoreSize + 1;
                UserStore._searchedInfo          = _.cloneDeep(SEARCH_USER_INFO);
                const [foundUsers, searchFields] = await subEvent(EVENT_TYPE.usersFound, () => UserAction.addNewUser(TEST_USER));

                assert(foundUsers.includes(TEST_USER));
                assert.deepEqual(UserStore.getUsers().length, prevUserStoreSize + 1);
                assert.deepEqual(searchFields, SEARCH_FIELDS);
            });
        });

        describe('updateUser', () => {
            it('Should emit change event', async () => {
                assert.notEqual(UserStore.getUsers()[1], UPDATE_USER);
                await subEvent(EVENT_TYPE.change, () => UserAction.updateUser(UPDATE_USER));

                assert.deepEqual(UserStore.getUsers()[1], UPDATE_USER);
            });

            it('Should emit usersFound event with updated foundUsers and searchFields if update in search mode', async () => {
                assert.notEqual(UserStore.getUsers()[1], UPDATE_USER);

                UserStore._searchedInfo = _.cloneDeep(SEARCH_USER_INFO);

                const [updatedFoundUsers, searchFields] = await subEvent(EVENT_TYPE.usersFound, () => UserAction.updateUser(UPDATE_USER));

                assert.deepEqual(updatedFoundUsers.length, 0);
                assert.deepEqual(UserStore.getUsers()[1], UPDATE_USER);
                assert.deepEqual(searchFields, SEARCH_FIELDS);
            });

            it('Should emit addingFailed event with duplicateUserId if user exists', async () => {
                assert.notEqual(UserStore.getUsers()[4], UPDATE_USER_EXISTING);
                const [userId] = await subEvent(EVENT_TYPE.addingFailed, () => UserAction.updateUser(UPDATE_USER_EXISTING));

                assert.strictEqual(userId, 2);
            });

            it('Should emit change event if user exists, but force flag is true', async () => {
                let newUser = _.cloneDeep(UPDATE_USER_EXISTING);

                await subEvent(EVENT_TYPE.change, () => UserAction.updateUser(UPDATE_USER_EXISTING, true));

                assert.deepEqual(UserStore._users[3], newUser);
            });
        });

        describe('findUser', () => {
            it('Should emit usersFound event with empty foundUsers and searchFields if users not found', async () => {
                const [foundUsers, searchFields] = await subEvent(EVENT_TYPE.usersFound, () => UserAction.findUser(SEARCH_NON_EXIST_USER_INFO));

                assert.deepEqual(UserStore._searchedInfo, SEARCH_NON_EXIST_USER_INFO);
                assert.deepEqual(foundUsers.length, 0);
                assert.deepEqual(searchFields, SEARCH_FIELDS);
            });

            it('Should emit usersFound event with foundUsers and searchFields if user found', async () => {
                const [foundUsers, searchFields] = await subEvent(EVENT_TYPE.usersFound, () => UserAction.findUser(SEARCH_USER_INFO));

                assert.deepEqual(foundUsers, [UserStore.getUsers()[1]]);
                assert.deepEqual(searchFields, SEARCH_FIELDS);
            });
        });

        describe('stopFindUser', () => {
            it('Should emit change event and clear searchedUser if stop search user', async () => {
                await subEvent(EVENT_TYPE.change, () => UserAction.stopFindUser());

                assert.deepEqual(UserStore._searchedInfo, null);
            });
        });
    });

    describe('private methods', () => {
        describe('_findUserIndexById', () => {
            it('Should return the index of the user with the same id', () => {
                assert.deepEqual(UserStore._findUserIndexById(UPDATE_USER.id), 1);
            });
        });

        describe('_findUserIndexByName', () => {
            it('Should return the index of the user with the same name', () => {
                assert.deepEqual(UserStore._findUserIndexByName(TEST_USER_EXISTING.name), 1);
            });
        });

        describe('_defineSearchFields', () => {
            it('Should return the index of the user with the same name', () => {
                UserStore._searchedInfo = new UserInfo({
                    name:  'Ervin  ',
                    phone: '  '
                });

                assert.deepEqual(UserStore._defineSearchFields(), SEARCH_FIELDS);
            });
        });
    });
});
