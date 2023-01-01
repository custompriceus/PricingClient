import React, { useState, useContext, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { validateInputs } from '../../resources/utilities';
import FormComponent from 'components/FormComponent';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';

const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        },
        flex: 0.6
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    todayTrends: {
        marginTop: 30
    },
    lastRow: {
        marginTop: 30
    },
    unresolvedTickets: {
        marginRight: 30,
        '@media (max-width: 1024px)': {
            marginRight: 0
        }
    },
    tasks: {
        marginTop: 0,
        '@media (max-width: 1024px)': {
            marginTop: 30
        }
    }
});

function ShirtPricingComponent() {
    const classes = useStyles();
    const { actions, state } = useContext(StoreContext);
    const [defaultShirtPricingForm, setDefaultShirtPricingForm] = useState([]);
    const [shirtPricingForm, setShirtPricingForm] = useState([]);
    const [defaultShirtPricingResults, setDefaultShirtPricingResults] = useState([]);
    const [shirtPricingResults, setShirtPricingResults] = useState([]);
    const [selectedAdditionalItems, setSelectedAdditionalItems] = useState([]);
    const [defaultSelectedAdditionalItems, setDefaultSelectedAdditionalItems] = useState([]);
    const [additionalItemsMinShirtQuantity, setAdditionalItemsMinShirtQuantity] = useState([]);

    const fetchData = async () => {
        actions.generalActions.setisbusy()

        await apiServices.getShirtPricingDisplay(state.generalStates.user.accessToken)
            .then(res => {
                console.log(res.data)
                setDefaultShirtPricingForm(res.data.form);
                setShirtPricingForm(res.data.form);
                setDefaultShirtPricingResults(res.data.results);
                setShirtPricingResults(res.data.results);
                setDefaultSelectedAdditionalItems(res.data.additionalItems.items);
                setSelectedAdditionalItems(res.data.additionalItems.items);
                setAdditionalItemsMinShirtQuantity(res.data.additionalItems.minShirtQuantity);
                actions.generalActions.resetisbusy();
            })
            .catch(err => {
                actions.generalActions.resetisbusy();
                console.log(err.response)
            })
    }

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

    const handleAdditionalItems = (item) => {
        const objIndex = selectedAdditionalItems.findIndex((obj => obj.name == item.name));
        let clone = selectedAdditionalItems.slice()
        clone[objIndex].checked = !item.checked

        setSelectedAdditionalItems(clone)
    };

    const handleSubmit = async (data) => {
        actions.generalActions.setisbusy();
        const validatedInputs = validateInputs(data, shirtPricingForm, defaultShirtPricingForm, additionalItemsMinShirtQuantity, selectedAdditionalItems);
        if (validatedInputs.map && validatedInputs.length > 0) {
            const adjustedFormItems = [];
            shirtPricingForm.map(item => {
                const isItemAnError = validatedInputs.find(function (input) {
                    return input.key === item.register;
                });
                const key = item.register;
                const defaultFormItem = defaultShirtPricingForm.find(form => form.register === key)
                adjustedFormItems.push({
                    text: defaultFormItem.text,
                    register: defaultFormItem.register,
                    value: !isItemAnError ? data[key] : item.value,
                    error: !isItemAnError ? null : true,
                    errorDisplayMessage: !isItemAnError ? defaultFormItem.errorDisplayMessage : isItemAnError.errorDisplayMessage,
                    inputValueType: defaultFormItem.inputValueType,
                    required: defaultFormItem.required,
                    minValue: defaultFormItem.minValue ? defaultFormItem.minValue : null,
                    maxValue: defaultFormItem.maxValue ? defaultFormItem.maxValue : null
                })
            })
            setShirtPricingForm(adjustedFormItems);
            setShirtPricingResults(defaultShirtPricingResults)
        }
        else {
            await apiServices.getShirtPriceQuote(state.generalStates.user.accessToken, data, selectedAdditionalItems, state.generalStates.user.email)
                .then(res => {
                    console.log(res.data);
                    setShirtPricingResults(res.data);
                    setSelectedAdditionalItems(defaultSelectedAdditionalItems)
                    setShirtPricingForm(defaultShirtPricingForm);
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
        actions.generalActions.resetisbusy();
    }

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    return (
        <Column >
            <Row>
                <Column flex={.5}>
                    <FormComponent
                        handleSubmit={handleSubmit}
                        selectedAdditionalItems={selectedAdditionalItems ? selectedAdditionalItems : null}
                        handleAdditionalItems={handleAdditionalItems}
                        formItems={shirtPricingForm ? shirtPricingForm : null}
                        defaultFormItems={defaultShirtPricingForm ? defaultShirtPricingForm : null}
                    />
                </Column>
                <Column flex={0.5}>
                    {shirtPricingResults ? shirtPricingResults.map(result => {
                        return (
                            <PricingResultsRowComponent
                                text={result.text}
                                value={result.value}
                                style={result.style}
                                finalSelectedItemsString={result.finalSelectedItemsString}
                            />
                        )
                    }) : null}
                </Column>
            </Row >
        </Column >
    );

}

export default ShirtPricingComponent;
