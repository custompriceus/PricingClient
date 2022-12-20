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
    console.log('get shirt prices at api');
    console.log(url)

    return new Promise((resolve, reject) => {
        axios({
            url: url + "shirtprices",
            method: "GET",
        })
            .then(res => {
                console.log('resolve res');
                console.log(res);
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
    console.log('get embroidery shirt prices at api');
    console.log(url)

    return new Promise((resolve, reject) => {
        axios({
            url: url + "embroideryshirtprices",
            method: "GET",
        })
            .then(res => {
                console.log('resolve res');
                console.log(res);
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
                console.log('resolve res');
                console.log(res);
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
        console.log('at login api');
        axios({
            url: url + "api/auth/login",
            method: "POST",
            data: data,
        })
            .then(res => {
                console.log('resolve res');
                console.log(res);
                resolve(res)
            })
            .catch(err => {
                console.log('error');
                console.log(err)
                reject(err)
            })
    })
}

export function signup() {
    return new Promise((resolve, reject) => {
        let data =
        {
            "email": 'tester1',
            "password": 'abc123',
        }
        console.log('at signup api');
        axios({
            url: url + "api/auth/signup",
            method: "POST",
            data: data,
        })
            .then(res => {
                console.log('resolve res');
                console.log(res);
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