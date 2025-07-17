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
import FormItemComponent from 'components/FormItemComponent';

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
    const [password, setPassword] = useState();
    const [passwordError, setPasswordError] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [screenCharge, setScreenCharge] = useState('');
const [screenChargeSaved, setScreenChargeSaved] = useState(false);
const [screenChargeError, setScreenChargeError] = useState(false);
const [field1, setField1] = useState('');
const [field2, setField2] = useState('');
const [field3, setField3] = useState('');
const [field4, setField4] = useState('');   

const [screenDataSaved, setMaterialDataSaved] = useState(false);
const [screenDataError, setMaterialDataError] = useState(false);

    const fetchScreenCharge = async () => {
    const response = await apiServices.getScreenCharge();
    if (response && response.data && response.data.screenCharge !== undefined) {
        console.log(response);
        setScreenCharge(response.data.screenCharge);
    }
};

   const fetchMaterialData = async () => {
    const response = await apiServices.getMaterialData();
    if (response && response.data && Array.isArray(response.data.alldata)) {
        const [first, second] = response.data.alldata;

        if (first) {
            setField1(first.key);
            setField2(first.value);
        }

        if (second) {
            setField3(second.key);
            setField4(second.value);
        }
    }
};

    const fetchData = async () => {
        actions.generalActions.setisbusy()

        await apiServices.getPricingList()
            .then(res => {
                console.log('new,', res.data)
                setPrices(res.data)
                setScreenCharge(res.data.screenCharge || ''); // <-- Add this line
                actions.generalActions.resetisbusy();
            })
            .catch(err => {
                actions.generalActions.resetisbusy();
                console.log(err.response)
            })
    }

    useEffect(() => {
        fetchData().catch(console.error);      
          fetchScreenCharge();
          fetchMaterialData();

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

    const handleChange = (inputName, value, type) => {
        switch (type) {
            case "password":
                setPassword(value);
                return;
            default:
                throw new Error("Unexpected action");
        }
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
                      
                            <FaEdit size='16px' onClick={() => {
                                setDisplayEditLightDarkPricing(!displayEditLightDarkPricing)
                            }} />                       
                          
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
                         {
                            passwordSaved ? <Row style={{ color: 'red' }}>Password Saved For Session</Row> :
                            <FormItemComponent
                            handleChange={handleChange}
                            register={'password'}
                            type={'password'}
                            text={'Password: '}
                        />
                        }
                        {
                            passwordError ? <Row style={{ color: 'red' }}>Incorrect Password</Row> : null
                        }
                        <AwesomeButtonComponent
                            text={'Submit New Pricing'}
                            size={'large'}
                            type='secondary'
                            onPress={async () => {
                                const response = await apiServices.postNewLightDarkPrices(newLightDarkPricing,password);
                                if (response && response.data && response.data!== 'Wrong Password') {
                                    setNewLightDarkPricing([]);
                                    setDisplayEditLightDarkPricing(false);
                                    setPasswordError(false);
                                    setPasswordSaved(true);
                                    fetchData().catch(console.error);
                                }
                                else {
                                    setPasswordError(true);
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
                       
                            <FaEdit size='16px' onClick={() => {
                                setDisplayEditEmbroideryPricing(!displayEditEmbroideryPricing)
                            }} />
                       
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
                        {
                            passwordSaved ? <Row style={{ color: 'red' }}>Password Saved For Session</Row> :
                            <FormItemComponent
                            handleChange={handleChange}
                            register={'password'}
                            type={'password'}
                            text={'Password: '}
                        />
                        }
                        {
                            passwordError ? <Row style={{ color: 'red' }}>Incorrect Password</Row> : null
                        }
                        <AwesomeButtonComponent
                            text={'Submit New Pricing'}
                            size={'large'}
                            type='secondary'
                            onPress={async () => {
                                const response = await apiServices.postNewEmbroideryPrices(newEmbroideryPricing,password);
                                if (response && response.data && response.data!== 'Wrong Password') {
                                    setNewEmbroideryPricing([]);
                                    setDisplayEditEmbroideryPricing(false);
                                    setPasswordError(false);
                                    setPasswordSaved(true);
                                    fetchData().catch(console.error);
                                }
                                else {
                                    setPasswordError(true);
                                }
                            }}
                        />
                    </Row>
                    : null}

                    <Row vertical='center' horizontal='center' style={{ marginTop: 30 }}>
    <label style={{ marginRight: 10 }}>Screen Charge:</label>
    <input
        type="number"
        value={screenCharge}
        onChange={e => setScreenCharge(e.target.value)}
        style={{ marginRight: 10, width: 100 }}
    />
    <AwesomeButtonComponent
        text={'Save '}
        size={'medium'}
        type='primary'
        onPress={async () => {
            // Call your API to save the screen charge
            const response = await apiServices.saveScreenCharge(screenCharge);
           //const response = '';
            if (response && response.data && response.data.success) {
                setScreenChargeSaved(true);
                setScreenChargeError(false);
                fetchScreenCharge(); // <-- Add this line
            } else {
                setScreenChargeError(true);
            }
        }}
    />
    {screenChargeSaved && <span style={{ color: 'green', marginLeft: 10 }}>Saved!</span>}
    {screenChargeError && <span style={{ color: 'red', marginLeft: 10 }}>Error saving!</span>}
</Row>

         <Row vertical='center' horizontal='center'>
            <h3 style={{ marginBottom: 10 }}>Material</h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 300px)', // updated width
                gap: '20px 25px',
                marginBottom: 15
            }}>
                <input
                    type="text"
                    placeholder="First Material"
                    value={field1}
                    onChange={e => setField1(e.target.value)}
                    style={{ padding: '6px' }}
                />
                <input
                    type="number"
                    placeholder="Amount of first material"
                    value={field2}
                    onChange={e => setField2(e.target.value)}
                    style={{ padding: '6px' }}
                />
                <input
                    type="text"
                    placeholder="Second Material"
                    value={field3}
                    onChange={e => setField3(e.target.value)}
                    style={{ padding: '6px' }}
                />
                <input
                    type="number"
                    placeholder="Amount of second material"
                    value={field4}
                    onChange={e => setField4(e.target.value)}
                    style={{ padding: '6px' }}
                />
            </div>

            <AwesomeButtonComponent
                text="Save"
                size="medium"
                type="primary"
                onPress={async () => {
                        // Call your API to save the screen charge
                        const response = await apiServices.saveMaterialData(field1,field2,field3,field4);
                    //const response = '';
                        if (response && response.data && response.data.success) {
                            setMaterialDataSaved(true);
                            setMaterialDataError(false);
                            fetchMaterialData(); // <-- Add this line
                        } else {
                            setMaterialDataError(true);
                        }
                    }}
            />
            {screenDataSaved && (
                <span style={{ color: 'green', marginLeft: 10 }}>Saved!</span>
            )}
            {screenDataError && (
                <span style={{ color: 'red', marginLeft: 10 }}>Error saving!</span>
            )}
        </Row>

            </div >
        )
            : null
    );
}

export default PriceListComponent;
