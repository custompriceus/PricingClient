import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';
import AwesomeButtonComponent from '../components/AwesomeButtonComponent';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';


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
            onSubmit={handleSubmit(async (data) => {
                console.log('handle');
                console.log(data);
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
                <Row style={{ margin: '10px' }}>
                    {props.selectedAdditionalItems.map(item => {
                        return (
                            <Column flex={1 / props.selectedAdditionalItems.length}>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onClick={() => props.handleAdditionalItems(item)}
                                        />
                                        {item.name}
                                    </label>
                                </div>
                            </Column>
                        )
                    })}
                </Row>
                : null}
            <AwesomeButtonComponent
                text={'Get Price Quote'}
            />
        </form>
    );
}

export default FormComponent;
