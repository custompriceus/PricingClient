import React from 'react';
import { Column, Row } from 'simple-flexbox';

function PricingResultsRowComponent(props) {
    return (
        <Column>
            <Row style={props.style ? { margin: '10px', ...props.style } : { margin: '10px' }}>
                <Column flex={0.5}>
                    {props.text}
                    {props.hideColon ? null : ':'}
                </Column>
                <Column flex={0.5}>
                    {props.value ? props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : props.hideValue ? null : 0}
                </Column>
            </Row>
            {props.finalSelectedItemsString ?
                <Row style={{ margin: '10px', flex: 1, borderBottom: '1px dotted' }}>
                    <span style={{ fontSize: '14px' }}>{props.finalSelectedItemsString}</span>
                </Row> : null}
        </Column>
    );
}

export default PricingResultsRowComponent;
