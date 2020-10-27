import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import UserInfo from '../../stores/user-info';

fixture`App tests`
    .page(`http://localhost:3000`)
    .beforeEach(async () => {
        await waitForReact();
    });

test('Update user', async t => {
    const userInfo       = new UserInfo(
        {
            name:  'Viktoria',
            phone: '+79500418181'
        }
    );
    const incorrectPhone = 'incorrect';
    const user           = ReactSelector('UserList div div User form');
    const edit           = user.find('button').withText('Edit');
    const inputName      = user.find('input').nth(0);
    const inputPhone     = user.find('input').nth(1);
    const save           = user.find('button').withText('Save');
    const undo           = user.find('button').withText('Undo');

    await t
        .click(edit)
        .typeText(inputName, userInfo.name, { replace: true })
        .typeText(inputPhone, userInfo.phone, { replace: true })
        .click(save)
        .expect(inputName.value).eql(userInfo.name)
        .expect(inputPhone.value).eql(userInfo.phone)
        .click(edit)
        .typeText(inputPhone, incorrectPhone, { replace: true })
        .expect(inputPhone.classNames).eql(['field-error'])
        .click(undo)
        .expect(inputPhone.value).eql(userInfo.phone);
});
