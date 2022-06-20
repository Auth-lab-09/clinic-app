'use strict';

process.env.SECRET = 'HeyThereAye';

const { db } = require('../src/models/index.model');
const supertest = require('supertest');
const { app } = require('../src/server');

const mockRequest = supertest(app);

let userData = {
  testUser: {
    username: 'test',
    password: 'test',
    role: 'head',
  },
};

let accessToken = null;

beforeAll(async () => {
  await db.sync();
});

describe('Auth Router', () => {
  it('should create a user', async () => {
    const response = await mockRequest.post('/signup').send({
      username: userData.testUser.username,
      password: userData.testUser.password,
      role: userData.testUser.role,
    });
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userData.testUser.username);
    expect(response.body.role).toBe(userData.testUser.role);
  });

  it('can signin with basic auth credentials', async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest.post('/signin').auth(username, password);
    expect(response.status).toBe(200);
  });

  it('can signin with bearer token', async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest.post('/signin').auth(username, password);
    expect(response.status).toBe(200);
    accessToken = response.body.token;
    const bearerResponse = await mockRequest.get('/secret').set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(200);
  });

  it('basic fails with known user and wrong password ', async () => {

    const response = await mockRequest.post('/signin')
      .auth('admin', 'xyz')
    const { user, token } = response.body;

    expect(response.status).toBe(500);
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('basic fails with unknown user', async () => {

    const response = await mockRequest.post('/signin')
      .auth('nobody', 'xyz')
    const { user, token } = response.body;

    expect(response.status).toBe(500);
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('Secret Route fails with invalid token', async () => {
    const response = await mockRequest.get('/secret')
      .set('Authorization', `bearer accessgranted`);
    expect(response.status).toBe(500);
  });

  it('Should respond with 404 status on an invalid route', async () => {
    const response = await mockRequest.get('/foo').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
  });

  it('Should respond with 404 status on an invalid method', async () => {
    const response = await mockRequest.patch('/api/patient').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
  });

  it('can add a patient', async () => {
    const response = await mockRequest.post('/api/patient').set('Authorization', `Bearer ${accessToken}`).send({
      firstName: 'bahaa',
      lastName: 'nimer',
      diagnose: 'something',
      cured: false
    });
    expect(response.status).toBe(201);
  });

  it('can get all patients', async () => {
    const response = await mockRequest.get('/api/patient').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });

  it('can get a patient by id', async () => {
    const response = await mockRequest.get('/api/patient/1').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });

  it('can update a patient by id', async () => {
    const response = await mockRequest.put('/api/patient/1').set('Authorization', `Bearer ${accessToken}`).send({
      firstName: 'bahaa2',
    });
    expect(response.status).toBe(201);
  });

  it('can delete a patient by id', async () => {
    const response = await mockRequest.delete('/api/patient/1').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(204);
  });

  it('can add a doctor', async () => {
    const response = await mockRequest.post('/doctor').set('Authorization', `Bearer ${accessToken}`).send({
      username: 'bahaa',
      password: '123',
      role: 'head'
    });
    expect(response.status).toBe(201);
  });

  it('can get all doctors', async () => {
    const response = await mockRequest.get('/doctor').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });

  it('can get a doctor by id', async () => {
    const response = await mockRequest.get('/doctor/1').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });

  it('can update a doctor by id', async () => {
    const response = await mockRequest.put('/doctor/1').set('Authorization', `Bearer ${accessToken}`).send({
      username: 'bahaa2',
      password: '123',
      role: 'head'
    });
    expect(response.status).toBe(201);
  });

  // it('can delete a doctor by id', async () => {
  //   const response = await mockRequest.delete('/doctor/1').set('Authorization', `Bearer ${accessToken}`);
  //   console.log(response.body);
  //   expect(response.status).toBe(204);
  // });
});


afterAll(async () => {
  await db.drop();
});