import React from 'react';
import { Column, Row } from 'simple-flexbox';

function ToggleFormItemComponent(props) {
    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Column flex={1} key={props.register}>
                <Row>
                    <Column flex={.8}>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={props.checked}
                                onChange={props.handleToggleChange}
                                style={{ cursor: 'pointer' }}
                            />
                            {props.text}
                        </label>
                    </Column>
                    {!props.displayInput ? null :
                        <Column style={{ width: '100px' }}>
                            <input
                                name={props.register}
                                value={props.value}
                                onChange={e => props.handleChange(props.register, e.target.value, props.type)}
                                disabled={!props.checked}
                                
                            />
                        </Column>
                    }
                </Row>
            </Column>
        </form>
    );
}

export default ToggleFormItemComponent;