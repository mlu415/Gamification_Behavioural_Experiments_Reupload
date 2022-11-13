import axios from 'axios';
import firebaseConfig from '../../../../libs/api-interfaces/src/firebase_config';
import firebaseAdmin from '../firebase/firebase-config';

/* Functions used in tests */

export const generateTestAuthToken = async (
  email: string,
  password: string
) => {
  // Retrieve token for authentication
  const key = firebaseConfig.apiKey;

  const body = {
    email,
    password,
    returnSecureToken: true,
  };

  try {
    const { data: result } = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${key}`,
      body
    );
    return result.idToken;
  } catch (e) {
    console.log(e);
  }
};

export const decodeTestAuthToken = async (idToken: string) => {
  if (!idToken) {
    return '';
  }
  let auth_id = '';
  await firebaseAdmin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      auth_id = decodedToken.uid;
    });

  return auth_id;
};
