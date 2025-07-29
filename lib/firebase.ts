import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCHhOe53R1iKqw0esKOD_6p4dHP3ez3ouk",
  authDomain: "simplecrm-1c200.firebaseapp.com",
  projectId: "simplecrm-1c200",
  storageBucket: "simplecrm-1c200.firebasestorage.app",
  messagingSenderId: "703167561202",
  appId: "1:703167561202:web:e2a22056721a031d307f6b",
}

console.log("Initializing Firebase with config:", firebaseConfig)

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Test Firebase connection
console.log("Firebase initialized successfully")
console.log("Auth instance:", auth)
console.log("Firestore instance:", db)
