import React from 'react';

import { Address } from './Address.js';
import { Company } from './Company.js';

export class User extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showAddress: false,
            showCompany: false,
            isNewUser:   this.props.isUser
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
        const { name, username, phone, email, website, address, company } = this.props;
        const { isNewUser, showAddress, showCompany }                     = this.state;

        return (
            <div className={'UserInfo'}>
                <p><label>
                    Name: <input type="text" value={name}/>
                </label></p>
                <p><label>
                    Username: <input type="text" value={username}/>
                </label></p>
                <p><label>
                    Phone: <input type="text" value={phone}/>
                </label></p>
                <p><label>
                    Email: <input type="text" value={email}/>
                </label></p>
                <p><label>
                    Website: <input type="text" value={email}/>
                </label></p>
                <div>
                    <button className="ButtonAddDetails" onClick={this.handleClickAddress}>
                        {isNewUser ? 'Add Address' : (showAddress ? 'Hide Address' : 'Show Address')}
                    </button>
                    {
                        showAddress && <div>
                            <Address address={address}/>
                        </div>
                    }
                    <button className="ButtonAddDetails" onClick={this.handleClickCompany}>
                        {isNewUser ? 'Add Company' : (showCompany ? 'Hide Company' : 'Show Company')}
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
