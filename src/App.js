import React from 'react';
import UsersData from './data/users.json';

import './App.css';

function User (props) {
    return (
        <div className={'UserInfo'}>
            <h2>{props.name}</h2>
            <h4>{props.username}</h4>
            <h4>phone: {props.phone}</h4>
            <p>{props.email}</p>
            <i>{props.website}</i>
            <Address address={props.address}/>
            <Company company={props.company}/>
        </div>
    );
}

function Address (props) {
    return (
        <div>
            <p>{props.address.street}, {props.address.suite}, {props.address.city}, {props.address.zipcode}</p>
            <Geo geo={props.address.geo}/>
        </div>
    );
}

function Geo (props) {
    return (
        <div>
            <p>geo: {props.geo.lat}, {props.geo.lng}</p>
        </div>
    );
}

function Company (props) {
    return (
        <div>
            <h4>{props.company.name}</h4>
            <p>catchPhrase: {props.company.catchPhrase}</p>
            <p>bs: {props.company.bs}</p>
        </div>
    )
}

function App () {
    return (
        <div className="App">
            {UsersData.map((user, index) => {
                return <div>
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

export default App;
