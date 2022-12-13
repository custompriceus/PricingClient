import React, { useState, useEffect, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import CardComponent from 'components/cards/CardComponent';
import { StoreContext } from "../../context/store/storeContext";
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { FaLock } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


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

function LeaguesComponent() {
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

    const handleChange = async (event, index) => {
        console.log(event);
        confirmAlert({
            title: 'Confirm Deck Submission',
            message: `Are You Sure You Want To Submit Deck ${event.label}`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        apiServices.registerLeagueDeck(state.generalStates.user.accessToken, state.generalStates.user.id, event.value)
                            .then(res => {
                                actions.generalActions.setUser(res.data)
                                reset();
                                displayToast('Successfully Registered Your Deck', 'success')
                            })
                            .catch(err => {
                                console.log(err.response)
                                reset();
                                displayToast(err.response.data.message, 'error')
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const renderRegistrantDetails = (registrant, leagueAdminId, shouldDisplayDecks, leagueId) => {
        const isUser = registrant.email === state.generalStates.user.email;

        return (
            <Row vertical='center'>
                <Column flex={.49}>
                    <span>{registrant.email ? registrant.email : "No Email"} </span>
                </Column>
                <Column flex={.02}>
                    {registrant.user_id === leagueAdminId ? <GrUserAdmin /> : null}
                </Column>
                <Column flex={.49}>
                    <Row vertical='center' flex={1}>
                        {
                            shouldDisplayDecks ? registrant.deck_name ?
                                <Row flex={1} vertical='center'>
                                    <Column flex={.5}>
                                        <AwesomeButton type={isUser ? "primary" : "secondary"} size="large"
                                            onPress={(event) => {
                                                event.preventDefault()
                                                window.open(registrant.deck_url, "_blank")
                                            }}
                                        >
                                            {registrant.deck_name}
                                        </AwesomeButton>
                                    </Column>
                                    <Column flex={.5}>
                                        <Row>
                                            <a target="_blank"
                                                href={registrant.deck_url}
                                                style={{ textDecoration: 'none', color: '#1E88E5', opacity: .9 }}
                                            >
                                                Moxfield Link
                                            </a>
                                        </Row>
                                    </Column>
                                </Row>
                                :
                                <span>
                                    <AwesomeButton type={isUser ? "primary" : "secondary"} size="large">
                                        No Deck Name
                                    </AwesomeButton>
                                </span>
                                :
                                isUser ?
                                    registrant.deck_name ?
                                        <Row>
                                            <AwesomeButton type="primary" size="large"
                                                onPress={(event) => {
                                                    event.preventDefault()
                                                    window.open(registrant.deck_url, "_blank")
                                                }}>
                                                {registrant.deck_name}
                                            </AwesomeButton>
                                        </Row>
                                        :
                                        <Column>
                                            <Column flexGrow={1}>
                                                <AwesomeButton type="primary" size="large"
                                                    onPress={() => {
                                                        console.log('clicked here')
                                                    }
                                                    }>
                                                    Submit Your Deck
                                                </AwesomeButton>
                                            </Column>
                                            <Dropdown key='tester' options={state.generalStates.user.decksForSubmission.map(decks => {
                                                return {
                                                    label: decks.label,
                                                    value: leagueId + "-" + decks.value
                                                }
                                            })}
                                                onChange={handleChange}
                                                placeholder="Select A Deck To Submit" />
                                        </Column>
                                    : registrant.deck_id ?
                                        <Row vertical='center'>
                                            <AwesomeButton type="secondary" size="large"
                                                onPress={() =>
                                                    displayToast('Awaiting Deck Reveal Date', 'warning')
                                                }
                                            >
                                                <Row vertical='center' flex={1}><FaLock />
                                                    Deck Submitted
                                                </Row>
                                            </AwesomeButton>
                                        </Row>
                                        :
                                        <Row vertical='center'>
                                            <AwesomeButton type="secondary" size="large"
                                                onPress={() =>
                                                    displayToast('Awaiting Admin To Set Deck Reveal Date', 'warning')
                                                }
                                            >
                                                <Row vertical='center' flex={1}>
                                                    <FaLock />
                                                    Awaiting Submission
                                                </Row>
                                            </AwesomeButton>
                                        </Row>
                        }
                    </Row>
                    <Row vertical='center'>
                    </Row>
                </Column>
            </Row>
        )
    }

    const renderLeagues = () => {
        return state.generalStates.user.leagues.map(league => {
            return (
                <Row alignSelf='stretch'>
                    <Column flexGrow={1}>
                        <Row className={classes.cardRow} breakpoints={{ 384: "column" }} >
                            <CardComponent
                                title={league.name}
                                link='View details'
                                subtitle={`Id: ${league.id}, 
                                Registrants: ${league.registrants.length},
                                    Start Date: ${league.start_date ? league.start_date : "Not Set"},
                                    End Date: ${league.end_date ? league.end_date : "Not Set"},
                                    Deck Reveal Date: ${league.deck_reveal_date ? league.deck_reveal_date : "Not Set"}
                                    `
                                }
                                items={
                                    league.registrants.map((registrant) => (
                                        renderRegistrantDetails(registrant, league.admin_id, league.shouldDisplayDecks, league.id)
                                    ))}>
                            </CardComponent >
                        </Row>
                    </Column>
                </Row>)
        })
    }

    const renderCreateLeague = () => {
        return (
            <Row breakpoints={{ 384: 'column' }}>
                <Row style={{ flex: .3 }}>
                    Create League - League Name:
                </Row>
                <Row style={{ flex: .7 }}>
                    <form id='createLeagueForm' onSubmit={handleSubmit(async (data) => await apiServices.createLeague(state.generalStates.user.accessToken, state.generalStates.user.id, data.leagueName)
                        .then(res => {
                            actions.generalActions.setUser(res.data)
                            reset();
                            displayToast('Successfully Created A League', 'success')
                        })
                        .catch(err => {
                            console.log(err.response)
                            reset();
                            displayToast(err.response.data.message, 'error')
                        }))}>
                        <input id='createLeague' {...register('leagueName', { required: true })} />
                        <AwesomeButton size="large" type="secondary">
                            Create League
                        </AwesomeButton>
                    </form>
                </Row>
            </Row>
        )
    }

    const renderJoinLeague = () => {
        return (
            <Row breakpoints={{ 384: 'column' }}>
                <Row style={{ flex: .3 }}>
                    Join League - League Id:
                </Row>
                <Row style={{ flex: .7 }}>
                    <form id='joinLeagueForm' onSubmit={
                        handleSubmit2(async (data) => {
                            var regex = /^[0-9]+$/;
                            if (!data.leagueId.match(regex)) {
                                displayToast('Please Enter A Valid League Id', 'warning')
                                reset2();
                                return;
                            }
                            await apiServices.joinLeague(state.generalStates.user.accessToken, state.generalStates.user.id, data.leagueId)
                                .then(res => {
                                    actions.generalActions.setUser(res.data)
                                    reset2();
                                    displayToast('Succesfully Joined A League', 'success')
                                })
                                .catch(err => {
                                    reset2();
                                    displayToast(err.response.data.message, 'error')
                                })
                        })}>
                        <input id='joinLeague' {...register2('leagueId', { required: true })} />
                        <AwesomeButton size="large" type="secondary">
                            Join League
                        </AwesomeButton>
                    </form>
                </Row>
            </Row>
        )
    }

    return (
        <Column>
            <ToastContainer />
            {renderCreateLeague()}
            <br />
            {renderJoinLeague()}
            <Row
                className={classes.cardRow}
                breakpoints={{ 384: 'column' }}
            >
                League Count: {state.generalStates.user.leagues.length}
            </Row>
            {renderLeagues()}
        </Column>
    );
}

export default LeaguesComponent;
