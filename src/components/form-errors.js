import React from 'react';

export default function FormError ({formErrors}) {
    return (
        <div className='formErrors'>
            {
                Object.keys(formErrors).map((fieldName, i) => {
                    if (formErrors[fieldName].length > 0) {
                        if(fieldName === 'href') {
                            return (
                                <a href={formErrors[fieldName]}>Show an object with that name.</a>
                            );
                        }
                        return (
                            <p key={i}>{formErrors[fieldName]}</p>
                        );
                    }
                    else {
                        return '';
                    }
                })
            }
        </div>
    );
}

