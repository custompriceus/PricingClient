import React, { useEffect, useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Column, Row } from 'simple-flexbox';
import CardComponent from 'components/cards/CardComponent';
import 'react-toastify/dist/ReactToastify.css';
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

function DecksComponent() {
    const classes = useStyles();
    const { actions, state } = useContext(StoreContext);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        const fetchData = async () => {
            actions.generalActions.setisbusy()
            await apiServices.getUserById(state.generalStates.user.id, state.generalStates.user.accessToken)
                .then(res => {
                    actions.generalActions.setUser(res.data)
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

    const renderDecks = () => {
        return state.generalStates.user.decks.map(deck => {
            return (
                <Row alignSelf='stretch'>
                    <Column flexGrow={1}>
                        <Row className={classes.cardRow} breakpoints={{ 384: "column" }} >
                            <CardComponent
                                title={deck.deck_name}
                                link='View details'
                                subtitle={`Id: ${deck.id}`}
                                subtitleTwo={<span style={{ color: 'blue' }} onClick={(event) => {
                                    event.preventDefault()
                                    window.open(deck.deck_url, "_blank")
                                }}>Moxfield URL: {deck.deck_url}</span>}
                                subtitleThree={`Deck Price: $${deck.deck_price}`}>
                            </CardComponent >
                        </Row>
                    </Column>
                </Row>)
        })
    }

    return (
        <div>
            <div>
                <ToastContainer />
                <form
                    onSubmit={handleSubmit(async (data) => {
                        console.log(data);
                        await (apiServices.submitDeck(state.generalStates.user.accessToken, state.generalStates.user.id, data.deckName, data.deckUrl, data.deckPrice))
                            .then(res => {
                                console.log(res);
                                actions.generalActions.setUser(res.data)
                                reset();
                                displayToast('Successfully Submitted Your Deck', 'success')
                            })
                            .catch(err => {
                                console.log(err.response)
                                reset();
                                displayToast(err.response.data.message, 'error')
                            })
                    })}
                >
                    <div style={{ paddingBottom: '1%' }}>
                        <label style={{ width: '30%' }} htmlFor="deckName">Deck Name</label>
                        <input style={{ marginLeft: '2%', width: '50%' }} {...register("deckName")} />
                    </div>
                    <div style={{ paddingBottom: '1%' }}>
                        <label htmlFor="deckName">Moxfield Deck Url (include https://)</label>
                        <input style={{ marginLeft: '2%', width: '50%' }} {...register("deckUrl")} />
                    </div>
                    <div style={{ paddingBottom: '1%' }}>
                        <label htmlFor="deckName">Deck Price</label>
                        <input style={{ marginLeft: '2%', width: '50%' }} {...register("deckPrice")} />
                    </div>
                    <input type="submit" />
                </form>
            </div>
            <Row
                className={classes.cardRow}
                breakpoints={{ 384: 'column' }}
            >
                Deck Count: {state.generalStates.user.decks.length}
            </Row>
            {renderDecks()}
        </div>
    );
}

export default DecksComponent;
