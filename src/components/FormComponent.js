import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';
import AwesomeButtonComponent from '../components/AwesomeButtonComponent';

function FormComponent(props) {
    const [formItems, setFormItems] = useState();
    const [selectedAdditionalItems, setSelectedAdditionaItems] = useState();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        setFormItems(props.formItems)
        setSelectedAdditionaItems(props.selectedAdditionalItems);
    }, []);

    const renderFormItem = (item) => {
        return (
            <Column flex={1}>
                <Row style={{ margin: '10px' }} key={item.text ? item.text : null}>
                    <Column flex={.7} style={{ marginRight: '10px' }}>
                        {item.text}
                    </Column>
                    <Column flex={.3} style={{ marginRight: '10px' }}>
                        <input
                            defaultValue={item.value ? item.value : null}
                            type={item.type ? item.type : null}
                            style={{}}
                            {...register(item.register)} />
                    </Column>
                </Row>
                {item.error ? <Row style={{ margin: '10px' }} key={item.errorDisplayMessage}>
                    <Column flex={1} style={{ marginRight: '10px', color: 'red' }}>
                        {item.errorDisplayMessage}
                    </Column>
                </Row> : null}
            </Column>
        )
    };

    const renderAdditionalItem = (item) => {
        return (
            <Row horizontal="left" style={{ margin: '10px' }} key={item.name ? item.name : null}>
                <label>
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onClick={() => props.handleAdditionalItems(item)}
                    />
                    {item.name}
                </label>
            </Row>
        )
    };

    const renderAdditionalItems = () => {
        return (
            <Column >
                <Row horizontal="spaced" style={{ margin: '10px' }}>
                    {props.additionalItemsDisplayText ? props.additionalItemsDisplayText : null}
                </Row>
                {
                    selectedAdditionalItems.map(item => {
                        return (
                            renderAdditionalItem(item)
                        )
                    })
                }
            </Column>
        )
    };

    if (!formItems) {
        return null;
    }

    else {
        return (
            <form
                onSubmit={
                    handleSubmit(async (data) => {
                        props.handleSubmit(data);
                        reset();
                    })}
            >
                {formItems ? formItems.map(item => {
                    return (
                        item.register === 'additionalInformation' ? renderAdditionalItems() : renderFormItem(item)
                    )
                }) : null}
                {props.error ?
                    <Row vertical='center' horizontal='center' style={{ color: 'red', margin: '10px' }}>
                        {props.error}
                    </Row>
                    : null}
                <Row vertical='center' horizontal='center'>
                    <AwesomeButtonComponent
                        text={props.text ? props.text : 'Get Price Quote'}
                    />
                </Row>
            </form >
        );
    }
}

export default FormComponent;
