import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// initialize firestore
const db = getFirestore(app);

// //user document
// const createUserDocument = (user, additionalData) => {
//   if (!user) return Promise.resolve();

//   //Firestore document
//   const userRef = doc(db, 'users', user.uid);

//   // Query the document
//   return getDoc(userRef).then((snapshot) => {
//     console.log(snapshot)
//     if (!snapshot.exists()) {
//       const { email } = user;
//       const { username } = additionalData;

//       // Set the user document
//       return setDoc(userRef, {
//         email,
//         username,

//         // other fields?
//       }).catch((err) => {
//         console.log('Error creating user document', err);
//       });
//     }
//   });
// };

// // Get user document
// const getUserDocument = (uid) => {
//   if (!uid) return Promise.resolve(null);

//   return getDoc(doc(db, 'users', uid))
//     .then((userDocument) => {
//       return {
//         uid,
//         ...userDocument.data(),
//       };
//     })
//     .catch((err) => {
//       console.log('Error fetching user document', err);
//     });
// };

export { auth, db };

// createUserDocument, getUserDocument,


