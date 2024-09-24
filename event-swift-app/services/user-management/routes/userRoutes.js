const express = require('express');
const router = express.Router();
const {
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  ConfirmSignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { cognitoClient, calculateSecretHash } = require('../cognitoConfig');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "profile", Value: profile },
      ],
      SecretHash: calculateSecretHash(email),
    };

    const command = new SignUpCommand(params);
    await cognitoClient.send(command);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

// Login 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: calculateSecretHash(email),
      },
    };

    const command = new InitiateAuthCommand(params);
    const result = await cognitoClient.send(command);

    const token = result.AuthenticationResult.IdToken;
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
});

// Confirm user registration
router.post('/confirm', async (req, res) => {
  try {
    const { email, confirmationCode } = req.body;
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: calculateSecretHash(email),
    };

    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);

    res.status(200).json({ message: 'User confirmed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Confirmation failed', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const params = {
      AccessToken: token,
    };

    const command = new GetUserCommand(params);
    const result = await cognitoClient.send(command);

    const userAttributes = result.UserAttributes.reduce((acc, attr) => {
      acc[attr.Name] = attr.Value;
      return acc;
    }, {});

    res.json({
      email: userAttributes.email,
      profile: userAttributes.profile,
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
});

module.exports = router;
