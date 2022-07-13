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

// Components imports
import Error401 from "./401Error.tsx";
import NotFoundTitle from "./404Page";
import Stats from "./Stats.tsx";
import Delayed from "./Delayed.tsx";

// Mantine imports
import { Paper } from "@mantine/core";
import { Avatar, AvatarsGroup } from "@mantine/core";
import { Center } from "@mantine/core";
import { Text } from "@mantine/core";
import { Container } from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import { Grid } from "@mantine/core";
import { Badge } from "@mantine/core";
import { Group } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { Stack } from "@mantine/core";
import { ScrollArea } from "@mantine/core";

// React imports
import { useId } from "react";
import { useState } from "react";
import { useEffect } from "react";
import dayjs, { locale } from "dayjs";
import "dayjs/locale/ro";

// Icons imports
import { Crown } from "tabler-icons-react";
import { BoxMultiple5 } from "tabler-icons-react";

// Custom styles imports
import "./blazingFire.css";
import "./bubbleFrame.css";
import "./rgbFrame.css";

const Profile = () => {
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

  const [user, loading, error] = useAuthState(auth);

  const [puncte, setPuncte] = useState(0);
  const [orare, setOrare] = useState(0);
  const [ore, setOre] = useState(0);
  const [registered, setRegistered] = useState(new Date());
  const [provider, setProvider] = useState("");
  const [maxPoints, setMaxPoints] = useState(0);
  const [items, setItems] = useState([]);
  const [activities, setActivities] = useState([]);

  const id = useId();

  useEffect(() => {
    if (
      user != undefined &&
      user != null &&
      auth != undefined &&
      auth != null
    ) {
      fetchPuncte();
      fetchOrare();
      fetchOre();
      fetchRegistered();
      fetchProvider();
      fetchMaxPoints();
      fetchItems();
      fetchActivities();
    }
  }, []);

  if (user == undefined || user == null || auth == undefined || auth == null) {
    return <Error401 />;
  }

  const fetchPuncte = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    setPuncte(document.data().puncte);
  };

  const fetchMaxPoints = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    setMaxPoints(document.data().maxPoints);
  };

  const fetchOrare = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    setOrare(document.data().orare.length);
  };

  const fetchOre = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const orare = document.data().orare;
    let ore = 0;
    for (let i = 0; i < orare.length; i++) {
      ore += orare[i].ore.length;
    }
    setOre(ore);
  };

  const fetchRegistered = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const registered = document.data().registered.toDate();
    setRegistered(registered);
  };

  const fetchProvider = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const proveider = document.data().authProvider;
    setProvider(proveider);
  };

  const fetchItems = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const items = document.data().items;
    setItems(items);
  };

  const fetchActivities = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const activities = document.data().recentActivities;
    setActivities(activities);
  };

  const setFormatDDMMYYYYtoMMDDYYYY = (date, separator = "/") => {
    const [day, month, year] = date.split("/");
    return month + separator + day + separator + year;
  };
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  dayjs.locale("ro");

  return (
    <div className="ontop" style={{ minHeight: "71vh" }}>
      <Delayed>
        <div className="profile" style={{ height: "auto", minHeight: "71vh" }}>
          <Center>
            <Paper
              radius="md"
              p="md"
              withBorder
              style={{ margin: "2rem", display: "flex", width: "70rem" }}
            >
              <Paper radius="md" p="md" withBorder>
                <Center>
                  <Avatar
                    src={user.photoURL}
                    referrerpolicy="no-referrer"
                    size="xl"
                    radius="50%"
                    className={
                      items.includes("electricborder")
                        ? "box"
                        : items.includes("bubbleborder")
                        ? "Bubble"
                        : ""
                    }
                  ></Avatar>
                </Center>
                <div className="nume" style={{ display: "inline-block" }}>
                  <h3
                    style={{
                      display: "inline-block",
                      marginBottom: "1rem",
                      marginTop: "1rem",
                    }}
                    className={items.includes("blazingfire") ? "Blazing" : ""}
                  >
                    {user.displayName}
                  </h3>
                  <Text
                    size="sm"
                    color="dimmed"
                    weight={600}
                    style={{ marginTop: "-1rem" }}
                  >
                    {user.email}
                  </Text>
                </div>
                <Center>
                  <Group>
                    <div className="status">
                      {maxPoints >= 0 && maxPoints < 100 ? (
                        <Badge color="dark">Începător</Badge>
                      ) : null}
                      {maxPoints >= 100 && maxPoints < 200 ? (
                        <Badge style={{ color: "#a4a9b2" }}>Ambiţios</Badge>
                      ) : null}
                      {maxPoints >= 200 && maxPoints < 300 ? (
                        <Badge color="teal">Expert</Badge>
                      ) : null}
                      {maxPoints >= 300 && maxPoints < 400 ? (
                        <Badge color="violet">As</Badge>
                      ) : null}
                      {maxPoints >= 400 ? (
                        <Badge color="yellow" leftSection={<Crown size={12} />}>
                          Geniu
                        </Badge>
                      ) : null}
                      {orare >= 5 ? (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "teal", to: "blue", deg: 60 }}
                          leftSection={<BoxMultiple5 size={12} />}
                        >
                          Veteran
                        </Badge>
                      ) : null}
                    </div>
                  </Group>
                </Center>
              </Paper>
              <Grid style={{ marginRight: "auto" }}>
                <Grid.Col span={10}>
                  <Grid
                    align="flex-start"
                    columns={3}
                    grow
                    style={{ marginLeft: "2rem" }}
                  >
                    <Grid.Col span={1}>
                      <Stats
                        title="Puncte"
                        value={puncte}
                        diff={puncte}
                        id={id}
                      />
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <Stats title="Orare" value={orare} diff={orare} id={id} />
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <Stats title="Ore" value={ore} diff={ore} id={id} />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Paper
                    radius="md"
                    p="md"
                    withBorder
                    style={{
                      marginLeft: "2.5rem",
                      textAlign: "left",
                    }}
                  >
                    <div
                      className="achivements"
                      style={{ display: "inline-block" }}
                    >
                      <Text
                        weight={600}
                        color="dimmed"
                        style={{ display: "inline-block" }}
                      >
                        Realizări:
                      </Text>{" "}
                      <Group>
                        {maxPoints >= 0 ? (
                          <Tooltip
                            label="Realizare primită pentru că ți-ai creat un cont"
                            withArrow
                          >
                            <Badge color="dark">Începător</Badge>
                          </Tooltip>
                        ) : null}
                        {maxPoints >= 100 ? (
                          <Tooltip
                            label="Realizare primită pentru că ai depășit 100 de puncte"
                            withArrow
                          >
                            <Badge style={{ color: "#a4a9b2" }}>Ambiţios</Badge>
                          </Tooltip>
                        ) : null}
                        {maxPoints >= 200 ? (
                          <Tooltip
                            label="Realizare primită pentru că ai depășit 200 de puncte"
                            withArrow
                          >
                            <Badge color="teal">Expert</Badge>
                          </Tooltip>
                        ) : null}
                        {maxPoints >= 300 ? (
                          <Tooltip
                            label="Realizare primită pentru că ai depășit 300 de puncte"
                            withArrow
                          >
                            <Badge color="violet">As</Badge>
                          </Tooltip>
                        ) : null}
                        {maxPoints >= 400 ? (
                          <Tooltip
                            label="Realizare primită pentru că ai depășit 400 de puncte"
                            withArrow
                          >
                            <Badge
                              color="yellow"
                              leftSection={<Crown size={12} />}
                            >
                              Geniu
                            </Badge>
                          </Tooltip>
                        ) : null}
                        {orare >= 5 ? (
                          <Tooltip
                            label="Realizare primită pentru că ai creat cel puțin 5 orare"
                            withArrow
                          >
                            <Badge
                              variant="gradient"
                              gradient={{ from: "teal", to: "blue", deg: 60 }}
                              leftSection={<BoxMultiple5 size={12} />}
                            >
                              Veteran
                            </Badge>
                          </Tooltip>
                        ) : null}
                      </Group>
                    </div>
                  </Paper>
                </Grid.Col>
              </Grid>
              {windowDimension.winWidth > 720 ? (
                <Paper
                  radius="md"
                  p="md"
                  withBorder
                  style={{ marginLeft: "-8rem" }}
                >
                  <Text weight={600} color="dimmed">
                    Înregistrat la:
                  </Text>
                  <Paper radius="md" p="xs" withBorder>
                    <Text weight={600} size="sm">
                      {dayjs(registered).format("D MMMM YYYY, HH:mm")}
                    </Text>
                  </Paper>
                  <Text
                    weight={600}
                    color="dimmed"
                    style={{ marginTop: "0.5rem" }}
                  >
                    Înregistrat cu:
                  </Text>
                  <Paper radius="md" p="xs" withBorder>
                    <Text weight={600} size="sm">
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </Text>
                  </Paper>
                </Paper>
              ) : null}
            </Paper>
          </Center>
          <Center>
            <Paper radius="md" p="md" withBorder>
              <Text weight={600} color="dimmed">
                Activități recente:
              </Text>
              <ScrollArea
                type="hover"
                style={{ height: activities.length > 5 ? "15rem" : "auto" }}
              >
                {activities.map((activity) => (
                  <>
                    <div
                      style={{
                        alignContent: "left",
                        alignItems: "left",
                        textAlign: "left",
                        display: "flex",
                        marginTop: "1rem",
                      }}
                    >
                      <Stack spacing={0} align="flex-start">
                        <Text
                          weight={600}
                          color="dimmed"
                          size="sm"
                          style={{
                            marginTop: "0.3rem",
                            display: "inline-block",
                          }}
                        >
                          {activity.date.toDate().toLocaleDateString("ro-RO")}
                        </Text>
                        <Text
                          weight={600}
                          color="dimmed"
                          size="sm"
                          style={{
                            display: "inline-block",
                          }}
                        >
                          {activity.date.toDate().toLocaleTimeString("ro-RO")}
                        </Text>
                      </Stack>
                      <Center
                        style={{ display: "inline-block", marginLeft: "1rem" }}
                      >
                        <Paper
                          radius="md"
                          p="xs"
                          withBorder
                          style={{
                            marginTop: "0.5rem",
                            display: "inline-block",
                          }}
                        >
                          <Text weight={600} size="sm"></Text>
                          <Text weight={600} size="md">
                            {activity.description}
                            {activity.price > 0 ? (
                              <>
                                {" "}
                                pentru{" "}
                                <Text
                                  weight={800}
                                  color="green"
                                  style={{ display: "inline-block" }}
                                >
                                  {activity.price}
                                </Text>{" "}
                                puncte
                              </>
                            ) : null}
                          </Text>
                        </Paper>
                      </Center>
                    </div>
                  </>
                ))}
              </ScrollArea>
            </Paper>
          </Center>
        </div>
      </Delayed>
    </div>
  );
};
export default Profile;
