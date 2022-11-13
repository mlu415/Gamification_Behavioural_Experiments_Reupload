import express from 'express';
import cors from 'cors';
import routes from './app/routes';
import mongoose from 'mongoose';
import config from './utils/config';
import bodyParser from 'body-parser';
import firebaseAdmin from './firebase/firebase-config';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.status(200).send()); // AWS Health Check

const port = process.env.PORT || 3333;
mongoose.connect(config.mongoURI)
  .then(() => {
    const server = app.listen(port, () => {
      console.log('Listening at http://localhost:' + port + '/api');
    });
    server.on('error', console.error);
  });

