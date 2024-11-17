import { createContext, PropsWithChildren, useState } from "react";
import {
  IAcknowledgement,
  INotification,
  NotificationState,
} from "../@types/notification";

interface NotificationContextType {
  notificationState: NotificationState;
  notificationQueue: INotification[];
  closeNotificationModal: () => void;
  openNotificationModal: (n: INotification) => void;
  removeNotifications: (acks: IAcknowledgement[]) => void;
  addToNotificationQueue: (newNotifications: INotification[]) => void;
  enqueueNotification: (notification: INotification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

function NotificationModalProvider({ children }: PropsWithChildren) {
  const [notificationQueue, setNotificationQueue] = useState<INotification[]>(
    []
  );
  const [notificationState, setNotificationState] = useState<NotificationState>(
    { isOpen: false, notification: null }
  );
  const [dequeueIndex, setDequeueIndex] = useState<number>(0);

  const addToNotificationQueue = (newNotifications: INotification[]) => {
    setNotificationQueue(newNotifications);
  };

  const enqueueNotification = (notification: INotification) => {
    setNotificationQueue((prev) => [...prev, notification]);
    setNotificationState({ isOpen: true, notification });
  };

  const openNotificationModal = (notification: INotification) => {
    setNotificationState({ isOpen: true, notification });
  };

  const closeNotificationModal = () => {
    setNotificationState({ isOpen: false, notification: null });
  };

  const removeNotifications = (acks: IAcknowledgement[]) => {
    setNotificationQueue((prev) =>
      prev.filter(
        (item) =>
          !acks.some(
            (ack) =>
              ack.transactionId === item.transactionId &&
              ack.notificationId === item.notificationId
          )
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationState,
        notificationQueue,
        openNotificationModal,
        closeNotificationModal,
        removeNotifications,
        addToNotificationQueue,
        enqueueNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, NotificationModalProvider };
