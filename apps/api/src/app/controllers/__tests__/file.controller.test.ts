import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import express from 'express';
import router from '../../routes/index';
import { generateTestAuthToken } from '../../../utils/testHelpers';
import { createReadStream } from 'fs';
import { createModel } from 'mongoose-gridfs';
import path from 'path';

let database;

const app = express();
app.use(express.json());
app.use('/api', router);
const server = app.listen(3002, () => null);
const request = supertest(app);

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await database.stop();

    done();
  });
});

describe('Get files', () => {
  it('Successfully retrieve file', async () => {
    const images = createModel();
    let id;

    images.write(
      {
        filename: 'test.png',
        contentType: 'image/png',
      },
      createReadStream(path.join(__dirname, './', 'test.png')),
      (error, file) => (id = file._id)
    );

    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const response = await request
      .get(`/api/files/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('No file found', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const response = await request
      .get(`/api/files/000000000000000000000001`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(404);
  });

  it('Bad ID', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const response = await request
      .get(`/api/files/123`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(400);
  });
});
