import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';
import AwesomeButtonComponent from '../components/AwesomeButtonComponent';

function FormComponent(props) {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    return (
        <form
            onSubmit={
                handleSubmit(async (data) => {
                    props.handleSubmit(data);
                    reset();
                })}
        >
            {props.items.map(item => {
                return (
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            {item.text}
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register(item.register)} />
                        </Column>
                    </Row>
                )
            })}
            {props.selectedAdditionalItems ?
                <Row horizontal="spaced" style={{ margin: '10px' }} wrap>
                    {props.selectedAdditionalItems.map(item => {
                        return (
                            <Column
                                style={{ minWidth: 200 }}
                                horizontal="left"
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onClick={() => props.handleAdditionalItems(item)}
                                    />
                                    {item.name}
                                </label>
                            </Column>
                        )
                    })}
                </Row>
                : null
            }
            <AwesomeButtonComponent
                text={'Get Price Quote'}
            />
        </form >
    );
}

export default FormComponent;
