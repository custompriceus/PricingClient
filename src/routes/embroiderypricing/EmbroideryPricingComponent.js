import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { formatNumber } from '../../resources/utilities';
import { getEmbroideryShirtQuantityBucket } from '../../resources/utilities';
import { getStitchQuantityBucket } from '../../resources/utilities';
import { getEmbroideryPrintCost } from '../../resources/utilities';
import FormComponent from 'components/FormComponent';
import PricingResultsRowComponent from 'components/PricingResultsRowComponent';

function EmbroideryPricingComponent() {

    const { actions, state } = useContext(StoreContext);
    const [pricing, setPricing] = useState();
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

    const [shirtQuantityBucket, setShirtQuantityBucket] = useState();
    const [embroideryDbPrices, setEmbroideryDbPrices] = useState();

    useEffect(() => {
        const fetchData = async () => {
            actions.generalActions.setisbusy()
            await apiServices.getEmbroideryShirtPrices()
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

    const handleSubmit = (data) => {
        const shirtCost = parseFloat(data.shirtCost);
        const shirtQuantity = parseInt(data.quantity);
        const markUp = parseFloat(data.markUp);
        const location1Stitches = data.location1Stitches;
        const location2Stitches = data.location2Stitches;
        const location3Stitches = data.location3Stitches;
        const location4Stitches = data.location4Stitches;

        setPricing(data);
        setShirtQuantity(parseInt(shirtQuantity));
        setShirtCost(shirtCost);
        setMarkUp(markUp);
        setLocation1Stitches(location1Stitches);
        setLocation2Stitches(location2Stitches);
        setLocation3Stitches(location3Stitches);
        setLocation4Stitches(location4Stitches);

        const embroideryShirtQuantityBucket = getEmbroideryShirtQuantityBucket(shirtQuantity);
        setShirtQuantityBucket(embroideryShirtQuantityBucket);

        const location1StitchBucket = location1Stitches ? getStitchQuantityBucket(parseInt(location1Stitches)) : null
        const location1PrintCost = location1Stitches && location1Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location1StitchBucket, embroideryDbPrices) : 0;
        setLocation1PrintCost(location1PrintCost);

        const location2StitchBucket = location2Stitches ? getStitchQuantityBucket(parseInt(location2Stitches)) : null
        const location2PrintCost = location2Stitches && location2Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location2StitchBucket, embroideryDbPrices) : 0;
        setLocation2PrintCost(location2PrintCost);

        const location3StitchBucket = location3Stitches ? getStitchQuantityBucket(parseInt(location3Stitches)) : null
        const location3PrintCost = location3Stitches && location3Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location3StitchBucket, embroideryDbPrices) : 0;
        setLocation3PrintCost(location3PrintCost);

        const location4StitchBucket = location4Stitches ? getStitchQuantityBucket(parseInt(location4Stitches)) : null
        const location4PrintCost = location4Stitches && location4Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location4StitchBucket, embroideryDbPrices) : 0;
        setLocation4PrintCost(location4PrintCost);

        const netCost = (location1PrintCost + location2PrintCost + location3PrintCost + location4PrintCost + shirtCost)
        setNetCost(netCost);

        const profit = (netCost * (markUp / 100))
        setProfit(profit);

        const retailPrice = netCost + profit;
        setRetailPrice(retailPrice);

        setTotalCost((netCost * shirtQuantity));
        setTotalProfit((profit * shirtQuantity));
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
