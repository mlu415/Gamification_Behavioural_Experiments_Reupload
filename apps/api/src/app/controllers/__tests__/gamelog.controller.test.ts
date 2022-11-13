import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Experimenter from '../../schema/schema.experimenter';
import Game from '../../schema/schema.game';
import GameLog from '../../schema/schema.gameLog';
import supertest from 'supertest';
import express from 'express';
import router from '../../routes/index';
import {
  generateTestAuthToken,
  decodeTestAuthToken,
} from '../../../utils/testHelpers';
import { AuthenticationRequest } from 'libs/api-interfaces/src/lib/AuthenticationRequest';

let database;

const app = express();
app.use(express.json());
app.use('/api', router);
const server = app.listen(3001, () => null);
const request = supertest(app);

const user1Data = {
  username: 'valid username',
  email: 'email@gmail.com',
};

const experimentor = {
  email: 'email@gmail.com',
  auth: '12345678',
};

const experimentor2 = {
  email: 'email2@gmail.com',
  auth: '22345678',
};

const level = {
  fps: 9,
  duration: 10,
  spawnRate: 5.5,
  itemAChance: 0.7,
  itemBChance: 0.9,
  itemAMultiplier: 3,
  itemBMultiplier: 2,
  regionMultiplierX: 50,
  regionMultiplierY: 50,
};

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

describe('Get gamelog', () => {
  it('Successfuly retrieve game log', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenter = new Experimenter(experimentor);
    newExperimenter.auth = await decodeTestAuthToken(token);
    await newExperimenter.save();

    const newGame = new Game({
      gameName: 'name here',
      createdBy: newExperimenter._id,
      link: 'randomLink.com',
      description: 'words here',
      completed: true,
      survey_start: 'surveyLink.com',
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [level],
      gifs: [],
    });

    await newGame.save();

    const newGameLog = new GameLog({
      username: user1Data.username,
      game: newGame._id,
      log: [
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move down',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ],
    });
    await newGameLog.save();

    const response = await request
      .get(`/api/game/${newGame._id}/logs`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: user1Data.username,
      });

    expect(response.status).toBe(200);
    expect(String(response.body)).toBe(
      String([
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move down',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ])
    );
  });

  it('Non-creator accessing logs will fail', async () => {
    const tokenA = '12345';
    const tokenB = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenterA = new Experimenter(experimentor);
    newExperimenterA.auth = tokenA;
    await newExperimenterA.save();

    const newExperimenterB = new Experimenter(experimentor2);
    newExperimenterB.auth = await decodeTestAuthToken(tokenB);
    await newExperimenterB.save();

    const newGame = new Game({
      gameName: 'name here',
      createdBy: newExperimenterA._id,
      link: 'randomLink.com',
      description: 'words here',
      completed: true,
      survey_start: 'surveyLink.com',
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [level],
      gifs: [],
    });
    await newGame.save();

    const newGameLog = new GameLog({
      username: user1Data.username,
      game: newGame._id,
      log: [
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move down',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ],
    });
    await newGameLog.save();

    const response = await request
      .get(`/api/game/${newGame._id}/logs`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        username: user1Data.username,
      });

    expect(response.status).toBe(404);
  });

  it('No game log found', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenter = new Experimenter(experimentor);
    newExperimenter.auth = await decodeTestAuthToken(token);
    await newExperimenter.save();

    const response = await request
      .get(`/api/game/000000000000000000000001/logs`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: user1Data.username,
      });
    expect(response.status).toBe(404);
  });
});

describe('Get all gamelogs', () => {
  it('Successfuly retrieve game logs', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenter = new Experimenter(experimentor);
    newExperimenter.auth = await decodeTestAuthToken(token);
    await newExperimenter.save();

    const newGame = new Game({
      gameName: 'name here',
      createdBy: newExperimenter._id,
      link: 'randomLink234.com',
      description: 'words here',
      completed: true,
      survey_start: 'surveyLink.com',
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [level],
      gifs: [],
    });

    await newGame.save();

    const newGameLog = new GameLog({
      username: 'fred',
      game: newGame._id,
      log: [
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move down',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ],
    });
    await newGameLog.save();

    const newGameLog2 = new GameLog({
      username: 'dave',
      game: newGame._id,
      log: [
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move up',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ],
    });
    await newGameLog2.save();

    const response = await request
      .get(`/api/game/${newGame._id}/logsByGame`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('Non-creator accessing logs will fail', async () => {
    const tokenA = '12345';
    const tokenB = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenterA = new Experimenter(experimentor);
    newExperimenterA.auth = tokenA;
    await newExperimenterA.save();

    const newExperimenterB = new Experimenter(experimentor2);
    newExperimenterB.auth = await decodeTestAuthToken(tokenB);
    await newExperimenterB.save();

    const newGame = new Game({
      gameName: 'name here',
      createdBy: newExperimenterA._id,
      link: 'randomLink.com',
      description: 'words here',
      completed: true,
      survey_start: 'surveyLink.com',
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [level],
      gifs: [],
    });
    await newGame.save();

    const newGameLog = new GameLog({
      username: user1Data.username,
      game: newGame._id,
      log: [
        {
          action: 'snake move right',
          time: '08/17/2022 12:02:06 am',
          level: 1,
        },
        {
          action: 'snake move down',
          time: '08/17/2022 12:02:07 am',
          level: 1,
        },
      ],
    });
    await newGameLog.save();

    const response = await request
      .get(`/api/game/${newGame._id}/logsByGame`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(response.status).toBe(404);
  });

  it('No game logs found', async () => {
    const token = await generateTestAuthToken(
      'test12@gmail.com',
      'E4KTCXhT#Vm$jxL*suxu'
    );

    const newExperimenter = new Experimenter(experimentor);
    newExperimenter.auth = await decodeTestAuthToken(token);
    await newExperimenter.save();

    const response = await request
      .get(`/api/game/000000000000000000000001/logsByGame`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});
