import firebaseAdmin from 'firebase-admin';
import config from '../utils/config';

const serviceAccount = JSON.parse(
  Buffer.from(config.serviceAccount, 'base64').toString('ascii')
);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    <firebaseAdmin.ServiceAccount>serviceAccount
  ),
});

export default firebaseAdmin;
