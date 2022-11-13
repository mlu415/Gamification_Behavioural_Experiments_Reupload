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

it('create new score', async () => {
  const newScore = new Score({
    value: 10,
    username: 'Player 1',
  });
  await newScore.save();

  const fromDb = await Score.findOne({ _id: newScore._id });
  expect(fromDb).toBeTruthy();
  expect(fromDb.value).toBe(10);
  expect(fromDb.username).toBe('Player 1');
});

it('fails when no username is supplied', async () => {
  const newScore = new Score({
    value: 10,
  });
  return expect(newScore.save()).rejects.toThrow();
});

it('fails when no value is supplied', async () => {
  const newScore = new Score({
    username: 'Player 1',
  });
  return expect(newScore.save()).rejects.toThrow();
});
