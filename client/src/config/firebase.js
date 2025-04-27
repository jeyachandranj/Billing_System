import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuH7J37Ct8M-7Py3JJNiMBHrHawpycFYQ",
  authDomain: "sign-87937.firebaseapp.com",
  projectId: "sign-87937",
  storageBucket: "sign-87937.firebasestorage.app",
  messagingSenderId: "560634110218",
  appId: "1:560634110218:web:3497a38210c8a6f100daf3",
  measurementId: "G-YZFZ57KGZ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;