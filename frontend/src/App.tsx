import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import { useNotification } from "./hooks/useNotification";
import NotificationModal from "./components/NotificationModal";
import { useSocket } from "./hooks/useSocket";
import { useEffect } from "react";
import { NotificationEvent } from "./@types/notification";
import { getAllNotificationsApi } from "./api/notifications.api";

function App() {
  const {
    notificationState,
    closeNotificationModal,
    enqueueNotification,
    setActiveDocNotifications,
    setArchiveNotifications,
  } = useNotification();
  const socket = useSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server with id ", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    socket.on(NotificationEvent.ForwardActiveDoc, (data) => {
      console.log(data);
      setActiveDocNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.removeListener(NotificationEvent.ForwardActiveDoc);
    };
  }, [socket]);

  useEffect(() => {
    socket.on(NotificationEvent.AcknowledgeActiveDoc, (data) => {
      console.log(data);
      setActiveDocNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.removeListener(NotificationEvent.AcknowledgeActiveDoc);
    };
  }, [socket]);

  useEffect(() => {
    socket.on(NotificationEvent.ReturnActiveDoc, (data) => {
      console.log(data);
      setActiveDocNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.removeListener(NotificationEvent.ReturnActiveDoc);
    };
  }, [socket]);

  useEffect(() => {
    const fetchNotifications = () => {
      getAllNotificationsApi().then((res) => {
        if (res.status === 200) {
          console.log(res.data.archiveNotifications);
          setActiveDocNotifications(res.data.activeDocNotifications);
          setArchiveNotifications(res.data.archiveNotifications);
        }
      });
    };

    fetchNotifications();
  }, []);

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
