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

import { BrandGoogle, Currency } from "tabler-icons-react";

import dayjs from "dayjs";

import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Calendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Modal, useMantineTheme } from "@mantine/core";
import { Title } from "@mantine/core";
import { Center } from "@mantine/core";

const Generator = (props) => {
  const [openModal, setOpenModal] = useState(false);

  const theme = useMantineTheme();

  const dispatch = useDispatch();

  const object = useSelector(selectObject);

  const location = useLocation();
  const id = useId();
  const history = useHistory();

  const [user, loading, error] = useAuthState(auth);

  const [value, setValue] = useState(new Date());

  const [currDay, setCurrDay] = useState("");
  const [currDate, setCurrDate] = useState(0);

  //if (location.state == undefined) {
  //      return <NotFoundTitle />;
  //  }
  console.log(location.state);

  const messageRef = useRef();

  console.log("GENERATORUSER: ", user.displayName);

  var orar = {
    settings: {
      ore: [],
      zile: [],
      materii: [],
    },
    ore: {
      zile: [],
      ore: [],
      materii: [],
      capitole: [],
    },
  };

  var days = location.state.days;
  var dates = location.state.date;
  var materii = [
    location.state.ore[0].name,
    location.state.ore[1].name,
    location.state.ore[2].name,
  ];

  var zi1 = dayjs(location.state.zile[0]);
  var zi2 = dayjs(location.state.zile[1]);
  const zile = zi2.diff(zi1, "day");

  const [orare, setOrare] = useState([]);

  const fetchOrare = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    setOrare(document.data().orare);
  };

  useEffect(() => {
    fetchOrare();
  }, []);

  console.log("ZILE:", zile);

  function populateObject() {
    orar.settings.ore = dates;
    orar.settings.days = days;
    orar.settings.materii = materii;

    orar.ore.zile = days;
    orar.ore.ore = dates;
    orar.ore.materii = materii;
    orar.ore.capitole = materii;
  }

  const addToDataBase = async (item) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    console.log(q);
    const aux = await getDocs(q);
    const document = aux.docs[0];
    console.log(document.id);

    await setDoc(
      doc(db, "users", document.id),
      { orare: [...document.data().orare, orar] },
      { merge: true }
    );
  };

  var datestesting = [16, 17, 18];
  var continut = [
    "16:30 -> 17:15 | Informatica",
    "14:30 -> 15:15 | Romana",
    "15:15 -> 16:00 | Matematica",
  ];

  var weekdayname = new Array(7);
  weekdayname[0] = "Sunday";
  weekdayname[1] = "Monday";
  weekdayname[2] = "Tuesday";
  weekdayname[3] = "Wednesday";
  weekdayname[4] = "Thursday";
  weekdayname[5] = "Friday";
  weekdayname[6] = "Saturday";

  return (
    <div className="generator">
      <Center>
        <Calendar
          value={value}
          onChange={setValue}
          month={value}
          size="xl"
          styles={(theme) => ({
            cell: {
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            },
            day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
            weekday: { fontSize: theme.fontSizes.lg },
            weekdayCell: {
              fontSize: theme.fontSizes.xl,
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[0],
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              height: 70,
            },
          })}
          renderDay={(date) => {
            const day = date.getDate();
            return (
              <Indicator
                size={24}
                color="blue"
                withBorder
                offset={8}
                disabled={datestesting.includes(day) == false}
                onClick={() => {
                  {
                    setCurrDay(
                      date.toLocaleDateString("ro-RO", { weekday: "long" })
                    );
                    setCurrDate(day);

                    datestesting.includes(day)
                      ? setOpenModal(true)
                      : console.log(
                          date.toLocaleDateString("ro-RO", { weekday: "long" })
                        );
                  }
                }}
              >
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
      </Center>
      <Modal
        centered
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title={<Title order={3}>{currDay.toUpperCase()}</Title>}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        {<div>{continut[datestesting.indexOf(currDate)]}</div>}
        {console.log(datestesting.indexOf(currDate))}
        {console.log(currDate)}
      </Modal>
    </div>
  );
};

export default Generator;
