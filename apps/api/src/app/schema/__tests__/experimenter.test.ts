import Experimenter from '../schema.experimenter'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose'

let database;

beforeAll(async () => {
    database = await MongoMemoryServer.create();
    const uri = database.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await database.stop();
});

it('create new experimenter', async () => {
    const newExperimenter = new Experimenter({
        email: 'email@gmail.com',
        auth: '12345678',
    })
    await newExperimenter.save();

    const fromDb = await Experimenter.findOne({ _id: newExperimenter._id });
    expect(fromDb).toBeTruthy();
    expect(fromDb.email).toBe('email@gmail.com');
    expect(fromDb.auth).toBe('12345678');
})

it('fails when creating new experimenter with no email', async () => {
    const newExperimenter = new Experimenter({
        emai: null,
        auth: '12345678',
    })
    return expect(newExperimenter.save()).rejects.toThrow();
})
