import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser, selectUsername, selectObject } from "./userSlice";

const firebaseConfig = {
  apiKey: "AIzaSyAYv-TF955BPhLNDpyU33_RXYOc_3JfAxo",
  authDomain: "fir-eduvision.firebaseapp.com",
  databaseURL:
    "https://fir-eduvision-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-eduvision",
  storageBucket: "fir-eduvision.appspot.com",
  messagingSenderId: "646268921365",
  appId: "1:646268921365:web:e87b17b5fa58292386101c",
  measurementId: "G-N4RKEE445C",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const SignInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        picture: user.photoURL,
        orare: [],
      });
    }

    console.log(auth);
    console.log("USER :", res.user);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

export { auth, db, SignInWithGoogle, logout };