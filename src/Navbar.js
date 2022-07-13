import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  Burger,
  Center,
  Box,
  UnstyledButton,
  Text,
  Autocomplete,
  Select,
  Menu,
  Button,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import {
  BrandTwitter,
  BrandYoutube,
  BrandInstagram,
  HeartMinus,
  TiltShift,
} from "tabler-icons-react";
import { useMantineColorScheme } from "@mantine/core";
import Theme from "./Theme";
import { Avatar, AvatarsGroup } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "tabler-icons-react";
import { SquareCheck, Package, Users, Calendar } from "tabler-icons-react";
import { Logout } from "tabler-icons-react";
import { CalendarEvent } from "tabler-icons-react";
import { QuestionMark } from "tabler-icons-react";
import { User } from "tabler-icons-react";
import { Badge } from "@mantine/core";
import { Crown } from "tabler-icons-react";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { Login } from "tabler-icons-react";

import UpdateContext from "./App";

// Redux
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setUser,
  selectUsername,
  selectPicture,
  selectEmail,
  selectShouldUpdate,
  selectUser,
} from "./userSlice";

// Images
import logoLight from "./images/logoLight.png";
import logoDark from "./images/logoDark.png";

import { auth, SignInWithGoogle, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, getDocs } from "firebase/firestore";
import { getFirestore, query, collection, where } from "firebase/firestore";
import { db } from "./firebase";

// Custom style import
import "./blazingFire.css";
import "./bubbleFrame.css";
import "./rgbFrame.css";

// Providers
import { usePointsContext } from "./points.tsx";

