import React, { useState, useEffect } from "react";
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

// Redux
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setUser,
  selectUsername,
  selectPicture,
  selectEmail,
} from "./userSlice";

// Images
import logoLight from "./images/logoLight.png";
import logoDark from "./images/logoDark.png";

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

    [theme.fn.smallerThan("sm")]: {
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
links[2] = new HeaderProps("/login", "Login");

export function HeaderMiddle() {
  const history = useHistory();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const username = useSelector(selectUsername);
  const profilepicture = useSelector(selectPicture);
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();

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
                src={profilepicture}
                radius="xl"
                style={{ marginRight: "10px" }}
              />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {username ? username : "Guest"}
                </Text>
                <Text color="dimmed" size="xs">
                  {email}
                </Text>
              </div>
            </Button>
          }
          transition="pop-top-right"
          placement="end"
          size="lg"
        >
          <Menu.Item
            icon={<Package size={16} color={theme.colors.blue[6]} />}
            rightSection={
              <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                Ctrl + P
              </Text>
            }
          >
            Project
          </Menu.Item>
          <Menu.Item
            icon={<SquareCheck size={16} color={theme.colors.pink[6]} />}
            rightSection={
              <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                Ctrl + T
              </Text>
            }
          >
            Task
          </Menu.Item>
          <Menu.Item
            icon={<Users size={16} color={theme.colors.cyan[6]} />}
            rightSection={
              <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                Ctrl + U
              </Text>
            }
          >
            Team
          </Menu.Item>
          <Menu.Item
            icon={<Calendar size={16} color={theme.colors.violet[6]} />}
            rightSection={
              <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                Ctrl + E
              </Text>
            }
          >
            Event
          </Menu.Item>
        </Menu>

        <Group className={classes.links} spacing={5}>
          {items}
        </Group>

        {/* LOGO */}
        {windowDimension.winWidth > 720 ? (
          <Center style={{ width: 400, height: 200 }}>
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
        {windowDimension.winWidth > 720 ? (
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
