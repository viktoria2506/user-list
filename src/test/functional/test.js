import { ReactSelector, waitForReact } from 'testcafe-react-selectors';

import UserInfo from '../../stores/user-info';
import ERRORS from '../../errors';

fixture`App tests`
    .page(`http://localhost:3000`)
    .beforeEach(async () => {
        await waitForReact();
    });

const userInfo = new UserInfo(
    {
        name:  'Viktoria',
        phone: '+79500418181'
    }
);

const user       = ReactSelector('User form');
const edit       = ReactSelector('Edit');
const editButton = edit.find('button').withText('Edit');
const inputName  = user.find('input').nth(0);
const inputPhone = user.find('input').nth(1);
const save       = edit.find('button').withText('Save');
const undo       = edit.find('button').withText('Undo');
const error      = user.find('p').nth(1).find('label').find('nobr');

test('User should be updated', async t => {
    await t
        .click(editButton)
        .typeText(inputName, userInfo.name, { replace: true })
        .typeText(inputPhone, userInfo.phone, { replace: true })
        .click(save)

        .expect(inputName.value).eql(userInfo.name)
        .expect(inputPhone.value).eql(userInfo.phone);
});

test('User should not be updated with an invalid phone', async t => {
    const phoneInitialValue = await inputPhone.value;

    await t
        .click(editButton)
        .typeText(inputPhone, 'incorrect', { replace: true })

        .expect(inputPhone.classNames).eql(['field-error'])
        .expect(save.hasAttribute('disabled')).ok()
        .expect(error.textContent).eql(ERRORS.phoneInvalid)

        .click(undo)

        .expect(inputPhone.value).eql(phoneInitialValue);
});
