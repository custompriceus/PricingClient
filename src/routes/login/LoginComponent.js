import { StoreContext } from "../../context/store/storeContext";
import { useGoogleOneTapLogin, useGoogleLogin } from '@react-oauth/google';
import React, { useState, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import useWindowSize from '../../hooks/useWindowSize';
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import FormComponent from '../../components/FormComponent';

function LoginComponent() {
    const { actions, state } = useContext(StoreContext);
    const [width, height] = useWindowSize();
    const [showSignUpWithEmail, setShowSignUpWithEmail] = useState(false);
    const [showSignInWithEmail, setShowSignInWithEmail] = useState(false);
    const [showSignInWithGoogle, setShowSignInWithGoogle] = useState(true);


    const login = async (token, type, sub, email) => {
        actions.generalActions.setisbusy()

        await apiServices.login(token, type, sub, email)
            .then(res => {
                actions.generalActions.setUser(res.data);
                actions.generalActions.login()
            })
            .catch(err => console.log(err.response))
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const googleProfile = await apiServices.getGoogleProfileFromBearerToken(codeResponse.access_token);
            if (googleProfile) {
                login(codeResponse.access_token, "bearer", googleProfile.data.sub, googleProfile.data.email);
            }
            else {
                console.log('did not get google profile');
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            login(credentialResponse.credential, "access");
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    const signInWithEmail = async (data) => {
        await apiServices.signInWithEmail(data.email, data.password)
            .then(res => {
                console.log(res);
                actions.generalActions.setUser(res.data);
                actions.generalActions.login()
            })
            .catch(err => console.log(err.response))
    }

    const signUpWithEmail = async (data) => {
        await apiServices.signUpWithEmail(data.email, data.password)
            .then(res => {
                console.log(res);
                actions.generalActions.setUser(res.data);
                actions.generalActions.login()
            })
            .catch(err => console.log(err.response))
    }

    const handleDisplayToggle = async (currentDisplay) => {
        switch (currentDisplay) {
            case ('signInWithGoogle'):
                setShowSignInWithGoogle(true)
                setShowSignInWithEmail(false)
                setShowSignUpWithEmail(false)
                return;
            case ('signInWithEmail'):
                setShowSignInWithGoogle(false)
                setShowSignInWithEmail(true)
                setShowSignUpWithEmail(false)
                return;
            case ('signUpWithEmail'):
                setShowSignInWithGoogle(false)
                setShowSignInWithEmail(false)
                setShowSignUpWithEmail(true)
                return;
            default:
                console.log(`Display Not Found`);
        }
    }

    const displayToggleOptionRow = (toggleOption, text) => {
        return (
            <Column
                onClick={() => { handleDisplayToggle(toggleOption) }}
                style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px', padding: '10px', border: '1px solid', borderRadius: '3px', cursor: "pointer" }}>
                {text}
            </Column>
        )
    }

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    return (
        <Column style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: height
        }}>
            <Row center='vertical' horizontal='vertical' style={{ marginBottom: '10px' }}>
                {showSignInWithGoogle ?
                    null :
                    showSignInWithEmail ?
                        <Row style={{ fontSize: '30px' }}>
                            Sign In With Email
                        </Row>
                        : showSignUpWithEmail ?
                            <Row style={{ fontSize: '30px' }}>
                                Sign Up With Email
                            </Row> : null}
            </Row>
            {showSignInWithGoogle ? <Row style={{ cursor: 'pointer', marginTop: '30px' }} onClick={() => {
                googleLogin()
            }}><img src={require('../../assets/icons/google_signin_buttons/web/2x/btn_google_signin_dark_pressed_web@2x.png')} />
            </Row> : null}
            {showSignUpWithEmail ? <FormComponent
                handleSubmit={signUpWithEmail}
                items={
                    [
                        { text: 'Email', register: 'email' },
                        { text: 'Password', register: 'password', type: 'password' },
                        { text: 'Re-type Password', register: 'reTypePassword', type: 'password' },
                    ]
                }
                text={'Sign Up'}
            /> : null}
            {showSignInWithEmail ?
                <FormComponent
                    handleSubmit={signInWithEmail}
                    items={
                        [
                            { text: 'Email', register: 'email' },
                            { text: 'Password', register: 'password', type: 'password' },
                        ]
                    }
                    text={'Sign In'}
                />
                : null}
            <Row center='vertical' horizontal='vertical'>
                {showSignInWithGoogle ?
                    <Row>
                        {displayToggleOptionRow('signUpWithEmail', 'Sign up with Email')}
                        {displayToggleOptionRow('signInWithEmail', 'Sign in with Email')}
                    </Row> :
                    showSignInWithEmail ?
                        <Row>
                            {displayToggleOptionRow('signUpWithEmail', 'Sign up with Email')}
                            {displayToggleOptionRow('signInWithGoogle', 'Sign in with Google')}
                        </Row>
                        : showSignUpWithEmail ?
                            <Row>
                                {displayToggleOptionRow('signInWithGoogle', 'Sign in with Google')}
                                {displayToggleOptionRow('signInWithEmail', 'Sign in with Email')}
                            </Row> : null}
            </Row>
        </Column>
    );
}

export default LoginComponent;
