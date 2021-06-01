import React, { PropsWithChildren, useContext, useState } from "react";

import { ProvideAuth, useAuth } from "./core/contexts/AuthContext";

import "./App.css";
import { Input } from "@material-ui/icons";
import { Container, makeStyles, TextField, Box, Typography, Button, List, ListItem } from "@material-ui/core";

const useStyles = makeStyles({
  scene: {
    // border: "solid red 1px",
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  taskInput: {
    marginRight: 12,
  },
  addButton: {
    flexShrink: 0,
  },
  todoList: {
    background: "#eaeaea",
  },
  todoListItem: {},
});

const App = () => {
  const styles = useStyles();

  const handleAddTask = () => {
    // TODO
  };

  return (
    <ProvideAuth>
      <Container className={styles.scene} maxWidth={"sm"}>
        <Typography variant={"h3"} component={"h1"}>
          My todo item:
        </Typography>
        <Box className={styles.header}>
          <TextField className={styles.taskInput} fullWidth placeholder={"What you want to do"} />
          <Button className={styles.addButton} variant={"contained"} color={"primary"} onClick={handleAddTask}>
            Add Task
          </Button>
        </Box>
        <Box>
          <Typography variant={"body2"}>Todo list</Typography>
          <List className={styles.todoList}>
            <ListItem>
              <Box>
                <Typography variant={"h6"}>Item 1</Typography>
                <Typography variant={"body1"}>Need to do sth</Typography>
              </Box>
            </ListItem>
          </List>
        </Box>
      </Container>
    </ProvideAuth>
  );
};

export default App;
