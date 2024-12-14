interface IStatusProps {
  status: string;
  color: "yellow" | "green" | "red" | "blue";
}

export default function Status({ status, color }: IStatusProps) {
  return (
    <div
      className={`${
        color === "green"
          ? "bg-green-200 border-green-700 text-green-700"
          : color === "red"
          ? "bg-red-200 border-red-700 text-red-700"
          : color === "yellow"
          ? "bg-yellow-200 border-yellow-700 text-yellow-700"
          : "bg-blue-200 border-blue-700 text-blue-700"
      } text-xs h-6 w-28 rounded-full flex flex-row items-center justify-center gap-1`}
    >
      <div
        className={`w-1 h-1 rounded-full ${
          color === "green"
            ? "bg-green-700"
            : color === "red"
            ? "bg-red-700"
            : color === "yellow"
            ? "bg-yellow-700"
            : "bg-blue-700"
        }`}
      ></div>
      <p>{status}</p>
    </div>
  );
}
