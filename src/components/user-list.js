import React from 'react';

import '../css/app.css';
import UserStore from '../stores/user-store';
import { addNewUser } from '../actions/user-action';
import CHANGE_EVENT from '../stores/event-type';
import UserInfo from '../stores/user-info';

import User from './user.js';

export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = this._getAppState();

        this.handleClickAddUser = this.handleClickAddUser.bind(this);
        this.handleClickSubmit  = this.handleClickSubmit.bind(this);
    }

    _getAppState () {
        return {
            wantAdd: false,
            users:   UserStore.getUsers(),
            size:    UserStore.getSize()
        };
    }

    handleClickAddUser () {
        this.setState({ wantAdd: !this.state.wantAdd });
    }

    handleClickSubmit () {
        //TODO: should be rewritten
        let companyInfo, addressInfo = {};

        if (document.getElementsByClassName('DetailsAddress')[0]) {
            addressInfo = {
                street:  document.getElementsByName('street')[0].value,
                city:    document.getElementsByName('city')[0].value,
                suite:   document.getElementsByName('suite')[0].value,
                zipcode: document.getElementsByName('zipcode')[0].value
            };
        }
        if (document.getElementsByClassName('DetailsCompany')[0]) {
            companyInfo = {
                nameCompany: document.getElementsByName('nameCompany')[0].value,
                catchPhrase: document.getElementsByName('name')[0].value,
                bs:          document.getElementsByName('bs')[0].value
            };
        }
        let userInfo = {
            id:      this.state.size + 1,
            name:    document.getElementsByName('name')[0].value,
            phone:   document.getElementsByName('phone')[0].value,
            email:   document.getElementsByName('email')[0].value,
            website: document.getElementsByName('website')[0].value
        };

        let newUser  = new UserInfo(userInfo, addressInfo, companyInfo);
        addNewUser(newUser);
    }

    _onChange = () => {
        this.setState(this._getAppState());
    };

    componentDidMount () {
        UserStore.on(CHANGE_EVENT, this._onChange);
    }

    componentWillUnmount () {
        UserStore.removeListener(CHANGE_EVENT, this._onChange);
    }

    render () {
        const { wantAdd, users } = this.state;
        return (
            <div className="UserList">
                <button className="ButtonAddUser" data-testid="ButtonAddUser" onClick={this.handleClickAddUser}>Add new
                    User
                </button>
                {
                    wantAdd &&
                    (
                        <div>
                            <User className="NewUser" isNewUser={true}/>
                            <button className="ButtonAddUser" onClick={this.handleClickSubmit}>Submit</button>
                        </div>
                    )
                }
                <hr/>
                {
                    users.map((user) => {
                        return (
                            <div className="UserInner" key={user.id}>
                                <User name={user.name}
                                      email={user.email}
                                      address={user.address}
                                      phone={user.phone}
                                      website={user.website}
                                      company={user.company}
                                      isNewUser={false}
                                />
                                <hr/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
