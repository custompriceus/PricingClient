import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import FormComponent from 'components/FormComponent';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';
import { validateInputs } from '../../resources/utilities';
import { getAdjustedFormWithErrors } from '../../resources/utilities';

function EmbroideryPricingComponent() {
    const { actions, state } = useContext(StoreContext);
    const [defaultEmbroideryPricingForm, setDefaultEmbroideryPricingForm] = useState();
    const [embroideryPricingForm, setEmbroideryPricingForm] = useState();
    const [defaultEmbroideryPricingResults, setDefaultEmbroideryPricingResults] = useState();
    const [embroideryPricingResults, setEmbroideryPricingResults] = useState();

    const fetchData = async () => {
        actions.generalActions.setisbusy()

        await apiServices.getDefaultEmbroideryPricingResults(state.generalStates.user.accessToken)
            .then(res => {
                console.log(res.data)
                setDefaultEmbroideryPricingForm(res.data.form);
                setEmbroideryPricingForm(res.data.form);
                setDefaultEmbroideryPricingResults(res.data.results);
                setEmbroideryPricingResults(res.data.results);
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

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    const handleSubmit = async (data) => {
        actions.generalActions.setisbusy();
        const validatedInputs = validateInputs(data, embroideryPricingForm, defaultEmbroideryPricingForm);
        if (validatedInputs.map && validatedInputs.length > 0) {
            const adjustedFormItems = getAdjustedFormWithErrors(embroideryPricingForm, defaultEmbroideryPricingForm, validatedInputs, data)
            setEmbroideryPricingForm(adjustedFormItems);
            setEmbroideryPricingResults(defaultEmbroideryPricingResults)
        }
        else {
            await apiServices.getEmbroideryPriceQuote(state.generalStates.user.accessToken, data, state.generalStates.user.email)
                .then(res => {
                    console.log(res.data);
                    setEmbroideryPricingResults(res.data);
                    setEmbroideryPricingForm(defaultEmbroideryPricingForm);
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
        actions.generalActions.resetisbusy();
    }

    return (
        <Column >
            <Row>
                <Column flex={.5}>
                    {
                        embroideryPricingForm ?
                            <FormComponent
                                handleSubmit={handleSubmit}
                                formItems={embroideryPricingForm ? embroideryPricingForm : null}
                                defaultFormItems={defaultEmbroideryPricingForm ? defaultEmbroideryPricingForm : null}
                            />
                            : null
                    }

                </Column>
                <Column flex={0.5}>
                    {embroideryPricingResults ? embroideryPricingResults.map(result => {
                        return (
                            <PricingResultsRowComponent
                                text={result.text}
                                value={result.value}
                                style={result.style}
                            />
                        )
                    }) : null}
                </Column>
            </Row>
        </Column>
    );
}

export default EmbroideryPricingComponent;