const useStyles = createStyles((theme) => ({
  user2: {
    backgroundColor: theme.colors.violet[6],
  },
  user: {
    background: "transparent",
    display: "block",
    borderRadius: "10px",
    height: "45px",
    width: "auto",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    position: "absolute",
    left: "2rem",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  inner: {
    display: "flex ",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    width: "100%",
    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    width: 260,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  social: {
    width: 260,

    [theme.fn.smallerThan("sm")]: {
      width: "auto",
      marginLeft: "auto",
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

class HeaderProps {
  constructor(link, label) {
    this.link = link;
    this.label = label;
  }
}

var links = [];
for (var i = 0; i <= 2; i++) {
  links[i] = new HeaderProps("/about", "Testing" + i);
}

links[0] = new HeaderProps("/about", "About");
links[1] = new HeaderProps("/contact", "Contact");
links[2] = new HeaderProps("/store", "Store");

const logOut = () => {
  signOut(auth);
};

export function HeaderMiddle() {
  function refreshPage() {
    window.location.reload(false);
  }

  const update = useContext(UpdateContext);

  const history = useHistory();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(null);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const username = useSelector(selectUsername);
  const profilepicture = useSelector(selectPicture);
  const email = useSelector(selectEmail);
  const shouldUpdate = useSelector(selectShouldUpdate);
  const UserObject = useSelector(selectUser);
  const dispatch = useDispatch();

  const [pointsProvider, setPointsProvider] = usePointsContext();

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("Guest");
  const [profilepic, setProfilepic] = useState("");
  const [mail, setMail] = useState("");

  const [puncte, setPuncte] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);

  const [maxPoints, setMaxPoints] = useState(0);

  const [boughtItems, setBoughtItems] = useState([]);

  const redirectTo = (input) => {
    history.push(input);
  };

  const fetchUserName = async () => {
    try {
      console.log("AUTH:", user);
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setProfilepic(data.picture);
      setMail(data.email);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUserName();
    fetchPuncte();
  }, [user, loading]);

  console.log("Points: ", pointsProvider);

  const fetchPuncte = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    console.log("PUNCTE NAVBAR: ", document.data().puncte);
    setPuncte(document.data().puncte);
    setMaxPoints(document.data().maxPoints);
    //sets items
    setBoughtItems(document.data().items);
  };

  console.log("pointsProvider", pointsProvider);

  if (pointsProvider) {
    fetchPuncte();
    setTimeout(() => {
      setPointsProvider(false);
    }, 1000);
  }

  const resetLogin = () => {
    logOut();
    setLoggedIn(false);
    setName("Guest");
    setProfilepic("");
    setMail("");
    history.push("/");
  };

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

  const rewards = (puncte) => {
    return (
      <div className="status">
        {maxPoints >= 0 && maxPoints < 100 ? (
          <Badge color="dark">Începător</Badge>
        ) : null}
        {maxPoints >= 100 && maxPoints < 200 ? (
          <Badge style={{ color: "#a4a9b2" }}>Intermediar</Badge>
        ) : null}
        {maxPoints >= 200 && maxPoints < 300 ? (
          <Badge color="teal">Semi-avansat</Badge>
        ) : null}
        {maxPoints >= 300 && maxPoints < 400 ? (
          <Badge color="violet">Avansat</Badge>
        ) : null}
        {maxPoints >= 400 ? (
          <Badge color="yellow" leftSection={<Crown size={12} />} size="xs">
            Legendă
          </Badge>
        ) : null}
      </div>
    );
  };

  const items = links.map((link) => (
    <a
      key={link.label}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        history.push(link.link);
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));
  console.log("current Pathname 👉️", window.location.hash);

  return (
    <Header height={56}>
      <Container className={classes.inner}>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          size="sm"
          className={classes.burger}
        />
        <Menu
          className={classes.user}
          control={
            <Button
              rightIcon={<ChevronDown size={18} />}
              sx={{ paddingRight: 12 }}
              className={classes.user}
            >
              <Avatar
                src={user?.photoURL ? user.photoURL : null}
                referrerpolicy="no-referrer"
                radius="xl"
                style={{ marginRight: "10px" }}
                className={
                  boughtItems.includes("electricborder")
                    ? "box"
                    : boughtItems.includes("bubbleborder")
                    ? "Bubble"
                    : ""
                }
              ></Avatar>
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  <div
                    className={
                      boughtItems.includes("blazingfire") ? "Blazing" : ""
                    }
                  >
                    {name ? name : "Guest"}
                  </div>
                </Text>
                {loggedIn ? (
                  <Group>
                    <Text
                      color="dimmed"
                      size="xs"
                      style={{ display: "inline-block" }}
                    >
                      <div
                        className="reward"
                        style={{ display: "inline-block" }}
                      >
                        {rewards(maxPoints)}
                      </div>
                      <div
                        className="puncte"
                        style={{
                          display: "inline-block",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {puncte} puncte
                      </div>
                    </Text>
                  </Group>
                ) : null}
              </div>
            </Button>
          }
          transition="pop-top-right"
          placement="end"
          size="lg"
        >
          {loggedIn ? (
            <>
              <Menu.Item
                icon={<User size={16} color={theme.colors.orange[6]} />}
                rightSection={
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Ctrl + U
                  </Text>
                }
                onClick={() => {
                  redirectTo("/profile");
                }}
              >
                Profil
              </Menu.Item>
              <Menu.Item
                icon={<QuestionMark size={16} color={theme.colors.orange[6]} />}
                rightSection={
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Ctrl + I
                  </Text>
                }
                onClick={() => {
                  redirectTo("/intrebari");
                }}
              >
                Întrebări
              </Menu.Item>
              <Menu.Item
                icon={<CalendarEvent size={16} color={theme.colors.blue[6]} />}
                rightSection={
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Ctrl + O
                  </Text>
                }
                onClick={() => {
                  redirectTo("/orare");
                }}
              >
                Orare
              </Menu.Item>
              <Menu.Item
                icon={<Logout size={16} color={theme.colors.violet[6]} />}
                rightSection={
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Ctrl + L
                  </Text>
                }
                onClick={() => {
                  resetLogin();
                }}
              >
                Log Out
              </Menu.Item>
            </>
          ) : (
            <Menu.Item
              icon={<Login size={16} color={theme.colors.blue[6]} />}
              rightSection={
                <Text
                  size="xs"
                  transform="uppercase"
                  weight={700}
                  color="dimmed"
                >
                  Ctrl + L
                </Text>
              }
              onClick={() => {
                history.push("/");
              }}
            >
              Log In
            </Menu.Item>
          )}
        </Menu>

        {windowDimension.winWidth > 720 ? (
          <Group className={classes.links} spacing={5}>
            {items}
          </Group>
        ) : null}

        {/* LOGO */}
        {windowDimension.winWidth > 1080 ? (
          <Center
            style={{ height: 54 }}
            onClick={() => {
              history.push("/");
              setActive(null);
            }}
          >
            {dark ? (
              <img src={logoDark} width="48px" height="48px" />
            ) : (
              <img src={logoLight} width="48px" height="48px" />
            )}
            <Text>
              <Text size="xl" weight={700}>
                EduVision
              </Text>
            </Text>
          </Center>
        ) : null}
        {windowDimension.winWidth > 1080 ? (
          <>
            <Group
              spacing={0}
              className={classes.social}
              position="right"
              noWrap
            >
              <ActionIcon size="lg">
                <BrandTwitter size={18} />
              </ActionIcon>
              <ActionIcon size="lg">
                <BrandYoutube size={18} />
              </ActionIcon>
              <ActionIcon size="lg">
                <BrandInstagram size={18} />
              </ActionIcon>
            </Group>
          </>
        ) : null}
        {windowDimension.winWidth < 720 ? (
          <Group position="right" style={{ marginLeft: "78vw" }}>
            <Theme />
          </Group>
        ) : (
          <Group position="right">
            <Theme />
          </Group>
        )}
      </Container>
    </Header>
  );
}
export default HeaderMiddle;
