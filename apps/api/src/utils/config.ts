import 'dotenv/config';

const serviceAccount = process.env.FIREBASE_SECRET;
const mongoURI = process.env.MONGO_URI;

const config = {
  serviceAccount,
  mongoURI
};

export default config;
