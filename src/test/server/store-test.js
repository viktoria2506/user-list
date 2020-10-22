const UserAction = require('../../../_compiled_/actions/user-action').default;
const UserInfo   = require('../../../_compiled_/stores/user-info').default;
const assert     = require('assert');
const usersData  = require('../../data/users.json');
const UserStore  = require('../../../_compiled_/stores/user-store').default;

let users;

describe('UserStore', () => {
    beforeEach(() => {
        users = usersData.map((user) => {
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
                    },
                    {},
                    {}
                );
                users.push(user);
                UserAction.addNewUser(user);
                assert(users, UserStore.getUsers());
            });
            it('User with incorrect fields should not be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Vika',
                        phone:   'phone0418181',
                        email:   'vika.chernookaya@mail.ru',
                        website: ''
                    },
                    {},
                    {}
                );
                UserAction.addNewUser(user);
                assert(users, UserStore.getUsers());
            });
            it('Existing user should not be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Ervin Howell',
                        phone:   '0418181',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    },
                    {},
                    {}
                );
                UserAction.addNewUser(user);
                assert(users, UserStore.getUsers());
            });
            it('Existing user should not be added', () => {
                const user = new UserInfo(
                    {
                        id:      11,
                        name:    'Ervin Howell',
                        phone:   '111111',
                        email:   'ervin@mail.ru',
                        website: 'github.com'
                    },
                    {},
                    {}
                );
                users.push(user);
                UserAction.addNewUser(user, true);
                assert(users, UserStore.getUsers());
            })
        });
        describe('updateUser', () => {
            it('User should be updated', () => {

            })
        })
    });
});
