import { IHistory } from "../@types/history";

interface DocumentHistoryProps {
  history: IHistory[];
}

export default function DocumentHistory({ history }: DocumentHistoryProps) {
  return (
    <table className="border-collapse text-sm w-full">
      <thead className="bg-[#023e8a] text-white">
        <tr>
          <th className="font-normal text-left p-2 hidden md:block">#</th>
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
              <td className="font-normal text-left p-2 hidden md:block">
                {idx + 1}
              </td>
              <td className="font-normal text-left p-2" data-cell="sender">
                {sender.name}
              </td>
              <td className="font-normal text-left p-2" data-cell="receiver">
                {receiver.name}
              </td>
              <td className="font-normal text-left p-2" data-cell="sent at">
                {new Date(sentTimestamp).toUTCString()}
              </td>
              <td
                className="font-normal text-left p-2"
                data-cell="acknowledged at"
              >
                {acknowledgedTimestamp
                  ? new Date(acknowledgedTimestamp).toUTCString()
                  : "n/a"}
              </td>
              <td className="font-normal text-left p-2" data-cell="comment">
                {comment}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
