import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useId } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mantine/core";
// Components import
import NotFoundTitle from "./404Page";
import {
  setUser,
  selectUsername,
  selectObject,
  selectEmail,
} from "./userSlice";

import { auth, SignInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { addDoc, getDocs } from "firebase/firestore";

import { logout, db } from "./firebase";
import { TextInput } from "@mantine/core";
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

import { BrandGoogle, Currency, LayersDifference } from "tabler-icons-react";

import dayjs from "dayjs";

import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Calendar, DateRangePicker } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Modal, useMantineTheme } from "@mantine/core";
import { Title } from "@mantine/core";
import { Center } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Text } from "@mantine/core";
import { Code } from "@mantine/core";
import { Paper } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { Slider, RangeSlider, Container } from "@mantine/core";
import { Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { Clock } from "tabler-icons-react";
import { SegmentedControl, Tooltip } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Help } from "tabler-icons-react";
import { useMantineColorScheme } from "@mantine/core";
import { Transition } from "@mantine/core";
import { useid } from "react-router-dom";
import "dayjs/locale/ro";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

var pushedAlt = false;

const Generator = (props) => {
  const [windowDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  const [openModal, setOpenModal] = useState(false);

  const theme = useMantineTheme();

  const dispatch = useDispatch();

  const object = useSelector(selectObject);

  const location = useLocation();
  const id = useId();
  const history = useHistory();

  const [user, loading, error] = useAuthState(auth);

  const [value, setValue] = useState(new Date());

  const ids = useId();

  const [currDay, setCurrDay] = useState("");
  const [currDate, setCurrDate] = useState(0);

  const [checked, setChecked] = useState(false);

  const [updatedAlt, setUpdatedAlt] = useState(false);

  const [valueSlider, setValueSlider] = useState(50);
  const [endValue, setEndValue] = useState(50);

  const [currMaterie, setCurrMaterie] = useState("");

  const [selectValue, setSelectValue] = useState("");

  const [capitolValue, setCapitolValue] = useState("");

  const [orarName, setOrarName] = useState("");

  const [orarImportant, setOrarImportant] = useState(false);

  const [orarDescriere, setOrarDescriere] = useState("Descriere");

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  var nrIntrebariRomana = 10;
  var nrIntrebariMatematica = 10;
  var nrIntrebariAlt = 15;

  var diffLevel1 = 4;
  var diffLevel2 = 3;
  var diffLevel3 = 2;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //if (location.state == undefined) {
  //      return <NotFoundTitle />;
  // }

  console.log(location.state);

  const messageRef = useRef();

  console.log("GENERATORUSER: ", user.displayName);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

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

  const addPoints = async (points) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    await setDoc(
      doc(db, "users", document.id),
      {
        puncte: document.data().puncte + points,
        maxPoints: document.data().maxPoints + points,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    fetchOrare();
    sleep(1000);
    console.log("use effect is runnning");
    GenerateOrar();
    logger();
    setOrarGenerat(orarFinal);
  }, []);

  console.log("ZILE:", zile);

  const addToDataBase = async (item) => {
    const activity = {
      name: "Generare",
      description: "Ai generat un orar nou!",
      price: 0,
      date: new Date(),
    };
    console.log("ORARNAME FROM ADD TO DB: ", orarName);
    setOrarGenerat({
      ...orarGenerat,
      nume: orarName,
      important: orarImportant,
      descriere: orarDescriere,
    });
    console.log("ORARGENERAT FROM GB: ", orarGenerat);
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    console.log(q);
    const aux = await getDocs(q);
    const document = aux.docs[0];
    console.log(document.id);

    await setDoc(
      doc(db, "users", document.id),
      {
        orare: [...document.data().orare, orarGenerat],
        recentActivities: [...document.data().recentActivities, activity],
      },
      { merge: true }
    );
  };

  var Location = {
    ore: location.state.date,
    zile: location.state.days,
    gresite: location.state.gresite,
    materii: [
      location.state.ore[0].name,
      location.state.ore[1].name,
      location.state.ore[2].name,
    ],
    date: location.state.zile,
  };

  var orarFinal = {
    nume: "",
    important: false,
    descriere: "",
    date: [],
    ore: [],
    durata: [],
    materii: [],
    capitole: [],
    importante: [],
    completate: [],
  };

  var capitoleRomanaTemp = Location.gresite.Romana.Capitole;
  var capitoleRomana = [];
  var capitoleMatematicaTemp = Location.gresite.Matematica.Capitole;
  var capitoleMatematica = [];
  var capitoleAltTemp = Location.gresite.Alt.Capitole;
  var capitoleAlt = [];

  for (var i = 0; i < capitoleRomanaTemp.length; i++) {
    if (!capitoleRomana.includes(capitoleRomanaTemp[i])) {
      capitoleRomana.push(capitoleRomanaTemp[i]);
    }
  }
  for (var i = 0; i < capitoleMatematicaTemp.length; i++) {
    if (!capitoleMatematica.includes(capitoleMatematicaTemp[i])) {
      capitoleMatematica.push(capitoleMatematicaTemp[i]);
    }
  }
  for (var i = 0; i < capitoleAltTemp.length; i++) {
    if (!capitoleAlt.includes(capitoleAltTemp[i])) {
      capitoleAlt.push(capitoleAltTemp[i]);
    }
  }

  var dificultateInformatica = 3;
  var dificultateFizica = 3;
  var dificultateChimie = 3;
  var dificultateBiologie = 1;

  var dificultateRomana = 2;
  var dificultateMatematica = 2;
  var dificultateAlt =
    Location.materii[0] == "Informatică"
      ? dificultateInformatica
      : Location.materii[0] == "Fizică"
      ? dificultateFizica
      : Location.materii[0] == "Chimie"
      ? dificultateChimie
      : Location.materii[0] == "Biologie"
      ? dificultateBiologie
      : Location.materii[1] == "Informatică"
      ? dificultateInformatica
      : Location.materii[1] == "Fizică"
      ? dificultateFizica
      : Location.materii[1] == "Chimie"
      ? dificultateChimie
      : Location.materii[1] == "Biologie"
      ? dificultateBiologie
      : Location.materii[2] == "Informatică"
      ? dificultateInformatica
      : Location.materii[2] == "Fizică"
      ? dificultateFizica
      : Location.materii[2] == "Chimie"
      ? dificultateChimie
      : dificultateBiologie;

  const returnPas = (input) => {
    if (input == "romana") {
      if (Location.gresite.Romana.Numar < nrIntrebariRomana / 3) {
        return diffLevel1;
      } else if (Location.gresite.Romana.Numar < nrIntrebariRomana / 2) {
        return diffLevel2;
      } else {
        return diffLevel3;
      }
    }
    if (input == "matematica") {
      if (Location.gresite.Matematica.Numar < nrIntrebariMatematica / 3) {
        return diffLevel1;
      } else if (
        Location.gresite.Matematica.Numar <
        nrIntrebariMatematica / 2
      ) {
        return diffLevel2;
      } else {
        return diffLevel3;
      }
    }
    if (input == "alt") {
      if (Location.gresite.Alt.Numar < nrIntrebariAlt / 3) {
        return diffLevel1;
      } else if (Location.gresite.Alt.Numar < nrIntrebariAlt / 2) {
        return diffLevel2;
      } else {
        return diffLevel3;
      }
    }
  };

  var globals = {
    pas: {
      romana: 10 / Location.gresite.Romana.Numar - dificultateRomana + 3,
      matematica:
        10 / Location.gresite.Matematica.Numar - dificultateMatematica + 3,
      alt: 10 / Location.gresite.Alt.Numar - dificultateAlt + 3,
    },
    left: {},
    materii: {
      alt:
        materii[0] == "Informatică" ||
        materii[0] == "Fizică" ||
        materii[0] == "Chimie" ||
        materii[0] == "Biologie"
          ? materii[0]
          : materii[1] == "Informatică" ||
            materii[1] == "Fizică" ||
            materii[1] == "Chimie" ||
            materii[1] == "Biologie"
          ? materii[1]
          : materii[2],
      romana:
        materii[0] == "Română"
          ? materii[0]
          : materii[1] == "Română"
          ? materii[1]
          : materii[2],
      matematica:
        materii[0] == "Matematică"
          ? materii[0]
          : materii[1] == "Matematică"
          ? materii[1]
          : materii[2],
    },
  };

  const [orarGenerat, setOrarGenerat] = useState(orarFinal);

  var aux = Location.date[0];
  var zi = dayjs(aux);

  var aux2 = Location.date[0];
  var zi2 = dayjs(aux);
  zi2 = zi2.add(
    2 *
      Math.round(
        (Math.round(globals.pas.romana) +
          Math.round(globals.pas.matematica) +
          Math.round(globals.pas.alt)) /
          3
      ),
    "day"
  );

  // Populates orarFinal with the 3 objects, (romana, matematica, alt)
  const Layer2 = () => {
    console.log("CAPITOLE ROMANA:", capitoleRomana);
    var contorCapitoleGresiteAlt = 0;
    var contorCapitoleGresiteRomana = 0;
    var contorCapitoleGresiteMatematica = 0;

    var durataAlt = Math.round((dificultateAlt * 100) / 3 + 20);
    var durataMatematica = Math.round((dificultateMatematica * 100) / 3 + 20);
    var durataRomana = Math.round((dificultateRomana * 100) / 3 + 20);

    var ora1 = dayjs(Location.ore[0]).hour();
    var ora2 = dayjs(Location.ore[1]).hour();

    var hourEndings = [10, 15, 25, 30, 45, 50];
    var minuteRemoval = [15, 20, 25, 30, 35];

    for (var i = 0; i < orarFinal.date.length; i += globals.pas.alt) {
      orarFinal.materii.push(globals.materii.alt);
      if (contorCapitoleGresiteAlt < Location.gresite.Alt.Numar) {
        orarFinal.capitole.push(
          Location.gresite.Alt.Capitole[contorCapitoleGresiteAlt++]
        );
      } else {
        contorCapitoleGresiteAlt = 0;
        orarFinal.capitole.push(
          Location.gresite.Alt.Capitole[contorCapitoleGresiteAlt++]
        );
      }
      orarFinal.durata.push(
        durataAlt -
          minuteRemoval[Math.floor(Math.random() * minuteRemoval.length)] +
          " minute"
      );
      var randomEnding =
        hourEndings[Math.floor(Math.random() * hourEndings.length)];
      var hour = getRndInteger(ora1, ora2) * 100 + randomEnding;
      while (hour + durataAlt > ora2 * 100) {
        hour -= 100;
      }
      var finalHour = parseInt(hour / 100) + ":" + (hour % 100);
      orarFinal.ore.push(finalHour.toString());
    }

    for (var i = 0; i < orarFinal.date.length; i += globals.pas.matematica) {
      orarFinal.materii.push(globals.materii.matematica);
      if (contorCapitoleGresiteMatematica < Location.gresite.Matematica.Numar) {
        orarFinal.capitole.push(
          Location.gresite.Matematica.Capitole[
            contorCapitoleGresiteMatematica++
          ]
        );
      } else {
        contorCapitoleGresiteMatematica = 0;
        orarFinal.capitole.push(
          Location.gresite.Matematica.Capitole[
            contorCapitoleGresiteMatematica++
          ]
        );
      }
      orarFinal.durata.push(
        durataMatematica -
          minuteRemoval[Math.floor(Math.random() * minuteRemoval.length)] +
          " minute"
      );
      var randomEnding =
        hourEndings[Math.floor(Math.random() * hourEndings.length)];
      var hour = getRndInteger(ora1, ora2) * 100 + randomEnding;
      while (hour + durataMatematica > ora2 * 100) {
        hour -= 100;
      }
      var finalHour = parseInt(hour / 100) + ":" + (hour % 100);
      orarFinal.ore.push(finalHour.toString());
    }

    for (var i = 0; i < orarFinal.date.length; i += globals.pas.romana) {
      orarFinal.materii.push(globals.materii.romana);
      if (contorCapitoleGresiteRomana < Location.gresite.Romana.Numar) {
        orarFinal.capitole.push(
          Location.gresite.Romana.Capitole[contorCapitoleGresiteRomana++]
        );
      } else {
        contorCapitoleGresiteRomana = 0;
        orarFinal.capitole.push(
          Location.gresite.Romana.Capitole[contorCapitoleGresiteRomana++]
        );
      }
      orarFinal.durata.push(
        durataRomana -
          minuteRemoval[Math.floor(Math.random() * minuteRemoval.length)] +
          " minute"
      );
      var randomEnding =
        hourEndings[Math.floor(Math.random() * hourEndings.length)];
      var hour = getRndInteger(ora1, ora2) * 100 + randomEnding;
      while (hour + durataMatematica > ora2 * 100) {
        hour -= 100;
      }
      var finalHour = parseInt(hour / 100) + ":" + (hour % 100);
      orarFinal.ore.push(finalHour.toString());
    }
  };

  const Layer1 = () => {
    for (
      var i = Location.date[0].getDate();
      i <= Location.date[0].getDate() + zile;
      i += Math.round(
        (Math.round(globals.pas.romana) +
          Math.round(globals.pas.matematica) +
          Math.round(globals.pas.alt)) /
          3
      )
    ) {
      zi = zi.add(
        Math.round(
          (Math.round(globals.pas.romana) +
            Math.round(globals.pas.matematica) +
            Math.round(globals.pas.alt)) /
            3
        ),
        "day"
      );
      if (Location.zile.includes(zi.day())) {
        orarFinal.date.push(zi.format("DD/MM/YYYY"));
      }
    }
    for (
      var i =
        Location.date[0].getDate() +
        Math.round(
          (Math.round(globals.pas.romana) +
            Math.round(globals.pas.matematica) +
            Math.round(globals.pas.alt)) /
            3
        );
      i < Location.date[0].getDate() + zile;
      i += Math.round(
        (Math.round(globals.pas.romana) +
          Math.round(globals.pas.matematica) +
          Math.round(globals.pas.alt)) /
          3
      )
    ) {
      zi2 = zi2.add(
        Math.round(
          (Math.round(globals.pas.romana) +
            Math.round(globals.pas.matematica) +
            Math.round(globals.pas.alt)) /
            3
        ) +
          Date(zi2.format("DD/MM/YYY")) <
          Date(Location.date[1])
          ? getRndInteger(2, 5)
          : 0,
        "day"
      );
      if (Location.zile.includes(zi2.day())) {
        orarFinal.date.push(zi2.format("DD/MM/YYYY"));
      }
    }
    orarFinal.date.sort(function (a, b) {
      return new Date(a) - new Date(b);
    });
  };

  const fillImportante = (input) => {
    for (var i = 0; i < 100; i++) {
      orarFinal.importante.push(input);
    }
  };

  const fillCompletate = (input) => {
    for (var i = 0; i < 100; i++) {
      orarFinal.completate.push(input);
    }
  };

  const GenerateOrar = () => {
    daysToNumbers(Location.zile);
    fillImportante(false);
    fillCompletate(false);
    Layer1();
    Layer2();
    shuffleOrar(orarFinal);
    orarFinal.date.sort(function (a, b) {
      var aa = a.split("/").reverse().join(),
        bb = b.split("/").reverse().join();
      return aa < bb ? -1 : aa > bb ? 1 : 0;
    });
    orarFinal.date = [...new Set(orarFinal.date)];
    setOrarGenerat(orarFinal);
    console.log("DATE : ", orarFinal.date);
  };

  const manageSortOrar = (orar) => {
    let newOrar = sortOrar(
      orar.date,
      orar.durata,
      orar.importante,
      orar.materii,
      orar.capitole,
      orar.ore
    );
    orar.date = newOrar.date;
    orar.durata = newOrar.durata;
    orar.important = newOrar.importante;
    orar.materii = newOrar.materii;
    orar.capitole = newOrar.capitole;
    orar.ore = newOrar.ore;
  };

  const rebuildDate = (date) => {
    return date;
  };

  // Durstenfeld shuffle, an optimized version of Fisher-Yates shuffle:
  function shuffleOrar(orar) {
    for (let i = orar.materii.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orar.materii[i], orar.materii[j]] = [orar.materii[j], orar.materii[i]];
      [orar.capitole[i], orar.capitole[j]] = [
        orar.capitole[j],
        orar.capitole[i],
      ];
      [orar.ore[i], orar.ore[j]] = [orar.ore[j], orar.ore[i]];
      [orar.durata[i], orar.durata[j]] = [orar.durata[j], orar.durata[i]];
      [orar.importante[i], orar.importante[j]] = [
        orar.importante[j],
        orar.importante[i],
      ];
    }
  }

  const sortOrar = (date, durata, importante, materii, capitole, ore) => {
    for (var i = 0; i < date.length - 1; i++) {
      var partsi = date[i].split("/");
      for (var j = i + 1; j < date.length; j++) {
        var partsj = date[j].split("/");
        if (
          new Date(partsi[1] + "/" + partsi[0] + "/" + partsi[2]).getTime() >
          new Date(partsj[1] + "/" + partsj[0] + "/" + partsj[2]).getTime()
        ) {
          var aux = date[i];
          date[i] = date[j];
          date[j] = aux;
          aux = durata[i];
          durata[i] = durata[j];
          durata[j] = aux;
          aux = importante[i];
          importante[i] = importante[j];
          importante[j] = aux;
          aux = materii[i];
          materii[i] = materii[j];
          materii[j] = aux;
          aux = capitole[i];
          capitole[i] = capitole[j];
          capitole[j] = aux;
          aux = ore[i];
          ore[i] = ore[j];
          ore[j] = aux;
        }
      }
    }
    console.log("ORAR SORTED DATES: ", date);
    return { date, durata, importante, materii, capitole, ore };
  };

  function daysToNumbers(input) {
    for (var i = 0; i < input.length; i++) {
      if (input[i] == "luni") {
        input[i] = 1;
      }
      if (input[i] == "marti") {
        input[i] = 2;
      }
      if (input[i] == "miercuri") {
        input[i] = 3;
      }
      if (input[i] == "joi") {
        input[i] = 4;
      }
      if (input[i] == "vineri") {
        input[i] = 5;
      }
      if (input[i] == "sambata") {
        input[i] = 6;
      }
      if (input[i] == "duminica") {
        input[i] = 0;
      }
    }
  }

  function logger() {
    console.log("THIS IS FROM LOGGER -> USEEFFECT");
    console.log("ORARFINAL DATE: ", orarFinal.date);
    console.log("PAS: ", globals.pas);
    console.log(
      Math.round(
        (Math.round(globals.pas.romana) +
          Math.round(globals.pas.matematica) +
          Math.round(globals.pas.alt)) /
          3
      )
    );
    console.log(Location.zile);
    console.log(Location.gresite);
    console.log("ORAR: ", orarFinal);
  }

  const saveDetails = () => {
    orarGenerat.nume = orarName;
    orarGenerat.important = orarImportant;
    orarGenerat.descriere = orarDescriere;
    setOrarGenerat({
      ...orarGenerat,
      nume: orarName,
      important: orarImportant,
      descriere: orarDescriere,
    });
  };

  sleep(2000);
  return (
    console.log("FROM RETURN"),
    console.log(orarFinal),
    console.log(orarGenerat),
    console.log("ORAR NAME: ", orarName),
    (
      <div className="generator">
        <Center>
          <Paper
            shadow="xl"
            radius="md"
            p="xl"
            withBorder
            style={{ marginTop: "5rem" }}
          >
            <Center>
              <Paper shadow="xl" radius="md" p="xl" withBorder>
                <Calendar
                  locale="ro"
                  value={value}
                  onChange={setValue}
                  size="xl"
                  renderDay={(date) => {
                    const dayj = dayjs(date);
                    const day = dayj.format("DD/MM/YYYY");
                    return (
                      <>
                        {console.log(
                          "ORARGENERAT FROM CALENDAR: ",
                          orarGenerat
                        )}
                        <Indicator
                          color={dark ? "violet" : "blue"}
                          withBorder
                          offset={8}
                          disabled={orarGenerat.date.includes(day) == false}
                          onClick={() => {
                            {
                              setCurrDay(
                                date.toLocaleDateString("ro-RO", {
                                  weekday: "long",
                                })
                              );
                              setCurrDate(day);

                              setCurrMaterie(
                                orarGenerat.materii[
                                  orarGenerat.date.indexOf(currDate)
                                ]
                              );
                              orarGenerat.date.includes(day)
                                ? setOpenModal(true)
                                : setOpenModal(false);
                              setCurrMaterie(
                                orarGenerat.materii[
                                  orarGenerat.date.indexOf(currDate)
                                ]
                              );
                              console.log("materie: ", selectValue);
                            }
                          }}
                        >
                          <div>{dayj.format("D")}</div>
                        </Indicator>
                      </>
                    );
                  }}
                />
              </Paper>
              <Transition
                mounted={openModal}
                transition="slide-right"
                duration={300}
                exitDuration={300}
                timingFunction="ease"
              >
                {(styles) =>
                  windowDimension.winWidth > 720 && openModal ? (
                    <Center style={{ ...styles }}>
                      <Paper
                        shadow="xl"
                        radius="md"
                        p="xl"
                        withBorder
                        style={{
                          ...styles,
                          //marginTop: "0rem",
                          //marginBottom: "3.5rem",
                          marginLeft: "3rem",
                        }}
                      >
                        <Tooltip
                          wrapLines
                          width={220}
                          transition="slide-up"
                          transitionDuration={200}
                          label="Pentru a face editari apasa de doua ori pe optiunea dorita pentru a confirma iar apoi reincarca ziua"
                        >
                          {" "}
                          <ActionIcon size="xs">
                            <Help />
                          </ActionIcon>
                        </Tooltip>
                        <>
                          {console.log("CURRMATERIE: ", currMaterie)}
                          <Paper p="xs" withBorder>
                            <div
                              style={{
                                textAlign: "left",
                              }}
                            >
                              <Code>MATERIE:</Code>{" "}
                              <SegmentedControl
                                data={materii}
                                value={
                                  orarGenerat.materii[
                                    orarGenerat.date.indexOf(currDate)
                                  ]
                                }
                                onChange={setSelectValue}
                                onClick={() => {
                                  orarGenerat.materii[
                                    orarGenerat.date.indexOf(currDate)
                                  ] = selectValue;
                                  orarGenerat.capitole[
                                    orarGenerat.date.indexOf(currDate)
                                  ] =
                                    orarGenerat.materii[
                                      orarGenerat.date.indexOf(currDate)
                                    ] == "Informatică" ||
                                    orarGenerat.materii[
                                      orarGenerat.date.indexOf(currDate)
                                    ] == "Fizica" ||
                                    orarGenerat.materii[
                                      orarGenerat.date.indexOf(currDate)
                                    ] == "Biologie" ||
                                    orarGenerat.materii[
                                      orarGenerat.date.indexOf(currDate)
                                    ] == "Chimie"
                                      ? capitoleAlt[
                                          getRndInteger(
                                            0,
                                            capitoleAlt.length - 1
                                          )
                                        ]
                                      : orarGenerat.materii[
                                          orarGenerat.date.indexOf(currDate)
                                        ] == "Matematică"
                                      ? capitoleMatematica[
                                          getRndInteger(
                                            0,
                                            capitoleMatematica.length - 1
                                          )
                                        ]
                                      : capitoleRomana[
                                          getRndInteger(
                                            0,
                                            capitoleRomana.length - 1
                                          )
                                        ];
                                }}
                              />
                            </div>
                          </Paper>
                          <Paper p="xs" withBorder mt={"xs"}>
                            <div
                              style={{
                                textAlign: "left",
                              }}
                            >
                              <Code>CAPITOL:</Code>{" "}
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {
                                      orarGenerat.capitole[
                                        orarGenerat.date.indexOf(currDate)
                                      ]
                                    }
                                  </Text>
                                </Center>
                              </Paper>
                              {}
                            </div>
                          </Paper>
                          <Paper
                            p="xs"
                            withBorder
                            mt={"xs"}
                            style={{ alignItems: "left", alignContent: "left" }}
                          >
                            <div
                              style={{
                                textAlign: "left",
                              }}
                            >
                              <Code>ORA:</Code>{" "}
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {
                                      orarGenerat.ore[
                                        orarGenerat.date.indexOf(currDate)
                                      ]
                                    }
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                          </Paper>
                          <Paper p="xs" withBorder mt={"xs"}>
                            <div
                              style={{
                                textAlign: "left",
                              }}
                            >
                              <Code>DURATA:</Code>{" "}
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {
                                      orarGenerat.durata[
                                        orarGenerat.date.indexOf(currDate)
                                      ]
                                    }
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                          </Paper>
                          {orarGenerat.importante[
                            orarGenerat.date.indexOf(currDate)
                          ] ? (
                            <>
                              <Paper p="xs" withBorder mt={"xs"}>
                                <div
                                  style={{
                                    textAlign: "left",
                                  }}
                                >
                                  <Code>DETALII:</Code>{" "}
                                  <Paper
                                    p="0.4rem"
                                    style={{
                                      backgroundColor: dark
                                        ? "#141517"
                                        : "#f1f3f5",
                                      display: "inline-block",
                                      paddingLeft: "0.7rem",
                                      paddingRight: "0.7rem",
                                    }}
                                  >
                                    <Text
                                      color={dark ? "#98a7ab" : "#495057"}
                                      size="sm"
                                      weight={500}
                                    >
                                      Important
                                    </Text>
                                  </Paper>
                                </div>
                              </Paper>
                            </>
                          ) : (
                            ""
                          )}
                          <Paper p="xs" withBorder mt={"xs"}>
                            <div
                              style={{
                                textAlign: "left",
                              }}
                            >
                              <Checkbox
                                label="Important"
                                onChange={() => {
                                  setOrarGenerat({
                                    ...orarGenerat,
                                    importante: {
                                      ...orarGenerat.importante,
                                      [orarGenerat.date.indexOf(currDate)]:
                                        !orarGenerat.importante[
                                          orarGenerat.date.indexOf(currDate)
                                        ],
                                    },
                                  });
                                  console.log("FROM ONCHANGE");
                                }}
                                checked={
                                  orarGenerat.importante[
                                    orarGenerat.date.indexOf(currDate)
                                  ]
                                }
                              />
                            </div>
                          </Paper>
                          {
                            orarGenerat.importante[
                              orarGenerat.date.indexOf(currDate)
                            ]
                          }
                        </>
                      </Paper>
                    </Center>
                  ) : null
                }
              </Transition>
            </Center>
            <div
              style={{
                marginTop: "3rem",
                marginLeft: "1rem",
                alignContent: "left",
                alignItems: "left",
                textAlign: "left",
              }}
            >
              <Title order={3}>Ultimele detalii...</Title>
              <TextInput
                placeholder="Nume"
                label="Numele orarului"
                variant="filled"
                value={orarName}
                onChange={(event) => setOrarName(event.currentTarget.value)}
              />
              <TextInput
                placeholder="Descriere"
                label="Descrierea oraului"
                variant="filled"
                value={orarDescriere}
                onChange={(event) =>
                  setOrarDescriere(event.currentTarget.value)
                }
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="filled"
                onClick={() => {
                  saveDetails();
                  setOrarGenerat(orarFinal);
                  addToDataBase(orarGenerat);
                  addPoints(75);
                  showNotification({
                    title: "Ai creat un orar nou!",
                    message: "Ai primit 75 puncte!",
                    autoClose: 2000,
                    color: "green",
                    icon: <Check />,
                  });
                }}
              >
                Salveaza
              </Button>
            </div>
          </Paper>
        </Center>
        <Modal
          centered
          opened={openModal && windowDimension.winWidth < 720}
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
          {
            <>
              <Paper shadow="xl" p="xs" withBorder>
                <div>
                  <Code>MATERIE:</Code>
                  {orarGenerat.materii[orarGenerat.date.indexOf(currDate)]}
                </div>
              </Paper>
              <Paper shadow="xl" p="xs" withBorder mt={"xs"}>
                <div>
                  <Code>CAPITOL:</Code>
                  {orarGenerat.capitole[orarGenerat.date.indexOf(currDate)]}
                </div>
              </Paper>
              <Paper shadow="xl" p="xs" withBorder mt={"xs"}>
                <div>
                  <Code>ORA:</Code>
                  {orarGenerat.ore[orarGenerat.date.indexOf(currDate)]}
                </div>
              </Paper>
              <Paper shadow="xl" p="xs" withBorder mt={"xs"}>
                <div>
                  <Code>DURATA:</Code>
                  {orarGenerat.durata[orarGenerat.date.indexOf(currDate)]}
                </div>
              </Paper>
              <Paper shadow="xl" p="xs" withBorder mt={"xs"}>
                <div>
                  <Checkbox
                    label="Important"
                    onChange={() => {
                      setOrarGenerat({
                        ...orarGenerat,
                        importante: {
                          ...orarGenerat.importante,
                          [orarGenerat.date.indexOf(currDate)]:
                            !orarGenerat.importante[
                              orarGenerat.date.indexOf(currDate)
                            ],
                        },
                      });
                      console.log("FROM ONCHANGE");
                    }}
                    checked={
                      orarGenerat.importante[orarGenerat.date.indexOf(currDate)]
                    }
                  />
                </div>
              </Paper>
            </>
          }
          {}
          {}
        </Modal>
      </div>
    )
  );
};

export default Generator;
