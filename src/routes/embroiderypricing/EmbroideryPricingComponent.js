import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { formatNumber } from '../../resources/utilities';
import FormComponent from 'components/FormComponent';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';

function EmbroideryPricingComponent() {
    const { actions, state } = useContext(StoreContext);
    const [shirtCost, setShirtCost] = useState();
    const [markUp, setMarkUp] = useState();
    const [shirtQuantity, setShirtQuantity] = useState();
    const [netCost, setNetCost] = useState();
    const [profit, setProfit] = useState();
    const [totalCost, setTotalCost] = useState();
    const [totalProfit, setTotalProfit] = useState();
    const [retailPrice, setRetailPrice] = useState();

    const [location1Stitches, setLocation1Stitches] = useState();
    const [location2Stitches, setLocation2Stitches] = useState();
    const [location3Stitches, setLocation3Stitches] = useState();
    const [location4Stitches, setLocation4Stitches] = useState();

    const [location1PrintCost, setLocation1PrintCost] = useState();
    const [location2PrintCost, setLocation2PrintCost] = useState();
    const [location3PrintCost, setLocation3PrintCost] = useState();
    const [location4PrintCost, setLocation4PrintCost] = useState();

    const [embroideryDbPrices, setEmbroideryDbPrices] = useState();

    useEffect(() => {
        const fetchData = async () => {
            actions.generalActions.setisbusy()
            await apiServices.getEmbroideryPrices(state.generalStates.user.accessToken)
                .then(res => {
                    setEmbroideryDbPrices(res.data);
                    actions.generalActions.resetisbusy();
                })
                .catch(err => console.log(err.response))
        }
        fetchData().catch(console.error);
    }, []);

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    const handleSubmit = async (data) => {
        actions.generalActions.setisbusy()
        await apiServices.getEmbroideryPriceQuote(state.generalStates.user.accessToken, data, state.generalStates.user.email)
            .then(res => {
                setShirtQuantity(parseInt(res.data.shirtQuantity));
                setShirtCost(res.data.shirtCost);
                setMarkUp(res.data.markUp);
                setLocation1Stitches(res.data.location1Stitches);
                setLocation2Stitches(res.data.location2Stitches);
                setLocation3Stitches(res.data.location3Stitches);
                setLocation4Stitches(res.data.location4Stitches);
                setLocation1PrintCost(res.data.location1PrintCost);
                setLocation2PrintCost(res.data.location2PrintCost);
                setLocation3PrintCost(res.data.location3PrintCost);
                setLocation4PrintCost(res.data.location4PrintCost);
                setNetCost(res.data.netCost);
                setProfit(res.data.profit);
                setRetailPrice(res.data.retailPrice);
                setTotalCost(res.data.totalCost);
                setTotalProfit(res.data.totalProfit);
                actions.generalActions.resetisbusy();
            })
            .catch(err => {
                actions.generalActions.resetisbusy();
                console.log(err.response)
            })
    }

    return (
        <Column >
            <Row>
                <Column flex={.5}>
                    <FormComponent
                        handleSubmit={handleSubmit}
                        items={
                            [
                                { text: 'Quantity', register: 'quantity' },
                                { text: 'Location 1 Stitches', register: 'location1Stitches' },
                                { text: 'Location 2 Stitches', register: 'location2Stitches' },
                                { text: 'Location 3 Stitches', register: 'location3Stitches' },
                                { text: 'Location 4 Stitches', register: 'location4Stitches' },
                                { text: 'Shirt Cost (1.50 for $1.50, 2.00 for $2.00, etc.)', register: 'shirtCost' },
                                { text: 'Mark Up (50 for 50%, 100 for 100%, etc.)', register: 'markUp' },
                            ]
                        }
                    />
                </Column>
                <Column flex={0.5}>
                    <PricingResultsRowComponent text={'Quantity'} value={shirtQuantity} />
                    <PricingResultsRowComponent text={'Location 1 Stitches'} value={location1Stitches} />
                    <PricingResultsRowComponent text={'Location 2 Stitches'} value={location2Stitches} />
                    <PricingResultsRowComponent text={'Location 3 Stitches'} value={location3Stitches} />
                    <PricingResultsRowComponent text={'Location 4 Stitches'} value={location4Stitches} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Location 1 Cost'} value={'$' + formatNumber(location1PrintCost)} />
                    <PricingResultsRowComponent text={'Location 2 Cost'} value={'$' + formatNumber(location2PrintCost)} />
                    <PricingResultsRowComponent text={'Location 3 Cost'} value={'$' + formatNumber(location3PrintCost)} />
                    <PricingResultsRowComponent text={'Location 4 Cost'} value={'$' + formatNumber(location4PrintCost)} />
                    <PricingResultsRowComponent text={'Shirt Cost'} value={'$' + formatNumber(shirtCost)} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Net Cost'} value={'$' + formatNumber(netCost)} />
                    <PricingResultsRowComponent text={'Mark Up'} value={formatNumber(markUp) + '%'} />
                    <PricingResultsRowComponent text={'Profit'} value={'$' + formatNumber(profit)} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Retail Price'} value={'$' + formatNumber(retailPrice)} style={{ borderBottom: '1px dotted' }} />
                    <PricingResultsRowComponent text={'Total Cost'} value={'$' + formatNumber(totalCost).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                    <PricingResultsRowComponent text={'Total Profit'} value={'$' + formatNumber(totalProfit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                </Column>
            </Row>
        </Column>
    );
}

export default EmbroideryPricingComponent;
