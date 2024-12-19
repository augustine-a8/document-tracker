import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";

export default function App() {
  return (
    <main className="relative max-w-[100vw] min-h-[100vh]">
      <Sidebar />
      <div className="absolute top-0 right-0 left-[300px] bottom-0 text-sm m-4">
        <Outlet />
      </div>
    </main>
  );
}
