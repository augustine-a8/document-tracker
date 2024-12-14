interface IErrorPage {
  message: string;
}

export default function ErrorPage({ message }: IErrorPage) {
  return (
    <div className="min-h-[calc(100vh-10.5rem)] grid place-items-center">
      <p>{message}</p>
    </div>
  );
}
