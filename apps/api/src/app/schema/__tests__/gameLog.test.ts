import Game from '../schema.game';
import Experimenter from '../schema.experimenter';
import GameLog from '../schema.gameLog';
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

it('create new game log', async () => {
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
        fps: 8,
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

  const newGameLog = new GameLog({
    username: 'attempt no1',
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

  const fromDb = await GameLog.findOne({ _id: newGameLog._id });
  expect(fromDb).toBeTruthy();
  expect(fromDb.game).toStrictEqual(newGame._id);
  expect(fromDb.log[0].action).toBe('snake move right');
  expect(fromDb.username).toBe('attempt no1');
});

it('fails when creating game log without log', async () => {
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
        fps: 8,
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

  const newGameLog = new GameLog({
    game: newGame._id,
    log: null,
  });

  return expect(newGameLog.save()).rejects.toThrow();
});

it('fails when creating game log without username', async () => {
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

  const newGameLog = new GameLog({
    username: null,
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

  return expect(newGameLog.save()).rejects.toThrow();
});

it('fails when creating game log with invalid game', async () => {
  const newGameLog = new GameLog({
    username: 'attmpt no2',
    game: 'invalid_id',
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

  return expect(newGameLog.save()).rejects.toThrow();
});
