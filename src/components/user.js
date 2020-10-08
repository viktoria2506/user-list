import React from 'react';

import Address from './address.js';
import Company from './company.js';
import UserInfo from '../stores/user-info';
import { addNewUser } from '../actions/user-action';
import Input from './input';

export default class User extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            currentUser: {
                name: props.name,
                phone: props.phone,
            },
            showAddress: false,
            showCompany: false,
            wantEdit: false
        };

        this.handleClickAddress = this.handleClickAddress.bind(this);
        this.handleClickCompany = this.handleClickCompany.bind(this);
        this.handleChange       = this.handleChange.bind(this);
        this.handleClickEdit    = this.handleClickEdit.bind(this);
        this.handleClickSubmit  = this.handleClickSubmit.bind(this);
    }

    handleClickAddress (e) {
        this.setState({ showAddress: !this.state.showAddress });
        e.preventDefault();
    }

    handleClickCompany (e) {
        this.setState({ showCompany: !this.state.showCompany });
        e.preventDefault();
    }

    handleClickEdit () {
        this.setState({ wantEdit: !this.state.wantEdit });
        if(this.state.wantEdit) {
            addNewUser(this.state.currentUser);
        }
    }

    handleChange (e) {
        if(this.state.wantEdit || this.props.isNewUser)
            this.setState({currentUser: {[e.target.name]: e.target.value}});

    }


    handleClickSubmit () {
        /*//TODO: should be rewritten
        //const {person} = this.form;
        let companyInfo = {};
        let addressInfo = {};

         if (document.getElementsByClassName('DetailsAddress')[0]) {
         addressInfo = {
         street:  this.state.name,
         city:    this.myRef.current.city.value,
         suite:   this.myRef.current.suite.value,
         zipcode: this.myRef.current.zipcode.value
         };
         }
         if (document.getElementsByClassName('DetailsCompany')[0]) {
         companyInfo = {
         nameCompany: this.state.nameCompany,
         catchPhrase: this.state.catchPhrase,
         bs:          this.state.bs
         };
         }
         let userInfo = {
         name:    this.state.name,
         phone:   this.state.phone,
         email:   this.state.email,
         website: this.state.website
         };

        let newUser = new UserInfo(userInfo, addressInfo, companyInfo);
        addNewUser(newUser);*/
    }

    render () {
        const { name, phone, email, website, address, company, isNewUser } = this.props;
        const { showAddress, showCompany, wantEdit, currentUser }                       = this.state;
        let buttonAddress                                                  = '';
        let buttonCompany                                                  = '';

        if (isNewUser) {
            buttonAddress = `${showAddress ? 'Remove' : 'Add'} Address`;
            buttonCompany = `${showCompany ? 'Remove' : 'Add'} Company`;
        }
        else {
            buttonAddress = `${showAddress ? 'Hide' : 'Show'} Address`;
            buttonCompany = `${showCompany ? 'Hide' : 'Show'} Company`;
        }

        return (
            <div className="UserInfo">
                <p><label>
                    Name: <input type="text" name="name" value={currentUser.name} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Phone: <input type="text" name="phone" value={phone} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Email: <input type="text" name="email" value={email} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Website: <input type="text" name="website" value={website} onChange={this.handleChange}/>
                </label></p>
                <div>
                    <button className="ButtonAddDetails" onClick={this.handleClickAddress}>
                        {buttonAddress}
                    </button>
                    {
                        showAddress &&
                        (
                            <Address address={address}/>
                        )
                    }
                    <button className="ButtonAddDetails" onClick={this.handleClickCompany}>
                        {buttonCompany}
                    </button>
                    {
                        showCompany &&
                        (
                            <Company company={company}/>
                        )
                    }
                </div>
                {
                    <button className="ButtonEdit" onClick={this.handleClickEdit}>
                        {wantEdit ? 'Save' : 'Edit'}
                    </button>
                }
            </div>
        );
    }
}
