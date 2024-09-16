const request = require('supertest');
const express = require('express');
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');

jest.mock('../cognitoConfig', () => ({
    cognitoClient: {
      send: jest.fn(),
    },
    calculateSecretHash: jest.fn(() => 'mockedSecretHash'),
  }));
  
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

  

describe('User Management Service', () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore('CognitoIdentityServiceProvider');
  });

  test('User registration should succeed with valid input', async () => {
    AWSMock.mock('CognitoIdentityServiceProvider', 'signUp', (params, callback) => {
      callback(null, { UserSub: '123456' });
    });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'Event Planner'
      });

    expect(response.statusCode).toBe(201);
    if (response.statusCode !== 201) {
        console.log('Registration Error:', response.body);
      }
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  test('User login should return a token with valid credentials', async () => {
    AWSMock.mock('CognitoIdentityServiceProvider', 'initiateAuth', (params, callback) => {
      callback(null, { AuthenticationResult: { IdToken: 'mock-token' } });
    });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: 'mock-token' });
  });

  // Add more tests for error cases and other endpoints
});
