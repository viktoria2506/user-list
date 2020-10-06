import React from 'react';
import User from './components/User.js';
import './css/App.css';
import UserStore from './stores/UserStore';
import UserAction from './actions/UserAction';


export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            wantAdd: false,
            users: UserStore.getUsers()
        }

        this.handleClickAddUser = this.handleClickAddUser.bind(this);
    }

    getAppState() {
        return {
            wantAdd: false,
            users: UserStore.getUsers()
        }
    }

    handleClickAddUser () {
        this.setState({ wantAdd: !this.state.wantAdd });
    }

    handleClickSubmit() {

        let user = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            website: document.getElementById('website').value,
            address: {
                city: document.getElementById('city').value,
                street: document.getElementById('street').value,
                suite: document.getElementById('suite').value,
                zipcode: document.getElementById('zipcode').value,
            },
            company: {
                name: document.getElementById('nameCompany').value,
                catchPhrase: document.getElementById('name').value,
                bs: document.getElementById('bs').value
            }

        }
        UserAction.addNewUser(user);
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState(this.getAppState());
    }

    render () {
        const { wantAdd, users } = this.state;
        return (
            <div className="UserList">
                <button className="ButtonAddUser" data-testid="ButtonAddUser" onClick={this.handleClickAddUser}>Add new User</button>
                {
                    wantAdd && <div>
                        <User className="NewUser" isNewUser={true}/>
                    <button className="ButtonAddUser"  onClick={this.handleClickSubmit}>Submit</button>
                    </div>

                }
                <hr/>
                {users.map((user) => {
                    return <div className="UserInner" key={user.id}>
                        <User name={user.name}
                              email={user.email}
                              address={user.address}
                              phone={user.phone}
                              website={user.website}
                              company={user.company}
                              isNewUser={false}
                        />
                        <hr/>
                    </div>;
                })}
            </div>
        );
    }
}
