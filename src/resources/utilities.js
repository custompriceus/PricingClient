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
            console.log(`Input Type Not Found`);
            return false;
    }
}

function getErrorDisplayMessage(key, value, message) {
    return (
        {
            key: key,
            value: 'blank',
            errorDisplayMessage: message
        }
    )
}
export function validateInputs(inputs, shirtPricingForm, defaultShirtPricingForm, minShirtQuantityForAdditionalItems, additionalItems) {
    const inputErrors = [];

    Object.keys(inputs).forEach(function (key, index) {
        const inputDetails = shirtPricingForm.find(form => form.register === key);
        const defaultInputDetails = defaultShirtPricingForm.find(form => form.register === key);
        if (inputs[key] === '' || inputs[key] === '0') {
            if (inputDetails.required) {
                inputErrors.push(getErrorDisplayMessage(key, 'blank', `${defaultInputDetails.errorDisplayMessage} cannot be blank`)
                )
            }
        }
        else {
            const validInput = validateInput(inputDetails.inputValueType, inputs[key])
            if (!validInput) {
                inputErrors.push(getErrorDisplayMessage(key, inputs[key], `${defaultInputDetails.errorDisplayMessage}'${inputs[key]}' is invalid`))
            }
            else {
                if (inputDetails.minValue && inputDetails.minValue > parseFloat(inputs[key])) {
                    inputErrors.push(getErrorDisplayMessage(key, inputs[key], `${defaultInputDetails.errorDisplayMessage} needs to be greater than ${inputDetails.minValue - 1}`))
                }
                else if (inputDetails.maxValue && inputDetails.maxValue < parseFloat(inputs[key])) {
                    inputErrors.push(getErrorDisplayMessage(key, inputs[key], `${defaultInputDetails.errorDisplayMessage} needs to be less than ${inputDetails.maxValue + 1}`))
                }
                if (key === 'quantity' && additionalItems) {
                    const additionalItemsLength = additionalItems.filter(function (item) {
                        return item.checked;
                    }).length
                    const quantity = parseFloat(inputs[key]);
                    if (additionalItemsLength > 0 && quantity < minShirtQuantityForAdditionalItems) {
                        inputErrors.push(getErrorDisplayMessage(key, inputs[key], `Additional Items Require A Min Shirt Order of ${minShirtQuantityForAdditionalItems}`))
                    }
                }
            }
        }
    });
    return inputErrors;
}