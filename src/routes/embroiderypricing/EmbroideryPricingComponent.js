import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

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

    const {
        register: register2,
        formState: { errors: errors2 },
        handleSubmit: handleSubmit2,
        reset: reset2
    } = useForm({
        mode: "onBlur",
    });

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

    const displayToast = (message, type) => {
        toast(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            type: type,
            theme: "light",
        });
    }

    const getEmbroideryShirtQuantityBucket = (shirtQuantity) => {
        switch (true) {
            case (shirtQuantity >= 1 && shirtQuantity <= 5):
                return '1-5';
            case (shirtQuantity >= 6 && shirtQuantity <= 11):
                return '6-11';
            case (shirtQuantity >= 12 && shirtQuantity <= 23):
                return '12-23';
            case (shirtQuantity >= 24 && shirtQuantity <= 47):
                return '24-47';
            case (shirtQuantity >= 48 && shirtQuantity <= 99):
                return '48-99';
            case (shirtQuantity >= 100 && shirtQuantity <= 248):
                return '100-248';
            case (shirtQuantity >= 249):
                return '249+';
            default:
                console.log(`Quantity Not Found`);
        }
    }

    const getStitchQuantityBucket = (stitchQuantity) => {
        switch (true) {
            case (stitchQuantity >= 1 && stitchQuantity <= 4999):
                return '1-4999';
            case (stitchQuantity >= 5000 && stitchQuantity <= 6999):
                return '5000-6999';
            case (stitchQuantity >= 7000 && stitchQuantity <= 8999):
                return '7000-8999';
            case (stitchQuantity >= 9000 && stitchQuantity <= 10999):
                return '9000-10999';
            case (stitchQuantity >= 11000 && stitchQuantity <= 12999):
                return '11000-12999';
            case (stitchQuantity >= 13000 && stitchQuantity <= 14999):
                return '13000-14999';
            case (stitchQuantity >= 15000 && stitchQuantity <= 16999):
                return '15000-16999';
            case (stitchQuantity >= 17000 && stitchQuantity <= 18999):
                return '17000-18999';
            case (stitchQuantity >= 19000 && stitchQuantity <= 20999):
                return '19000-20999';
            case (stitchQuantity >= 21000 && stitchQuantity <= 22999):
                return '21000-22999';
            case (stitchQuantity >= 23000):
                return '23+';
            default:
                console.log(`Quantity Not Found`);
        }
    }

    const getEmbroideryPrintCost = (embroideryShirtQuantityBucket, stitchQuantityBucket) => {
        return parseFloat(embroideryDbPrices.find(obj =>
            obj.quantity == embroideryShirtQuantityBucket && obj.stitches === stitchQuantityBucket
        ).price)
    }

    const embroideryPricingComponent = () => {
        return <Row>
            <Column flex={.5}>
                <ToastContainer />
                <form
                    onSubmit={handleSubmit2(async (data) => {
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
                        const location1PrintCost = location1Stitches && location1Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location1StitchBucket) : 0;
                        setLocation1PrintCost(location1PrintCost);

                        const location2StitchBucket = location2Stitches ? getStitchQuantityBucket(parseInt(location2Stitches)) : null
                        const location2PrintCost = location2Stitches && location2Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location2StitchBucket) : 0;
                        setLocation2PrintCost(location2PrintCost);

                        const location3StitchBucket = location3Stitches ? getStitchQuantityBucket(parseInt(location3Stitches)) : null
                        const location3PrintCost = location3Stitches && location3Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location3StitchBucket) : 0;
                        setLocation3PrintCost(location3PrintCost);

                        const location4StitchBucket = location4Stitches ? getStitchQuantityBucket(parseInt(location4Stitches)) : null
                        const location4PrintCost = location4Stitches && location4Stitches > 0 ? getEmbroideryPrintCost(embroideryShirtQuantityBucket, location4StitchBucket) : 0;
                        setLocation4PrintCost(location4PrintCost);

                        const netCost = (location1PrintCost + location2PrintCost + location3PrintCost + location4PrintCost + shirtCost)
                        setNetCost(netCost);
                        console.log('net cost, ', netCost)

                        const profit = (netCost * (markUp / 100))
                        setProfit(profit);

                        const retailPrice = netCost + profit;
                        setRetailPrice(retailPrice);

                        setTotalCost((netCost * shirtQuantity));
                        console.log('total cost', netCost * shirtQuantity);
                        setTotalProfit((profit * shirtQuantity));

                        reset2();
                    })}
                >
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Quantity
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("quantity")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Location 1 Stitches
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("location1Stitches")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Location 2 Stitches
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("location2Stitches")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Location 3 Stitches
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}}{...register2("location3Stitches")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Location 4 Stitches
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("location4Stitches")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Shirt Cost (1.50 for $1.50, 2.00 for $2.00, etc.)
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("shirtCost")} />
                        </Column>
                    </Row>
                    <Row style={{ margin: '10px' }}>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            Mark Up (50 for 50%, 100 for 100%, etc.)
                        </Column>
                        <Column flex={.5} style={{ marginRight: '10px' }}>
                            <input style={{}} {...register2("markUp")} />
                        </Column>
                    </Row>
                    <AwesomeButton size="large" type="secondary">
                        Get Price Quote
                    </AwesomeButton>
                </form>
            </Column>
            <Column flex={0.5}>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Quantity:
                    </Column>
                    <Column flex={0.5}>
                        {shirtQuantity ? shirtQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 1 Stitches:
                    </Column>
                    <Column flex={0.5}>
                        {location1Stitches ? location1Stitches.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 2 Stitches:
                    </Column>
                    <Column flex={0.5}>
                        {location2Stitches ? location2Stitches.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 3 Stitches:
                    </Column>
                    <Column flex={0.5}>
                        {location3Stitches ? location3Stitches.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 4 Stitches:
                    </Column>
                    <Column flex={0.5}>
                        {location4Stitches ? location4Stitches.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 1 Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${location1PrintCost ? (Math.round(location1PrintCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 2 Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${location2PrintCost ? (Math.round(location2PrintCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 3 Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${location3PrintCost ? (Math.round(location3PrintCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Location 4 Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${location4PrintCost ? (Math.round(location4PrintCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Shirt Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${shirtCost ? (Math.round(shirtCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Net Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${netCost ? (Math.round(netCost * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Mark Up:
                    </Column>
                    <Column flex={0.5}>
                        {markUp ? markUp : 0}%
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Profit:
                    </Column>
                    <Column flex={0.5}>
                        ${profit ? (Math.round(profit * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Retail Price:
                    </Column>
                    <Column flex={0.5}>
                        ${retailPrice ? (Math.round(retailPrice * 100) / 100).toFixed(2) : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Total Cost:
                    </Column>
                    <Column flex={0.5}>
                        ${totalCost ? (Math.round(totalCost * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
                <Row style={{ margin: '10px' }}>
                    <Column flex={0.5}>
                        Total Profit:
                    </Column>
                    <Column flex={0.5}>
                        ${totalProfit ? (Math.round(totalProfit * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                    </Column>
                </Row>
            </Column>
        </Row>
    }

    return (
        <Column >
            {embroideryPricingComponent()}
        </Column>
    );
}

export default EmbroideryPricingComponent;
