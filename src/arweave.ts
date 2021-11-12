import Blockweave from "blockweave";
import Schema, { registerSchema } from "ardb";
import { Todo } from "./types";

const blockweave = new Blockweave({ url: process.env.REACT_APP_GATEWAY || "http://localhost:1984" });

export const TODO = new Schema<Todo>(
  {
    isCompleted: { type: "boolean" },
    task: { type: "string" },
    owner: { type: "string" },
  },
  blockweave,
  "use_wallet"
);
registerSchema("TODO", TODO);
