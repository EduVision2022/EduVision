// @ts-nocheck
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useId } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs, { locale } from "dayjs";
import "dayjs/locale/ro";

// Component imports
import Delayed from "./Delayed.tsx";

// Mantine imports
import { Accordion, AccordionProps, createStyles, Grid } from "@mantine/core";
import { Paper } from "@mantine/core";
import { Center } from "@mantine/core";
import { Code } from "@mantine/core";
import { Text } from "@mantine/core";
import { Space } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { Calendar, RangeCalendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Transition, GroupedTransition } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Modal } from "@mantine/core";
import { Title } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { Button } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Badge } from "@mantine/core";
import { Stack } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";

import { useMantineColorScheme, useMantineTheme } from "@mantine/core";

//Font import
import "./smallestPixel.css";

// Icons imports
import { FileDatabase, Plus } from "tabler-icons-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Help } from "tabler-icons-react";
import { LayoutList } from "tabler-icons-react";
import { CalendarEvent } from "tabler-icons-react";
import { Check, X } from "tabler-icons-react";

// Image imports
import backgroundLight from "./images/defaultLight.png";
import backgroundDark from "./images/defaultDark.png";
import backgroundLightInverted from "./images/invertedLight.png";
import backgroundDarkInverted from "./images/invertedDark.png";

// Firestore firebase imports
import {
  getFirestore,
  query,
  collection,
  where,
  Firestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { addDoc, getDocs } from "firebase/firestore";
import { logout, db } from "./firebase";
import { userInfo } from "os";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, SignInWithGoogle } from "./firebase";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme, _params, getRef) => ({
  icon: { ref: getRef("icon") },

  control: {
    ref: getRef("control"),
    border: 0,
    opacity: 0.6,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    "&:hover": {
      backgroundColor: "transparent",
      opacity: 1,
    },
  },

  item: {
    borderBottom: 0,
    overflow: "hidden",
    transition: `box-shadow 150ms ${theme.transitionTimingFunction}`,
    border: "1px solid transparent",
    borderRadius: theme.radius.sm,
  },

  itemOpened: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[3],

    [`& .${getRef("control")}`]: {
      opacity: 1,
    },

    [`& .${getRef("icon")}`]: {
      transform: "rotate(45deg)",
    },
  },

  content: {
    paddingLeft: 0,
  },
}));

function StyledAccordion(props: AccordionProps) {
  const { classes } = useStyles();
  return <Accordion classNames={classes} {...props} />;
}

