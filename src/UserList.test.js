import React from 'react';
import { render } from '@testing-library/react';
import UserList from './UserList';


test('renders learn react link', () => {
    let { getByTestId } = render(<UserList/>);
    const buttonAddUser = getByTestId('ButtonAddUser');
    expect(buttonAddUser).toHaveClass("ButtonAddUser");
});
