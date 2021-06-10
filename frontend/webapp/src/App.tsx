import React, { PropsWithChildren, useContext, useEffect, useState } from "react";

import { Box, Button, Container, IconButton, List, ListItem, makeStyles, TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as model from "src/services/api/model";
import * as proxy from "src/services/api/proxy";

import { ProvideAuth } from "./core/contexts/AuthContext";
import { useFetch, useLazyFetch } from "./core/hooks/useFetch";

import "./App.css";

type TodoItem = model.Todo.TodoItem;

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
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 16,
  },
  taskInputs: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    marginBottom: 12,
  },
  taskDesc: {
    marginBottom: 12,
  },
  addButton: {},
  todoList: {
    background: "#f0f0f0",
  },
  todoListItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    borderBottom: "solid #0002 1px",
  },
  todoTitle: {},
  todoDesc: {},
  todoDeleteButton: {
    position: "absolute",
    right: 12,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});

const App = () => {
  const styles = useStyles();

  const [getTodoItemsRequest, getTodoItems] = useFetch(proxy.Todo.TodoList.List);
  const todoItems = getTodoItemsRequest.data?.data ?? [];

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [createTaskRequest, createTask] = useLazyFetch(proxy.Todo.TodoList.New, { title: "" });
  const [deleteTaskRequest, deleteTask] = useLazyFetch(proxy.Todo.TodoList.Delete, "");

  const handleAddTask = async () => {
    try {
      if (taskTitle.length > 0) {
        await createTask([{ title: taskTitle, description: taskDesc }]);
        await getTodoItems();
        setTaskTitle("");
        setTaskDesc("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = (uid: string) => async () => {
    try {
      await deleteTask([uid]);
      await getTodoItems();
    } catch (error) {}
  };

  return (
    <ProvideAuth>
      <Container className={styles.scene} maxWidth={"sm"}>
        <Typography variant={"h3"} component={"h1"}>
          My todo item:
        </Typography>
        <Box className={styles.header}>
          <Box className={styles.taskInputs}>
            <TextField
              className={styles.taskTitle}
              fullWidth
              placeholder={"What you want to do"}
              value={taskTitle}
              onChange={e => {
                setTaskTitle(e.target.value);
              }}
            />
            <TextField
              className={styles.taskDesc}
              fullWidth
              placeholder={"More details"}
              value={taskDesc}
              onChange={e => {
                setTaskDesc(e.target.value);
              }}
            />
          </Box>
          <Button
            className={styles.addButton}
            variant={"contained"}
            color={"primary"}
            disabled={createTaskRequest.loading}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
        <Box>
          <Typography variant={"body2"}>Todo list</Typography>
          {!todoItems ? null : (
            <List className={styles.todoList}>
              {todoItems.map(item => (
                <ListItem className={styles.todoListItem} key={item.uid}>
                  <Box className={styles.stack}>
                    <Typography className={styles.todoTitle} variant={"h6"}>
                      {item.title}
                    </Typography>
                    <Typography className={styles.todoDesc} variant={"body1"}>
                      {item.description}
                    </Typography>
                  </Box>
                  <IconButton className={styles.todoDeleteButton} onClick={handleDeleteTask(item.uid)}>
                    <CloseIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Container>
    </ProvideAuth>
  );
};

export default App;
