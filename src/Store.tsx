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
import { StoreItems } from "./StoreItems";
import Delayed from "./Delayed.tsx";
import HeaderStore from "./HeaderStore.tsx";

// Mantine imports
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  useMantineTheme,
  NumberInputStylesNames,
} from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import { Title } from "@mantine/core";
import { Butterfly } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { Paper } from "@mantine/core";
import { Center } from "@mantine/core";

// Icons imports
import { Check, X } from "tabler-icons-react";
import React, { useEffect } from "react";

// React imports
import { useState } from "react";

// Components imports
import Error401 from "./401Error.tsx";

interface StoreItemProps {
  displayName: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

function StoreItem({ item }: StoreItemProps) {
  const theme = useMantineTheme();
  const [user, loading, error] = useAuthState(auth);

  const [items, setItems] = useState([]);

  class Activity {
    name: string;
    description: string;
    price: number;
    date: Date;
    constructur(name: string, description: string, price: number, date: Date) {
      this.name = name;
      this.description = description;
      this.price = price;
      this.date = date;
    }
  }

  const buyItem = async (item) => {
    const activity = {
      name: "Cumpărare",
      description: "Ai cumpărat " + item.displayName,
      price: item.price,
      date: new Date(),
    };
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    if (document.data().puncte >= item.price) {
      await setDoc(
        doc(db, "users", document.id),
        {
          puncte: document.data().puncte - item.price,
          items: [...document.data().items, item.name],
          recentActivities: [...document.data().recentActivities, activity],
        },
        { merge: true }
      );
      showNotification({
        title: "Ai cumpărat cu succes " + item.displayName + "!",
        message: "Ai plătit " + item.price + " puncte!",
        autoClose: 2000,
        color: "green",
        icon: <Check />,
      });
    } else {
      showNotification({
        title: "Nu ai suficiente puncte!",
        message: "Cumpărarea a eșuat!",
        autoClose: 2000,
        color: "red",
        icon: <X />,
      });
    }
  };

  const [shouldUpdate, setShouldUpdate] = useState(0);

  const fetchItems = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const items = document.data().items;
    setItems(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  return (
    <div className="store-item">
      <Card shadow="sm" p="lg">
        <Card.Section>
          <Image src={item.image} height={160} alt="Norway" />
        </Card.Section>

        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Text weight={500}>{item.displayName}</Text>
          <Badge color={theme.primaryColor} variant="light">
            {item.price} puncte
          </Badge>
        </Group>

        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {item.description}
        </Text>

        <Button
          variant="light"
          color="blue"
          disabled={items.includes(item.name)}
          fullWidth
          style={{ marginTop: 14 }}
          onClick={() => {
            buyItem(item);
            setShouldUpdate((value) => value + 1);
          }}
        >
          {items.includes(item.name) ? "Cumpărat" : "Cumpără"}
        </Button>
      </Card>
    </div>
  );
}

const items = StoreItems.map((item) => {
  return <StoreItem item={item} />;
});

const Store = () => {
  const theme = useMantineTheme();
  const [user, loading, error] = useAuthState(auth);

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

  if (!user) {
    return <Error401 />;
  }

  return (
    <>
      <HeaderStore />
      <Delayed>
        <div
          className="store"
          style={{ minHeight: "70vh", marginTop: "0.5rem" }}
        >
          <Center>
            <Paper
              radius="md"
              p="xl"
              shadow="xl"
              withBorder
              style={{ margin: "3rem" }}
            >
              <SimpleGrid
                cols={windowDimension.winWidth > 768 ? "3" : "1"}
                style={{}}
              >
                {items}
              </SimpleGrid>
            </Paper>
          </Center>
        </div>
      </Delayed>
    </>
  );
};
export default Store;
