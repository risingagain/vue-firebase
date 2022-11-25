import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "***",
    authDomain: "***",
    databaseURL: "***",
    projectId: "***",
    storageBucket: "***",
    messagingSenderId: "***",
    appId: "***",
    measurementId: "***"
}
firebase.initializeApp(firebaseConfig)

export const firebaseDB = firebase.firestore()
export const firebaseAuth = firebase.auth()
export const firebaseStorage = firebase.storage()
export const TaskState = firebase.storage.TaskState