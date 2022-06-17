import { React, useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser, selectUsername } from "./userSlice";
// Mantine UI Imports
import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Transition,
  Box,
} from "@mantine/core";
import { Check, InfoCircle } from "tabler-icons-react";
import image from "./image.svg";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import { Header, Burger, Center } from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import {
  BrandTwitter,
  BrandYoutube,
  BrandInstagram,
  HeartMinus,
  TiltShift,
} from "tabler-icons-react";
import Theme from "./Theme";
import { Avatar } from "@mantine/core";
import { Notification } from "@mantine/core";
import { X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { CircleCheck, CircleDashed } from "tabler-icons-react";
import { SimpleGrid } from "@mantine/core";
import { Divider } from "@mantine/core";
import { Timeline } from "@mantine/core";

// Login Imports
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// Image imports
import logoLight from "./images/logoLight.png";
import logoDark from "./images/logoDark.png";
import backgroundLight from "./images/test.png";
import backgroundDark from "./images/image.png";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.2)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: "0px 6px",
  },
}));

function navigate(href, newTab) {
  var a = document.createElement("a");
  a.href = href;
  if (newTab) {
    a.setAttribute("target", "_blank");
  }
  a.click();
}

const Home = () => {
  const user = useSelector(selectUsername);
  const dispatch = useDispatch();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes } = useStyles();

  const [loggedin, setLoggedin] = useState(false);

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

  return (
    <div className="Home">
      <div
        style={{
          background: dark
            ? "url(" + backgroundDark + ")"
            : "url(" + backgroundLight + ")",
          height: "120vh",
          paddingTop: "10vh",
        }}
      >
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Edu<span className={classes.highlight}>Vision</span> <br />{" "}
              </Title>
              <Text color="dimmed" mt="md">
                Generează orare de învățare pentru Bacalaureat în 3 pași simpli
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="primary" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
                style={{
                  alignContent: "left",
                  alignItems: "left",
                  textAlign: "left",
                  paddingTop: "2rem",
                }}
              >
                <List.Item>
                  <b>Relevanță</b> - orare care pun accent pe dificultățile
                  elevului
                </List.Item>
                <List.Item>
                  <b>Testat</b> - orare testate chiar de către elevi
                </List.Item>
                <List.Item>
                  <b>Personalizat</b> - orare personalizate pentru elevi
                </List.Item>
                <List.Item>
                  <b>Rapid</b> - orare care sunt generate în mod rapid
                </List.Item>
                <List.Item>
                  <b>Securizat</b> - orare care sunt generate în mod securizat
                </List.Item>
              </List>
              <Group mt={30}>
                {loggedin ? (
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    className={classes.control}
                    onClick={() => {
                      document
                        .getElementById("second")
                        .scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Get started
                  </Button>
                ) : (
                  <GoogleLogin
                    theme={dark ? "filled_black" : "filled_light"}
                    shape="pill"
                    onSuccess={(credentialResponse) => {
                      var decoded = jwt_decode(credentialResponse.credential);
                      console.log(decoded.email);
                      setLoggedin(true);
                      dispatch(
                        setUser({
                          name: decoded.name,
                          email: decoded.email,
                          picture: decoded.picture,
                        })
                      );
                      showNotification({
                        id: "hello-there",
                        disallowClose: false,
                        onClose: () => console.log("unmounted"),
                        onOpen: () => console.log("mounted"),
                        autoClose: 5000,
                        title: "Logged In",
                        message:
                          "You logged in successfully as " + decoded.name,
                        color: "teal",
                        icon: <Check size={18} />,
                        className: "my-notification-class",
                        loading: false,
                      });
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    useOneTap
                  />
                )}

                <Button
                  variant="default"
                  radius="xl"
                  size="md"
                  className={classes.control}
                  onClick={() => {
                    if (!loggedin) {
                      document
                        .getElementById("second")
                        .scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate("https://github.com/", true);
                    }
                  }}
                >
                  {loggedin ? "Source code" : "Learn more"}
                </Button>
              </Group>
            </div>
            <Image src={image} className={classes.image} />
          </div>
        </Container>

        <Container style={{ paddingTop: "80vh" }}>
          <SimpleGrid
            cols={3}
            style={{ alignContent: "center", alignItems: "center" }}
          >
            <div>
              <h3 className="text-center ">
                <span className="text-white" style={{ fontSize: "5rem" }}>
                  <b>100</b>
                  <br />
                </span>
                <span className="text-white">orare generate</span>
              </h3>
            </div>
            <Divider
              size="xs"
              color={dark ? "grey" : "grey"}
              orientation="vertical"
              style={{
                left: "50%",
                transform: "translate(50%, 10%)",
              }}
            />
            <div style={{ paddingTop: "2.5rem" }}>
              <h2 className="text-5xl md:text-7xl leading-[1.05] mb-2 flex">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                </svg>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  className="-ml-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                </svg>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  className="-ml-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                </svg>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  className="-ml-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                </svg>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  className="-mx-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                </svg>
              </h2>
              <h3 className="h3 mb-0">Votat de elevi</h3>
            </div>
          </SimpleGrid>
        </Container>
      </div>
      <div className="second" id="second">
        {!loggedin ? (
          <Container>
            <Title order={3} style={{ paddingTop: "2rem" }}>
              HOW EDUVISION WORKS
            </Title>
            <Title order={2} style={{ paddingTop: "2rem" }}>
              Generează orare de învățare în 3 pași simpli
            </Title>
            <Timeline
              active={2}
              style={{
                paddingTop: "3rem",
                transform:
                  windowDimension.winWidth < 720
                    ? "translateX(0%)"
                    : "translateX(35%)",
              }}
            >
              <Timeline.Item title="Completează un formular">
                <Text color="dimmed" size="sm">
                  Obținem câteva informații despre timpul tău
                </Text>
              </Timeline.Item>
              <Timeline.Item title="Rezolvă un test">
                <Text color="dimmed" size="sm">
                  Determinăm nivelul tău de pregătire
                </Text>
              </Timeline.Item>
              <Timeline.Item title="Învață">
                <Text color="dimmed" size="sm">
                  Ne vom asigura să te evaluăm în timpul învățării
                </Text>
              </Timeline.Item>
            </Timeline>
          </Container>
        ) : (
          <h1>testing</h1>
        )}
      </div>
    </div>
  );
};
export default Home;
