import React from "react";
import { Container, Title, Accordion, createStyles } from "@mantine/core";
import { Code } from "@mantine/core";
import { useHistory } from "react-router-dom";
import { Text } from "@mantine/core";
import { Highlight } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
  const control = getRef("control");

  return {
    wrapper: {
      paddingTop: theme.spacing.xl * 2,
      paddingBottom: theme.spacing.xl * 2,
      minHeight: 650,
    },

    title: {
      fontWeight: 400,
      marginBottom: theme.spacing.xl * 1.5,
    },

    control: {
      ref: control,

      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,

      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }`,
    },

    itemOpened: {
      [`& .${control}`]: {
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
          ],
      },
    },
  };
});

const placeholder = [
  "EduVision este un proiect dezvoltat de către doi elevi de liceu care au o viziune despre educația din România, mai ales de dezvoltarea acesteia cu ajutorul unui sistem de educație digitalizat. EduVision poate fi folosit de orice elev pentru a genera orare de învățare personalizate, pentru a se îmbunătăți la materiile alese. EduVision nu numai că generează orarele elevilor, ci le permite să pună întrebări celorlalți membri înregistrați acolo unde nu se descurcă.",
  "Orele sunt personalizate pe baza rezultatelor de la testul inițial. Aceste rezultate dictează frecvența fiecărei materii pe perioada aleasă, durata orelor, numărul de ore pe saptămană, și modul în care sunt distribuite pe perioada aleasă. Elevul poate marca anumite ore ca fiind 'Importante', pentru a le putea adresa mai multă atenție.",
  "Tocmai pentru că sistemul este digital, poate asigura o evaluare mai rapidă a rezultatelor elevilor, și le poate interpreta în special pentru nevoile elevului.",
];

const About = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { classes } = useStyles();
  const history = useHistory();
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        About
      </Title>

      <Accordion
        iconPosition="right"
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        <Accordion.Item label="Ce este EduVision?">
          <Highlight
            highlight={["EduVision"]}
            highlightStyles={(theme) => ({
              backgroundImage: theme.fn.linearGradient(
                45,
                dark ? theme.colors.pink[5] : theme.colors.cyan[5],
                dark ? theme.colors.violet[5] : theme.colors.indigo[5]
              ),
              fontWeight: 700,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            })}
            style={{ display: "inline-block" }}
          >
            EduVision
          </Highlight>{" "}
          este un proiect dezvoltat de către doi elevi de liceu care au o
          viziune despre educația din România, mai ales de dezvoltarea acesteia
          cu ajutorul unui sistem de educație digitalizat. EduVision poate fi
          folosit de orice elev pentru a genera orare de învățare personalizate,
          pentru a se îmbunătăți la materiile alese. EduVision nu numai că
          generează orarele elevilor, ci le permite să pună întrebări celorlalți
          membri înregistrați acolo unde nu se descurcă.
        </Accordion.Item>
        <Accordion.Item label="Cum sunt orarele personalizate?">
          {placeholder[1]}
        </Accordion.Item>
        <Accordion.Item label="De unde știți că acest sistem de educație funcționează pentru orice elev?">
          {placeholder[2]}
        </Accordion.Item>
        <Accordion.Item label="În ce este realizat proiectul?">
          <Highlight
            highlight={["EduVision"]}
            highlightStyles={(theme) => ({
              backgroundImage: theme.fn.linearGradient(
                45,
                dark ? theme.colors.pink[5] : theme.colors.cyan[5],
                dark ? theme.colors.violet[5] : theme.colors.indigo[5]
              ),
              fontWeight: 700,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            })}
            style={{ display: "inline-block" }}
          >
            EduVision
          </Highlight>{" "}
          este realiat în{" "}
          <a href="https://reactjs.org/" target="_blank">
            <Code>React</Code>{" "}
          </a>
          si{" "}
          <a href="https://www.typescriptlang.org/" target="_blank">
            <Code>TypeScript</Code>
          </a>{" "}
          pentru interfață,{" "}
          <a href="https://mantine.dev" target="_blank">
            <Code>Mantine</Code>
          </a>
          pentru design,{" "}
          <a href="https://redux.js.org/" target="_blank">
            <Code>Redux</Code>
          </a>{" "}
          pentru stocarea locală a datelor,{" "}
          <a href="https://firebase.google.com/" target="_blank">
            <Code>FireBase</Code>
          </a>{" "}
          pentru baza de date si{" "}
          <a href="https://console.cloud.google.com/" target="_blank">
            <Code>Google API</Code>{" "}
          </a>
          pentru autentificare.
        </Accordion.Item>
        <Accordion.Item label="De cine este realizat proiectul?">
          <Text style={{ display: "inline-block" }}>
            <Highlight
              highlight={["EduVision"]}
              highlightStyles={(theme) => ({
                backgroundImage: theme.fn.linearGradient(
                  45,
                  dark ? theme.colors.pink[5] : theme.colors.cyan[5],
                  dark ? theme.colors.violet[5] : theme.colors.indigo[5]
                ),
                fontWeight: 700,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              })}
              style={{ display: "inline-block" }}
            >
              EduVision
            </Highlight>{" "}
            este realiat de către{" "}
            <Text weight="600" style={{ display: "inline-block" }}>
              Andrei Stan
            </Text>{" "}
            și{" "}
            <Text weight="600" style={{ display: "inline-block" }}>
              Șerban Toader
            </Text>{" "}
            , elevi ai
            <Text weight="600" style={{ display: "inline-block" }}>
              {" "}
              Liceului Teoretic "Tudor Vladimirescu"{"  "}
            </Text>{" "}
            din București, în cadrul concursului{" "}
            <Text weight="600" style={{ display: "inline-block" }}>
              InfoEducație 2022
            </Text>
          </Text>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};
export default About;
