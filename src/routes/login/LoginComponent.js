import { StoreContext } from "../../context/store/storeContext";
// import { useGoogleOneTapLogin, useGoogleLogin } from '@react-oauth/google';
import React, { useState, useContext } from 'react';
import { Column, Row } from 'simple-flexbox';
import useWindowSize from '../../hooks/useWindowSize';
import LoadingComponent from '../../components/loading';
import * as apiServices from '../../resources/api';
import FormComponent from '../../components/FormComponent';

const defaultSignUpItems = [
    { text: 'Email', register: 'email' },
    { text: 'Password', register: 'password', type: 'password' },
    { text: 'Re-type Password', register: 'reTypePassword', type: 'password' },
];

const defaultSignInItems = [
    { text: 'Email', register: 'email' },
    { text: 'Password', register: 'password', type: 'password' },
]

function LoginComponent() {
    const { actions, state } = useContext(StoreContext);
    const [width, height] = useWindowSize();
    const [showSignUpWithEmail, setShowSignUpWithEmail] = useState(false);
    const [showSignInWithEmail, setShowSignInWithEmail] = useState(true);
    const [showSignInWithGoogle, setShowSignInWithGoogle] = useState(false);
    const [error, setError] = useState();
    const [signUpForm, setSignUpForm] = useState(defaultSignUpItems);
    const [signInForm, setSignInForm] = useState(defaultSignInItems);

    const handleError = (error) => {
        console.log(error);
        setError(error)
    }

    const login = async (token, type, sub, email) => {
        // actions.generalActions.setisbusy()

        // await apiServices.login(token, type, sub, email)
        //     .then(res => {
        //         actions.generalActions.setUser(res.data);
        //         actions.generalActions.login()
        //         actions.generalActions.resetisbusy()
        //     })
        //     .catch(err => console.log(err.response))
        console.log('api')
    }

    // const googleLogin = useGoogleLogin({
    //     // onSuccess: async (codeResponse) => {
    //     //     const googleProfile = await apiServices.getGoogleProfileFromBearerToken(codeResponse.access_token);
    //     //     if (googleProfile) {
    //     //         login(codeResponse.access_token, "bearer", googleProfile.data.sub, googleProfile.data.email);
    //     //     }
    //     //     else {
    //     //         console.log('did not get google profile');
    //     //     }
    //     // },
    //     // onError: errorResponse => console.log(errorResponse),
    // });

    // useGoogleOneTapLogin({
    //     // onSuccess: credentialResponse => {
    //     //     login(credentialResponse.credential, "access");
    //     // },
    //     // onError: () => {
    //     //     console.log('Login Failed');
    //     // },
    // });

    const signInWithEmail = async (data) => {
        if (data && data.email && data.password) {
            await apiServices.signInWithEmail(data.email, data.password)
                .then(res => {
                    console.log(res);
                    localStorage.setItem("userDetails", JSON.stringify(res.data));
                    actions.generalActions.setUser(res.data);
                    actions.generalActions.login()
                })
                .catch(err => handleError(err.response.data))
        }
        else {
            handleError('Please Enter An Email And Password')
        }
    }

    const signUpWithEmail = async (data) => {
        if (data && data.password && data.reTypePassword) {
            if (data.password === data.reTypePassword) {
                await apiServices.signUpWithEmail(data.email, data.password)
                    .then(res => {
                        console.log(res);
                        localStorage.setItem("userDetails", JSON.stringify(res.data));
                        actions.generalActions.setUser(res.data);
                        actions.generalActions.login()
                    })
                    .catch(err => handleError(err.response.data))
            }
            else {
                handleError(`Passwords Don't Match`)
            }
        }
        else {
            handleError(`Please Make Sure All Inputs Were Entered`)
        }
    }

    const handleDisplayToggle = async (currentDisplay) => {
        setError()
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
            <div
                onClick={() => handleDisplayToggle(toggleOption)}
                className="mt-5 cursor-pointer text-center text-sm text-gray-600 hover:text-purple-600 border border-gray-300 py-2 px-4 rounded"
            > {text}
            </div>
        )
    }

    if (state.generalStates.isBusy) {
        return <LoadingComponent loading />
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    {showSignInWithGoogle ? 'Create Account' : showSignInWithEmail ? 'Sign In With Email' : 'Sign Up With Email'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {showSignInWithGoogle ? 'Create a Ultima Chatbot account to create the projects.' : ''}
                </p>

                {showSignUpWithEmail && (
                    <FormComponent
                        handleSubmit={signUpWithEmail}
                        error={error}
                        formItems={signUpForm}
                        text={'Create Account'}
                    />
                )}
                {showSignInWithEmail && (
                    <FormComponent
                        handleSubmit={signInWithEmail}
                        error={error}
                        formItems={signInForm}
                        text={'Sign In'}
                    />
                )}

                <div className="text-center mt-2 text-sm text-gray-500">OR</div>

                <div className="flex justify-center gap-2">
                    {showSignInWithGoogle && (
                        <>
                            {displayToggleOptionRow('signUpWithEmail', 'Sign up with Email')}
                            {displayToggleOptionRow('signInWithEmail', 'Sign in with Email')}
                        </>
                    )}
                    {showSignInWithEmail && (
                        <>
                            {displayToggleOptionRow('signUpWithEmail', 'Sign up with Email')}
                            {displayToggleOptionRow('signInWithGoogle', 'Sign in with Google')}
                        </>
                    )}
                    {showSignUpWithEmail && (
                        <>
                            {displayToggleOptionRow('signInWithGoogle', 'Sign in with Google')}
                            {displayToggleOptionRow('signInWithEmail', 'Sign in with Email')}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
