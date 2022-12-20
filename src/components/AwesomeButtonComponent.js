import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

function AwesomeButtonComponent(props) {
    return (
        <AwesomeButton
            onPress={props.onPress ? props.onPress : null}
            size={props.size ? props.size : "large"}
            type={props.type ? props.type : "secondary"}>
            {props.text ? props.text : ''}
        </AwesomeButton>
    );
}

export default AwesomeButtonComponent;
