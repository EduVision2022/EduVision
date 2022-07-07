import { SimpleGrid, Text, Title, Paper } from "@mantine/core";
import NotFoundTitle from "./404Page";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useId } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  selectUsername,
  selectObject,
  selectEmail,
} from "./userSlice";
import { auth, SignInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { addDoc, getDocs } from "firebase/firestore";
import { logout, db } from "./firebase";
import { getFirestore, query, collection, where } from "firebase/firestore";
import {
  Card,
  Image,
  Badge,
  Button,
  Group,
  useMantineTheme,
} from "@mantine/core";
import orarPNG from "./images/orar.png";
import orarPreview1 from "./images/orarPreview1.png";
import orarPreview2 from "./images/orarPreview2.png";
import orarPreviewDark from "./images/orarPreviewDark.png";
import orarPreviewDark2 from "./images/orarPreviewDark2.png";
import { useMantineColorScheme } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { Edit } from "tabler-icons-react";
import { Modal } from "@mantine/core";

import Error401 from "./401Error.tsx";
import Delayed from "./Delayed.tsx";

const Orare = () => {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [user, loading, error] = useAuthState(auth);

  const [orare, setOrare] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const history = useHistory();

  const fetchOrare = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    setOrare(document.data().orare);
  };

  const deleteOrar = async () => {};

  useEffect(() => {
    if (user) {
      fetchOrare();
    }
  }, []);

  interface Orare {
    nume: string;
    important: boolean;
    descriere: string;
    date: [];
    ore: [];
    durata: [];
    materii: [];
    capitole: [];
    importante: [];
  }

  return (
    <div className="ontop" style={{ height: "auto", minHeight: "65vh" }}>
      <Delayed>
        <>
          <div className="orare" style={{ height: "auto", minHeight: "65vh" }}>
            {user == null ||
            user == undefined ||
            auth == null ||
            auth == undefined ? (
              <Error401 />
            ) : orare.length == 0 ? (
              <NotFoundTitle />
            ) : null}

            <SimpleGrid cols={5} style={{ margin: "3rem" }}>
              {orare.map(
                (orar: Orare, index) => (
                  console.log("ORAR", orar),
                  (
                    <div style={{ width: 340, margin: "auto" }}>
                      <Card shadow="sm" p="lg" withBorder>
                        <Card.Section>
                          <Image
                            src={dark ? orarPreviewDark2 : orarPreview1}
                            height={180}
                            alt="Orar"
                          />
                        </Card.Section>

                        <Group
                          position="apart"
                          style={{
                            marginBottom: 5,
                            marginTop: theme.spacing.sm,
                          }}
                        >
                          <Text weight={500}>{orar.nume}</Text>
                          {orar.important ? (
                            <Badge
                              color={dark ? "violet" : "blue"}
                              variant="light"
                            >
                              IMPORTANT
                            </Badge>
                          ) : null}
                        </Group>

                        <Text
                          color="dimmed"
                          size="sm"
                          style={{
                            alignContent: "left",
                            alignItems: "left",
                            textAlign: "left",
                          }}
                        >
                          {orar.descriere}
                        </Text>
                        <Button
                          variant="light"
                          color="blue"
                          fullWidth
                          style={{ marginTop: 14 }}
                          onClick={() => {
                            history.push({
                              pathname: "/orare/view",
                              state: {
                                orar: orar,
                              },
                            });
                          }}
                        >
                          Go
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          style={{
                            marginTop: 14,
                            width: "145px",
                            float: "left",
                          }}
                          leftIcon={<Trash />}
                          onClick={() => {
                            setOpenModal(true);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="light"
                          color="gray"
                          style={{
                            marginTop: 14,
                            width: "145px",
                            float: "right",
                          }}
                          leftIcon={<Edit />}
                        >
                          Edit
                        </Button>
                        <Modal
                          centered
                          overlayColor={
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[9]
                              : theme.colors.gray[2]
                          }
                          overlayOpacity={0.55}
                          overlayBlur={3}
                          opened={openModal}
                          onClose={() => {
                            setOpenModal(false);
                          }}
                          title="AVERTIZARE"
                        >
                          <Paper shadow="xl" p="md" radius="md" withBorder>
                            <Text size="md" style={{ display: "inline-block" }}>
                              <Badge radius="sm" p="3px" size="lg">
                                Atentie!
                              </Badge>{" "}
                              Aceasta actiune va{" "}
                              <Text
                                color="red"
                                style={{ display: "inline-block" }}
                              >
                                {" "}
                                <Badge color="red" radius="sm" p="3px">
                                  sterge
                                </Badge>
                              </Text>{" "}
                              definitiv si ireversibil orarul din contul tau.
                            </Text>
                          </Paper>
                          <Button
                            color="red"
                            variant="filled"
                            style={{
                              float: "right",
                              marginRight: "1.5rem",
                              marginTop: "1rem",
                            }}
                            onClick={() => {
                              deleteOrar(orar.nume);
                              setOpenModal(false);
                            }}
                          >
                            STERGE
                          </Button>
                          <Button
                            variant="light"
                            style={{
                              float: "left",
                              marginLeft: "1rem",
                              marginTop: "1rem",
                            }}
                            onClick={() => {
                              setOpenModal(false);
                            }}
                          >
                            ANULEAZA
                          </Button>
                        </Modal>
                      </Card>
                    </div>
                  )
                )
              )}
            </SimpleGrid>
          </div>
        </>
      </Delayed>
    </div>
  );
};
export default Orare;
