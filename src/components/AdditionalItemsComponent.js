import React from 'react';
import { Column, Row } from 'simple-flexbox';

function AdditionalItemsComponent(props) {
    const selectedAdditionalItems = props.selectedAdditionalItems || [];
    const allAdditionalItems = props.allAdditionalItems || [];

    const renderAdditionalItem = (item) => (
        <label style={{ cursor: 'pointer', marginRight: 16 }} key={item.name}>
            <input
                type="checkbox"
                style={{ cursor: 'pointer' }}
                checked={selectedAdditionalItems.some(
                    ai => ai.register === props.register && ai.item === item.name
                )}
              onChange={() => {
        console.log('Checkbox clicked:', props.register, item.name);
        props.handleChange(props.register, item.name);
    }}

            />
            {item.name}
        </label>
    );

    return (
        <Column>
            <Row horizontal="space-around">
                {props.displayText ? props.displayText : null}
            </Row>
            <Row horizontal="space-around">
                {allAdditionalItems.map(renderAdditionalItem)}
            </Row>
        </Column>
    );
}

export default AdditionalItemsComponent;