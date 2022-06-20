import { React, useState, useEffect, useHistory } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser, selectUsername } from "./userSlice";
import { useRef } from "react";
import dayjs from "dayjs";

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
  Paper,
  Progress,
  THEME_ICON_SIZES,
  MultiSelect,
  Stack,
} from "@mantine/core";
import { Check, InfoCircle, Webhook, WorldLatitude } from "tabler-icons-react";
import image from "./image.svg";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import { Header, Burger, Center } from "@mantine/core";
import { useBooleanToggle, useSetState } from "@mantine/hooks";
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
import { DateRangePicker } from "@mantine/dates";
import { TimeInput } from "@mantine/dates";
import { TimeRangeInput } from "@mantine/dates";
import { Clock } from "tabler-icons-react";
import { Calendar } from "tabler-icons-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useListState } from "@mantine/hooks";

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

  top: {
    borderBottomRightRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },

  middle: {
    borderTop: "none",
    borderRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },

  bottom: {
    borderTop: "none",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
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
  const { classes, cx } = useStyles();

  const [loggedin, setLoggedin] = useState(false);

  const [progress, setProgress] = useState(0);

  const [pas, setPas] = useState(0);

  const [step, setStep] = useState(0);

  const [showBack, setShowBack] = useState(false);

  const [days, setDays] = useState([]);

  const [Form, setForm] = useState({
    Buttons: {
      informatica: {
        variant: "outline",
        disabled: false,
      },
      chimie: {
        variant: "outline",
        disabled: false,
      },
      biologie: {
        variant: "outline",
        disabled: false,
      },
      fizica: {
        variant: "outline",
        disabled: false,
      },
    },
  });

  class Ora {
    constructor(position, mass, symbol, name) {
      this.position = position;
      this.mass = mass;
      this.symbol = symbol;
      this.name = name;
    }
  }

  const [state, handlers] = useListState(data2);

  var data2 = [];
  data2[0] = new Ora("1", "1.0079", "MT", "Matematică");
  data2[1] = new Ora("2", "4.0026", "RM", "Română");

  const ToggleFormButton = (name) => {
    if (name == "informatica") {
      if (Form.Buttons.informatica.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "I", "Informatică")
        );
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "chimie") {
      if (Form.Buttons.chimie.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "C", "Chimie")
        );
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "biologie") {
      if (Form.Buttons.biologie.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "B", "Biologie")
        );
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "fizica") {
      if (Form.Buttons.fizica.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "F", "Fizică")
        );
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
  };

  const ditems = state.map((item, index) => (
    <Draggable index={index} draggableId={item.symbol} key={item.symbol}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text className={classes.symbol}>{item.symbol}</Text>
          <div>
            <Text>{item.name}</Text>
            <Text color="dimmed" size="sm">
              Dificultate: {item.position} • Capitole: {item.mass}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  const now = new Date();
  const then = dayjs(now).add(30, "minutes").toDate();
  const [date, setDate] = useState([]);

  const [trans, setTrans] = useState(false);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const [currIntrebare, setCurrIntrebare] = useState(0);

  function Intrebare(
    materie,
    capitol,
    intrebare,
    raspunsuri = [],
    raspunsCorect
  ) {
    this.materie = materie;
    this.capitol = capitol;
    this.intrebare = intrebare;
    this.raspunsuri = raspunsuri;
    this.raspunsCorect = raspunsCorect;
  }

  const intrebari = [
    new Intrebare(
      "Informatica",
      "Elemente de baza",
      "Ce este un limbaj de programare?",
      ["a", "b", "c", "d"],
      2
    ),
  ];

  const [colorButton1, setColorButton1] = useState("primary");
  const [colorButton2, setColorButton2] = useState("primary");
  const [colorButton3, setColorButton3] = useState("primary");
  const [colorButton4, setColorButton4] = useState("primary");

  const [disabledButton1, setDisabledButton1] = useState(false);
  const [disabledButton2, setDisabledButton2] = useState(false);
  const [disabledButton3, setDisabledButton3] = useState(false);
  const [disabledButton4, setDisabledButton4] = useState(false);

  const ColorSuccess = "green";
  const ColorError = "red";

  function resetButtons() {
    setColorButton1("primary");
    setColorButton2("primary");
    setColorButton3("primary");
    setColorButton4("primary");
    setDisabledButton1(false);
    setDisabledButton2(false);
    setDisabledButton3(false);
    setDisabledButton4(false);
  }

  function submit(input) {
    if (input == intrebari[currIntrebare].raspunsCorect) {
      if (input == 1) {
        setColorButton1(ColorSuccess);
        setDisabledButton2(true);
        setDisabledButton3(true);
        setDisabledButton4(true);
      }
      if (input == 2) {
        setColorButton2(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton3(true);
        setDisabledButton4(true);
      }
      if (input == 3) {
        setColorButton3(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton2(true);
        setDisabledButton4(true);
      }
      if (input == 4) {
        setColorButton4(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton2(true);
        setDisabledButton3(true);
      }
    } else {
      if (input == 1) {
        setColorButton1(ColorError);
      }
      if (input == 2) {
        setColorButton2(ColorError);
      }
      if (input == 3) {
        setColorButton3(ColorError);
      }
      if (input == 4) {
        setColorButton4(ColorError);
      }
      if (intrebari[currIntrebare].raspunsCorect == 1) {
        setColorButton1(ColorSuccess);
      }
      if (intrebari[currIntrebare].raspunsCorect == 2) {
        setColorButton2(ColorSuccess);
      }
      if (intrebari[currIntrebare].raspunsCorect == 3) {
        setColorButton3(ColorSuccess);
      }
      if (intrebari[currIntrebare].raspunsCorect == 4) {
        setColorButton4(ColorSuccess);
      }
    }

    sleep(2000).then(() => {
      resetButtons();
    });
  }

  const data = [
    { value: "luni", label: "Luni" },
    { value: "marti", label: "Marți" },
    { value: "miercuri", label: "Miercuri" },
    { value: "joi", label: "Joi" },
    { value: "vineri", label: "Vineri" },
    { value: "sambata", label: "Sâmbătă" },
    { value: "duminica", label: "Duminică" },
  ];

  const [value, setValue] = useState(
    [Date | null, Date | null] > [new Date(2021, 11, 1), new Date(2021, 11, 5)]
  );

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

  var contents = [
    <DateRangePicker
      label="Selectează perioada de învățare"
      placeholder="Alege intervalul de date"
      value={value}
      onChange={setValue}
      mt="1rem"
      variant="filled"
      icon={<Calendar size={16} />}
    />,
    <MultiSelect
      value={days}
      onChange={setDays}
      data={data}
      transitionDuration={500}
      transition="fade"
      transitionTimingFunction="ease"
      label="Alege zilele in care vrei sa inveti"
      placeholder="Zi"
      variant="filled"
    />,
    <TimeRangeInput
      icon={<Clock size={16} />}
      label="Alege orele de învățare"
      value={date}
      onChange={setDate}
      clearable
      variant="filled"
    />,
    <>
      <Text weight="600" size="sm">
        La ce materii doresti sa te pregatesti?
      </Text>
      <Stack align="center" spacing="0px">
        <Button
          className={classes.top}
          style={{ width: "8rem" }}
          variant="light"
          disabled
        >
          Romana
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant="light"
          disabled
        >
          Matematica
        </Button>
        <Button
          className={classes.middle}
          variant={Form.Buttons.informatica.variant}
          style={{ width: "8rem" }}
          id="informatica"
          disabled={Form.Buttons.informatica.disabled}
          onClick={() => ToggleFormButton("informatica")}
        >
          Informatica
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant={Form.Buttons.chimie.variant}
          id="chimie"
          disabled={Form.Buttons.chimie.disabled}
          onClick={() => ToggleFormButton("chimie")}
        >
          Chimie
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant={Form.Buttons.biologie.variant}
          id="biologie"
          disabled={Form.Buttons.biologie.disabled}
          onClick={() => ToggleFormButton("biologie")}
        >
          Biologie
        </Button>
        <Button
          className={classes.bottom}
          style={{ width: "8rem" }}
          variant={Form.Buttons.fizica.variant}
          id="fizica"
          disabled={Form.Buttons.fizica.disabled}
          onClick={() => ToggleFormButton("fizica")}
        >
          Fizica
        </Button>
      </Stack>
    </>,
    <>
      <Text weight="600" size="sm">
        Ordonează materiile după prioritate
      </Text>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination.index })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {ditems}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>,
    <>
      {intrebari[currIntrebare].intrebare}
      <Center>
        <Stack spacing="0.3rem" mt="xs">
          <Button
            color={colorButton1}
            disabled={disabledButton1}
            onClick={() => submit(1)}
            variant="light"
          >
            {intrebari[currIntrebare].raspunsuri[0]}
          </Button>
          <Button
            color={colorButton2}
            disabled={disabledButton2}
            onClick={() => submit(2)}
            variant="light"
          >
            {intrebari[currIntrebare].raspunsuri[1]}
          </Button>
          <Button
            color={colorButton3}
            disabled={disabledButton3}
            onClick={() => submit(3)}
            variant="light"
          >
            {intrebari[currIntrebare].raspunsuri[2]}
          </Button>
          <Button
            color={colorButton4}
            disabled={disabledButton4}
            onClick={() => submit(4)}
            variant="light"
          >
            {intrebari[currIntrebare].raspunsuri[3]}
          </Button>
        </Stack>
      </Center>
    </>,
  ];

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
                        autoClose: 3000,
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
                  strokeWidth="0"
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
                  strokeWidth="0"
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
                  strokeWidth="0"
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
                  strokeWidth="0"
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
                  strokeWidth="0"
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
          <>
            <Center style={{ paddingTop: "2rem" }}>
              <Progress
                radius="md"
                size="xl"
                value={progress}
                style={{ width: "30rem" }}
                label={`${progress}%`}
              />
            </Center>

            <Center style={{ paddingTop: "2rem" }}>
              <Paper shadow="xl" p="md" withBorder style={{ width: "22rem" }}>
                <Title order={3}>PASUL {step + 1}</Title>
                {contents[pas]}
                {showBack ? (
                  <Button
                    variant="light"
                    mt="1rem"
                    mr="sm"
                    color="red"
                    onClick={() => {
                      setPas(pas - 1);
                      setProgress(progress - 10);
                    }}
                  >
                    Back
                  </Button>
                ) : null}

                <Button
                  onClick={() => {
                    setProgress(progress + 10);
                    setPas(pas + 1);
                    console.log(value);
                    setShowBack(true);
                    console.log(days);
                    console.log(date);
                    if (pas == 4) {
                      setTrans(true);
                    }
                  }}
                  variant="light"
                  mt="1rem"
                >
                  Next
                </Button>
              </Paper>
            </Center>
          </>
        )}
      </div>
    </div>
  );
};
export default Home;
