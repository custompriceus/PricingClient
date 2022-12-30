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

export function formatNumber(number) {
    const newNumber = number ? number : 0;
    return (Math.round(newNumber * 100) / 100).toFixed(2)
}

function validateInput(inputType, input) {
    switch (inputType) {
        case ('integer'):
            return ((input % 1 === 0) && input !== '0') ? true : false
        case ('float'):
            return (!isNaN(input) && input !== '0') ? true : false
        default:
            console.log(`Key Not Found`);
            return false;
    }
}

function checkInput(key, input) {
    switch (key) {
        case ('quantity'):
            return input !== '' && validateInput('integer', input)
        case ('printSideOneColors'):
            return validateInput('integer', input)
        case ('printSideTwoColors'):
            return validateInput('integer', input)
        case ('jerseyNumberSides'):
            return validateInput('integer', input)
        case ('shirtCost'):
            return input !== '' && validateInput('float', input)
        case ('markUp'):
            return input !== '' && validateInput('float', input)
        default:
            console.log(`Key Not Found`);
            return true;
    }
}

function checkMandatoryInput(key) {
    switch (key) {
        case ('quantity'):
            return true
        case ('shirtCost'):
            return true
        case ('markUp'):
            return true
        default:
            return false;
    }
}

function getErrorDisplayMessage(key) {
    switch (key) {
        case ('quantity'):
            return `Quantity `
        case ('shirtCost'):
            return `Shirt Cost `
        case ('markUp'):
            return `Mark Up `
        case ('printSideOneColors'):
            return `Print Side One Colors `
        case ('printSideTwoColors'):
            return `Print Side Two Colors `
        case ('jerseyNumberSides'):
            return `Jersey Number Sides `
        default:
            return false;
    }
}

export function validateInputs(inputs) {
    const inputErrors = [];
    Object.keys(inputs).forEach(function (key, index) {
        if (inputs[key] === '') {
            if (checkMandatoryInput(key)) {
                inputErrors.push({
                    key: key,
                    value: 'blank',
                    message: `${getErrorDisplayMessage(key)} cannot be blank`
                })
            }
        }
        else {
            const validInput = checkInput(key, inputs[key])
            if (!validInput) {
                inputErrors.push({
                    key: key,
                    value: inputs[key],
                    message: `${getErrorDisplayMessage(key)}'${inputs[key]}' is invalid`
                })
            }
        }
    });
    return inputErrors;
}