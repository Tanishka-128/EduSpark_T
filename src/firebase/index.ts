'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  // Note: App Hosting emulators are not yet supported.
  // if (process.env.NODE_ENV === 'development') {
  //   try {
  //     connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  //     connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  //   } catch (e) {
  //     console.error('Failed to connect to Firebase emulators.', e);
  //   }
  // }

  return {
    firebaseApp,
    auth,
    firestore
  };
}

export const initiateEmailSignIn = (auth: Auth, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        resolve(userCredential.user);
      })
      .catch(error => {
        toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
        reject(error);
      });
  });
};

export const initiateEmailSignUp = (auth: Auth, email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                resolve(userCredential);
            })
            .catch(error => {
                toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
                reject(error);
            });
    });
};


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
