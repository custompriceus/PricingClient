import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { formatNumber } from '../../resources/utilities';
import { validateInputs } from '../../resources/utilities';
import FormComponent from 'components/FormComponent';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';

const defaultFormItems = [
    { text: 'Quantity', register: 'quantity', value: null },
    { text: 'Print Side One Colors', register: 'printSideOneColors', value: null },
    { text: 'Print Side Two Colors', register: 'printSideTwoColors', value: null },
    { text: 'Jersey Number Sides', register: 'jerseyNumberSides', value: null },
    { text: 'Shirt Cost (1.50 for $1.50, 2.00 for $2.00, etc.)', register: 'shirtCost', value: null },
    { text: 'Mark Up (50 for 50%, 100 for 100%, etc.)', register: 'markUp', value: null },
]

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
    const [shirtCost, setShirtCost] = useState();
    const [jerseyNumberCost, setJerseyNumberCost] = useState();
    const [markUp, setMarkUp] = useState();
    const [printSideOneColors, setPrintSideOneColors] = useState();
    const [printSideTwoColors, setPrintSideTwoColors] = useState();
    const [jerseyNumberSides, setJerseyNumberSides] = useState();
    const [shirtQuantity, setShirtQuantity] = useState();
    const [netCost, setNetCost] = useState();
    const [printSideOneCost, setPrintSideOneCost] = useState();
    const [printSideTwoCost, setPrintSideTwoCost] = useState();
    const [additionalItemsCost, setAdditionalItemsCost] = useState();
    const [profit, setProfit] = useState();
    const [totalCost, setTotalCost] = useState();
    const [totalProfit, setTotalProfit] = useState();
    const [retailPrice, setRetailPrice] = useState();
    const [formItems, setFormItems] = useState(defaultFormItems);
    const [formErrors, setFormErrors] = useState();

    const [dbPrices, setdbPrices] = useState();

    const additionalItems = [
        { name: 'Nylon', checked: false },
        { name: 'Poly', checked: false },
        { name: 'Mesh', checked: false },
        { name: 'Jersey', checked: false },
        { name: 'Legs', checked: false },
        { name: 'Sweats', checked: false },
        { name: 'Sleeves', checked: false }
    ];
    const [selectedAdditionalItems, setSelectedAdditionalItems] = useState(additionalItems);
    const [finalSelectedItems, setFinalSelectedItems] = useState();
    const [finalSelectedItemsString, setFinalSelectedItemsString] = useState();

    const handleAdditionalItems = (item) => {
        const objIndex = selectedAdditionalItems.findIndex((obj => obj.name == item.name));
        let clone = selectedAdditionalItems.slice()
        clone[objIndex].checked = !item.checked

        setSelectedAdditionalItems(clone)
    };

    const handleSubmit = async (data) => {
        actions.generalActions.setisbusy()
        const validatedInputs = validateInputs(data);
        if (validatedInputs.map && validatedInputs.length > 0) {
            const adjustedItems = [];
            formItems.map(item => {
                const isItemAnError = validatedInputs.find(function (input) {
                    return input.key === item.register;
                });
                if (!isItemAnError) {
                    const key = item.register;
                    adjustedItems.push({
                        text: item.text,
                        register: item.register,
                        value: data[key]
                    })
                }
                else {
                    adjustedItems.push(item)
                }
            })
            setFormItems(adjustedItems);
            setFormErrors(validatedInputs);
        }
        else {
            await apiServices.getShirtPriceQuote(state.generalStates.user.accessToken, data, selectedAdditionalItems, state.generalStates.user.email)
                .then(res => {
                    setShirtQuantity(parseInt(res.data.shirtQuantity));
                    setShirtCost(res.data.shirtCost);
                    setMarkUp(res.data.markUp);
                    setPrintSideOneColors(res.data.printSideOneColors);
                    setPrintSideTwoColors(res.data.printSideTwoColors);
                    setJerseyNumberSides(res.data.jerseyNumberSides);
                    setPrintSideOneCost(res.data.printSideOneCost);
                    setPrintSideTwoCost(res.data.printSideTwoCost);
                    setJerseyNumberCost(res.data.jerseyNumberCost);
                    setFinalSelectedItems(res.data.finalSelectedItems);
                    setFinalSelectedItemsString(res.data.finalSelectedItemsString);
                    setAdditionalItemsCost(res.data.additionalItemsCost)
                    setNetCost(res.data.netCost);
                    setProfit(res.data.profit);
                    setRetailPrice(res.data.retailPrice);
                    setTotalCost(res.data.totalCost);
                    setTotalProfit(res.data.totalProfit);

                    setSelectedAdditionalItems(res.data.selectedAdditionalItems)
                    setFormErrors([])
                    setFormItems(defaultFormItems);
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
        actions.generalActions.resetisbusy();
    }

    useEffect(() => {
        const fetchData = async () => {
            actions.generalActions.setisbusy()
            await apiServices.getShirtPrices(state.generalStates.user.accessToken)
                .then(res => {
                    setdbPrices(res.data);
                    actions.generalActions.resetisbusy();
                })
                .catch(err => console.log(err.response))
        }
        fetchData().catch(console.error);
    }, []);

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }


    return (
        <Column >
            {formErrors ?
                formErrors.map(error => {
                    return (
                        <PricingResultsRowComponent hideValue hideColon text={`Error: ${error.message}`} style={{ color: 'red' }} />
                    )
                })
                : null}
            <Row>
                <Column flex={.5}>
                    <FormComponent
                        handleSubmit={handleSubmit}
                        selectedAdditionalItems={selectedAdditionalItems}
                        handleAdditionalItems={handleAdditionalItems}
                        items={formItems}
                    />
                </Column>
                <Column flex={0.5}>
                    <PricingResultsRowComponent text={'Quantity'} value={shirtQuantity} />
                    <PricingResultsRowComponent text={'Print Side One Colors'} value={printSideOneColors} />
                    <PricingResultsRowComponent text={'Print Side Two Colors'} value={printSideTwoColors} />
                    <PricingResultsRowComponent text={'Jersey Number Sides'} value={jerseyNumberSides} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Print Side One Cost'} value={'$' + formatNumber(printSideOneCost)} />
                    <PricingResultsRowComponent text={'Print Side Two Cost'} value={'$' + formatNumber(printSideTwoCost)} />
                    <PricingResultsRowComponent text={'Jersey Number Cost'} value={'$' + formatNumber(jerseyNumberCost)} />
                    <PricingResultsRowComponent text={'Shirt Cost'} value={'$' + formatNumber(shirtCost)} />
                    <PricingResultsRowComponent text={'Additional Items Cost'} value={'$' + formatNumber(additionalItemsCost)}
                        style={finalSelectedItems && finalSelectedItems.map ? null : { borderBottom: '1px dotted' }} />

                    {finalSelectedItems && finalSelectedItems.map ?
                        <Row style={{ margin: '10px', flex: 1, borderBottom: '1px dotted' }}>
                            <span style={{ fontSize: '14px' }}>{finalSelectedItemsString}</span>
                        </Row> : null}

                    <PricingResultsRowComponent text={'Net Cost'} value={'$' + formatNumber(netCost)} />
                    <PricingResultsRowComponent text={'Mark Up'} value={formatNumber(markUp) + '%'} />
                    <PricingResultsRowComponent text={'Profit'} value={'$' + formatNumber(profit)} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Retail Price'} value={'$' + formatNumber(retailPrice)} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Total Cost'} value={'$' + formatNumber(totalCost).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                    <PricingResultsRowComponent text={'Total Profit'} value={'$' + formatNumber(totalProfit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                </Column>
            </Row >
        </Column >
    );
}

export default ShirtPricingComponent;
