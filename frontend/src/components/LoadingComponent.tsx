import { ClipLoader } from "react-spinners";
import { LengthType } from "react-spinners/helpers/props";

interface LoadingComponentProps {
  isLoading: boolean;
  size?: LengthType | undefined;
}

export default function LoadingComponent({
  isLoading,
  size,
}: LoadingComponentProps) {
  if (isLoading) {
    return <ClipLoader size={size} />;
  }
}
