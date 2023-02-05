import React from 'react';
import { Column, Row } from 'simple-flexbox';
import Collapsible from 'react-collapsible';
import { FaArrowDown } from "react-icons/fa";

const renderAdditionalItems = (additionalItems, costDescription) => {
    return (
        <Column>
            <Collapsible trigger={
                <Row style={{ margin: '10px', flex: 1, fontSize: '14px', cursor: 'pointer' }} vertical='center' horizontal='center'>
                    Expand For Detailed Pricing<FaArrowDown size='16px' />
                </Row>
            }>
                {additionalItems.map(item => {
                    return (
                        <Row style={{ margin: '10px', flex: 1, fontSize: '14px' }}>
                            {item}
                        </Row>
                    )
                })}
                <Row style={{ margin: '10px', flex: 1, fontSize: '14px' }}>{costDescription}</Row>
            </Collapsible>
        </Column>
    )
}

function PricingResultsRowComponent(props) {
    return (
        <Column>
            <Row style={props.style ? { margin: '10px', ...props.style } : { margin: '10px' }}>
                <Column flex={0.7}>
                    {props.text}
                </Column>
                <Column flex={0.3}>
                    {props.value ? props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : props.hideValue ? null : 0}
                </Column>
            </Row>
            {props.additionalItems && props.additionalItems.map && props.additionalItems.length > 0 ?
                renderAdditionalItems(props.additionalItems, props.costDescription)
                : null}
        </Column>
    );
}

export default PricingResultsRowComponent;
