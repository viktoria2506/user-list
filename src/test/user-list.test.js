import React from 'react';
import { render } from '@testing-library/react';
import UserList from '../components/user-list';


test('renders learn react link', () => {
    let { getByTestId } = render(<UserList/>);
    const buttonAddUser = getByTestId('ButtonAddUser');
    expect(buttonAddUser).toHaveClass("ButtonAddUser");
});
