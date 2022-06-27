import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useId } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mantine/core";
// Components import
import NotFoundTitle from "./404Page";
import { setUser, selectUsername, selectObject } from "./userSlice";

import { auth, SignInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { addDoc, getDocs } from "firebase/firestore";

import { logout, db } from "./firebase";

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
import { getFirestore, query, collection, where } from "firebase/firestore";

import { BrandGoogle } from "tabler-icons-react";

const Generator = (props) => {
  const dispatch = useDispatch();

  const object = useSelector(selectObject);

  const location = useLocation();
  const id = useId();
  const history = useHistory();

  //if (location.state == undefined) {
  //    return <NotFoundTitle />;
  //  }

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [testing, setTesting] = useState("testing");

  console.log(location);
  const fetchUserName = async () => {
    try {
      console.log("AUTH:", user);
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!user) {
      return <NotFoundTitle />;
    }
    fetchUserName();
  }, [user, loading]);
  const messageRef = useRef();
  return (
    <div className="generator">
      <h1>{testing}</h1>
      <h1>{name}</h1>
      <h1>{user?.email}</h1>
      <Button
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
        }
        onClick={SignInWithGoogle}
        variant="default"
        radius="xl"
        size="sm"
      >
        Sign in with Google
      </Button>
      <button className="register__btn register__google" onClick={logout}>
        SignOut
      </button>
    </div>
  );
};

export default Generator;
