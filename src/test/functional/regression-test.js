import { ReactSelector, waitForReact } from 'testcafe-react-selectors';

import UserInfo from '../../stores/user-info';

fixture`App tests`
    .page(`http://localhost:3000`)
    .beforeEach(async () => {
        await waitForReact();
    });

const userInfo = new UserInfo(
    {
        name:  'Viktoria',
        phone: '+79500418181'
    },
    {
        city:   'Minsk',
        street: 'Pionerskaya'
    }
);

const user          = ReactSelector('User form').nth(0);
const edit          = user.find('button').withText('Edit');
const save          = user.find('button').withText('Save');
const address       = ReactSelector('Address');
const inputCity     = address.find('input').nth(0);
const inputStreet   = address.find('input').nth(1);
const inputSuite    = address.find('input').nth(2);
const inputZipcode  = address.find('input').nth(3);
const showAddress   = user.find('button').withText('Show Address');
const deleteAddress = user.find('button').withText('Delete Address');

test('Address should be deleted', async t => {
    await t
        .click(edit)
        .click(showAddress)
        .typeText(inputCity, userInfo.address.city, { replace: true })
        .typeText(inputStreet, userInfo.address.street, { replace: true })

        .expect(inputCity.value).eql(userInfo.address.city)
        .expect(inputStreet.value).eql(userInfo.address.street)

        .click(deleteAddress)

        .expect(inputCity.value).eql('')
        .expect(inputStreet.value).eql('')
        .expect(inputSuite.value).eql('')
        .expect(inputZipcode.value).eql('')

        .click(save)

        .expect(showAddress.exists).notOk();
});
