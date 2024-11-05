import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import { useNotification } from "./hooks/useNotification";
import AcknowledgeDocumentModal from "./components/AcknowledgeDocumentModal";

function App() {
  const { showNotificationModal } = useNotification();
  return (
    <>
      <Header />
      <Outlet />
      {showNotificationModal ? <AcknowledgeDocumentModal /> : undefined}
    </>
  );
}

export default App;
