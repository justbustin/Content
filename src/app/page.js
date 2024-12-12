// pages/index.js
"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth, db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import './page.css';

export default function ChatPage() {
  const provider = new GoogleAuthProvider();

  /**
   * Logs in the user using the Google auth provider.
   * @returns {Promise<void>}
   */

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
  
      // Create a reference to the document with the user's UID as the document ID
      const userDocRef = doc(db, "users", user.uid);
  
      // Set the document data
      await setDoc(userDocRef, {
        userId: user.uid,
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        createdAt: new Date().toISOString(),
      }, { merge: true });  // Use merge: true to update the document if it already exists
  
      window.location.href = '/home';
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-3 items-center justify-center">
      <img src="conti.png" alt="Conti" className="h-32 w-auto rounded-full" />
      <h1 className="text-6xl font-bold text-white">Your Social Media Manager</h1>
      <p className="text-2xl mt-4 text-white">
        Improve your brand, automate posts, and connect with your audience
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-8" onClick={handleLogin}>
        Login with Google
      </button>
      
    </div>
  );
}
