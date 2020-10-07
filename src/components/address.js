import React from 'react';

export default function Address (props) {
    const { address = {} } = props;
    return (
        <div className="DetailsAddress" name='address'>
            <p><label>
                City: <input type="text" name='city' defaultValue={address.city}/>
            </label></p>
            <p><label>
                Street: <input type="text" name='street' defaultValue={address.street}/>
            </label></p>
            <p><label>
                Suite: <input type="text" name='suite' defaultValue={address.suite}/>
            </label></p>
            <p><label>
                Zipcode: <input type="text" name='zipcode' defaultValue={address.zipcode}/>
            </label></p>
        </div>
    );

}


