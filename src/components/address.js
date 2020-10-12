import React from 'react';

const ADDRESS = 'address';

export default function Address (props) {
    const { address = {}, onChange } = props;
    const _onChange = e => onChange(e, ADDRESS);

    return (
        <div className="DetailsAddress">
            <p><label>
                City: <input type="text" name="city" value={address.city} onChange={_onChange}/>
            </label></p>
            <p><label>
                Street: <input type="text" name="street" value={address.street} onChange={_onChange} />
            </label></p>
            <p><label>
                Suite: <input type="text" name="suite" value={address.suite} onChange={_onChange}/>
            </label></p>
            <p><label>
                Zipcode: <input type="text" name="zipcode" value={address.zipcode} onChange={_onChange}/>
            </label></p>
        </div>
    );
}


