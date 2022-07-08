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

// Mantine imports
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import { Title } from "@mantine/core";
import { Butterfly } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";

// Icons imports
import { Check, X } from "tabler-icons-react";
import React, { useEffect } from "react";

// React imports
import { useState } from "react";

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

  const buyItem = async (item) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    if (document.data().puncte >= item.price) {
      await setDoc(
        doc(db, "users", document.id),
        {
          puncte: document.data().puncte - item.price,
          items: [...document.data().items, item.name],
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

  const fetchItems = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const items = document.data().items;
    setItems(items);
    setTimeout(fetchItems, 1000);
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

  return (
    <Delayed>
      <div className="store" style={{ minHeight: "70vh", marginTop: "2rem" }}>
        <Title
          align="center"
          style={{ fontWeight: 400, marginBottom: theme.spacing.xl * 1.5 }}
        >
          Store
        </Title>
        <SimpleGrid cols={5} style={{ margin: "3rem" }}>
          {items}
        </SimpleGrid>
      </div>
    </Delayed>
  );
};
export default Store;
