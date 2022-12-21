import axios from 'axios';
const url = process.env.REACT_APP_SERVER_URL

export function postNewLightDarkPrices(accessToken, newShirtPrices) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/submitNewLightDarkPricing",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                newPrices: newShirtPrices
            }
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function postNewEmbroideryPrices(accessToken, newEmbroideryPrices) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/submitNewEmbroideryPricing",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                newPrices: newEmbroideryPrices
            }
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function getShirtPrices() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "shirtprices",
            method: "GET",
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function getEmbroideryShirtPrices() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "embroideryshirtprices",
            method: "GET",
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function getPricingList() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "pricinglist",
            method: "GET",
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function login(token, type, sub, email) {
    return new Promise((resolve, reject) => {
        let data =
        {
            "credential": token,
            "type": type,
        }
        if (sub) {
            data.sub = sub
        }
        if (email) {
            data.email = email
        }
        axios({
            url: url + "api/auth/login",
            method: "POST",
            data: data,
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function loginWithEmail(email, password) {
    return new Promise((resolve, reject) => {
        let data =
        {
            "email": email,
            "password": password,
        }
        axios({
            url: url + "api/auth/loginwithemail",
            method: "POST",
            data: data,
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                // console.log('error');
                // console.log(err)
                reject(err)
            })
    })
}

export function getGoogleProfileFromBearerToken(token) {
    return new Promise((resolve, reject) => {
        axios({
            url: "https://oauth2.googleapis.com/tokeninfo",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function signUpWithEmail(email, password) {
    return new Promise((resolve, reject) => {
        let data =
        {
            "email": email,
            "password": password,
        }
        axios({
            url: url + "api/auth/signupwithemail",
            method: "POST",
            data: data,
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                // console.log('error');
                // console.log(err)
                reject(err)
            })
    })
}