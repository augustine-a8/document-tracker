import { INotification } from "../@types/notification";

interface INotificationModalProps {
  isOpen: boolean;
  notification: INotification | null;
  closeModal: () => void;
}

export default function NotificationModal({
  isOpen,
  notification,
  closeModal,
}: INotificationModalProps) {
  if (!isOpen || notification === null) {
    return;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="modal">
        <p>{notification.message}</p>
      </div>
    </div>
  );
}
