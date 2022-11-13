import Game from '../schema.game';
import Experimenter from '../schema.experimenter';
import Attempt from '../schema.attempt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let database;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await database.stop();
});

it('create new attempt', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    gameName: 'name here',
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
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
  });
  await newGame.save();

  const newAttempt = new Attempt({
    email: 'test@gmail.com',
    score: 100,
    game: newGame._id,
  });
  await newAttempt.save();

  const fromDb = await Attempt.findOne({ _id: newAttempt._id });
  expect(fromDb).toBeTruthy();
  expect(fromDb.email).toBe('test@gmail.com');
  expect(fromDb.score).toBe(100);
  expect(fromDb.game).toStrictEqual(newGame._id);
});

it('fails when creating attempt without email', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    gameName: 'name here',
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
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
  });
  await newGame.save();

  const newAttempt = new Attempt({
    email: null,
    score: 100,
    game: newGame._id,
  });

  return expect(newAttempt.save()).rejects.toThrow();
});

it('fails when creating attempt without score', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    gameName: 'name here',
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
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
  });
  await newGame.save();

  const newAttempt = new Attempt({
    email: 'test@gmail.com',
    score: null,
    game: newGame._id,
  });

  return expect(newAttempt.save()).rejects.toThrow();
});

it('fails when creating attempt with invalid game', async () => {
  const newAttempt = new Attempt({
    email: 'test@gmail.com',
    score: 100,
    game: 'invalid_id',
  });

  return expect(newAttempt.save()).rejects.toThrow();
});
