const assert = require('assert');

const usersData  = require('../../data/users.json');
const UserAction = require('../../../_compiled_/actions/user-action').default;
const UserInfo   = require('../../../_compiled_/stores/user-info').default;
const UserStore  = require('../../../_compiled_/stores/user-store').default;
const EVENT_TYPE = require('../../../_compiled_/stores/event-type').default;

const TEST_USER = new UserInfo(
    {
        id:      11,
        name:    'Ervin New',
        phone:   '89500418181',
        email:   'vika.chernookaya@mail.ru',
        website: 'github.com'
    }
);

const TEST_USER_EXISTING = new UserInfo(
    {
        id:      11,
        name:    'Ervin Howell',
        phone:   '0418181',
        email:   'ervin@mail.ru',
        website: 'github.com'
    }
);

const SEARCH_USER_INFO = new UserInfo(
    {
        name: 'Ervin'
    }
);

const SEARCH_USER_INFO_2 = new UserInfo(
    {
        name:  'Ervin  ',
        phone: '  '
    }
);

const UPDATE_USER = new UserInfo(
    {
        id:      2,
        name:    'Vika',
        phone:   '555',
        email:   'ervin@mail.ru',
        website: 'github.com'
    }
);

const SEARCH_FIELDS = {
    name:    true,
    phone:   false,
    email:   false,
    website: false
};

let users;
let foundUsers;
let searchFields;
let userId;

UserStore.on(EVENT_TYPE.usersFound, _getFoundUsers);
UserStore.on(EVENT_TYPE.addingFailed, _getUserID);

function _getFoundUsers (users, fields) {
    foundUsers   = users;
    searchFields = fields;
}

function _getUserID (id) {
    userId = id;
}

function _initUserList () {
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
    beforeEach(() => {
        users = _initUserList();
    });

    afterEach(() => {
        UserStore._users        = _initUserList();
        UserStore._searchedUser = {};
    });

    describe('.getUsers()', () => {
        it('Should return a list of users', () => {
            assert(UserStore.getUsers(), users);
        });
    });

    describe('Actions', () => {
        describe('addNewUser', () => {
            it('Should emit userAdded event', () => {
                users.push(TEST_USER);
                UserAction.addNewUser(TEST_USER);
                assert(UserStore.getUsers(), users);
                assert(UserStore._users[UserStore._users.length - 1].id, UserStore._users.length);
            });

            it('Should emit addingFailed event with duplicateUserId if user exists ', () => {
                UserAction.addNewUser(TEST_USER_EXISTING);
                assert(UserStore.getUsers(), users);
                assert(userId, 2);
            });

            it('Should emit userAdded event if user exists, but force flag is true', () => {
                users.push(TEST_USER_EXISTING);
                UserAction.addNewUser(TEST_USER_EXISTING, true);
                assert(UserStore.getUsers(), users);
            });

            it('Should emit usersFound event with foundUsers and searchFields if we are in search mode', () => {
                users.push(TEST_USER);
                UserAction.findUser(SEARCH_USER_INFO);
                UserAction.addNewUser(TEST_USER);
                assert(UserStore.getUsers(), users);
                assert(foundUsers, []);
                assert(searchFields, SEARCH_FIELDS);
            });
        });

        describe('updateUser', () => {
            it('Should emit change event', () => {
                assert.notEqual(users[1], UPDATE_USER);
                users[1] = UPDATE_USER;
                UserAction.updateUser(UPDATE_USER);
                assert(UserStore.getUsers(), users);
            });

            it('Should emit usersFound event with foundUsers and searchFields if update in search mode', () => {
                UserAction.findUser(SEARCH_USER_INFO);
                assert(foundUsers.length, 1);
                assert.notEqual(users[1], UPDATE_USER);
                UserAction.updateUser(UPDATE_USER);
                users[1] = UPDATE_USER;
                assert(foundUsers, []);
                assert(UserStore.getUsers(), users);
            });
        });

        describe('findUser', () => {
            it('Should emit usersFound event with empty foundUsers and searchFields if users not found', () => {
                UserAction.findUser(SEARCH_USER_INFO);
                assert(foundUsers, []);
                assert(searchFields, SEARCH_FIELDS);
            });

            it('Should emit usersFound event with foundUsers and searchFields if user found', () => {
                UserAction.findUser(SEARCH_USER_INFO);
                assert(foundUsers.length, 1);
                assert(searchFields, SEARCH_FIELDS);
            });
        });

        describe('stopFindUser', () => {
            it('Should emit change action and clear searchedUser if stop search user', () => {
                UserAction.stopFindUser();
                assert(UserStore.getUsers(), users);
                assert(UserStore._searchedUser, {});
            });
        });
    });

    describe('private methods', () => {
        describe('_findUserIndexById', () => {
            it('Should return the index of the user with the same id', () => {
                assert(UserStore._findUserIndexById(UPDATE_USER), 1);
            });
        });

        describe('_findUserIndexByName', () => {
            it('Should return the index of the user with the same name', () => {
                assert(UserStore._findUserIndexByName(TEST_USER_EXISTING), 1);
            });
        });

        describe('_defineSearchFields', () => {
            it('Should return the index of the user with the same name', () => {
                UserStore._searchedUser = SEARCH_USER_INFO_2;
                assert(UserStore._defineSearchFields, SEARCH_FIELDS);
            });
        });
    });
});
