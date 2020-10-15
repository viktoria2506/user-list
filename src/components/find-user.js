import React from 'react';

import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default class FindUser extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            user: {
                info:    {
                    name: '',
                    phone: '',
                    email: '',
                    website: ''
                },
                address: {},
                company: {}
            }
        };

        this._handleFind   = this._handleFind.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _handleFind (e) {
        const { user } = this.state;
        const findUser = new UserInfo(user.info, user.address, user.company);

        UserAction.findUser(findUser);
        e.preventDefault();
    }

    _handleChange (e) {
        const { user } = this.state;
        const name     = e.target.name;

        user.info[name] = e.target.value;
        this.setState({ user });
        e.preventDefault();
    }

    render () {
        return (
            <form className="SearchInfo">
                <p><label>
                    Name: <input type="text"
                                 name="name"
                                 onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Phone: <input type="text"
                                  name="phone"
                                  onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Email: <input type="email"
                                  name="email"
                                  onChange={this._handleChange}/>
                </label></p>
                <p><label>
                    Website: <input type="text"
                                    name="website"
                                    onChange={this._handleChange}/>
                </label></p>
                <button className="Find" onClick={this._handleFind}>Find</button>
            </form>
        );
    }

}
