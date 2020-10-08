import React from 'react';

import User from './user';
import UserInfo from '../stores/user-info';
import { addNewUser } from '../actions/user-action';



export default class NewUser extends React.Component {
    constructor (props) {
        super(props);
        this.myRef = React.createRef();

        this.handleClickSubmit  = this.handleClickSubmit.bind(this);
    }
    handleClickSubmit () {
        //TODO: should be rewritten
        //const {person} = this.form;
        let companyInfo = {};
        let addressInfo = {};

        if (document.getElementsByClassName('DetailsAddress')[0]) {
            addressInfo = {
                street:  this.myRef.current.street.value,
                city:    this.myRef.current.city.value,
                suite:   this.myRef.current.suite.value,
                zipcode: this.myRef.current.zipcode.value
            };
        }
        if (document.getElementsByClassName('DetailsCompany')[0]) {
            companyInfo = {
                nameCompany: this.myRef.current.nameCompany.value,
                catchPhrase: this.myRef.current.catchPhrase.value,
                bs:          this.myRef.current.bs.value
            };
        }
        let userInfo = {
            name:    this.myRef.current.name.value,
            phone:   this.myRef.current.phone.value,
            email:   this.myRef.current.email.value,
            website: this.myRef.current.website.value
        };

        let newUser = new UserInfo(userInfo, addressInfo, companyInfo);
        addNewUser(newUser);
    }

    render () {
        return (
            (
                <div>
                    <form
                        onSubmit={this.handleClickSubmit}
                        ref={this.myRef}>
                        <User  className="NewUser" isNewUser={true}/>
                    </form>

                </div>
            )
        )
    }
}
