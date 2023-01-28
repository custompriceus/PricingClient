import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';

function AdditionalItemsComponent(props) {
    const renderAdditionalItem = (item) => {
        return (
            <label style={{ cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    style={{ cursor: 'pointer' }}
                    onClick={() => props.handleChange(props.register, item.name)}
                />
                {item.name}
            </label>
        )
    };

    return (
        <Column>
            <Row horizontal="space-around" style={{}}>
                {props.displayText ? props.displayText : null}
            </Row>
            <Row horizontal="space-around" >
                {
                    props.selectedAdditionalItems && props.selectedAdditionalItems.map ? props.selectedAdditionalItems.map(item => {
                        return (
                            renderAdditionalItem(item)
                        )
                    }) : null
                }
            </Row>
        </Column >
    );
}

export default AdditionalItemsComponent;
