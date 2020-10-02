import React from 'react';

export class Address extends React.Component {
    render () {
        const { address = {} } = this.props;

        return (
            <div className="Details">
                <p><label>
                    City: <input type="text" value={address.city}/>
                </label></p>
                <p><label>
                    Street: <input type="text" value={address.street}/>
                </label></p>
                <p><label>
                    Suite: <input type="text" value={address.suite}/>
                </label></p>
                <p><label>
                    Zipcode: <input type="text" value={address.zipcode}/>
                </label></p>
            </div>
        );
    }
}


class Geo extends React.Component {
    render () {
        return (
            <div className="Details">
                <p>geo: {this.props.geo.lat}, {this.props.geo.lng}</p>
            </div>
        );
    }

}
