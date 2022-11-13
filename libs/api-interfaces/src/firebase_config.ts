import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDXj8KOdqbgwTXB3KJt8NIWaqtkwkcS3os',
  authDomain: 'tomatoes-25cf0.firebaseapp.com',
  projectId: 'tomatoes-25cf0',
  storageBucket: 'tomatoes-25cf0.appspot.com',
  messagingSenderId: '100024832722',
  appId: '1:100024832722:web:e64c6f2645eb6f0ca3930b',
  measurementId: 'G-9QHJPDL86G',
};

initializeApp(firebaseConfig);

export const auth = getAuth();

export default firebaseConfig;
