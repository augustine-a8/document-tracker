import { IError } from "../@types/error";

interface ErrorComponentProps {
  error: IError;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="w-full px-2 py-1 border border-[#d00000] bg-[#ffdab9] rounded-md">
      <p className="text-center text-[#d00000] text-sm">{error.data.message}</p>
    </div>
  );
}
