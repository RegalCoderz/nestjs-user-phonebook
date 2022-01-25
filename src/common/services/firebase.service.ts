import { initializeApp } from '@firebase/app';
import { firebaseConfig } from 'src/config/firebase/firebaseSDK.config';

export class FirebaseService {
  constructor() {
    initializeApp(firebaseConfig);
    console.log('Firebase App Initialized in FirebaseService');
  }
}