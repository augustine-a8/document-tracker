import { IHistory } from "../@types/history";

interface DocumentHistoryProps {
  history: IHistory[];
}

export default function DocumentHistory({ history }: DocumentHistoryProps) {
  return (
    <table className="border-collapse text-sm w-full">
      <thead className="bg-[#023e8a] text-white">
        <tr>
          <th className="font-normal text-left p-2">#</th>
          <th className="font-normal text-left p-2">Sender</th>
          <th className="font-normal text-left p-2">Receiver</th>
          <th className="font-normal text-left p-2">Sent At</th>
          <th className="font-normal text-left p-2">Acknowledged At</th>
          <th className="font-normal text-left p-2">Comment</th>
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
              <td className="font-normal text-left p-2">{idx + 1}</td>
              <td className="font-normal text-left p-2">{sender.name}</td>
              <td className="font-normal text-left p-2">{receiver.name}</td>
              <td className="font-normal text-left p-2">
                {new Date(sentTimestamp).toUTCString()}
              </td>
              <td className="font-normal text-left p-2">
                {acknowledgedTimestamp
                  ? new Date(acknowledgedTimestamp).toUTCString()
                  : "n/a"}
              </td>
              <td className="font-normal text-left p-2">{comment}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
