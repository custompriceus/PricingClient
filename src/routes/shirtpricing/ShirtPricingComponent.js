import React, { useState, useContext, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { validateInputs } from '../../resources/utilities';
import { getAdjustedFormWithErrors } from '../../resources/utilities';
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
    const [defaultShirtPricingForm, setDefaultShirtPricingForm] = useState();
    const [shirtPricingForm, setShirtPricingForm] = useState();
    const [defaultShirtPricingResults, setDefaultShirtPricingResults] = useState();
    const [shirtPricingResults, setShirtPricingResults] = useState();
    const [selectedAdditionalItems, setSelectedAdditionalItems] = useState();
    const [additionalItemsDisplayText, setAdditionalItemsDisplayText] = useState();
    const [additionalItemsMinShirtQuantity, setAdditionalItemsMinShirtQuantity] = useState();
    const [toggle, setToggle] = useState();
    const [displayToggle, setDisplayToggle] = useState();
    const [defaultDisplayToggle, setDefaultDisplayToggle] = useState();

    const fetchData = async () => {
        actions.generalActions.setisbusy()

        await apiServices.getShirtPricingDisplay(state.generalStates.user.accessToken)
            .then(res => {
                console.log(res.data)
                setDefaultShirtPricingForm(res.data.form);
                setShirtPricingForm(res.data.form);
                setDefaultShirtPricingResults(res.data.results);
                setShirtPricingResults(res.data.results);
                setSelectedAdditionalItems(res.data.additionalItems.items);
                setAdditionalItemsDisplayText(res.data.additionalItems.displayText);
                setAdditionalItemsMinShirtQuantity(res.data.additionalItems.minShirtQuantity);
                if (res.data.screenCharge) {
                    setToggle(true);
                    setDisplayToggle(res.data.screenCharge.defaultToggle);
                    setDefaultDisplayToggle(res.data.screenCharge.defaultToggle);
                }
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

    const handleSubmit = async (data, displayToggleFromForm) => {
        actions.generalActions.setisbusy();
        const validatedInputs = validateInputs(data, shirtPricingForm, defaultShirtPricingForm, additionalItemsMinShirtQuantity, selectedAdditionalItems);
        if (validatedInputs.map && validatedInputs.length > 0) {
            const adjustedFormItems = getAdjustedFormWithErrors(shirtPricingForm, defaultShirtPricingForm, validatedInputs, data, displayToggleFromForm)
            setShirtPricingForm(adjustedFormItems);
            setShirtPricingResults(defaultShirtPricingResults)
            setDisplayToggle(displayToggleFromForm)
        }
        else {
            await apiServices.getShirtPriceQuote(state.generalStates.user.accessToken, data, selectedAdditionalItems, state.generalStates.user.email, displayToggleFromForm)
                .then(res => {
                    setShirtPricingResults(res.data);
                    setSelectedAdditionalItems([
                        { name: 'Nylon, Poly, Mesh, Jersey', checked: false },
                        { name: 'Legs, Sweats, Sleeves', checked: false }
                    ])
                    setShirtPricingForm(defaultShirtPricingForm);
                    setDisplayToggle(defaultDisplayToggle);
                })
                .catch(err => {
                    console.log(err.response)
                    setDisplayToggle(defaultDisplayToggle);
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
                    {
                        shirtPricingForm ?
                            <FormComponent
                                handleSubmit={handleSubmit}
                                selectedAdditionalItems={selectedAdditionalItems ? selectedAdditionalItems : null}
                                handleAdditionalItems={handleAdditionalItems}
                                additionalItemsDisplayText={additionalItemsDisplayText ? additionalItemsDisplayText : null}
                                formItems={shirtPricingForm ? shirtPricingForm : null}
                                toggle={toggle}
                                displayToggle={displayToggle}
                            />
                            : null
                    }
                </Column>
                <Column flex={0.5}>
                    {
                        shirtPricingResults ? shirtPricingResults.map(result => {
                            return (
                                <PricingResultsRowComponent
                                    text={result.text}
                                    value={result.value}
                                    style={result.style}
                                    finalSelectedItemsString={result.finalSelectedItemsString}
                                />
                            )
                        })
                            : null
                    }
                </Column>
            </Row >
        </Column >
    );

}

export default ShirtPricingComponent;
