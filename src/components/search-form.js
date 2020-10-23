import React from 'react';

import { FIELD_NAMES } from './user';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default class SearchForm extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            user: new UserInfo()
        };
    }

    _handleFind = e => {
        const { user } = this.state;

        UserAction.findUser(user);
        e.preventDefault();
    };

    _handleChange = e => {
        const { user } = this.state;
        const name     = e.target.name;

        user[name] = e.target.value;
        this.setState({ user });
        e.preventDefault();
    };

    render () {
        return (
            <form className="SearchInfo">
                <p><label>
                    Name: <input type="text"
                                 name={FIELD_NAMES.name}
                                 onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Phone: <input type="text"
                                  name={FIELD_NAMES.phone}
                                  onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Email: <input type="email"
                                  name={FIELD_NAMES.email}
                                  onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Website: <input type="text"
                                    name={FIELD_NAMES.website}
                                    onChange={this._handleChange}/>
                </label></p>
                <button className="Find" onClick={this._handleFind}>Find</button>
            </form>
        );
    }
}
