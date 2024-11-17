import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import { useNotification } from "./hooks/useNotification";
import NotificationModal from "./components/NotificationModal";
import { useSocket } from "./hooks/useSocket";
import { useEffect } from "react";

function App() {
  const { notificationState, closeNotificationModal } = useNotification();
  const socket = useSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server with id ", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  return (
    <>
      <Header />
      <Outlet />
      <NotificationModal
        isOpen={notificationState.isOpen}
        notification={notificationState.notification}
        closeModal={closeNotificationModal}
      />
    </>
  );
}

export default App;
