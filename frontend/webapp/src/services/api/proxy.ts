import {getRequest, postRequest, deleteRequest} from "./client/client";
import * as m from "./model";

export const Todo = {
  TodoList: {
    List: function List(): Promise<m.Envelope<m.Todo.TodoItem[], any>> {
      return getRequest("todo/todo_list/");
    },
    Search: function Search(search: string): Promise<m.Envelope<m.Todo.TodoItem[], any>> {
      return getRequest("todo/todo_list/search/", { search: search });
    },
    New: function New(todo: m.Todo.RequestNewTodoItem): Promise<m.Envelope<boolean, any>> {
      return postRequest("todo/todo_list/", todo, false);
    },
    Delete: function Delete(uid: string): Promise<m.Envelope<true, any>> {
      return deleteRequest(`todo/todo_list/${uid}/`);
    },
  }
}