function sortByDate(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const View = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [user, loading, error] = useAuthState(auth);

  const Location = useLocation();
  const orar = Location.state.orar;

  const date = orar.date;

  const [testModal, setTestModal] = useState(false);
  const [pasTest, setPasTest] = useState(0);
  const [score, setScore] = useState(0);

  console.log(orar);

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

  const [segValue, setSegValue] = useState("react");

  const [value, setValue] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [currDate, setCurrDate] = useState(0);

  const [intrebare, setIntrebare] = useState("");
  const [anonim, setAnonim] = useState(false);

  const [testMaterie, setTestMaterie] = useState("");
  const [testCapitol, setTestCapitol] = useState("");

  function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }
  const setFormatDDMMYYYYtoMMDDYYYY = (date, separator = "/") => {
    const [day, month, year] = date.split("/");
    return month + separator + day + separator + year;
  };
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  dayjs.locale("ro");

  function intrebareMaterie(
    materie,
    capitol,
    intrebare,
    raspunsuri = [],
    raspunsCorect
  ) {
    this.materie = materie;
    this.capitol = capitol;
    this.intrebare = intrebare;
    this.raspunsuri = raspunsuri;
    this.raspunsCorect = raspunsCorect;
  }

  var intrebariInformatica = [
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Indicați expresia C/C++ cu valoarea 0",
      ["sqrt(16)==4", "45*5==200+5*5", "25/10==15/10", "64/4==8*2"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Numim pădure un graf neorientat în care fiecare componentă conexă a sa este un arbore. Orice pădure cu cel putin doi arbori este un graf care:",
      [
        "Are cicluri şi este conex",
        "Are cicluri şi nu este conex",
        "Nu are cicluri şi este conex",
        "Nu are cicluri şi nu este conex",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Declararea variabilelor",
      "Alegeți declararea corectă a unei variabile structurale cu 2 componente, una de tip real și una de tip întreg.",

      [
        "int float x[10] ;",
        "struct { float x; int y} a;",
        "float a[20];",
        "struct { float x; int y} int a;",
      ],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Variabilele x și y sunt întregi. Indicați expresia C/C++ echivalentă cu (x<3)&&(y>=5).",
      [
        "!(!(x<3)||!(y>=5))",
        "!(x>=3)&&(y<5)",
        "!((x>=3)&&(y<5))",
        "!((x<3)||(y>=5))",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Valorile care pot reprezenta gradele nodurilor unui graf neorientat, cu 6 noduri, sunt:",
      ["2,2,5,5,0,1", "6,5,4,3,2,1", "2,2,3,4,0,3", "1,0,0,2,2,2"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Ce se afisează, în urma executării următoarelor instrucțiuni: int b[5]={88,87,76,36,21},i;for( i=1;i<4;i++){cout<<b[i]<<' ';}",
      [
        "87 76 36",
        "88 87 76 36 21",
        "87 76 36 21",
        "Secventa are erori de sintaxa.",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Variabilele i şi j sunt de tip întreg, iar variabila m memorează un tablou bidimensional cu 5 linii şi 5 coloane, numerotate de la 0 la 4, cu elemente numere întregi. O expresie C/C++ a cărei valoare este egală cu produsul dintre primul element de pe linia i și ultimul element de pe coloana j din acest tablou este:",
      ["m(0,i)*m(j,4)", "m(i)(0)*m(4)(j)", "m[i][0]*m[4][j]", "m[0,i]*m[j,4]"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Backtracking",
      "Utilizând metoda backtracking se generează toate modalităţile de a scrie numărul 6 ca sumă de numere naturale impare. Termenii fiecărei sume sunt în ordine crescătoare. Cele patru soluţii sunt obţinute în această ordine: 1+1+1+1+1+1; 1+1+1+3; 1+5; 3+3. Aplicând acelaşi algoritm, numărul soluţiilor obţinute pentru scrierea lui 8 este:",
      ["9", "6", "5", "8"],
      2
    ),
  ];

  const [currIntrebari, setCurrIntrebari] = useState([]);
  const generateIntrebari = async (materie, capitol) => {
    var intrebari = [];

    for (var i = 0; i < intrebariInformatica.length; i++) {
      if (intrebariInformatica[i].materie == materie) {
        if (intrebariInformatica[i].capitol == capitol) {
          intrebari.push(intrebariInformatica[i]);
        }
      }
    }
    console.log("intrebari: ", intrebari);
    await setCurrIntrebari(intrebari);
  };

  const manageTest = async () => {
    setPasTest(0);
    setTestMaterie(orar.materii[orar.date.indexOf(currDate)]);
    setTestCapitol(orar.capitole[orar.date.indexOf(currDate)]);
    setTimeout(console.log("currintrebari from onclick", currIntrebari), 2000);
    setTestModal(true);
  };

  const checkScore = () => {
    if (score >= currIntrebari.length) {
      console.log("passed");
    } else {
      console.log("failed");
    }
  };

  class Intrebare {
    intrebare: string;
    materie: string;
    capitol: string;
    username: string;
    constructor(intrebare, materie, capitol, username) {
      this.intrebare = intrebare;
      this.materie = materie;
      this.capitol = capitol;
      this.username = username;
    }
  }

  const addQuestion = async (intrebare, materie, capitol, username) => {
    var question = new Intrebare(intrebare, materie, capitol, username);
    const q = query(
      collection(db, "intrebari"),
      where("intrebare", "==", question.intrebare)
    );
    const aux = await getDocs(q);
    const document = aux.docs[0];
    console.log(document);
    if (aux.docs.length === 0) {
      await addDoc(collection(db, "intrebari"), {
        intrebare: intrebare,
        materie: materie,
        capitol: capitol,
        raspuns: [],
        autor: username,
      });
    }
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

  function AccordionLabel({ date, important }) {
    var data = dayjs(setFormatDDMMYYYYtoMMDDYYYY(date)).format(
      "dddd, D MMMM, YYYY"
    );
    return (
      <>
        <div className="accordion-label" style={{ display: "flex" }}>
          <Text style={{ display: "" }}>
            {dayjs(setFormatDDMMYYYYtoMMDDYYYY(date)).format(
              "dddd, D MMMM, YYYY"
            )}
          </Text>
          <Space w={180}></Space>
          <div className="important">
            {important ? <Badge color="teal">Important</Badge> : null}
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="view" style={{}}>
      <Center>
        <Tabs grow style={{ marginTop: "3rem" }} variant="pills">
          <Tabs.Tab label="Lista" icon={<LayoutList size={14} />}>
            <Paper
              shadow="xl"
              radius="md"
              p="xl"
              withBorder
              style={{ width: "35rem" }}
            >
              <StyledAccordion iconPosition="left" multiple>
                {date.map((date, index) => (
                  <Accordion.Item
                    label={
                      <AccordionLabel
                        date={date}
                        important={orar.importante[index]}
                      />
                    }
                    style={{
                      alignContent: "left",
                      alignItems: "left",
                      textAlign: "left",
                      marginTop: "1rem",
                    }}
                  >
                    {
                      <div className="accordion-content">
                        <div className="materie">
                          <Code>MATERIE:</Code>{" "}
                          <Paper
                            p="0.4rem"
                            style={{
                              backgroundColor: dark ? "#141517" : "#f1f3f5",
                              display: "inline-block",
                              paddingLeft: "0.7rem",
                              paddingRight: "0.7rem",
                              margin: "0.5rem",
                            }}
                          >
                            <Center>
                              <Text
                                color={dark ? "#98a7ab" : "#495057"}
                                size="sm"
                                weight={500}
                              >
                                {orar.materii[index]}
                              </Text>
                            </Center>
                          </Paper>
                        </div>
                        <div className="capitol">
                          <Code>CAPITOL:</Code>{" "}
                          <Paper
                            p="0.4rem"
                            style={{
                              backgroundColor: dark ? "#141517" : "#f1f3f5",
                              display: "inline-block",
                              paddingLeft: "0.7rem",
                              paddingRight: "0.7rem",
                              margin: "0.5rem",
                            }}
                          >
                            <Center>
                              <Text
                                color={dark ? "#98a7ab" : "#495057"}
                                size="sm"
                                weight={500}
                              >
                                {orar.capitole[index]}
                              </Text>
                            </Center>
                          </Paper>
                        </div>
                        <div className="ora">
                          <Code>ORA:</Code>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Paper
                            p="0.4rem"
                            style={{
                              backgroundColor: dark ? "#141517" : "#f1f3f5",
                              display: "inline-block",
                              paddingLeft: "0.7rem",
                              paddingRight: "0.7rem",
                              margin: "0.5rem",
                            }}
                          >
                            <Center>
                              <Text
                                color={dark ? "#98a7ab" : "#495057"}
                                size="sm"
                                weight={500}
                              >
                                {orar.ore[index]}
                              </Text>
                            </Center>
                          </Paper>
                        </div>
                        <div className="durata">
                          <Code>DURATA: </Code> &nbsp;
                          <Paper
                            p="0.4rem"
                            style={{
                              backgroundColor: dark ? "#141517" : "#f1f3f5",
                              display: "inline-block",
                              paddingLeft: "0.7rem",
                              paddingRight: "0.7rem",
                              margin: "0.5rem",
                            }}
                          >
                            <Center>
                              <Text
                                color={dark ? "#98a7ab" : "#495057"}
                                size="sm"
                                weight={500}
                              >
                                {orar.durata[index]}
                              </Text>
                            </Center>
                          </Paper>
                          <br />
                          <Paper shadow="xl" radius="md" p="md" withBorder>
                            <Text weight="600" size="sm">
                              Pune o întrebare despre ora aceasta
                            </Text>
                            <Text weight="600" size="xs" color="dimmed">
                              Întrebarea va fi publicată la secțiunea
                              <Badge color="gray">Întrebări</Badge> și orice
                              utliziator îți va putea răspunde.
                            </Text>
                            <Checkbox
                              label={"Doresc să rămân anonim"}
                              style={{
                                marginBottom: "0.5rem",
                                marginTop: "0.5rem",
                              }}
                              checked={anonim}
                              onChange={(event) =>
                                setAnonim(event.currentTarget.checked)
                              }
                            />
                            <TextInput
                              variant="default"
                              placeholder="Intrebare"
                              value={intrebare}
                              onChange={(event) =>
                                setIntrebare(event.currentTarget.value)
                              }
                              style={{
                                display: "inline-block",
                                width: "75%",
                                marginRight: "0.5rem",
                              }}
                            />
                            <Button
                              variant="default"
                              style={{ display: "inline-block" }}
                              onClick={() => {
                                addQuestion(
                                  intrebare,
                                  orar.materii[index],
                                  orar.capitole[index],
                                  anonim == true ? "Anonim" : user.displayName
                                );
                                addPoints(25);
                                showNotification({
                                  title: "Întrebarea a fost adăugată!",
                                  message: "Ai primit 25 puncte!",
                                  autoClose: 2000,
                                  color: "green",
                                  icon: <Check />,
                                });
                              }}
                            >
                              Intreaba
                            </Button>
                          </Paper>
                        </div>
                      </div>
                    }
                  </Accordion.Item>
                ))}
              </StyledAccordion>
            </Paper>
          </Tabs.Tab>
          <Tabs.Tab label="Calendar" icon={<CalendarEvent size={14} />}>
            <Paper
              shadow="xl"
              radius="md"
              p="xl"
              withBorder
              style={{ display: "flex" }}
            >
              <Center>
                <Paper shadow="xl" radius="md" p="xl" withBorder>
                  <Calendar
                    locale="ro"
                    value={value}
                    onChange={setValue}
                    size="xl"
                    renderDay={(dateday) => {
                      const dayj = dayjs(dateday);
                      const day = dayj.format("DD/MM/YYYY");
                      return (
                        <>
                          <Indicator
                            color="teal"
                            disabled={
                              date.includes(day) == false ||
                              orar.date.indexOf(day) == -1 ||
                              orar.importante[orar.date.indexOf(day)] ==
                                undefined ||
                              orar.importante[orar.date.indexOf(day)] == false
                            }
                            label="Important"
                            size={18}
                            position="bottom-center"
                            withBorder
                            radius="md"
                            onClick={() => {
                              date.includes(day)
                                ? setOpenModal(true)
                                : setOpenModal(false);
                              setCurrDate(day);
                              generateIntrebari(
                                orar.materii[orar.date.indexOf(currDate)],
                                orar.capitole[orar.date.indexOf(currDate)]
                              );
                            }}
                          >
                            <Indicator
                              color={dark ? "violet" : "blue"}
                              withBorder
                              offset={8}
                              disabled={date.includes(day) == false}
                              onClick={() => {
                                date.includes(day)
                                  ? setOpenModal(true)
                                  : setOpenModal(false);
                                setCurrDate(day);
                                generateIntrebari(
                                  orar.materii[orar.date.indexOf(currDate)],
                                  orar.capitole[orar.date.indexOf(currDate)]
                                );
                              }}
                            >
                              <div>{dayj.format("D")}</div>
                            </Indicator>
                          </Indicator>
                        </>
                      );
                    }}
                  ></Calendar>
                </Paper>
              </Center>
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
                          marginLeft: "2rem",
                        }}
                      >
                        <Paper p="xs" withBorder>
                          <Center>
                            {orar.importante[orar.date.indexOf(currDate)] ==
                            true ? (
                              <Badge color="teal">IMPORTANT</Badge>
                            ) : null}
                          </Center>
                          <div
                            className="paper-content"
                            style={{
                              alignContent: "left",
                              alignItems: "left",
                              textAlign: "left",
                            }}
                          >
                            <div className="materie">
                              <Code>MATERIE:</Code>{" "}
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                  margin: "0.5rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {orar.materii[orar.date.indexOf(currDate)]}
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                            <div className="capitol">
                              <Code>CAPITOL:</Code>{" "}
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                  margin: "0.5rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {orar.capitole[orar.date.indexOf(currDate)]}
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                            <div className="ora">
                              <Code>ORA:</Code>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                  margin: "0.5rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {orar.ore[orar.date.indexOf(currDate)]}
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                            <div className="durata">
                              <Code>DURATA: </Code> &nbsp;
                              <Paper
                                p="0.4rem"
                                style={{
                                  backgroundColor: dark ? "#141517" : "#f1f3f5",
                                  display: "inline-block",
                                  paddingLeft: "0.7rem",
                                  paddingRight: "0.7rem",
                                  margin: "0.5rem",
                                }}
                              >
                                <Center>
                                  <Text
                                    color={dark ? "#98a7ab" : "#495057"}
                                    size="sm"
                                    weight={500}
                                  >
                                    {orar.durata[orar.date.indexOf(currDate)]}
                                  </Text>
                                </Center>
                              </Paper>
                            </div>
                          </div>
                        </Paper>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{ marginTop: "1rem" }}
                        >
                          <Text weight="600" size="sm">
                            Pune o întrebare despre ora aceasta
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            Întrebarea va fi publicată la secțiunea
                            <Badge color="gray">Întrebări</Badge> și orice
                            utliziator îți va putea răspunde.
                          </Text>
                          <Checkbox
                            label={"Doresc să rămân anonim"}
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            checked={anonim}
                            onChange={(event) =>
                              setAnonim(event.currentTarget.checked)
                            }
                          />
                          <TextInput
                            variant="default"
                            placeholder="Intrebare"
                            value={intrebare}
                            onChange={(event) =>
                              setIntrebare(event.currentTarget.value)
                            }
                            style={{
                              display: "inline-block",
                              width: "75%",
                              marginRight: "0.5rem",
                            }}
                          />
                          <Button
                            variant="default"
                            style={{ display: "inline-block" }}
                            onClick={() => {
                              addQuestion(
                                intrebare,
                                orar.materii[orar.date.indexOf(currDate)],
                                orar.capitole[orar.date.indexOf(currDate)],
                                anonim == true ? "Anonim" : user.displayName
                              );
                            }}
                          >
                            Intreaba
                          </Button>
                        </Paper>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{ marginTop: "1rem" }}
                        >
                          <Text weight="600" size="sm">
                            Completează ora
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            Pentru a completa ora, trebuie sa raspunzi corect la{" "}
                            cel puțin jumătate <br />
                            din întrebările care îți vor fi puse. Când ești
                            pregătit, apasă butonul de mai jos.
                          </Text>
                          <Button
                            variant="default"
                            style={{ marginTop: "0.5rem" }}
                            onClick={() => {}}
                          >
                            Generează întrebările
                          </Button>
                          <Button
                            variant="default"
                            style={{ marginTop: "0.5rem" }}
                            onClick={() => {
                              generateIntrebari(
                                orar.materii[orar.date.indexOf(currDate)],
                                orar.capitole[orar.date.indexOf(currDate)]
                              );
                              manageTest();
                            }}
                          >
                            Completează ora
                          </Button>
                        </Paper>
                      </Paper>
                    </Center>
                  ) : null
                }
              </Transition>
            </Paper>
            <Modal
              centered
              opened={testModal}
              onClose={() => setTestModal(false)}
              closeOnClickOutside={false}
              title={
                <Title order={4}>
                  Test {testMaterie}, {testCapitol}
                </Title>
              }
            >
              {currIntrebari.length > 0 ? (
                <>
                  <Paper shadow="xl" radius="md" p="md" withBorder>
                    <Text weight="600" size="sm">
                      {currIntrebari[pasTest].intrebare}
                    </Text>
                  </Paper>
                  <Center style={{ marginTop: "1rem" }}>
                    <SegmentedControl
                      value={segValue}
                      onChange={setSegValue}
                      orientation="vertical"
                      size="md"
                      data={[
                        {
                          value: currIntrebari[pasTest].raspunsuri[0],
                          label: currIntrebari[pasTest].raspunsuri[0],
                        },
                        {
                          value: currIntrebari[pasTest].raspunsuri[1],
                          label: currIntrebari[pasTest].raspunsuri[1],
                        },
                        {
                          value: currIntrebari[pasTest].raspunsuri[2],
                          label: currIntrebari[pasTest].raspunsuri[2],
                        },
                        {
                          value: currIntrebari[pasTest].raspunsuri[3],
                          label: currIntrebari[pasTest].raspunsuri[3],
                        },
                      ]}
                    />
                  </Center>
                </>
              ) : null}
              <Center style={{ marginTop: "1rem" }}>
                <Button
                  variant="default"
                  onClick={() => {
                    if (pasTest < currIntrebari.length - 1) {
                      if (
                        currIntrebari[pasTest].raspunsuri.indexOf(segValue) +
                          1 ==
                        currIntrebari[pasTest].raspunsCorect
                      ) {
                        setScore((value) => value + 1);
                      }
                      setPasTest((value) => value + 1);
                    } else {
                      if (
                        currIntrebari[pasTest].raspunsuri.indexOf(segValue) +
                          1 ==
                        currIntrebari[pasTest].raspunsCorect
                      ) {
                        setScore((value) => value + 1);
                      }
                      checkScore();
                      setTestModal(false);
                      setPasTest(0);
                    }
                  }}
                >
                  {pasTest < 3 ? "Următoarea întrebare" : "Finalizare"}
                </Button>
              </Center>
            </Modal>
            <Modal
              centered
              opened={openModal && windowDimension.winWidth < 720}
              onClose={() => setOpenModal(false)}
              title={<Title order={3}>{}</Title>}
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
                  <div
                    className="paper-content"
                    style={{
                      alignContent: "left",
                      alignItems: "left",
                      textAlign: "left",
                    }}
                  >
                    <div className="materie">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>MATERIE:</Code>{" "}
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.materii[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="capitol">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>CAPITOL:</Code>{" "}
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.capitole[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="ora">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>ORA:</Code>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.ore[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="durata">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "1rem" }}
                      >
                        <Code>DURATA: </Code> &nbsp;
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.durata[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                  </div>
                </>
              }
              {}
              {}
            </Modal>
          </Tabs.Tab>
        </Tabs>
      </Center>
    </div>
  );
};
export default View;
