import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

function FormItemComponent(props) {
    const {
        register,
        formState: { errors },
        reset
    } = useForm({
        mode: "onBlur",
    });

    const handleDropdownChange = async (event) => {
        props.handleDropdownChange(event.value, props.register)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Column flex={1}
                key={props.register} >
                <Row flex={1}>
                    <Column flex={.8} vertical='center'>
                        {props.text}
                    </Column>
                    {!props.dropdown ?
                        <Column  >
                            <input
                                style={{ width: '100px' }}
                                 name={props.register}
                            value={props.value}
                                onChange={e => {
                                    console.log('Input value for', props.register, ':', e.target.value);
                                    props.handleChange(props.register, e.target.value, props.type);
                                }} />
                        </Column>
                        :
                        <Column
                            style={{ cursor: 'pointer', horizontal: 'start', vertical: 'center', width: '100px' }}
                        >
                            <Select
                                defaultValue={props.defaultDropdownValue}
                                onChange={handleDropdownChange}
                                options={props.dropdownOptions}
                                value={props.value}
                            />
                        </Column>
                    }
                </Row>
                {props.error ? <Row flex={1}>
                    <Column flex={.85} style={{ marginRight: '10px', color: 'red' }}>
                        {props.error}
                    </Column>
                </Row> : null}
            </Column>
        </form >
    );
}

export default FormItemComponent;
