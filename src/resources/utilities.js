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

function getInputFieldDetails(inputField) {
    switch (inputField) {
        case ('quantity'):
            return {
                required: true,
                errorDisplayMessage: 'Quantity ',
                inputValueType: 'integer'
            }
        case ('printSideOneColors'):
            return {
                required: false,
                errorDisplayMessage: 'Print Side One Colors ',
                inputValueType: 'integer'
            }
        case ('printSideTwoColors'):
            return {
                required: false,
                errorDisplayMessage: 'Print Side Two Colors ',
                inputValueType: 'integer'
            }
        case ('jerseyNumberSides'):
            return {
                required: false,
                errorDisplayMessage: 'Jersey Number Sides ',
                inputValueType: 'integer'
            }
        case ('shirtCost'):
            return {
                required: true,
                errorDisplayMessage: 'Shirt Cost ',
                inputValueType: 'float'
            }
        case ('markUp'):
            return {
                required: true,
                errorDisplayMessage: 'Mark Up ',
                inputValueType: 'float'
            }
        default:
            console.log(`Key Not Found`);
            return true;
    }
}

function validateInput(inputType, input) {
    switch (inputType) {
        case ('integer'):
            return ((input % 1 === 0) && input !== '0') ? true : false
        case ('float'):
            return (!isNaN(input) && input !== '0') ? true : false
        default:
            console.log(`Input Type Not Found`);
            return false;
    }
}

export function validateInputs(inputs) {
    const inputErrors = [];
    Object.keys(inputs).forEach(function (key, index) {
        const inputFieldDetails = getInputFieldDetails(key);

        if (inputs[key] === '' || inputs[key] === '0') {
            if (inputFieldDetails.required) {
                inputErrors.push({
                    key: key,
                    value: 'blank',
                    message: `${inputFieldDetails.errorDisplayMessage} cannot be blank`
                })
            }
        }
        else {
            const validInput = validateInput(inputFieldDetails.inputValueType, inputs[key])
            if (!validInput) {
                inputErrors.push({
                    key: key,
                    value: inputs[key],
                    message: `${inputFieldDetails.errorDisplayMessage}'${inputs[key]}' is invalid`
                })
            }
        }
    });
    return inputErrors;
}