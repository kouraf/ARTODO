import { ChangeEvent, FormEvent } from "react";
import { Document } from "ardb/lib/faces/document";

export interface Todo {
  task: string;
  isCompleted: boolean;
  owner: string;
};


export type TodoProps = {
  todo: Document & Todo;
  handleDone: (todo: Document & Todo) => Promise<void>;
};

export type AddTodoProps = {
  task: string;
  handleSubmitTodo: (e: FormEvent) => void;
  handleChange: (e: ChangeEvent) => void;
};
