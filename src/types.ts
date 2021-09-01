import { ChangeEvent, FormEvent } from "react";

export type Todo = {
  id: string;
  task: string;
  isCompleted: boolean;
};

export type TodoProps = {
  todo: Todo;
};

export type AddTodoProps = {
  task: string;
  handleSubmitTodo: (e: FormEvent) => void;
  handleChange: (e: ChangeEvent) => void;
};
