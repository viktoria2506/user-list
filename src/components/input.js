import React from 'react';

export default function Input (props) {
    const edit  = props.wantEdit;
    const value = props.defaultValue;
    if (edit) {
        return <input />;
    }
    else {
        return <input readOnly value={value}/>;
    }
}
