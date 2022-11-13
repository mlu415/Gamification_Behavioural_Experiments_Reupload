import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Experimenter from '../../schema/schema.experimenter';
import Game from '../../schema/schema.game';
import Score from '../../schema/schema.score';
import supertest from 'supertest';
import express from 'express';
import router from '../../routes/index';
import {
  generateTestAuthToken,
  decodeTestAuthToken,
} from '../../../utils/testHelpers';

let database;
let request;
let server;
let newExperimenter;
let _id;
let token, token2, token3;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await mongoose.connect(uri);
  token = await generateTestAuthToken(
    'test12@gmail.com',
    'E4KTCXhT#Vm$jxL*suxu'
  );

  token2 = await generateTestAuthToken('testUser@gmail.com', 'testUser');

  token3 = await generateTestAuthToken('testUser2@gmail.com', 'testUser2');

  const app = express();
  app.use(express.json());
  app.use('/api', router);
  server = app.listen(3001, () => null);
  request = supertest(app);

  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'test12@gmail.com',
  });
  newExperimenter.auth = await decodeTestAuthToken(token);
  await newExperimenter.save();
  _id = newExperimenter._id;

  const experimenter2 = new Experimenter({
    username: 'testUser',
    email: 'testUser@gmail.com',
  });
  experimenter2.auth = await decodeTestAuthToken(token2);
  await experimenter2.save();

  const score1 = new Score({
    value: 10,
    username: 'Player 1',
  });
  await score1.save();

  const score2 = new Score({
    value: 10,
    username: 'Player 1',
  });
  await score2.save();

  const newGame = new Game({
    _id: '000000000000000000000001',
    createdBy: newExperimenter._id,
    gameName: 'name here',
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_end: 'surveyLink.com',
    score: [score1._id, score2._id],
    levels: [
      {
        fps: 9,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: 0.9,
        itemAMultiplier: 3,
        itemBMultiplier: 2,
        regionMultiplierX: 50,
        regionMultiplierY: 50,
      },
    ],
  });

  await newGame.save();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await database.stop();

    done();
  });
});

it('create a new game', async () => {

  await request
    .post('/api/game')
    .set('Authorization', `Bearer ${token}`)
    .send({
      _id: '000000000000000000000002',
      gameName: 'name here again',
      createdBy: _id,
      link: 'randomLink2.com',
      description: 'words here again',
      completed: true,
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [
        {
          fps: 9,
          duration: 100,
          spawnRate: 5.5,
          itemAChance: 0.7,
          itemBChance: 0.9,
          itemAMultiplier: 3,
          itemBMultiplier: 2,
          regionMultiplierX: 50,
          regionMultiplierY: 50,
        },
      ],
      gifs: [],
    })
    .expect(201);

  const fromDb = await Game.findOne({ _id: '000000000000000000000002' });
  expect(fromDb).toBeTruthy();
  expect(fromDb.createdBy).toStrictEqual(_id);
  expect(fromDb.description).toBe('words here again');
  expect(fromDb.levels[0].duration).toBe(100);
});
it('should fail when creating game that with already existing link', async () => {

  await request
    .post('/api/game')
    .set('Authorization', `Bearer ${token}`)
    .send({
      createdBy: _id,
      name: 'name here',
      link: 'randomLink.com',
      description: 'should not exist',
      completed: true,
      survey_end: 'surveyLink.com',
      items_a: [],
      items_b: [],
      levels: [
        {
          fps: 9,
          duration: 10,
          spawnRate: 5.5,
          itemAChance: 0.7,
          itemBChance: 0.9,
          itemAMultiplier: 3,
          itemBMultiplier: 2,
          regionMultiplierX: 50,
          regionMultiplierY: 50,
        },
      ],
      gifs: [],
    })
    .expect(409);

  const fromDb = await Game.findOne({ description: 'should not exist' });
  expect(fromDb).toBeFalsy();
});
it('gets game data for existing games', async () => {
  const response = await request.get('/api/game/000000000000000000000001');
  expect(response.status).toBe(200);
});

it('should fail to get non existent games', async () => {
  const response = await request.get('/api/game/000000000000000000000009');
  expect(response.status).toBe(404);
});

it('gets score data for an existing game', async () => {
  const { body: retrievedScores } = await request
    .get('/api/game/score/000000000000000000000001')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(retrievedScores).toHaveLength(2);
});

it('should get the games list for an authenticated user.', async () => {
  const response = await request
    .get('/api/games')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body).toHaveLength(2);
});

it('should return 404 error if the game list is empty.', async () => {
  await request
    .get('/api/games')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token2}`)
    .expect(404);
});

it('should return 401 error for an unauthenticated user when getting game list.', async () => {
  await request
    .get('/api/games')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token3}`)
    .expect(401);
});

it('modfiy a game', async () => {
  await request
    .patch('/api/game/000000000000000000000001')
    .set('Authorization', `Bearer ${token}`)
    .send({
      gameName: 'new name here now',
      link: 'randomLink.com',
      description: 'words here are changed',
      completed: true,
      survey_end: 'surveyLink.com',
      score: [],
      items_a: [],
      items_b: [],
      levels: [
        {
          fps: 9,
          duration: 10,
          spawnRate: 5.5,
          itemAChance: 0.7,
          itemBChance: 0.9,
          itemAMultiplier: 3,
          itemBMultiplier: 2,
          regionMultiplierX: 50,
          regionMultiplierY: 50,
        },
      ],
      gifs: [],
    })
    .expect(200);

  const fromDb = await Game.findOne({ _id: '000000000000000000000001' });
  expect(fromDb).toBeTruthy();
  expect(fromDb.gameName).toBe('new name here now');
  expect(fromDb.link).toBe('randomLink.com');
  expect(fromDb.description).toBe('words here are changed');
});

it('fails when modfiying a game with invalid auth', async () => {
  await request
    .patch('/api/game/000000000000000000000001')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      gameName: 'new name shouldnt change',
      link: 'randomLink3.com',
      description: 'words here again',
      completed: true,
      survey_end: 'surveyLink.com',
      score: [],
      items_a: [],
      items_b: [],
      levels: [
        {
          fps: 9,
          duration: -5,
          spawnRate: 5.5,
          itemAChance: 0.7,
          itemBChance: 0.9,
          itemAMultiplier: 3,
          itemBMultiplier: 2,
          regionMultiplierX: 50,
          regionMultiplierY: 50,
        },
      ],
      gifs: [],
    })
    .expect(401);

  const fromDb = await Game.findOne({ _id: '000000000000000000000001' });
  expect(fromDb).toBeTruthy();
  expect(fromDb.gameName).toBe('new name here now');
  expect(fromDb.link).toBe('randomLink.com');
});

it('delete game', async () => {
  const response = await request
    .delete('/api/game/000000000000000000000001')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(200);

  const check = await Game.findOne({ _id: '000000000000000000000001' });
  expect(check).toBeFalsy();
});

it('delete game with invalid auth', async () => {
  const response = await request
    .delete('/api/game/000000000000000000000002')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token3}`);
  expect(response.status).toBe(401);
});

it('fails if user tries to delete invalid game', async () => {
  const response = await request
    .delete('/api/game/000000000000000000000009')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(404);
});
