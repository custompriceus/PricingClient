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

export async function getUserById(id, accessToken) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/" + id,
            method: "GET",
            headers: {
                "access-control-allow-origin": "*",
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": accessToken
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

export function createLeague(accessToken, userId, leagueName) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/createleague",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                "userId": userId,
                "leagueName": leagueName
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

export function joinLeague(accessToken, userId, leagueId) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/joinleague",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                "userId": userId,
                "leagueId": leagueId
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

export function submitDeck(accessToken, userId, deckName, deckUrl, deckPrice) {
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/submitdeck",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                "userId": userId,
                "deckName": deckName,
                "deckUrl": deckUrl,
                "deckPrice": deckPrice
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

export function registerLeagueDeck(accessToken, userId, deckDetails) {
    console.log('register league deck');
    return new Promise((resolve, reject) => {
        axios({
            url: url + "api/user/registerleaguedeck",
            method: "POST",
            headers: {
                "x-access-token": accessToken
            },
            data: {
                "userId": userId,
                "deckDetails": deckDetails
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
