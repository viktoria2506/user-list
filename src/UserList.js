import React from 'react';
import usersData from './data/users.json';
import User from './components/user.js';
import './css/App.css';


export default class UserList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            wantAdd: false
        };

        this.handleClickAddUser = this.handleClickAddUser.bind(this);
    }

    handleClickAddUser () {
        this.setState({ wantAdd: !this.state.wantAdd });
    }

    render () {
        const { wantAdd } = this.state;
        return (
            <div className="App">
                <button className="ButtonAddUser" onClick={this.handleClickAddUser}>Add new User</button>
                {
                    wantAdd && <User className="NewUser" isNewUser={false}/>
                }
                <hr/>
                {usersData.map((user) => {
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
