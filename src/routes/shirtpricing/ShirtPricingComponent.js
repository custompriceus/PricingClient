import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import ToggleFormItemComponent from 'components/ToggleFormItemComponent';
import { saveInputsForTab, loadInputsForTab } from '../../utils/duplicateManager';

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
    const TAB_KEYS = {
    screen_light: 'screen_light_prev',
    screen_dark: 'screen_dark_prev',
    embroidery: 'embroidery_prev'
};
const [autoFillEnabled, setAutoFillEnabled] = useState(true);

    const { actions, state } = useContext(StoreContext);
    const [shirtPricingResults, setShirtPricingResults] = useState();
    const [selectedAdditionalItems, setSelectedAdditionalItems] = useState();
    const [additionalItemsMinShirtQuantity, setAdditionalItemsMinShirtQuantity] = useState();
    const [quantity, setQuantity] = useState();
    const [quantityError, setQuantityError] = useState();
    const [screenChargeDefault, setScreenChargeDefault] = useState(null);
    const printLocationColorOptions = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
    ];
    const [defaultPrintLocations, setDefaultPrintLocations] = useState([{
        text: "Print Location 1 - Amt of colors:",
        value: 1,
        style: null,
        register: 'printSide1Colors',
        required: false,
        errorDisplayMessage: 'Print location 1 - Amt of colors: ',
        inputValueType: 'integer',
        maxValue: 6,
        sortValue: 1
    }]);
    const [printLocations, setPrintLocations] = useState([{
        text: "Print Location 1 - Amt of colors:",
        value: 1,
        style: null,
        register: 'printSide1Colors',
        required: false,
        errorDisplayMessage: 'Print location 1 - Amt of colors: ',
        inputValueType: 'integer',
        maxValue: 6,
        sortValue: 1
    }]);
    const selectedPrintLocationOptions = printLocations.map(loc =>
        printLocationColorOptions.find(opt => opt.value === Number(loc.value))
    );
    const jerseyNumberSidesOptions = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
    ];
    //get these deefault vaalues from backend
    const [additionalItems, setAdditionalItems] = useState([]);
    const [jerseyNumberSides, setJerseyNumberSides] = useState(0);
    const selectedJerseyNumberSides = jerseyNumberSidesOptions.find(
        opt => opt.value === Number(jerseyNumberSides)
    );
    const [shirtCost, setShirtCost] = useState();
    const [shirtCostError, setShirtCostError] = useState();
    const [markUp, setMarkUp] = useState();
    const [markUpError, setMarkUpError] = useState();
    const [displayScreenCharge, setDisplayScreenCharge] = useState(false);
    const [screenCharge, setScreenCharge] = useState();
    const [screenChargeError, setScreenChargeError] = useState();
    const [displayScreenChargeResults, setDisplayScreenChargeResults] = useState();
    const [canToggleScreenChargeResults, setCanToggleScreenChargeResults] = useState();
    const [resultWithScreenCharges, setResultWithScreenCharges] = useState();
    const [resultWithOutScreenCharges, setResultWithOutScreenCharges] = useState();

    const fetchData = async () => {
        actions.generalActions.setisbusy()
        await apiServices.getShirtPricingDisplay(state.generalStates.user.accessToken)
            .then(res => {
                setShirtPricingResults(res.data.results);
                setSelectedAdditionalItems(res.data.additionalItems.additionalItems);
                setAdditionalItemsMinShirtQuantity(res.data.additionalItems.minShirtQuantity);
                actions.generalActions.resetisbusy();
            })
            .catch(err => {
                actions.generalActions.resetisbusy();
                console.log(err.response)
            })
    }
    const fetchScreenCharge = async () => {
        const response = await apiServices.getScreenCharge();
        console.log(response);
        if (response && response.data && response.data.screenCharge !== undefined) {
            setScreenChargeDefault(response.data.screenCharge);
        }
    };

    useEffect(() => {
        fetchData().catch(console.error);
    //      if (autoFillEnabled) {
    //     handleDuplicate('screen_light');
    // }     
        fetchScreenCharge();  
       
    }, []);
    useEffect(() => {
        if (screenChargeDefault !== null && screenCharge === undefined) {
            setScreenCharge(screenChargeDefault);
        }
    }, [screenChargeDefault, screenCharge]);

