import { createUser, getUser, modifyUser } from '../user.controller';
import Experimenter from '../../schema/schema.experimenter';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express, { NextFunction } from 'express';
import { AuthenticationRequest } from 'libs/api-interfaces/src/lib/AuthenticationRequest';
import router from '../../routes';
import supertest from 'supertest';
import { decodeTestAuthToken, generateTestAuthToken } from 'apps/api/src/utils/testHelpers';

let database;
let request;
let server;
let token, token2, token3;



const user1Data = {
  email: 'email@gmail.com',
  auth: '12345678',
};

const user2Data = {
  email: 'email2@gmail.com',
  auth: '123456789',
};

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await mongoose.connect(uri);

  token = await generateTestAuthToken(
    'test12@gmail.com',
    'E4KTCXhT#Vm$jxL*suxu'
  );

  token2 = await generateTestAuthToken(
    'testUser@gmail.com',
    'testUser'
  );

  token3 = await generateTestAuthToken(
    'testUser2@gmail.com',
    'testUser2'
  )

  const app = express();
  app.use(express.json());
  app.use('/api', router);
  server = app.listen(3000, () => null);
  request = supertest(app);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  const newExperimenter = new Experimenter({
    email: 'test12@gmail.com',
  });
  newExperimenter.auth = await decodeTestAuthToken(token);
  await newExperimenter.save();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await database.stop();
    done();
  });
});

describe('User controller', () => {
  it('create a new experimenter', async () => {
    const mockRequest = {
      user: user1Data.auth,
      body: {
        email: user1Data.email,
      },
    } as AuthenticationRequest;

    const mockResponse: any = {
      json: await jest.fn(),
      status: await jest.fn(),
    };

    const mockNext: NextFunction = jest.fn();

    await createUser(mockRequest, mockResponse, mockNext);
    const fromDb = await Experimenter.findOne({ email: user1Data.email });
    expect(fromDb).toBeTruthy();
    expect(fromDb.email).toBe(user1Data.email);
    expect(fromDb.auth).toBe(user1Data.auth);
  });

  it('duplicated email', async () => {
    const mockRequest1 = {
      user: user1Data.auth,
      body: {
        email: user1Data.email,
      },
    } as AuthenticationRequest;

    const mockRequest2 = {
      body: {
        email: user1Data.email,
        auth: user2Data.auth,
      },
    } as AuthenticationRequest;

    const mockResponse: any = {
      json: jest.fn(),
      status: jest.fn(),
    };

    const mockNext: NextFunction = jest.fn();
    await createUser(mockRequest1, mockResponse, mockNext);
    await createUser(mockRequest2, mockResponse, mockNext);

    const fromDb = await Experimenter.findOne({ email: user1Data.email });
    expect(fromDb).toBeTruthy();
    expect(fromDb.email).toBe(user1Data.email);
    expect(fromDb.auth).toBe(user1Data.auth);

    const fromDb2 = await Experimenter.findOne({ email: user2Data.email });
    expect(fromDb2).toBeFalsy();
  });
});

describe('Get user controller', () => {
  it('get an experimenter', async () => {
    const response = await request
      .get(`/api/users`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('invalid token', async () => {
    const response = await request
      .get(`/api/users`)
      .set('Authorization', `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });
});


describe('User modify controller', () => {
  it('modify a experimenter', async () => {
    const newExperimenter = new Experimenter({
      email: user1Data.email,
      auth: user1Data.auth,
    });
    await newExperimenter.save();

    const mockRequest = {
      user: user1Data.auth,
      body: {
        email: 'new_email@test.com',
      },
    } as AuthenticationRequest;

    const mockResponse: any = {
      json: await jest.fn(),
      status: await jest.fn(),
    };

    const mockNext: NextFunction = jest.fn();
    await modifyUser(mockRequest, mockResponse, mockNext);
    const fromDb = await Experimenter.findOne({ _id: newExperimenter._id });
    expect(fromDb).toBeTruthy();
    expect(fromDb.email).toBe('new_email@test.com');
    expect(fromDb.auth).toBe(user1Data.auth);
  });

  it('wrong token', async () => {
    const newExperimenter = new Experimenter({
      email: user1Data.email,
      auth: user1Data.auth,
    });
    await newExperimenter.save();

    const mockRequest = {
      user: user2Data.auth,
      body: {
        email: 'new_email@test.com',
      },
    } as AuthenticationRequest;

    const mockResponse: any = {
      json: await jest.fn(),
      status: await jest.fn(),
    };

    const mockNext: NextFunction = jest.fn();
    await modifyUser(mockRequest, mockResponse, mockNext);

    const fromDb = await Experimenter.findOne({ _id: newExperimenter._id });
    expect(fromDb).toBeTruthy();
    expect(fromDb.email).toBe(user1Data.email);
    expect(fromDb.auth).toBe(user1Data.auth);
  });
});
