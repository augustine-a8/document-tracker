import { useContext } from "react";

import { SocketContext } from "../context/SocketContext";

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (socket === undefined) {
    throw new Error("useSocket should be called inside of SocketProvider");
  }
  return socket;
};
