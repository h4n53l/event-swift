const { CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider");
const { createHmac } = require('crypto');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

const calculateSecretHash = (username) => {
  const message = username + process.env.COGNITO_CLIENT_ID;
  const hmac = createHmac('sha256', process.env.COGNITO_CLIENT_SECRET);
  return hmac.update(message).digest('base64');
};

module.exports = { cognitoClient, calculateSecretHash };
