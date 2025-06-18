import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7JJVGFwXvThu5cucLQQSrovhS2uTrJt4",
  authDomain: "culinary-management-system.firebaseapp.com",
  projectId: "culinary-management-system",
  storageBucket: "culinary-management-system.appspot.com",
  messagingSenderId: "605832445788",
  appId: "1:605832445788:web:648d03eb0114f67054cb99",
  measurementId: "G-5CE91W0LJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;