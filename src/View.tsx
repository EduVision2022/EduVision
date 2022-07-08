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

  /*const sorted = orar.date.sort(sortByDate);
  const date = sorted.filter(function (item, pos) {
    return sorted.indexOf(item) == pos;
  });
  var aux = date[0];
  date[0] = date[date.length - 1];
  date[date.length - 1] = aux;*/

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

  const [value, setValue] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [currDate, setCurrDate] = useState(0);

  const [intrebare, setIntrebare] = useState("");
  const [anonim, setAnonim] = useState(false);

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
                      </Paper>
                    </Center>
                  ) : null
                }
              </Transition>
            </Paper>
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
