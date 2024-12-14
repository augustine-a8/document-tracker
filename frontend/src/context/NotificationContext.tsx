import { createContext, PropsWithChildren, useEffect, useState } from "react";
import {
  IAcknowledgement,
  INotification,
  NotificationState,
} from "../@types/notification";
import { IActiveDocNotification } from "../@types/activeDocNotification";
import { IArchiveNotification } from "../@types/archiveNotification";

interface NotificationContextType {
  notificationState: NotificationState;
  notificationQueue: INotification[];
  activeDocNotifications: IActiveDocNotification[];
  archiveNotifications: IArchiveNotification[];
  closeNotificationModal: () => void;
  openNotificationModal: (n: INotification) => void;
  removeNotifications: (acks: IAcknowledgement[]) => void;
  addToNotificationQueue: (newNotifications: INotification[]) => void;
  enqueueNotification: (notification: INotification) => void;
  total: number;
  setActiveDocNotifications: React.Dispatch<
    React.SetStateAction<IActiveDocNotification[]>
  >;
  setArchiveNotifications: React.Dispatch<
    React.SetStateAction<IArchiveNotification[]>
  >;
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
  const [total, setTotal] = useState<number>(0);
  const [activeDocNotifications, setActiveDocNotifications] = useState<
    IActiveDocNotification[]
  >([]);
  const [archiveNotifications, setArchiveNotifications] = useState<
    IArchiveNotification[]
  >([]);

  const addToNotificationQueue = (newNotifications: INotification[]) => {
    setNotificationQueue(newNotifications);
  };

  const enqueueNotification = (notification: INotification) => {
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

  useEffect(() => {
    const updateTotal = () => {
      const totalActiveDocNotifications = activeDocNotifications.length;
      const totalArchiveNotifications = archiveNotifications.length;

      setTotal(totalActiveDocNotifications + totalArchiveNotifications);
    };

    updateTotal();
  }, [activeDocNotifications, archiveNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notificationState,
        notificationQueue,
        total,
        activeDocNotifications,
        archiveNotifications,
        openNotificationModal,
        closeNotificationModal,
        removeNotifications,
        addToNotificationQueue,
        enqueueNotification,
        setActiveDocNotifications,
        setArchiveNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, NotificationModalProvider };
