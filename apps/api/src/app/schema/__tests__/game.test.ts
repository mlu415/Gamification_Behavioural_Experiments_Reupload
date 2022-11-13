import Game from '../schema.game';
import Experimenter from '../schema.experimenter';
import Score from '../schema.score';
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

it('create new game', async () => {
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
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 5,
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

  const fromDb = await Game.findOne({ _id: newGame._id });
  expect(fromDb).toBeTruthy();
  expect(fromDb.createdBy).toStrictEqual(newExperimenter._id);
  expect(fromDb.gameName).toBe('name here');
  expect(fromDb.link).toBe('randomLink.com');
  expect(fromDb.description).toBe('words here');
  expect(fromDb.completed).toBe(true);
  expect(fromDb.survey_end).toBe('surveyLink.com');
  expect(fromDb.items_a).toStrictEqual([]);
  expect(fromDb.items_b).toStrictEqual([]);
  expect(fromDb.levels.length).toBe(1);
  expect(fromDb.levels[0].fps).toBe(5);
  expect(fromDb.levels[0].duration).toBe(10);
  expect(fromDb.levels[0].spawnRate).toBe(5.5);
  expect(fromDb.levels[0].itemAChance).toBe(0.7);
  expect(fromDb.levels[0].itemBChance).toBe(0.9);
  expect(fromDb.levels[0].itemAMultiplier).toBe(3);
  expect(fromDb.levels[0].itemBMultiplier).toBe(2);
  expect(fromDb.levels[0].regionMultiplierX).toBe(50);
  expect(fromDb.levels[0].regionMultiplierY).toBe(50);
  expect(fromDb.gifs).toStrictEqual([]);
});

it('fails when creating game with invalid owner', async () => {

  const newGame = new Game({
    createdBy: 'invalid_id',
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 7,
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
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with no levels', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level without duration', async () => {
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
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
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
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid spawn rate', async () => {
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
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: -1,
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
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid item a chance', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 1.2,
        itemBChance: 0.9,
        itemAMultiplier: 3,
        itemBMultiplier: 2,
        regionMultiplierX: 50,
        regionMultiplierY: 50,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid item b chance', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: -0.5,
        itemAMultiplier: 3,
        itemBMultiplier: 2,
        regionMultiplierX: 50,
        regionMultiplierY: 50,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid item a multiplier', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: 0.9,
        itemAMultiplier: -1,
        itemBMultiplier: 2,
        regionMultiplierX: 50,
        regionMultiplierY: 50,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid item b multiplier', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: 0.9,
        itemAMultiplier: 3,
        itemBMultiplier: -0.1,
        regionMultiplierX: 50,
        regionMultiplierY: 50,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating game with level with invalid region multiplier x', async () => {
  const newExperimenter = new Experimenter({
    username: 'valid username',
    email: 'email@gmail.com',
    auth: '12345678',
  });
  await newExperimenter.save();

  const newGame = new Game({
    createdBy: newExperimenter._id,
    link: 'randomLink.com',
    description: 'words here',
    completed: true,
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: 0.9,
        itemAMultiplier: 3,
        itemBMultiplier: 2,
        regionMultiplierX: -10,
        regionMultiplierY: 50,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating level with invalid region multiplier y', async () => {
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
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: 10,
        duration: 10,
        spawnRate: 5.5,
        itemAChance: 0.7,
        itemBChance: 0.9,
        itemAMultiplier: 3,
        itemBMultiplier: 2,
        regionMultiplierX: 50,
        regionMultiplierY: -10,
      },
    ],
    gifs: [],
  });
  return expect(newGame.save()).rejects.toThrow();
});

it('fails when creating level with invalid region fps', async () => {
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
    survey_start: 'surveyLink.com',
    survey_end: 'surveyLink.com',
    items_a: [],
    items_b: [],
    levels: [
      {
        fps: -1,
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
  return expect(newGame.save()).rejects.toThrow();
});
