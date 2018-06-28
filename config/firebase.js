// Initialize Firebase
// import { FirebaseConfig } from '../config/keys'
import * as firebase from "firebase";

import { FirebaseConfig } from "../config/keys";
firebase.initializeApp(FirebaseConfig);
export const bridgesRef = firebase.database().ref();
// export const bridgesRef = databaseRef.child("bridge-alert");