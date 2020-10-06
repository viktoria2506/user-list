import React from 'react';

export default function Address (props) {
    const { address = {} } = props;
    return (
        <div className="DetailsAddress" id='address'>
            <p><label>
                City: <input type="text" id='city' value={address.city}/>
            </label></p>
            <p><label>
                Street: <input type="text" id='street' value={address.street}/>
            </label></p>
            <p><label>
                Suite: <input type="text" id='suite' value={address.suite}/>
            </label></p>
            <p><label>
                Zipcode: <input type="text" id='zipcode' value={address.zipcode}/>
            </label></p>
        </div>
    );

}


