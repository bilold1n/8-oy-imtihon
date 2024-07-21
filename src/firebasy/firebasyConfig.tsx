// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnGQkSO_c1_HDcQHW8AYFI2J5QswQ2CTY",
  authDomain: "myproject-7036d.firebaseapp.com",
  projectId: "myproject-7036d",
  storageBucket: "myproject-7036d.appspot.com",
  messagingSenderId: "361999099812",
  appId: "1:361999099812:web:7fadef90127ee8df88c331",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export async function DeleteDocitem(path: any, itemid: any) {
  const docref = await deleteDoc(doc(db, path, itemid));
  console.log(docref);
  return "Document was deleted!";
}
export async function DeleteDocitem1(path: any, itemid: any) {
  const docref = await deleteDoc(doc(db, path, itemid));
  console.log(docref);
  return "Document was deleted!";
}
