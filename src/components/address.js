import React from 'react';

export default function Address (props) {
    const { address = {} } = props;
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


