import { TodoProps } from "../types";

export const Row = ({ todo: { task } }: TodoProps) => (
  <div
    className={`flex w-full p-4 mb-2 justify-center items-center bg-green-300`}
  >
    <p className={`text-xl font-sans font-medium text-gray-700`}>{task}</p>
  </div>
);
