const assert = require('assert');

const usersData  = require('../../data/users.json');
const UserAction = require('../../../_compiled_/actions/user-action').default;
const UserInfo   = require('../../../_compiled_/stores/user-info').default;
const UserStore  = require('../../../_compiled_/stores/user-store').default;
const EVENT_TYPE = require('../../../_compiled_/stores/event-type').default;

let users;
let userData;
let userAction;
let foundUsers;
let searchFields;
let userId;


UserStore.on(EVENT_TYPE.usersFound, getFoundUsers);
UserStore.on(EVENT_TYPE.addingFailed, getUserID);

UserStore.off(EVENT_TYPE.usersFound, getFoundUsers);
UserStore.off(EVENT_TYPE.addingFailed, getUserID);

function getFoundUsers (users, fields) {
    foundUsers   = users;
    searchFields = fields;
}

function getUserID (id) {
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
        users      = _initUserList();
        userData   = UserStore;
        userAction = UserAction;
    });

    describe('.getUsers()', () => {
        it('Should return a list of users', () => {
            assert(users, UserStore.getUsers());
        });
    });

    describe('Actions', () => {
        describe('addNewUser', () => {
            it('A new user should be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Vika',
                        phone:   '89500418181',
                        email:   'vika.chernookaya@mail.ru',
                        website: 'github.com'
                    }
                );
                users.push(user);
                userAction.addNewUser(user);
                assert(users, userData.getUsers());
            });
            it('User with incorrect fields should not be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Vika',
                        phone:   'incorrect0418181',
                        email:   'vika.chernookaya@mail.ru',
                        website: ''
                    }
                );
                userAction.addNewUser(user);
                assert(users, userData.getUsers());
            });
            it('Existing user should not be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Ervin Howell',
                        phone:   '0418181',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    }
                );
                userAction.addNewUser(user);
                assert(users, userData.getUsers());
                console.assert(2, userId);
            });
            it('Existing user should be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Ervin Howell',
                        phone:   '111111',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    }
                );
                users.push(user);
                userAction.addNewUser(user, true);
                assert(users, userData.getUsers());
            });
            it('User should be added in search mode', () => {
                const user     = new UserInfo(
                    {
                        id:      11,
                        name:    'Vika',
                        phone:   '111111',
                        email:   'vika@mail.ru',
                        website: 'github.com'
                    }
                );
                const findUser = new UserInfo(
                    {
                        name:    'Vika',
                        phone:   '',
                        email:   '',
                        website: ''
                    }
                );
                const fields   = {
                    name:    true,
                    phone:   false,
                    email:   false,
                    website: false
                };
                users.push(user);
                userAction.findUser(findUser);
                userAction.addNewUser(user);
                assert(users, userData.getUsers());
                assert([], foundUsers);
                assert(fields, searchFields);
            });
        });

        describe('updateUser', () => {
            it('User should be updated', () => {
                const user = new UserInfo(
                    {
                        id:      2,
                        name:    'Ervin',
                        phone:   '555',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    }
                );
                users[1]   = user;
                userAction.updateUser(user);
                assert(users, userData.getUsers());
            });
            it('User should not be updated', () => {
                const user = new UserInfo(
                    {
                        id:      2,
                        name:    'Ervin',
                        phone:   'invalid phone',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    }
                );
                userAction.updateUser(user);
                assert(users, userData.getUsers());
            });
        });

        describe('findUser', () => {
            it('Not found users', () => {
                const user   = new UserInfo(
                    {
                        name:    'Vika',
                        phone:   '',
                        email:   '',
                        website: ''
                    }
                );
                const fields = {
                    name:    true,
                    phone:   false,
                    email:   false,
                    website: false
                };
                userAction.findUser(user);
                console.log(foundUsers);
                assert([], foundUsers);
                assert(fields, searchFields);
            });
            it('Should be found 1 user with name Ervin', () => {

            });
        });

        describe('stopFindUser', () => {
            it('Stop find user', () => {
                const user = new UserInfo(
                    {
                        name:    'Ervin',
                        phone:   '',
                        email:   '',
                        website: ''
                    }
                );
                userAction.findUser(user);
                assert([], foundUsers);
            });
        });
    });
});
