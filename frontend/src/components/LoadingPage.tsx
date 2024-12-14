import { ClipLoader } from "react-spinners";

export default function LoadingPage() {
  return (
    <div className="min-h-[calc(100vh-7rem)] grid place-items-center">
      <ClipLoader />
    </div>
  );
}
