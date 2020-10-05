import React from 'react';

import Address from './address.js';
import Company from './company.js';

export default class User extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showAddress: false,
            showCompany: false
        };

        this.handleClickAddress = this.handleClickAddress.bind(this);
        this.handleClickCompany = this.handleClickCompany.bind(this);
    }

    handleClickAddress () {
        this.setState({ showAddress: !this.state.showAddress });
    }

    handleClickCompany () {
        this.setState({ showCompany: !this.state.showCompany });
    }

    render () {
        const { name, phone, email, website, address, company, isNewUser } = this.props;
        const { showAddress, showCompany }                                 = this.state;
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
            <div className='UserInfo'>
                <p><label>
                    Name: <input type="text" value={name}/>
                </label></p>
                <p><label>
                    Phone: <input type="text" value={phone}/>
                </label></p>
                <p><label>
                    Email: <input type="text" value={email}/>
                </label></p>
                <p><label>
                    Website: <input type="text" value={website}/>
                </label></p>
                <div>
                    <button className="ButtonAddDetails" onClick={this.handleClickAddress}>
                        {buttonAddress}
                    </button>
                    {
                        showAddress && <div>
                            <Address address={address}/>
                        </div>
                    }
                    <button className="ButtonAddDetails" onClick={this.handleClickCompany}>
                        {buttonCompany}
                    </button>
                    {
                        showCompany && <div>
                            <Company company={company}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
