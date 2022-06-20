import React from "react";
import {
  createStyles,
  Anchor,
  Group,
  ActionIcon,
  Center,
  Text,
} from "@mantine/core";
import { BrandTwitter, BrandYoutube, BrandInstagram } from "tabler-icons-react";
import { useMantineTheme } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import "./smallestPixel.css";

// Images
import logoLight from "./images/logoLight.png";
import logoDark from "./images/logoDark.png";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
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

export function Footer() {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const items = links.map((link) => (
    <>
      <Anchor
        color="dimmed"
        key={link.label}
        href={link.link}
        sx={{ lineHeight: 1 }}
        onClick={(event) => event.preventDefault()}
        size="sm"
      >
        {link.label}
      </Anchor>
    </>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Center style={{}}>
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
        <Group className={classes.links}>{items}</Group>

        <Group spacing={0} position="right" noWrap>
          <ActionIcon size="lg">
            <BrandTwitter size={18} />
          </ActionIcon>
          <ActionIcon size="lg">
            <BrandYoutube size={18} />
          </ActionIcon>
          <ActionIcon size="lg">
            <BrandInstagram size={18} />
          </ActionIcon>{" "}
          <Text
            font="Smallest Pixel-7"
            color={dark ? "#8996a3" : "#495057"}
            style={{ fontFamily: "Smallest Pixel-7" }}
            className="strokeme"
            size="xs"
          >
            Made with ❤️ by speedy&sbn
          </Text>
        </Group>
      </div>
    </div>
  );
}
export default Footer;
