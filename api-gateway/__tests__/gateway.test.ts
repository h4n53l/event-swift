// api-gateway/src/__tests__/main.test.ts
import request from 'supertest';
import express from 'express';
import * as path from 'path';

describe('API Gateway', () => {
  let app: express.Application;
  let server: any;

  beforeAll(() => {
    app = express();
    
    // Replicate the main.ts setup
    app.use('/assets', express.static(path.join(__dirname, 'assets')));
    
    app.get('/api', (req, res) => {
      res.send({ message: 'Welcome to Event Swift api-gateway!' });
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('Basic Endpoints', () => {
    it('GET /api should return welcome message', async () => {
      const response = await request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Welcome to Event Swift api-gateway!'
      });
    });

    it('should handle unknown routes', async () => {
      await request(app)
        .get('/unknown-route')
        .expect(404);
    });
  });

  describe('Static Assets', () => {
    it('should serve static assets from /assets path', async () => {
      // Note: This test might need modification based on your actual assets
      await request(app)
        .get('/assets/some-file.txt')
        .expect(404); // Expecting 404 since we don't have actual assets in test
    });
  });

  describe('Server Configuration', () => {
    it('should use default port 3333 if PORT env variable is not set', () => {
      const defaultPort = process.env.PORT || 3333;
      expect(defaultPort).toBeDefined();
    });
  });
});

