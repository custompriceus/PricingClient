import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';

function ToggleFormItemComponent(props) {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    return (
        <form>
            <Column flex={1} key={props.register} >
                <Row>
                    <Column flex={.8}>
                        <label>
                            <input
                                type="checkbox"
                                value={true}
                                onClick={() => props.handleToggleChange()}
                            />
                            {props.text}
                        </label>
                    </Column>
                    {!props.displayInput ? null :
                        <Column style={{ width: '100px' }}>
                            <input
                                defaultValue={props.defaultValue}
                                {...register(props.register, {
                                    onChange: (e) => { props.handleChange(e.target.name, e.target.value, props.type) }
                                }
                                )}
                                disabled={!props.checked ? true : false}
                            />
                        </Column>
                    }
                </Row>
            </Column>
        </form >
    );
}

export default ToggleFormItemComponent;
