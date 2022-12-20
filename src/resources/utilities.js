export function convertSlugToUrl(slug, parameters) {
    let url = slug;
    Object.entries(parameters).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
    });
    return url;
}

export const refreshTokenSetup = (res) => {
    // Timing to renew access token
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async () => {
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
        console.log('newAuthRes:', newAuthRes);
        // saveUserToken(newAuthRes.access_token);  <-- save new token
        localStorage.setItem('authToken', newAuthRes.id_token);

        // Setup the other timer after the first one
        setTimeout(refreshToken, refreshTiming);
    };

    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
};

export function getShirtQuantityBucket(shirtQuantity) {
    switch (true) {
        case (shirtQuantity >= 6 && shirtQuantity <= 11):
            return '6-11';
        case (shirtQuantity >= 12 && shirtQuantity <= 36):
            return '12-36';
        case (shirtQuantity >= 37 && shirtQuantity <= 72):
            return '37-72';
        case (shirtQuantity >= 73 && shirtQuantity <= 144):
            return '73-144';
        case (shirtQuantity >= 145 && shirtQuantity <= 287):
            return '145-287';
        case (shirtQuantity >= 288 && shirtQuantity <= 499):
            return '288-499';
        case (shirtQuantity >= 500 && shirtQuantity <= 999):
            return '500-999';
        case (shirtQuantity >= 1000 && shirtQuantity <= 4999):
            return '1000-4999';
        case (shirtQuantity >= 5000):
            return '5000+';
        default:
            console.log(`Quantity Not Found`);
    }
}

export function getPrintCost(shirtQuantityBucket, numberOfColors, dbPrices) {
    return parseFloat(dbPrices.find(obj =>
        obj.quantity == shirtQuantityBucket && obj.colors === parseInt(numberOfColors)
    ).price)
}

export function getAdditionalItemsPrice(shirtQuantity) {
    switch (true) {
        case (shirtQuantity >= 12 && shirtQuantity <= 36):
            return 0.50;
        case (shirtQuantity >= 37 && shirtQuantity <= 72):
            return 0.35;
        case (shirtQuantity > 72):
            return 0.25;
        default:
            console.log(`Quantity Not Found`);
    }
}

export function formatNumber(number) {
    const newNumber = number ? number : 0;
    return (Math.round(newNumber * 100) / 100).toFixed(2)
}

export function getEmbroideryShirtQuantityBucket(shirtQuantity) {
    switch (true) {
        case (shirtQuantity >= 1 && shirtQuantity <= 5):
            return '1-5';
        case (shirtQuantity >= 6 && shirtQuantity <= 11):
            return '6-11';
        case (shirtQuantity >= 12 && shirtQuantity <= 23):
            return '12-23';
        case (shirtQuantity >= 24 && shirtQuantity <= 47):
            return '24-47';
        case (shirtQuantity >= 48 && shirtQuantity <= 99):
            return '48-99';
        case (shirtQuantity >= 100 && shirtQuantity <= 248):
            return '100-248';
        case (shirtQuantity >= 249):
            return '249+';
        default:
            console.log(`Quantity Not Found`);
    }
}

export function getStitchQuantityBucket(stitchQuantity) {
    switch (true) {
        case (stitchQuantity >= 1 && stitchQuantity <= 4999):
            return '1-4999';
        case (stitchQuantity >= 5000 && stitchQuantity <= 6999):
            return '5000-6999';
        case (stitchQuantity >= 7000 && stitchQuantity <= 8999):
            return '7000-8999';
        case (stitchQuantity >= 9000 && stitchQuantity <= 10999):
            return '9000-10999';
        case (stitchQuantity >= 11000 && stitchQuantity <= 12999):
            return '11000-12999';
        case (stitchQuantity >= 13000 && stitchQuantity <= 14999):
            return '13000-14999';
        case (stitchQuantity >= 15000 && stitchQuantity <= 16999):
            return '15000-16999';
        case (stitchQuantity >= 17000 && stitchQuantity <= 18999):
            return '17000-18999';
        case (stitchQuantity >= 19000 && stitchQuantity <= 20999):
            return '19000-20999';
        case (stitchQuantity >= 21000 && stitchQuantity <= 22999):
            return '21000-22999';
        case (stitchQuantity >= 23000):
            return '23+';
        default:
            console.log(`Quantity Not Found`);
    }
}

export function getEmbroideryPrintCost(embroideryShirtQuantityBucket, stitchQuantityBucket, embroideryDbPrices) {
    return parseFloat(embroideryDbPrices.find(obj =>
        obj.quantity == embroideryShirtQuantityBucket && obj.stitches === stitchQuantityBucket
    ).price)
}