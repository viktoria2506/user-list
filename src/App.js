import React from 'react';
import UsersData from './data/users.json';
import { User } from './components/User.js';
import './App.css';


class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            wantAdd: false,
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
                    wantAdd && <div className="NewUser">
                        <User isUser='false'/>
                    </div>
                }
                <hr/>
                {UsersData.map((user) => {
                    return <div className="UserInner" key={user.id}>
                        <User name={user.name}
                              username={user.username}
                              email={user.email}
                              address={user.address}
                              phone={user.phone}
                              website={user.website}
                              company={user.company}
                        />
                        <hr/>
                    </div>;
                })}
            </div>
        );
    }
}

export default App;
