import React from 'react';

export default function Company (props) {
    const { company = {} } = props;
    return (
        <div className="Details">
            <p><label>
                Name: <input type="text" id='nameCompany' value={company.name}/>
            </label></p>
            <p><label>
                Catch phrase: <input type="text" id='catchPhrase' value={company.catchPhrase}/>
            </label></p>
            <p><label>
                BS: <input type="text" id='bs' value={company.bs}/>
            </label></p>
        </div>
    );
}
