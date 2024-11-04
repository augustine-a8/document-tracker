import { createContext, PropsWithChildren, useState } from "react";
import { IAcknowledgement, INotification } from "../@types/notification";

interface NotificationContextType {
  showNotificationModal: boolean;
  toggleNotificationModal: () => void;
  notificationData: INotification | null;
  setNotificationData: (n: INotification) => void;
  allNotifications: INotification[];
  setAllNotifications: (n: INotification[]) => void;
  removeNotifications: (acks: IAcknowledgement[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

function NotificationModalProvider({ children }: PropsWithChildren) {
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [notificationData, _notificationData] = useState<INotification | null>(
    null
  );
  const [allNotifications, _allNotifications] = useState<INotification[]>([]);

  const toggleNotificationModal = () => {
    setShowNotificationModal((prev) => !prev);
  };

  const setNotificationData = (notificationData: INotification) => {
    _notificationData(notificationData);
    _allNotifications((prev) => [...prev, notificationData]);
  };

  const setAllNotifications = (notifications: INotification[]) => {
    _allNotifications(notifications);
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
        toggleNotificationModal,
        notificationData,
        setNotificationData,
        allNotifications,
        setAllNotifications,
        removeNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, NotificationModalProvider };
