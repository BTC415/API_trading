const MetaApi = require('metaapi.cloud-sdk');

// Initialize MetaApi client
const metaApi = new MetaApi();

// Retrieve account access token
const getAccountAccessToken = async (accountId) => {
    try {
        const accountAccessToken = await metaApi.tokenManagementApi.narrowDownToken({
            applications: ['trading-account-management-api'], // Specify the required application
            roles: ['reader'], // Define the role for the token
            resources: [{ entity: 'account', id: accountId }], // Provide the accountId for which you want to retrieve the token
            validityInHours: 24 // Set the validity period for the token
        });
        console.log('Account Access Token:', accountAccessToken);
    } catch (error) {
        console.error('Failed to retrieve account access token:', error);
    }
};

module.exports = {
    getAccountAccessToken
}