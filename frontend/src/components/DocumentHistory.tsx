import { IHistory } from "../@types/history";

interface DocumentHistoryProps {
  history: IHistory[];
}

export default function DocumentHistory({ history }: DocumentHistoryProps) {
  return (
    <table className="document-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Sent At</th>
          <th>Acknowledged At</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item, idx) => {
          const {
            historyId,
            comment,
            sentTimestamp,
            acknowledgedTimestamp,
            sender,
            receiver,
          } = item;
          return (
            <tr key={historyId}>
              <td>{idx + 1}</td>
              <td>{sender.name}</td>
              <td>{receiver.name}</td>
              <td>{new Date(sentTimestamp).toUTCString()}</td>
              <td>
                {acknowledgedTimestamp
                  ? new Date(acknowledgedTimestamp).toUTCString()
                  : "n/a"}
              </td>
              <td>{comment}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
