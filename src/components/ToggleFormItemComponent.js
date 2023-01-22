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
            <Column flex={1} style={{ margin: '10px' }} key={props.register} >
                <Row>
                    <Column flex={.7} >
                        <label>
                            <input
                                type="checkbox"
                                checked={props.displayScreenCharge}
                                onClick={() => props.handleToggleChange()}
                            />
                            Include Screen Charge
                        </label>
                    </Column>
                    <Column flex={.3} >
                        <input
                            defaultValue={16}
                            {...register(props.register, {
                                onChange: (e) => { props.handleChange(e.target.name, e.target.value, props.type) }
                            }
                            )}
                            disabled={!props.displayScreenCharge ? true : false}
                        />
                    </Column>
                </Row>
            </Column>
        </form >
    );
}

export default ToggleFormItemComponent;
