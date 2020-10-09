import React from 'react';

import Address from './address.js';
import Company from './company.js';
import UserInfo from '../stores/user-info';
import UserAction from '../actions/user-action';

export default class User extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            currentUser: {
                name:    props.name,
                phone:   props.phone,
                email:   props.email,
                website: props.website,
                address: {
                    street:  props.street,
                    city:    props.city,
                    suite:   props.suite,
                    zipcode: props.zipcode
                },
                company: props.company

            },
            showAddress: false,
            showCompany: false,
            wantEdit:    false
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

    handleClickEdit (e) {
        this.setState({ wantEdit: !this.state.wantEdit });
        if (this.state.wantEdit) {
            UserAction.updateUser(this.createUser());
        }
        e.preventDefault();
    }

    handleChange (e) {
        const { currentUser } = this.state;

        currentUser[e.target.name] = e.target.value;

        if (this.state.wantEdit || this.props.isNewUser) {
            this.setState({ currentUser });
        }
    }

    createUser () {
        let companyInfo = {};
        let addressInfo = {};

        if (document.getElementsByClassName('DetailsAddress')[0]) {
            addressInfo = {
                street:  this.state.currentUser.street,
                city:    this.state.currentUser.address.city,
                suite:   this.state.currentUser.suite,
                zipcode: this.state.currentUser.zipcode
            };
        }
        if (document.getElementsByClassName('DetailsCompany')[0]) {
            companyInfo = {
                nameCompany: this.state.currentUser.nameCompany,
                catchPhrase: this.state.currentUser.catchPhrase,
                bs:          this.state.currentUser.bs
            };
        }
        let userInfo = {
            name:    this.state.currentUser.name,
            phone:   this.state.currentUser.phone,
            email:   this.state.currentUser.email,
            website: this.state.currentUser.website
        };

        let newUser = new UserInfo(userInfo, addressInfo, companyInfo);
        return newUser;
    }

    handleClickSubmit () {
        //TODO: should be rewritten
        UserAction.addNewUser(this.createUser());
    }

    render () {
        const { isNewUser }                                       = this.props;
        const { showAddress, showCompany, wantEdit, currentUser } = this.state;
        let buttonAddress                                         = '';
        let buttonCompany                                         = '';

        if (isNewUser) {
            buttonAddress = `${showAddress ? 'Remove' : 'Add'} Address`;
            buttonCompany = `${showCompany ? 'Remove' : 'Add'} Company`;
        }
        else {
            buttonAddress = `${showAddress ? 'Hide' : 'Show'} Address`;
            buttonCompany = `${showCompany ? 'Hide' : 'Show'} Company`;
        }

        return (
            <form className="UserInfo">
                <p><label>
                    Name: <input type="text" name="name" value={currentUser.name} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Phone: <input type="text" name="phone" value={currentUser.phone} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Email: <input type="text" name="email" value={currentUser.email} onChange={this.handleChange}/>
                </label></p>
                <p><label>
                    Website: <input type="text" name="website" value={currentUser.website}
                                    onChange={this.handleChange}/>
                </label></p>
                <div>
                    <button className="ButtonAddDetails" onClick={this.handleClickAddress}>
                        {buttonAddress}
                    </button>
                    {
                        showAddress &&
                        (
                            <Address address={currentUser.address} onChange={this.handleChange}/>
                        )
                    }
                    <button className="ButtonAddDetails" onClick={this.handleClickCompany}>
                        {buttonCompany}
                    </button>
                    {
                        showCompany &&
                        (
                            <Company company={currentUser.company}/>
                        )
                    }
                </div>
                {isNewUser ? <button className="ButtonAddUser" onClick={this.handleClickSubmit}>
                               Submit
                           </button>
                           : <button className="ButtonEdit" onClick={this.handleClickEdit}>
                     {wantEdit ? 'Save' : 'Edit'}
                 </button>
                }
            </form>
        );
    }
}
