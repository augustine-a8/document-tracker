interface EmptyComponentProps {
  message?: string;
}

export default function EmptyComponent({ message }: EmptyComponentProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid place-items-center">
        <img src="/empty.png" alt="empty box image" />
      </div>
      <p className="text-center capitalize lb-regular text-sm">
        {message ? message : "Nothing here yet"}
      </p>
    </div>
  );
}
