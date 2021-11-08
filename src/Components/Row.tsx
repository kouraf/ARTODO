import React from 'react';
import { TodoProps } from "../types";

export const Row = ({ todo,handleDone }: TodoProps) => (
  <div
    className={`flex w-full p-4 mb-2 justify-between items-center bg-green-300 ${todo.isCompleted ? ("line-through"):""}`}
  >
    <p className={`text-xl font-sans font-medium text-gray-700`}>{todo.task}</p>
    <button onClick={()=> {
      handleDone(todo)
    }} className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">Done</button>
  </div>
);
