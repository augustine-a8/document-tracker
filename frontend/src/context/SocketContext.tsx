import { useEffect, createContext, PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import { Config } from "../api/config";
import { DefaultEventsMap } from "@socket.io/component-emitter";

let socket: Socket;

const getSocket = () => {
  if (!socket) {
    socket = io(Config.ServerEndpoint, { withCredentials: true });
  }
  return socket;
};

export const SocketContext = createContext<
  Socket<DefaultEventsMap, DefaultEventsMap> | undefined
>(undefined);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = getSocket();

  //   useEffect(() => {
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
