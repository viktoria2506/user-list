import React from 'react';

export default function Company (props) {
    const { company = {} } = props;
    return (
        <div className="DetailsCompany">
            <p><label>
                Name: <input type="text" name="nameCompany" defaultValue={company.nameCompany}/>
            </label></p>
            <p><label>
                Catch phrase: <input type="text" name="catchPhrase" defaultValue={company.catchPhrase}/>
            </label></p>
            <p><label>
                BS: <input type="text" name="bs" defaultValue={company.bs}/>
            </label></p>
        </div>
    );
}
