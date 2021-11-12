import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Row } from "./Row";
import { AddTodo } from "./AddTodo";
import { Todo as ITodo } from "../types";
import { TODO } from "../arweave";
import { Document } from "ardb/lib/faces/document";

import "./loader.css";

type Todo = ITodo & Document

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [owner, setOwner] = useState("");
  const hasTodos = todos.length > 0;

  async function fetch() {
    await window.arweaveWallet
      .connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"])
      .then(() => {
        setConnected(true);
        return window.arweaveWallet.getActiveAddress().then(async (walletAddress) =>
          {
            setOwner(walletAddress)
            const todos = await TODO.findMany({owner:walletAddress})
            
            if(todos)
            setTodos(todos as Todo[])
          }
        );
      })
      .catch(console.log);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      console.log("waiting for arweaveWallet");
      while (!window.hasOwnProperty("arweaveWallet"))
        await new Promise((resolve) => setTimeout(resolve, 1000));
      fetch();
    })();
  }, []);

  const handleAddTodo = async (todo: ITodo) => {
    try {
      setLoading(true);
      await TODO.create(todo)

      setTask("");
      fetch();
    } catch (error) {
      console.log("error :", error);
    }
  };
  const handleDone = async (todo: Todo) => {
    try {
      setLoading(true);
      await TODO.updateById(todo._id,{...todo,isCompleted:!todo.isCompleted})

      fetch();
    } catch (error) {
      console.log("error :", error);
    }
  };

  const handleChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setTask(value);
  };

  const handleSubmitTodo = (e: FormEvent) => {
    e.preventDefault();

    const todo = {
      task: task,
      isCompleted: false,
      owner
    };
    task && handleAddTodo(todo);
  };

  const handleDisconnect = () => {
    window.arweaveWallet.disconnect();
    setConnected(false);
    window.location.reload();
    setTodos([]);
  };
  return (
    <section className="w-10/12 lg:w-1/2 max-w-2xl flex flex-col items-center">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          {connected ? (
            <>
              <AddTodo
                handleChange={handleChange}
                handleSubmitTodo={handleSubmitTodo}
                task={task}
              />
              <div className="h-10" />
              {todos.map((todo) => (
                <Row key={todo._id} todo={todo} handleDone={handleDone} />
              ))}
              {!hasTodos && (
                <p className="mb-5 text-xl text-red-500 uppercase">
                  Please add a todo!
                </p>
              )}

              <button
                onClick={handleDisconnect}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={fetch}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            >
              Login
            </button>
          )}
        </>
      )}
    </section>
  );
};
