interface IEmptyPagePros {
  message: string;
}

export default function EmptyPage({ message }: IEmptyPagePros) {
  return (
    <div className="min-h-[calc(100vh-10.5rem)] grid place-items-center">
      <p>{message}</p>
    </div>
  );
}
