interface EmptyComponentProps {
  message?: string;
}

export default function EmptyComponent({ message }: EmptyComponentProps) {
  return (
    <div>
      <div className="grid place-items-center mb-4">
        <img src="/empty.png" alt="empty box image" />
      </div>
      <p className="text-center uppercase text-sm">
        {message ? message : "Nothing here yet"}
      </p>
    </div>
  );
}
