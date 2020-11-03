import React from 'react';

const COMPANY = 'company';

export default function Company (props) {
    const { company = {}, onChange } = props;
    const _onChange                  = e => onChange(e, COMPANY);


    return (
        <div className="DetailsCompany">
            <p><label>
                Name: <input type="text" name="name" value={company.name} onChange={_onChange}/>
            </label></p>
            <p><label>
                Catch phrase: <input type="text" name="catchPhrase" value={company.catchPhrase} onChange={_onChange}/>
            </label></p>
            <p><label>
                BS: <input type="text" name="bs" value={company.bs} onChange={_onChange}/>
            </label></p>
        </div>
    );
}
