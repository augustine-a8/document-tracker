import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

function useNotificationModal() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationModal must be used within a NotificationContextProvider"
    );
  }
  return context;
}

export { useNotificationModal };
