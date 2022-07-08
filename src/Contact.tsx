import React from "react";
import {
  createStyles,
  ThemeIcon,
  Text,
  Group,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { Sun, Phone, MapPin, At } from "tabler-icons-react";
import { Center } from "@mantine/core";
import { Title } from "@mantine/core";
import { BrandDiscord } from "tabler-icons-react";
import { BrandGmail } from "tabler-icons-react";
import { BrandGithub } from "tabler-icons-react";
import { useMantineColorScheme } from "@mantine/core";
import Theme from "./Theme";

type ContactIconVariant = "white" | "gradient";

interface ContactIconStyles {
  variant: ContactIconVariant;
}

const useStyles = createStyles((theme, { variant }: ContactIconStyles) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    color: theme.white,
  },

  icon: {
    marginRight: theme.spacing.md,
    backgroundImage:
      variant === "gradient"
        ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
            theme.colors[theme.primaryColor][6]
          } 100%)`
        : "none",
    backgroundColor: "transparent",
  },

  title: {
    textAlign: "left",
    color:
      variant === "gradient"
        ? theme.colors.gray[6]
        : theme.colors[theme.primaryColor][0],
  },

  description: {
    color: variant === "gradient" ? theme.black : theme.white,
  },

  title2: {
    fontWeight: 400,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

interface ContactIconProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
  variant?: ContactIconVariant;
}

function ContactIcon({
  icon: Icon,
  title,
  description,
  variant = "gradient",
  className,
  ...others
}: ContactIconProps) {
  const { classes, cx } = useStyles({ variant });
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <div className={cx(classes.wrapper, className)} {...others}>
      {variant === "gradient" ? (
        <ThemeIcon size={40} radius="md" className={classes.icon}>
          <Icon size={24} />
        </ThemeIcon>
      ) : (
        <Box mr="md">
          <Icon size={24} />
        </Box>
      )}

      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <Text
          className={classes.description}
          style={{
            color: variant == "white" ? "#fff" : dark ? "#fff" : "#000",
          }}
        >
          {description}
        </Text>
      </div>
    </div>
  );
}

interface ContactIconsListProps {
  data?: ContactIconProps[];
  variant?: ContactIconVariant;
}

const MOCKDATA = [
  {
    title: "Email",
    description: "andrei.cristian.stan@lttvb.ro",
    icon: BrandGmail,
  },
  { title: "Discord", description: "speedy#9383", icon: BrandDiscord },
  { title: "GitHub", description: "Andrei9383", icon: BrandGithub },
];
const MOCKDATA2 = [
  { title: "Email", description: "serban.toader@lttvb.ro", icon: BrandGmail },
  { title: "Discord", description: "Sbn06#4954", icon: BrandDiscord },
  { title: "GitHub", description: "Sbn06", icon: BrandGithub },
];

export function ContactIconsList({
  data = MOCKDATA,
  variant,
}: ContactIconsListProps) {
  const items = data.map((item, index) => (
    <ContactIcon key={index} variant={variant} {...item} />
  ));
  return <Group direction="column">{items}</Group>;
}

export function ContactIconsList2({
  data = MOCKDATA2,
  variant,
}: ContactIconsListProps) {
  const items = data.map((item, index) => (
    <ContactIcon key={index} variant={variant} {...item} />
  ));
  return <Group direction="column">{items}</Group>;
}

const Contact = () => {
  const { classes, cx } = useStyles({ variant: "gradient" });

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div className="contact" style={{ minHeight: "55vh", marginTop: "10rem" }}>
      <Title align="center" className={classes.title2}>
        Contact
      </Title>
      <Center>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 755, cols: 1 }]}>
          <div className="as">
            <Title order={3}>Andrei Stan</Title>
            <Box
              sx={(theme) => ({
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
                backgroundColor: dark ? theme.colors.dark[6] : theme.white,
              })}
            >
              <ContactIconsList />
            </Box>
          </div>
          <div className="sb">
            <Title order={3}>Șerban Toader</Title>
            <Box
              sx={(theme) => ({
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
                backgroundImage: `linear-gradient(135deg, ${
                  theme.colors[theme.primaryColor][6]
                } 0%, ${theme.colors[theme.primaryColor][4]} 100%)`,
              })}
            >
              <ContactIconsList2 variant="white" />
            </Box>
          </div>
        </SimpleGrid>
      </Center>
    </div>
  );
};
export default Contact;
