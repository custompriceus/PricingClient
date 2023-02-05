import React, { useState, useContext, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { validateInput } from '../../resources/utilities';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';
import FormItemComponent from 'components/FormItemComponent';
import LocationsComponent from 'components/LocationsComponent';
import AwesomeButtonComponent from 'components/AwesomeButtonComponent';

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

function EmbroideryPricingComponent() {
    const classes = useStyles();
    const { actions, state } = useContext(StoreContext);
    const [embroideryPricingResults, setEmbroideryPricingResults] = useState();
    const [quantity, setQuantity] = useState();
    const [quantityError, setQuantityError] = useState();
    const [defaultStitchLocations, setDefaultStitchLocations] = useState([{
        text: "Stitch Location 1 - Amt of stitches:",
        value: 0,
        style: null,
        register: 'stitchLocation1Stitches',
        required: false,
        errorDisplayMessage: 'Stitch location 1 - Amt of stitches: ',
        inputValueType: 'integer',
        sortValue: 1
    }]);
    const [stitchLocations, setStitchLocations] = useState([{
        text: "Stitch Location 1 - Amt of stitches:",
        value: 0,
        style: null,
        register: 'stitchLocation1Stitches',
        required: false,
        errorDisplayMessage: 'Stitch location 1 - Amt of stitches: ',
        inputValueType: 'integer',
        sortValue: 1
    }]);
    //get these deefault vaalues from backend
    const [shirtCost, setShirtCost] = useState();
    const [shirtCostError, setShirtCostError] = useState();
    const [markUp, setMarkUp] = useState();
    const [markUpError, setMarkUpError] = useState();
    const [locationsError, setLocationsError] = useState();

    const fetchData = async () => {
        actions.generalActions.setisbusy()
        await apiServices.getEmbroideryPricingDisplay(state.generalStates.user.accessToken)
            .then(res => {
                setEmbroideryPricingResults(res.data.resultWithOutScreenCharges);
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

    const upsert = (array, register, value) => {
        //see if can move upsert to utilities
        const i = array.findIndex(_element => _element.register === register);
        const newItem = {
            register: register,
            value: value
        };
        if (i > -1) {
            let newData = [...array.slice()]
            //check is slice is necessary
            newData[i].value = value;
            return newData;
        }
        else {
            return [...array, newItem]
        }
    }

    const handleChange = (inputName, value, type) => {
        switch (type) {
            case "quantity":
                setQuantity(value);
                return;
            case "stitchLocations":
                const newData = upsert(stitchLocations, inputName, value);
                setStitchLocations(newData);
                return;
            case "shirtCost":
                setShirtCost(value);
                return;
            case "markUp":
                setMarkUp(value);
                return;
            default:
                throw new Error("Unexpected action");
        }
    }

    const resetAll = () => {
        setQuantity();
        setStitchLocations(defaultStitchLocations);
        setShirtCost();
        setMarkUp();
    }

    const handleSubmit = async () => {
        let errors = [];
        const isQuantityValidated = validateInput('integer', quantity, 'Quantity', 'true');
        if (isQuantityValidated.error) {
            setQuantityError(isQuantityValidated.message);
            errors.push('quantity');
        }
        else if (quantityError) {
            setQuantityError(null)
        }

        let locationErrors = 0;
        stitchLocations.map(location => {
            const isLocationValidated = validateInput(location.inputValueType, location.value, location.text);
            console.log('is valid', isLocationValidated)
            if (isLocationValidated.error) {
                errors.push('isShirtCostValidated');
                locationErrors++;
                setLocationsError('One Or More Stitch Locations Are Invalid');
            }
        })
        if (locationErrors === 0) {
            setLocationsError();
        }

        const isShirtCostValidated = validateInput('float', shirtCost, 'Shirt Cost: ', 'true');
        if (isShirtCostValidated.error) {
            setShirtCostError(isShirtCostValidated.message);
            console.log(isShirtCostValidated);
            errors.push('isShirtCostValidated');
        }
        else if (shirtCostError) {
            setShirtCostError(null)
        }

        const isMarkUpValidated = validateInput('float', markUp, 'Mark Up: ', 'true');
        if (isMarkUpValidated.error) {
            setMarkUpError(isMarkUpValidated.message);
            errors.push('isMarkUpValidated');
        }
        else if (markUpError) {
            setMarkUpError(null)
        }


        if (quantity && parseInt(quantity) < 6) {
            errors.push(`min quantity of 6 for shirts not met`);
            setQuantityError('min quantity of 6 for shirts not met');
        }


        if (errors && errors.length === 0) {
            const data = {
                quantity: quantity,
                locations: stitchLocations,
                shirtCost: shirtCost,
                markUp: markUp,
                email: state.generalStates.user.email
            }

            actions.generalActions.setisbusy();
            await apiServices.getEmbroideryPriceQuote(state.generalStates.user.accessToken, data)
                .then(res => {
                    console.log('data,', res.data.result)
                    setEmbroideryPricingResults(res.data.result);
                    resetAll();
                })
                .catch(err => {
                    console.log(err.response)
                })
            actions.generalActions.resetisbusy();
        }
    }


    const addStitchLocation = (stitchLocation) => {
        const newStitchLocations = [...stitchLocations, stitchLocation];
        setStitchLocations(newStitchLocations);
    }

    const removeStitchLocation = () => {
        const newStitchLocations = [...stitchLocations];
        newStitchLocations.pop();
        setStitchLocations(newStitchLocations);
    }

    const renderPricingResults = () => {
        return (
            <>
                {embroideryPricingResults.map(result => {
                    return (
                        <PricingResultsRowComponent
                            text={result.text}
                            value={result.value}
                            style={result.style}
                            additionalItems={result.additionalItems}
                            costDescription={result.costDescription}
                        />
                    )
                })}
            </>
        )
    }

    return (
        <Row>
            <Column flex={.5}>
                <Row>
                    <Column flex={0.05}>

                    </Column>
                    <Column flex={.95}
                        style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                        vertical='center'
                    >
                        <FormItemComponent
                            handleChange={handleChange}
                            register={'quantity'}
                            type={'quantity'}
                            text={'Quantity:'}
                            error={quantityError ? quantityError : null}
                        />
                    </Column>
                </Row>
                <LocationsComponent
                    handleChange={handleChange}
                    defaultLocations={defaultStitchLocations}
                    addLocation={addStitchLocation}
                    removeStitchLocation={removeStitchLocation}
                    textPrefix={'Stitch Location '}
                    textSuffix={'Amt of stitches'}
                    registerPrefix={'stitchLocation'}
                    registerSuffix={'Stitches'}
                    locationsInputType={'stitchLocations'}
                    error={locationsError ? locationsError : null}
                    newLocationDefaultValue={0}
                />
                <Row>
                    <Column flex={0.05}>

                    </Column>
                    <Column flex={.95}
                        style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                        vertical='center'
                    >
                        <FormItemComponent
                            handleChange={handleChange}
                            register={'shirtCost'}
                            type={'shirtCost'}
                            error={shirtCostError ? shirtCostError : null}
                            text={'Shirt Cost (1.5 for $1.50, 2.00 for $2.00, etc.)'}
                        />
                    </Column>
                </Row>
                <Row>
                    <Column flex={0.05}>

                    </Column>
                    <Column flex={.95}
                        style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                        vertical='center'
                    >
                        <FormItemComponent
                            handleChange={handleChange}
                            register={'markUp'}
                            type={'markUp'}
                            error={markUpError ? markUpError : null}
                            text={'Mark Up (50 for 50%, 100 for 100%, etc.)'}
                        />
                    </Column>
                </Row>
                <Row>
                    <Column flex={0.05}>

                    </Column>
                    <Column flex={.95}
                        style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                        vertical='center'
                    >
                        <AwesomeButtonComponent
                            text={'Get Price Quote'}
                            size={'large'}
                            type='secondary'
                            onPress={async () => { handleSubmit() }}
                        />
                    </Column>
                </Row>
            </Column >
            <Column flex={0.5}>
                {
                    embroideryPricingResults ? renderPricingResults()
                        : null
                }
            </Column>
        </Row >
    );
}

export default EmbroideryPricingComponent;