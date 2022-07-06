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
import Error401 from "./401Error.tsx";
import NotFoundTitle from "./404Page";
import Stats from "./Stats.tsx";

// Mantine imports
import { Paper } from "@mantine/core";
import { Avatar, AvatarsGroup } from "@mantine/core";
import { Center } from "@mantine/core";
import { Text } from "@mantine/core";
import { Container } from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import { Grid } from "@mantine/core";

// React imports
import { useId } from "react";

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);

  const id = useId();

  if (user == undefined || user == null || auth == undefined || auth == null) {
    return <Error401 />;
  }

  return (
    <div className="profile">
      <Paper
        shadow="xl"
        radius="md"
        p="md"
        withBorder
        style={{ margin: "2rem", display: "flex" }}
      >
        <Paper radius="md" p="md" withBorder>
          <Center>
            <Avatar src={user.photoURL} size="xl" radius="50%" />
          </Center>
          <div className="nume" style={{ display: "inline-block" }}>
            <h3 style={{ display: "inline-block" }}>{user.displayName}</h3>
            <Text
              size="sm"
              color="dimmed"
              weight={600}
              style={{ marginTop: "-1rem" }}
            >
              {user.email}
            </Text>
          </div>
        </Paper>
        <Grid
          align="flex-start"
          columns={3}
          grow
          style={{ marginLeft: "2rem" }}
        >
          <Grid.Col span={1}>
            <Stats title="Puncte" value="1300" diff={32} id={id} />
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats title="som ting wong" value="" diff={1000} id={id} />
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats title="wat wong?" value="" diff={32} id={id} />
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
};
export default Profile;
