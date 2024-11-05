import { createContext, PropsWithChildren, useState } from "react";
import {
  IAcknowledgement,
  INotification,
  INotificationQueue,
  NotificationType,
} from "../@types/notification";

interface NotificationContextType {
  showNotificationModal: boolean;
  toggleNotificationModal: () => void;
  allNotifications: INotification[];
  setAllNotifications: (n: INotification[]) => void;
  addNotification: (n: INotification) => void;
  removeNotifications: (acks: IAcknowledgement[]) => void;
  enqueueNotification: (
    type: NotificationType,
    notification: INotification
  ) => void;
  dequeueNotification: () => INotificationQueue | undefined;
  notificationQueueLength: number;
  notificationQueue: INotificationQueue[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

function NotificationModalProvider({ children }: PropsWithChildren) {
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [notificationQueue, setNotificationQueue] = useState<
    INotificationQueue[]
  >([]);
  const [allNotifications, _allNotifications] = useState<INotification[]>([]);

  const enqueueNotification = (
    type: NotificationType,
    notification: INotification
  ) => {
    const newNotification: INotificationQueue = { type, notification };
    setNotificationQueue((prev) => [...prev, newNotification]);
  };

  const dequeueNotification = () => {
    return notificationQueue.shift();
  };

  const toggleNotificationModal = () => {
    setShowNotificationModal((prev) => !prev);
  };

  const setAllNotifications = (notifications: INotification[]) => {
    _allNotifications(notifications);
  };

  const addNotification = (notification: INotification) => {
    _allNotifications((prev) => [...prev, notification]);
  };

  const removeNotifications = (acks: IAcknowledgement[]) => {
    _allNotifications((prev) =>
      prev.filter(
        (item) =>
          !acks.some(
            (ack) =>
              ack.historyId === item.historyId &&
              ack.notificationId === item.notificationId
          )
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotificationModal,
        notificationQueueLength: notificationQueue.length,
        allNotifications,
        notificationQueue,
        toggleNotificationModal,
        addNotification,
        setAllNotifications,
        removeNotifications,
        enqueueNotification,
        dequeueNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, NotificationModalProvider };
