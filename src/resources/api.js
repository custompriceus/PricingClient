import axios from 'axios';
const url = process.env.REACT_APP_SERVER_URL

export function getDefaultEmbroideryPricingResults() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/getEmbroideryPricingDisplay",
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
export function getShirtPricingDisplay() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/getShirtPricingDisplay",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }, 
            method: "GET"
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

export function getEmbroideryPricingDisplay() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/getEmbroideryPricingDisplay",
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

export function getEmbroideryPriceQuote(data) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/getEmbroideryPriceQuote",
            method: "POST",
            data: data
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

export function getShirtPriceQuote(data) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/getShirtPriceQuote",
            method: "POST",
            data: data
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

export function postNewLightDarkPrices(newShirtPrices,password) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/submitNewLightDarkPricing",
            method: "POST",
            data: {
                newPrices: newShirtPrices,
                password:password
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

export function postNewEmbroideryPrices(newEmbroideryPrices,password) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/submitNewEmbroideryPricing",
            method: "POST",
            data: {
                newPrices: newEmbroideryPrices,
                password:password
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
            url: url + "api/user/shirtprices",
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

export function getEmbroideryPrices() {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/embroideryprices",
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
            url: url + "api/user/pricinglist",
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
            url: url + "api/auth/logintest",
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

export function signInWithEmail(email, password) {
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