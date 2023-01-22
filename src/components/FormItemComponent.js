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
            <Column flex={1} style={{ margin: '10px' }} key={props.register} >
                <Row flex={1}>
                    <Column flex={.7} vertical='center'>
                        {props.text}
                    </Column>
                    {!props.dropdown ?
                        <Column flex={.3} >
                            <input
                                {...register(props.register, {
                                    onChange: (e) => { props.handleChange(e.target.name, e.target.value, props.type) }
                                }
                                )} />
                        </Column>
                        :
                        <Column flex={.3} style={{ cursor: 'pointer', horizontal: 'start', vertical: 'center', marginRight: '45px' }}>
                            <Select
                                defaultValue={props.defaultDropdownValue}
                                onChange={handleDropdownChange}
                                options={props.dropdownOptions}
                            />
                        </Column>
                    }
                </Row>
                {props.error ? <Row flex={1}>
                    <Column flex={.7} style={{ marginRight: '10px', color: 'red' }}>
                        {props.error}
                    </Column>
                </Row> : null}
            </Column>
        </form >
    );
}

export default FormItemComponent;
