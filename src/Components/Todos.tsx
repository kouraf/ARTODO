import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Row } from "./Row";
import { AddTodo } from "./AddTodo";
import { Todo } from "../types";
import { ardb, arweave } from "../arweave";

import "./loader.css";

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const hasTodos = todos.length > 0;

  async function fetch() {
    await window.arweaveWallet
      .connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"])
      .then(() => {
        setConnected(true);
        return window.arweaveWallet.getActiveAddress().then((walletAddress) =>
          ardb
            .search("transactions")
            .from(walletAddress)
            .find()
            .then((txs) =>
              Promise.all(
                txs.map((ts) =>
                  arweave.transactions
                    .getData(ts.id, { decode: true, string: true })
                    .then((data) => JSON.parse(data as string))
                    .catch(console.log)
                )
              ).then((transactions) =>
                setTodos(transactions.filter((trnsaction) => trnsaction))
              )
            )
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

  const handleAddTodo = async (todo: Todo) => {
    try {
      setLoading(true);
      const tx = await arweave.createTransaction({
        data: JSON.stringify(todo),
      });

      await arweave.transactions.sign(tx);

      await arweave.transactions.post(tx);

      setTask("");
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
      id: uuidv4(),
      task: task,
      isCompleted: false,
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
          <AddTodo
            handleChange={handleChange}
            handleSubmitTodo={handleSubmitTodo}
            task={task}
          />
          <div className="h-10" />
          {todos.map((todo) => (
            <Row key={todo.id} todo={todo} />
          ))}
          {!hasTodos && connected && (
            <p className="mb-5 text-xl text-red-500 uppercase">
              Please add a todo!
            </p>
          )}

          {connected ? (
            <button
              onClick={handleDisconnect}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            >
              Logout
            </button>
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
