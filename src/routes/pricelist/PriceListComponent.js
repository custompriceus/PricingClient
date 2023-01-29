import React, { useState, useEffect, useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { FaEdit } from "react-icons/fa";
import { Column, Row } from 'simple-flexbox';
import { useForm } from 'react-hook-form';
import 'react-awesome-button/dist/styles.css';
import PricingEditInputComponent from 'components/PricingEditInputComponent';
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

function PriceListComponent() {
    const classes = useStyles();
    const { actions, state } = useContext(StoreContext);
    const [prices, setPrices] = useState();
    const [displayEditLightDarkPricing, setDisplayEditLightDarkPricing] = useState(false);
    const [displayEditEmbroideryPricing, setDisplayEditEmbroideryPricing] = useState(false);
    const [newLightDarkPricing, setNewLightDarkPricing] = useState([]);
    const [newEmbroideryPricing, setNewEmbroideryPricing] = useState([]);

    const fetchData = async () => {
        actions.generalActions.setisbusy()

        await apiServices.getPricingList(state.generalStates.user.accessToken)
            .then(res => {
                console.log('new,', res.data)
                setPrices(res.data)
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

    const {
        register: register,
        formState: { errors: errors },
        handleSubmit: handleSubmit,
        reset: reset
    } = useForm({
        mode: "onBlur",
    });

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    const handleNewPricing = (props, newPrice) => {
        if (props && props.type && props.type === 'lightAndDarkPricing') {
            setNewLightDarkPricing([...newLightDarkPricing,
            {
                colors: props.colors,
                quantity: props.quantity,
                price: parseFloat(newPrice)
            }
            ]);
        }
        else if (props && props.type && props.type === 'embroideryPricing') {
            setNewEmbroideryPricing([...newEmbroideryPricing,
            {
                stitches: props.stitches,
                quantity: props.quantity,
                price: parseFloat(newPrice)
            }
            ]);
        }
        else {
            console.log('cant find one');
        }
    }

    return (
        prices ? (
            <div>
                <table style={{ width: '100%' }}>
                    <caption>
                        Light And Dark Shirt Pricing
                        {state.generalStates.user.email === 'dedtees@gmail.com' || state.generalStates.user.email === 'jweinst4@gmail.com' ?
                            <FaEdit size='16px' onClick={() => {
                                setDisplayEditLightDarkPricing(!displayEditLightDarkPricing)
                            }} />
                            :
                            null
                        }
                    </caption>
                    <tr>
                        <td></td>
                        {prices.shirtColorQuantities.map(item => {
                            return (
                                <th style={{ borderLeft: "1px solid rgb(0, 0, 0)" }} textAlign='center' scope="col">
                                    {item}
                                </th>
                            )
                        })}
                    </tr>
                    {prices.shirtPricingBuckets.map(item => {
                        return (
                            <tr>
                                <th style={{ textAlign: 'center' }} scope="row">{item.shirtQuantityBucket}</th>
                                {item.prices.map(itemTwo => {
                                    return (
                                        <td style={{ textAlign: 'center', justifyContent: 'center' }} >
                                            <Row style={{ borderLeft: "1px solid rgb(0, 0, 0)" }}>
                                                <Column flex={.5}>
                                                    {'$' + (Math.round(itemTwo.price * 100) / 100).toFixed(2)}
                                                </Column>
                                                <Column horizontal='center' vertical='center' flex={.5}>
                                                    {displayEditLightDarkPricing ?
                                                        <PricingEditInputComponent
                                                            colors={itemTwo.colors}
                                                            quantity={itemTwo.quantity}
                                                            type={'lightAndDarkPricing'}
                                                            handleNewPricing={handleNewPricing} />
                                                        : null}
                                                </Column>
                                            </Row>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                    }
                </table >
                {displayEditLightDarkPricing ?
                    <Row vertical='center' horizontal='center'>
                        <AwesomeButtonComponent
                            text={'Submit New Pricing'}
                            size={'large'}
                            type='secondary'
                            onPress={async () => {
                                const response = await apiServices.postNewLightDarkPrices(state.generalStates.user.accessToken, newLightDarkPricing);
                                if (response) {
                                    setNewLightDarkPricing([]);
                                    setDisplayEditLightDarkPricing(false);
                                    fetchData().catch(console.error);
                                }
                            }}
                        />
                    </Row>
                    : null}
                <br />
                <br />
                <table style={{ width: '100%' }}>
                    <caption>
                        Embroidery Pricing
                        {state.generalStates.user.email === 'dedtees@gmail.com' || state.generalStates.user.email === 'jweinst4@gmail.com' ?
                            <FaEdit size='16px' onClick={() => {
                                setDisplayEditEmbroideryPricing(!displayEditEmbroideryPricing)
                            }} />
                            :
                            null
                        }
                    </caption>
                    <tr >
                        <td ></td>
                        {prices.embroideryStitchBuckets.map(item => {
                            return (
                                <th style={{ borderLeft: "1px solid rgb(0, 0, 0)" }} textAlign='center' scope="col">
                                    {item}
                                </th>
                            )
                        })}
                    </tr>
                    {prices.embroideryPricingBuckets.map(item => {
                        return (
                            <tr>
                                <th style={{ textAlign: 'center' }} scope="row">{item.embroideryQuantityBucket}</th>
                                {item.prices.map(itemTwo => {
                                    return (
                                        <td style={{ textAlign: 'center', justifyContent: 'center' }} >
                                            <Row style={{ borderLeft: "1px solid rgb(0, 0, 0)" }}>
                                                <Column flex={.5}>
                                                    {'$' + (Math.round(itemTwo.price * 100) / 100).toFixed(2)}
                                                </Column>
                                                <Column horizontal='center' vertical='center' flex={.5}>
                                                    <Column horizontal='center' vertical='center' flex={.5}>
                                                        {displayEditEmbroideryPricing ?
                                                            <PricingEditInputComponent
                                                                stitches={itemTwo.stitches}
                                                                quantity={itemTwo.quantity}
                                                                type={'embroideryPricing'}
                                                                handleNewPricing={handleNewPricing} />
                                                            : null}
                                                    </Column>
                                                </Column>
                                            </Row>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                    }
                </table >
                {displayEditEmbroideryPricing ?
                    <Row vertical='center' horizontal='center'>
                        <AwesomeButtonComponent
                            text={'Submit New Pricing'}
                            size={'large'}
                            type='secondary'
                            onPress={async () => {
                                const response = await apiServices.postNewEmbroideryPrices(state.generalStates.user.accessToken, newEmbroideryPricing);
                                if (response) {
                                    setNewEmbroideryPricing([]);
                                    setDisplayEditEmbroideryPricing(false);
                                    fetchData().catch(console.error);
                                }
                            }}
                        />
                    </Row>
                    : null}
            </div >
        )
            : null
    );
}

export default PriceListComponent;
