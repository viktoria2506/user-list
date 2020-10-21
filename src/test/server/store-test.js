const UserStore = require('../../../_compiled_/stores/user-store').default;

describe('UserStore', () => {
    describe('.getUsers()', () => {
        it('Should return a list of users', () => {
            console.log(UserStore.getUsers());
        });
    });
});
