import React from 'react';
import { StoreProvider } from "./context/store/storeContext";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import Theme from 'resources/theme';
import Routes from 'routes';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { GoogleOAuthProvider } from '@react-oauth/google';



ReactDOM.render(
    <ThemeProvider theme={Theme}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <StoreProvider>
                <Router>
                    <Routes />
                </Router>
            </StoreProvider>
        </GoogleOAuthProvider>
    </ThemeProvider>
    ,
    document.getElementById('root')

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
