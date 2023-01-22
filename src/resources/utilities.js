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

export function validateInput(inputType, inputValue, inputName, required) {
    if ((inputValue === '' || inputValue === 0 || !inputValue)) {
        if (required === 'true') {
            return {
                error: true,
                message: `${inputName} cannot be blank`
            }
        }
        else {
            return {
                error: false
            }
        }
    }
    switch (inputType) {
        case ('integer'):
            return ((inputValue % 1 === 0) && parseInt(inputValue) >= 0) ?
                {
                    error: false
                } :
                {
                    error: true,
                    message: `Invalid value '${inputValue}' for ${inputName}`
                }
        case ('float'):
            return (inputValue - 0) == inputValue && ('' + inputValue).trim().length > 0 ?
                {
                    error: false
                } :
                {
                    error: true,
                    message: `Invalid value '${inputValue}' for ${inputName}`
                }
        default:
            console.log(`Input Type Not Found`);
            return {
                error: true,
                message: `Input Type Not Found`
            }
    }
}