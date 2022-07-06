import React from "react";
import {
  createStyles,
  Group,
  Paper,
  Text,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { ArrowUpRight, ArrowDownRight } from "tabler-icons-react";
import { MOCKDATA } from "./mockdatastats";

const useStyles = createStyles((theme) => ({
  root: {},

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface StatsGridIconsProps {
  data: { title: string; value: string; diff: number }[];
}

const StatsGridIcons = (props) => {
  const { classes } = useStyles();

  const DiffIcon = props.diff > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={classes.root}>
      <Paper withBorder p="md" radius="md" key={props.title}>
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="xs"
              className={classes.label}
            >
              {props.title}
            </Text>
            <Text weight={700} size="xl">
              {props.value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({
              color:
                props.diff > 0 ? theme.colors.teal[6] : theme.colors.red[6],
            })}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} />
          </ThemeIcon>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text
            component="span"
            color={props.diff > 0 ? "teal" : "red"}
            weight={700}
          >
            {props.diff}%
          </Text>{" "}
          {props.diff > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Paper>
    </div>
  );
};
export default StatsGridIcons;
