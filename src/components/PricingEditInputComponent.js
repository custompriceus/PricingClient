import React, { useState } from 'react';
import { Column } from 'simple-flexbox';

function PricingEditInputComponent(props) {
    const handleBlur = (e) => {
        setFieldValue(e.target.value);
        if (e.target.value && e.target.value > 0 && props.quantity && props.colors || props.stitches) {
            props.handleNewPricing(props, e.target.value)
        }
    };
    const [fieldValue, setFieldValue] = useState('');

    return (
        <Column horizontal='center' vertical='center' flex={.5}>
            <Column
                horizontal='center' vertical='center' flex={.5}>
                <input style={{ width: '100%' }} onBlur={handleBlur} />
            </Column>
        </Column>
    );
}

export default PricingEditInputComponent;
