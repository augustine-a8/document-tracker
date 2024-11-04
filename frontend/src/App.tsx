import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import { useNotificationModal } from "./hooks/useNotificationModal";
import AcknowledgeDocumentModal from "./components/AcknowledgeDocumentModal";

function App() {
  const { showNotificationModal } = useNotificationModal();
  return (
    <>
      <Header />
      <Outlet />
      {showNotificationModal ? <AcknowledgeDocumentModal /> : undefined}
    </>
  );
}

export default App;
