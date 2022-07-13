// @ts-nocheck
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

// React imports
import { useEffect } from "react";
import { useState } from "react";

// Mantine imports
import {
  Accordion,
  AccordionProps,
  createStyles,
  TextInput,
} from "@mantine/core";
import { Badge } from "@mantine/core";
import { Paper } from "@mantine/core";
import { Text } from "@mantine/core";
import { Code } from "@mantine/core";
import { Button } from "@mantine/core";
import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { Center } from "@mantine/core";
import { Notification } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { LoadingOverlay } from "@mantine/core";

// Icons Imports
import { Plus } from "tabler-icons-react";
import { stringify } from "@firebase/util";
import dayjs from "dayjs";
import { Check, X } from "tabler-icons-react";

// Components imports
import Error401 from "./401Error.tsx";
import NotFoundTitle from "./404Page";

import { usePointsContext } from "./points.tsx";

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
  return (
    <Accordion classNames={classes} icon={<Plus size={16} />} {...props} />
  );
}

const Intrebari = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [pointsProvider, setPointsProvider] = usePointsContext();

  const [value, setValue] = useState(0);

  const [user, loading, error] = useAuthState(auth);

  const [visible, setVisible] = useState(true);

  var intrebari = [];
  var idIntrebari = [];

  const [intrebariFinal, setIntrebariFinal] = useState([]);
  const [idIntrebariFinal, setIdIntrebariFinal] = useState([]);

  const [raspuns, setRaspuns] = useState("");

  const fetchQuestions = async () => {
    const q = await getDocs(collection(db, "intrebari"));
    q.forEach((doc) => {
      intrebari.push(doc.data());
      idIntrebari.push(doc.id);
      //console.log("INTREBARE: ", doc.data());
      //console.log("INTREBARI: ", intrebari);
    });
  };

  var raspunsuri = [];
  var autoriRaspunsuri = [];
  var dateRaspunsuri = [];
  const [raspunsuriFinal, setRaspunsuriFinal] = useState([]);
  const [autoriRaspunsuriFinal, setAutoriRaspunsuriFinal] = useState([]);
  const [dateRaspunsuriFinal, setDateRaspunsuriFinal] = useState([]);

  const [shouldReload, setShouldReload] = useState(false);

  const [update, setUpdate] = useState(false);

  const fetchAnswers = async (id) => {
    raspunsuri = [];
    autoriRaspunsuri = [];
    dateRaspunsuri = [];
    await setRaspunsuriFinal([]);
    setAutoriRaspunsuriFinal([]);
    await setDateRaspunsuriFinal([]);
    const docRef = doc(db, "intrebari", id);
    const docSnap = await getDoc(docRef);
    const docRaspunsuri = docSnap.data().raspuns;

    autoriRaspunsuri.push(docSnap.data().autoriRaspunsuri);
    dateRaspunsuri.push(docSnap.data().dateRaspunsuri);
    setRaspunsuriFinal(docRaspunsuri);
    setAutoriRaspunsuriFinal(docSnap.data().autoriRaspunsuri);
    setDateRaspunsuriFinal(docSnap.data().dateRaspunsuri);
  };

  useEffect(() => {
    Reload();
    setTimeout(function () {
      setVisible((value) => !value);
    }, 1000);
  }, []);

  const Reload = async () => {
    fetchQuestions();
    setIntrebariFinal(intrebari);
    setIdIntrebariFinal(idIntrebari);
  };

  if (auth == null || auth == undefined || user == null || user == undefined) {
    return <Error401 />;
  }

  interface AnswerProps {
    id: string;
    raspuns: string;
  }

  const addAnswer = async (id: string, raspuns: string) => {
    const docRef = doc(db, "intrebari", id);
    const docSnap = await getDoc(docRef);
    await setDoc(
      docRef,
      {
        raspuns: [...docSnap.data().raspuns, raspuns],
        autoriRaspunsuri: [
          ...(docSnap.data().autoriRaspunsuri == undefined || null
            ? []
            : docSnap.data().autoriRaspunsuri),
          user.displayName,
        ],
        dateRaspunsuri: [
          ...(docSnap.data().dateRaspunsuri == undefined || null
            ? []
            : docSnap.data().dateRaspunsuri),
          new Date(),
        ],
      },
      { merge: true }
    );
    //console.log(docSnap.data());
  };

  /*
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      console.log(q);
      const aux = await getDocs(q);
      const document = aux.docs[0];
      console.log(document.id);

      await setDoc(
        doc(db, "users", document.id),
        { orare: [...document.data().orare, orarGenerat] },
        { merge: true }
      );
  */

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

  interface AccordionLabelProps {
    materie: string;
    capitol: string;
    raspunsuri: [];
  }

  function AccordionLabel({
    materie,
    capitol,
    raspunsuri,
  }: AccordionLabelProps) {
    return (
      <>
        <Text style={{ display: "inline-block" }} weight="600" size="lg">
          {materie}
        </Text>
        {", "}
        <Text style={{ display: "inline-block" }}>{capitol}</Text>
        {raspunsuri.length > 0 ? (
          <Badge color="green" style={{ marginLeft: "1rem" }}>
            {" "}
            {raspunsuri.length} răspunsuri{" "}
          </Badge>
        ) : (
          <Badge color="red" style={{ marginLeft: "1rem" }}>
            {" "}
            {raspunsuri.length} răspunsuri{" "}
          </Badge>
        )}
      </>
    );
  }

  interface IntrebareProps {
    intrebare: string;
    autor: string;
    materie: string;
    capitol: string;
    raspuns: [];
  }

  interface IdIntrebareProps {
    id: string;
  }

  const setFormatDDMMYYYYtoMMDDYYYY = (date, separator = "/") => {
    const [day, month, year] = date.split("/");
    return month + separator + day + separator + year;
  };
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  dayjs.locale("ro");

  return (
    <div className="intrebari" style={{ height: "auto", minHeight: "71vh" }}>
      <LoadingOverlay visible={visible} />
      <Center>
        <Paper shadow="xs" radius="md" withBorder style={{ margin: "2rem" }}>
          <StyledAccordion style={{ margin: "1rem" }}>
            {intrebariFinal.map((intrebare: IntrebareProps, index) => (
              <Accordion.Item
                label={
                  <AccordionLabel
                    materie={intrebare.materie}
                    capitol={intrebare.capitol}
                    raspunsuri={intrebare.raspuns}
                  />
                }
                onClick={() => {
                  fetchAnswers(idIntrebariFinal[index]);
                }}
                key={index}
              >
                <div
                  className="accordion-content"
                  style={{ textAlign: "left" }}
                >
                  <div className="intrebare">
                    <Text weight="600" size="sm">
                      Enunț
                    </Text>
                    <Paper radius="md" p="xs" withBorder>
                      <Text weight="500">{intrebare.intrebare}</Text>
                    </Paper>
                  </div>
                  <div className="autor" style={{ marginTop: "1rem" }}>
                    <Text weight="600" size="sm">
                      Autor
                    </Text>
                    <Paper radius="md" p="xs" withBorder>
                      <Text weight="500">{intrebare.autor}</Text>
                    </Paper>
                  </div>
                  <div className="raspunsuri" style={{ marginTop: "1rem" }}>
                    <Text weight="600" size="sm">
                      Răspunsuri
                    </Text>
                    {raspunsuriFinal.map((raspuns, index) => (
                      <div className="raspuns" key={raspuns + index}>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{
                            margin: "1rem",
                          }}
                        >
                          <Text weight="600">
                            {autoriRaspunsuriFinal[index]}
                          </Text>
                          <Text weight="600" size="sm" color="dimmed">
                            {dayjs(
                              new Date(dateRaspunsuriFinal[index].toDate())
                            ).format("D MMMM, HH:mm")}
                          </Text>
                          <Paper shadow="sm" radius="md" p="sm" withBorder>
                            {raspuns}
                          </Paper>
                        </Paper>
                      </div>
                    ))}
                  </div>
                  <div className="input" style={{ display: "inline-block" }}>
                    <TextInput
                      style={{ display: "inline-block", width: "270px" }}
                      label="Adaugă răspunsul tău"
                      placeholder="Răspuns"
                      value={raspuns}
                      onChange={(event) =>
                        setRaspuns(event.currentTarget.value)
                      }
                    />
                    <Button
                      variant="default"
                      style={{ display: "inline-block", marginLeft: "0.4rem" }}
                      onClick={() => {
                        addAnswer(idIntrebariFinal[index], raspuns);
                        addPoints(100);
                        setPointsProvider(true);
                        showNotification({
                          title: "Răspunsul tău a fost adăugat!",
                          message: "Ai primit 100 puncte!",
                          autoClose: 2000,
                          color: "green",
                          icon: <Check />,
                        });
                      }}
                    >
                      Adaugă răspuns
                    </Button>
                  </div>
                </div>
              </Accordion.Item>
            ))}
          </StyledAccordion>
        </Paper>
      </Center>
    </div>
  );
};
export default Intrebari;
