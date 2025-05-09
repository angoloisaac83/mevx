"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, collection, addDoc, type Firestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8jYrQ_NZ9vi1kAC4iXuOd0G4uYXYDah4",
  authDomain: "mevx-224af.firebaseapp.com",
  projectId: "mevx-224af",
  storageBucket: "mevx-224af.appspot.com",
  messagingSenderId: "932302828310",
  appId: "1:932302828310:web:596ae81544707cd8001637",
  measurementId: "G-K1T5BS5KC7",
}

// Initialize Firebase
let app: FirebaseApp | undefined = undefined
let db: Firestore | undefined = undefined

// Initialize Firebase only on the client side
if (typeof window !== "undefined") {
  try {
    // Check if Firebase is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    // Initialize Firestore
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export async function storeWalletData(walletData: any) {
  if (!db) {
    console.error("Firestore not initialized")
    // Return a mock ID instead of throwing an error to prevent app crashes
    return "mock-id-firestore-not-available"
  }

  try {
    const docRef = await addDoc(collection(db, "walletData"), walletData)
    console.log("Wallet data stored with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error storing wallet data:", error)
    // Return a mock ID instead of throwing an error
    return "mock-id-storage-error"
  }
}

// Mock implementation for when Firestore is not available
export function isFirestoreAvailable() {
  return !!db
}
