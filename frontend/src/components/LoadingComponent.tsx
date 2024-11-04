import { ClipLoader } from "react-spinners";

interface LoadingComponentProps {
  isLoading: boolean;
}

export default function LoadingComponent({ isLoading }: LoadingComponentProps) {
  if (isLoading) {
    return <ClipLoader />;
  }
}
