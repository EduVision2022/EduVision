import { React, useState } from "react";
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
} from "@mantine/core";
import { Check } from "tabler-icons-react";
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

// Login Imports
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// Image imports
import logoTransparent from "./images/logomain.png";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
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
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

const Home = () => {
  const user = useSelector(selectUsername);
  const dispatch = useDispatch();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes } = useStyles();

  const [loggedin, setLoggedin] = useState(false);

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Edu<span className={classes.highlight}>Vision</span> <br />{" "}
            </Title>
            <Text color="dimmed" mt="md">
              Build fully functional accessible web applications faster than
              ever – Mantine includes more than 120 customizable components and
              hooks to cover you in any situation
            </Text>
            <Button
              variant="light"
              onClick={() => {
                dispatch(
                  setUser({ name: "John Doe", email: "johndoe@gmail.com" })
                );
              }}
            >
              Testing
            </Button>
            {user}
            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <Check size={12} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>TypeScript based</b> – build type safe applications, all
                components and hooks export types
              </List.Item>
              <List.Item>
                <b>Free and open source</b> – all packages have MIT license, you
                can use Mantine in any project
              </List.Item>
              <List.Item>
                <b>No annoying focus ring</b> – focus ring will appear only when
                user navigates with keyboard
              </List.Item>
            </List>

            <Group mt={30}>
              {loggedin ? (
                <Button
                  variant="light"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Get started
                </Button>
              ) : (
                <GoogleLogin
                  theme={dark ? "filled_black" : "filled_light"}
                  shape="pill"
                  onSuccess={(credentialResponse) => {
                    //console.log(credentialResponse);
                    var decoded = jwt_decode(credentialResponse.credential);
                    //console.log(decoded);
                    console.log(decoded.email);
                    setLoggedin(true);
                    dispatch(
                      setUser({
                        name: decoded.name,
                        email: decoded.email,
                        picture: decoded.picture,
                      })
                    );
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
              >
                Source code
              </Button>
            </Group>
          </div>
          <Image src={image} className={classes.image} />
        </div>
      </Container>
    </div>
  );
};
export default Home;
