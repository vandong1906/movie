

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,

} from "firebase/auth";
import CallUser from "./CallUser";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();  
const auth = getAuth(app);
export const loginGoogle = async () => {
    try {

      const result = await signInWithPopup(auth, provider);
  
      // Get the ID token (not the access token)
      const idToken = await result.user.getIdToken();
      console.log('ID Token:', idToken); // Debug: Check the ID token
  
      if (!idToken) {
        throw new Error('No ID token received');
      }
  
      const data = await CallUser().loginGoogle(idToken);
     
      return data.user;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  };

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
