import React from 'react';
import { Column, Row } from 'simple-flexbox';

function PricingResultsRowComponent(props) {
    return (
        <Row style={props.style ? { margin: '10px', ...props.style } : { margin: '10px' }}>
            <Column flex={0.5}>
                {props.text}:
            </Column>
            <Column flex={0.5}>
                {props.value ? props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
            </Column>
        </Row>
    );
}

export default PricingResultsRowComponent;