//     useEffect(() => {
//     const saved = localStorage.getItem('shirtFormData');
//     if (saved) {
//         const parsed = JSON.parse(saved);
//         setQuantity(parsed.quantity || '');
//         setPrintLocations(parsed.printLocations || defaultPrintLocations);
//         setJerseyNumberSides(parsed.jerseyNumberSides || 0);
//         setShirtCost(parsed.shirtCost || '');
//         setMarkUp(parsed.markUp || '');
//         setScreenCharge(parsed.screenCharge || screenChargeDefault || '');
//         setAdditionalItems(parsed.additionalItems || []);
//         setDisplayScreenCharge(parsed.displayScreenCharge || false);
//     }
// }, []);

// useEffect(() => {
//     const formData = {
//         quantity,
//         printLocations,
//         jerseyNumberSides,
//         shirtCost,
//         markUp,
//         screenCharge,
//         displayScreenCharge,
//         additionalItems
//     };
//     localStorage.setItem('shirtFormData', JSON.stringify(formData));
// }, [quantity, printLocations, jerseyNumberSides, shirtCost, markUp, screenCharge, displayScreenCharge, additionalItems]);

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
            case "printLocation":
                const newData = upsert(printLocations, inputName, value);
                console.log(newData);
                setPrintLocations(newData);
                return;
            case "shirtCost":
                setShirtCost(value);
                return;
            case "markUp":
                setMarkUp(value);
                return;
            case "screenCharge":
                setScreenCharge(value);
                return;
            default:
                throw new Error("Unexpected action");
        }
    }

    const handleAdditionalItemsChange = (inputName, item) => {
        console.log('handleAdditionalItemsChange called:', inputName, item);
        const i = additionalItems.findIndex(_element => _element.register === inputName && _element.item === item);
        const additionalItemsClone = [...additionalItems]
        if (i > -1) {
            additionalItemsClone.splice(i, 1);
        }
        else {
            additionalItemsClone.push(
                {
                    register: inputName,
                    item: item
                }
            )
        }
        setAdditionalItems(additionalItemsClone)
        console.log('additionalItems after set:', additionalItemsClone);
    }

    const resetAll = () => {
        setQuantity();
        setPrintLocations(defaultPrintLocations);
        setJerseyNumberSides();
        setShirtCost();
        setMarkUp();
        setAdditionalItems([]);
        setDisplayScreenCharge(false);
        setScreenCharge(16)
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

        const isScreenChargeValidated = !screenCharge ? true : validateInput('float', screenCharge, 'Screen Charge: ');
        if (isScreenChargeValidated.error) {
            setScreenChargeError(isScreenChargeValidated.message);
            errors.push('isScreenChargeValidated');
        }
        else if (screenChargeError) {
            setScreenChargeError(null)
        }

        if (quantity && parseInt(quantity) < 6) {
            errors.push(`min quantity of 6 for shirts not met`);
            setQuantityError('min quantity of 6 for shirts not met');
        }

        if (additionalItems && additionalItems.length > 0) {
            if (parseInt(quantity) < parseInt(additionalItemsMinShirtQuantity)) {
                errors.push(`min quantity of ${additionalItemsMinShirtQuantity} for additional items not met`);
                setQuantityError('min quantity for additional items not met');
            }
        }

        if (errors && errors.length === 0) {
            const tabKey = TAB_KEYS.screen_light;

            const saveData = {
            quantity,
            printLocations,
            jerseyNumberSides,
            shirtCost,
            markUp,
            screenCharge,
            displayScreenCharge,
            additionalItems
        };
        saveInputsForTab(tabKey, saveData);

            const data = {
                quantity: quantity,
                locations: printLocations,
                additionalItems: additionalItems,
                jerseyNumberSides: jerseyNumberSides,
                shirtCost: shirtCost,
                markUp: markUp,
                screenCharge: displayScreenCharge ? true : false,
                screenChargePrice: screenCharge,
                email: state.generalStates.user.email
            }

            actions.generalActions.setisbusy();
            await apiServices.getShirtPriceQuote(data)
                .then(res => {
                    if (res.data.screenCharge) {
                        setShirtPricingResults(res.data.resultWithScreenCharges);
                        setResultWithScreenCharges(res.data.resultWithScreenCharges);
                        setResultWithOutScreenCharges(res.data.resultWithOutScreenCharges);
                        setCanToggleScreenChargeResults(true);
                        setDisplayScreenChargeResults(true);
                    }
                    else {
                        setShirtPricingResults(res.data.resultWithOutScreenCharges);
                        setResultWithScreenCharges();
                        setResultWithOutScreenCharges(res.data.resultWithOutScreenCharges);
                        setCanToggleScreenChargeResults(false);
                        setDisplayScreenChargeResults(false);
                    }
                   const results = res.data.resultWithScreenCharges || res.data.resultWithOutScreenCharges;
                  if (results) {
                    //console.log(getValueFromResults(results, "Quantity:"));
                         setQuantity(getValueFromResults(results, "Quantity:"));
                         setJerseyNumberSides(getValueFromResults(results, "Jersey Number Sides:"));
                       // Prefill all print locations
    const allPrintLocations = getAllPrintLocationsFromResults(results);
    
    setPrintLocations(allPrintLocations.length > 0 ? allPrintLocations : defaultPrintLocations);
    setAdditionalItems(getSelectedAdditionalItemsFromResults(results));    
                    }
                    //  resetAll();
                })
                .catch(err => {
                    console.log(err.response)
                })
            actions.generalActions.resetisbusy();
        }
    }
    function getValueFromResults(results, label) {
        const found = results.find(item => item.text === label);
        return found ? found.value : '';
    }
    function getAllPrintLocationsFromResults(results) {
    // Find all results with text like "Print Location X - Amt of colors:"
    const printLocationRegex = /^Print Location (\d+) - Amt of colors:$/;
    
    return results
        .filter(item => printLocationRegex.test(item.text))
        .map((item, idx) => ({
            text: item.text,
            value: Number(item.value),
            style: null,
            register: `printSide${idx + 1}Colors`,
            required: false,
            errorDisplayMessage: item.text,
            inputValueType: 'integer',
            maxValue: 6,
            sortValue: idx + 1
        }));
}
function getSelectedAdditionalItemsFromResults(results) {
    const selected = [];
    results.forEach(item => {
        const match = item.text.match(/^Print Location (\d+) - Cost:$/);
        if (match && item.additionalItems && Array.isArray(item.additionalItems)) {
            const locationNum = match[1];
            const register = `printSide${locationNum}Colors`;
            item.additionalItems.forEach(ai => {
                selected.push({ register, item: ai });
            });
        }
    });
    return selected;
}

    const handleDropdownChange = (value, inputName) => {
        // const newData = [...printLocations];
        // const newDataHere = upsert(newData, inputName, value);
        // //cheeck if i can just usse ...printlocations instead of newdata
        // setPrintLocations(newDataHere);

         const newData = upsert(printLocations, inputName, value);
       
    setPrintLocations(newData);
    }

    const handleJerseySidesDropdownChange = (value) => {
        setJerseyNumberSides(value);
    }

    const handleToggleChange = () => {
        setDisplayScreenCharge(!displayScreenCharge);
    }

    const handleDisplayScreenChargeToggleChange = () => {
        if (displayScreenChargeResults) {
            setShirtPricingResults(resultWithOutScreenCharges);
        }
        else {
            setShirtPricingResults(resultWithScreenCharges);
        }
        setDisplayScreenChargeResults(!displayScreenChargeResults);
    }

    const handleDuplicate = (tab) => {
        const tabKey = TAB_KEYS[tab];
        const saved = loadInputsForTab(tabKey);
        
        if (saved) {
            setQuantity(saved.quantity || '');
            setPrintLocations(saved.printLocations || defaultPrintLocations);
            setJerseyNumberSides(saved.jerseyNumberSides || 0);
            setShirtCost(saved.shirtCost || '');
            setMarkUp(saved.markUp || '');
            setScreenCharge(saved.screenCharge || screenChargeDefault || '');
            setAdditionalItems(saved.additionalItems || []);
            setDisplayScreenCharge(saved.displayScreenCharge || false);
        } else {
            alert('No previous values found for this tab.');
        }
    };

    const addPrintLocation = (printLocation) => {
        const newPrintLocations = [...printLocations, printLocation];
        setPrintLocations(newPrintLocations);
    }

    const removePrintLocation = () => {
        const newPrintLocations = [...printLocations];
        newPrintLocations.pop();
        setPrintLocations(newPrintLocations);
    }


    const renderPricingResults = () => {
        return (
            <><Row>
                {canToggleScreenChargeResults ?
                    <Column style={{ margin: '10px' }}>
                        <ToggleFormItemComponent
                            handleChange={handleChange}
                            handleToggleChange={handleDisplayScreenChargeToggleChange}
                            checked={displayScreenChargeResults}
                            displayInput={false}
                            defaultChecked={true}
                            text={'Include Screen Charge'}
                            value={screenCharge}
                        />
                    </Column>
                    : null}
            </Row>
                {shirtPricingResults.map(result => {
                    return (
                        <PricingResultsRowComponent
                            text={result.text}
                            value={result.value}
                            key={result.text}
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
       <>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      <AwesomeButtonComponent
        text="Duplicate Last Inputs"
        type="primary"
        size="medium"
        onPress={() => handleDuplicate('screen_light')}
      />
      <div style={{ marginLeft: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={autoFillEnabled}
            onChange={() => setAutoFillEnabled(!autoFillEnabled)}
          />
          {' '}Auto-fill with last used values?
        </label>
      </div>
    </div>     
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
                            value={quantity} // <-- Add this line
                        />
                    </Column>
                </Row>
                <LocationsComponent
                    handleAdditionalItemsChange={handleAdditionalItemsChange}
                    selectedAdditionalItems={additionalItems}
                    defaultLocations={printLocations}
                    addLocation={addPrintLocation}
                    removeLocation={removePrintLocation}
                    handleDropdownChange={handleDropdownChange}
                    textPrefix={'Print Location '}
                    textSuffix={'Amt of colors'}
                    registerPrefix={'printSide'}
                    registerSuffix={'Colors'}
                    dropdown={true}
                    dropdownOptions={printLocationColorOptions}
                    newLocationDefaultValue={1}
                />
                <Row>
                    <Column flex={0.05}>

                    </Column>
                    <Column flex={.95}
                        style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                        vertical='center'
                    >
                        <FormItemComponent
                            register={'jerseyNumberSides'}
                            type={'jerseyNumberSides'}
                            text={'Optional: If adding numbers, how many sides?'}
                            dropdown={true}
                            dropdownOptions={jerseyNumberSidesOptions}
                            handleDropdownChange={handleJerseySidesDropdownChange}
                            defaultDropdownValue={jerseyNumberSidesOptions[0]}
                            value={selectedJerseyNumberSides}
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
                            register={'shirtCost'}
                            type={'shirtCost'}
                            error={shirtCostError ? shirtCostError : null}
                            text={'Shirt Cost (1.5 for $1.50, 2.00 for $2.00, etc.)'}
                            value={shirtCost}
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
                            value={markUp}
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
                        <ToggleFormItemComponent
                            handleChange={handleChange}
                            handleToggleChange={handleToggleChange}
                            checked={displayScreenCharge}
                            register={'screenCharge'}
                            type={'screenCharge'}
                            error={screenChargeError ? screenChargeError : null}
                            text={'Include Screen Charge'}
                            defaultValue={screenChargeDefault}
                            displayInput={true}
                            value={screenCharge} // <-- ADD THIS LINE
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
                    shirtPricingResults ? renderPricingResults()
                        : null
                }
            </Column>
        </Row >
        </>
    );
}

export default ShirtPricingComponent;
